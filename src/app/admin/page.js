import { getCustomers } from '@/lib/services/customerService';
import { getOrders } from '@/lib/services/orderService';
import { getProducts } from '@/lib/services/productService';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const [customers, orders, products] = await Promise.all([
    getCustomers(),
    getOrders(),
    getProducts(),
  ]);

  return (
    <DashboardClient
      customers={customers}
      orders={orders}
      products={products}
    />
  );
}
