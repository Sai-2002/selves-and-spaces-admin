'use server';

import { revalidatePath } from 'next/cache';
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProductImage,
} from '@/lib/services/productService';

// Server Action errors are masked in production builds, so failures are returned, not thrown.
async function run(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    return { ok: false, error: err.message || 'Something went wrong.' };
  }
}

export async function createProductAction(data) {
  const result = await run(() => createProduct(data));
  if (result.ok) revalidatePath('/admin/products');
  return result;
}

export async function updateProductAction(id, data) {
  const result = await run(() => updateProduct(id, data));
  if (result.ok) revalidatePath('/admin/products');
  return result;
}

export async function uploadProductImageAction(id, formData) {
  const file = formData.get('file');
  const result = await run(() => uploadProductImage(id, file));
  if (result.ok) revalidatePath('/admin/products');
  return result;
}

export async function deleteProductImageAction(id, imageId) {
  const result = await run(() => deleteProductImage(id, imageId));
  if (result.ok) revalidatePath('/admin/products');
  return result;
}
