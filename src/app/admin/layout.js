import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/layout/AdminShell';

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return <AdminShell user={session}>{children}</AdminShell>;
}
