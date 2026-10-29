import { notFound } from 'next/navigation';
import { getCustomers, getCustomer } from '@/lib/services/customerService';
import { getOrdersByCustomer } from '@/lib/services/orderService';
import CustomerListPanel from '@/components/customers/CustomerListPanel';
import CustomerDetail from '@/components/customers/CustomerDetail';

export default async function CustomerDetailPage({ params }) {
  const { id } = await params;

  const [customers, customer, customerOrders] = await Promise.all([
    getCustomers(),
    getCustomer(id),
    getOrdersByCustomer(id),
  ]);

  if (!customer) notFound();

  return (
    <div className="flex h-full">
      <CustomerListPanel customers={customers} selectedId={id} />
      <CustomerDetail customer={customer} orders={customerOrders} />
    </div>
  );
}
