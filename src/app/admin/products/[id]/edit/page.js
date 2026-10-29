import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/services/productService';
import ProductForm from '@/components/products/ProductForm';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <nav className="flex items-center gap-1.5 text-sm text-brown/50 mb-6">
        <Link href="/admin/products" className="hover:text-forest transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink/60 max-w-[180px] truncate">{product.title}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-medium">Edit</span>
      </nav>

      <div className="mb-6">
        <h2 className="text-xl font-serif font-semibold text-ink">Edit Product</h2>
        <p className="text-sm text-brown/60 mt-0.5">Update the details for this product.</p>
      </div>

      <div className="bg-white/60 rounded-xl border border-tan/30 p-6">
        <ProductForm initialProduct={product} />
      </div>
    </div>
  );
}
