import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-brown/50 mb-6">
        <Link href="/admin/products" className="hover:text-forest transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-medium">New Product</span>
      </nav>

      <div className="mb-6">
        <h2 className="text-xl font-serif font-semibold text-ink">Add New Product</h2>
        <p className="text-sm text-brown/60 mt-0.5">
          Fill in the details below to add a product to your inventory.
        </p>
      </div>

      <div className="bg-white/60 rounded-xl border border-tan/30 p-6">
        <ProductForm />
      </div>
    </div>
  );
}
