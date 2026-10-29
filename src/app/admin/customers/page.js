import { Users } from 'lucide-react';
import { getCustomers } from '@/lib/services/customerService';
import CustomerListPanel from '@/components/customers/CustomerListPanel';

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="flex h-full">
      <CustomerListPanel customers={customers} selectedId={null} />
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-3 text-brown/30">
        <Users className="w-14 h-14" />
        <p className="text-sm">Select a client to view details</p>
      </div>
    </div>
  );
}
