import { apiGet, apiPost, apiPatch, apiDelete, apiUpload } from '@/lib/api/client';

const PAGE_SIZE = 100; // the API's maximum

// API: { id, title, amount (decimal string), description, images[{id,url,position}],
//        details[{id,title,subtitle,paragraph,position}], created_at, updated_at }
function fromApi(p) {
  return {
    id: p.id,
    title: p.title,
    amount: Number(p.amount),
    description: p.description ?? '',
    images: [...(p.images ?? [])].sort((a, b) => a.position - b.position),
    details: [...(p.details ?? [])].sort((a, b) => a.position - b.position),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// App form data: { title, amount, description, details[{title, subtitle, paragraph}] }
// On update the API replaces the whole details list when `details` is sent.
function toApi(data) {
  return {
    title: data.title.trim(),
    amount: Math.round(Number(data.amount) * 100) / 100,
    description: data.description?.trim() ?? '',
    details: (data.details ?? []).map((d) => ({
      title: d.title.trim(),
      subtitle: d.subtitle?.trim() || null,
      paragraph: d.paragraph.trim(),
    })),
  };
}

export async function getProducts() {
  const all = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await apiGet(`/products?limit=${PAGE_SIZE}&offset=${offset}`);
    all.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return all.map(fromApi);
}

export async function getProduct(id) {
  try {
    return fromApi(await apiGet(`/products/${id}`));
  } catch (err) {
    if (/not found/i.test(err.message)) return null;
    throw err;
  }
}

export async function createProduct(data) {
  return fromApi(await apiPost('/products', toApi(data)));
}

export async function updateProduct(id, data) {
  return fromApi(await apiPatch(`/products/${id}`, toApi(data)));
}

// Returns { id, url, position }. The API takes one file per request (multipart field "file").
export async function uploadProductImage(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiUpload(`/products/${id}/images`, formData);
}

export async function deleteProductImage(id, imageId) {
  return apiDelete(`/products/${id}/images/${imageId}`);
}
