import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProducts } from '@/lib/services/productService';
import ProductListPanel from '@/components/products/ProductListPanel';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6 space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-semibold text-ink">Products</h2>
          <p className="text-sm text-brown/60 mt-0.5">Manage your wellness retail inventory.</p>
        </div>
        <Link href="/admin/products/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-cream text-sm font-medium rounded-lg hover:bg-moss transition-colors">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </Link>
      </div>

      <ProductListPanel products={products} />
    </div>
  );
}
