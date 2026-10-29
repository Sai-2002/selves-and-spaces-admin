import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api/client';
import { customers as mockCustomers } from '@/lib/mock-data/customers';

// API response → app shape
// API: { id, full_name, email, phone, is_active, created_at, updated_at, data: { therapist, tags, address, notes } }
// App: { id, name, email, phone, status, therapist, joinedAt, totalOrders, totalSpent, tags, address, notes }
function fromApi(c) {
  return {
    id: c.id,
    name: c.full_name,
    email: c.email ?? '',
    phone: c.phone ?? '',
    status: c.is_active ? 'active' : 'inactive',
    therapist: c.data?.therapist ?? '',
    joinedAt: c.created_at ? c.created_at.split('T')[0] : '',
    totalOrders: c.data?.totalOrders ?? 0,
    totalSpent: c.data?.totalSpent ?? 0,
    tags: c.data?.tags ?? [],
    address: c.data?.address ?? { street: '', city: '', state: '', zip: '' },
    notes: c.data?.notes ?? '',
  };
}

// App shape → API request body
function toApi(data) {
  return {
    full_name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    is_active: data.status !== 'inactive',
    data: {
      therapist: data.therapist,
      tags: data.tags ?? [],
      address: data.address ?? {},
      notes: data.notes ?? '',
    },
  };
}

export async function getCustomers() {
  const raw = await apiGet('/customers/');
  if (!raw) return mockCustomers;
  return raw.map(fromApi);
}

export async function getCustomer(id) {
  const raw = await apiGet(`/customers/${id}`);
  if (!raw) return mockCustomers.find((c) => c.id === id) ?? null;
  return fromApi(raw);
}

export async function createCustomer(data) {
  const raw = await apiPost('/customers/', toApi(data));
  return raw ? fromApi(raw) : null;
}

export async function updateCustomer(id, data) {
  const raw = await apiPatch(`/customers/${id}`, toApi(data));
  return raw ? fromApi(raw) : null;
}

export async function deleteCustomer(id) {
  return await apiDelete(`/customers/${id}`);
}
