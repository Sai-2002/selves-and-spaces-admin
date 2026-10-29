import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api/client';
import { orders as mockOrders } from '@/lib/mock-data/orders';

// API response → app shape
// API: { id, customer_id, customer_name, customer_email, order_date, status, total_amount,
//        currency, payment_method, created_at,
//        order_items: [{ id, order_id, product_id, products, quantity, unit_price, subtotal }] }
// App: { id, customerId, customerName, status, items, subtotal, tax, total, createdAt, notes }
function fromApi(o) {
  const items = (o.order_items ?? []).map((item) => ({
    productId: item.product_id ?? '',
    productName: item.products?.name ?? '',
    quantity: item.quantity,
    unitPrice: item.unit_price,
  }));

  const total = o.total_amount ?? 0;
  const tax = Math.round(total * 0.08 * 100) / 100; // Approximate — API stores total_amount as final
  const subtotal = Math.round((total - tax) * 100) / 100;

  return {
    id: o.id,
    customerId: o.customer_id ?? '',
    customerName: o.customer_name ?? '',
    status: o.status,
    items,
    subtotal,
    tax,
    total,
    createdAt: o.order_date ?? o.created_at ?? '',
    notes: o.data?.notes ?? '',
  };
}

// App shape → API request body for create
function toApiCreate(data) {
  return {
    customer_id: data.customerId || null,
    customer_name: data.customerName || null,
    customer_email: data.customerEmail || null,
    status: data.status ?? 'pending',
    total_amount: data.total,
    currency: 'INR',
    payment_method: data.paymentMethod || null,
    items: (data.items ?? []).map((item) => ({
      product_id: item.productId || null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
  };
}

// App shape → API request body for update (only status + payment_method are patchable)
function toApiUpdate(data) {
  return {
    status: data.status ?? null,
    payment_method: data.paymentMethod ?? null,
  };
}

export async function getOrders(filters = {}) {
  const params = new URLSearchParams();
  if (filters.customerId) params.set('customer_id', filters.customerId);
  if (filters.status) params.set('status', filters.status);
  const qs = params.toString();

  const raw = await apiGet(`/orders/${qs ? `?${qs}` : ''}`);
  if (!raw) return mockOrders;
  return raw.map(fromApi);
}

export async function getOrder(id) {
  const raw = await apiGet(`/orders/${id}`);
  if (!raw) return mockOrders.find((o) => o.id === id) ?? null;
  return fromApi(raw);
}

export async function getOrdersByCustomer(customerId) {
  const raw = await apiGet(`/orders/?customer_id=${customerId}`);
  if (!raw) return mockOrders.filter((o) => o.customerId === customerId);
  return raw.map(fromApi);
}

export async function createOrder(data) {
  const raw = await apiPost('/orders/', toApiCreate(data));
  return raw ? fromApi(raw) : null;
}

export async function updateOrder(id, data) {
  const raw = await apiPatch(`/orders/${id}`, toApiUpdate(data));
  return raw ? fromApi(raw) : null;
}

export async function deleteOrder(id) {
  return await apiDelete(`/orders/${id}`);
}
