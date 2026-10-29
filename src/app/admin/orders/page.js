import { ShoppingBag } from 'lucide-react';
import { getOrders } from '@/lib/services/orderService';
import OrderListPanel from '@/components/orders/OrderListPanel';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex h-full">
      <OrderListPanel orders={orders} selectedId={null} />
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-3 text-brown/30">
        <ShoppingBag className="w-14 h-14" />
        <p className="text-sm">Select an order to view details</p>
      </div>
    </div>
  );
}
