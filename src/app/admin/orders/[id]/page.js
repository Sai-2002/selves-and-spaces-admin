import { notFound } from 'next/navigation';
import { getOrders, getOrder } from '@/lib/services/orderService';
import OrderListPanel from '@/components/orders/OrderListPanel';
import OrderDetail from '@/components/orders/OrderDetail';

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  const [orders, order] = await Promise.all([
    getOrders(),
    getOrder(id),
  ]);

  if (!order) notFound();

  return (
    <div className="flex h-full">
      <OrderListPanel orders={orders} selectedId={id} />
      <OrderDetail order={order} />
    </div>
  );
}
