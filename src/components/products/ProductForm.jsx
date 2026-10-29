'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft, Plus, X, ImagePlus, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  createProductAction,
  updateProductAction,
  uploadProductImageAction,
  deleteProductImageAction,
} from '@/lib/actions/productActions';

// Limits mirror the API (ProductCreate / DetailIn).
const MAX_DETAILS = 50;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

let seq = 0;
const newDetail = (d = {}) => ({
  key: `d_${seq++}`,
  title: d.title ?? '',
  subtitle: d.subtitle ?? '',
  paragraph: d.paragraph ?? '',
});

export default function ProductForm({ initialProduct }) {
  const isEdit = !!initialProduct;

  const [form, setForm] = useState({
    title: initialProduct?.title ?? '',
    amount: initialProduct?.amount ?? '',
    description: initialProduct?.description ?? '',
  });
  const [details, setDetails] = useState(() => (initialProduct?.details ?? []).map(newDetail));
  const [errors, setErrors] = useState({});

  // Images already saved on the server (can be deleted) and new files queued for upload.
  const [savedImages, setSavedImages] = useState(initialProduct?.images ?? []);
  const [newImages, setNewImages] = useState([]); // [{ file, src }]
  const [imageNotice, setImageNotice] = useState(null);
  const fileRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

  function handleChange(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    else if (form.title.trim().length > 200) e.title = 'Title must be 200 characters or fewer.';
    if (form.amount === '' || isNaN(form.amount) || Number(form.amount) < 0)
      e.amount = 'Enter a valid price (0 or more).';
    if (form.description.length > 10000) e.description = 'Description is too long (max 10,000 characters).';
    const badDetail = details.findIndex((d) => !d.title.trim() || !d.paragraph.trim());
    if (badDetail !== -1) e.details = `Section ${badDetail + 1} needs a title and a paragraph.`;
    if (details.some((d) => d.subtitle.length > 200)) e.details = 'Subtitles must be 200 characters or fewer.';
    if (details.some((d) => d.paragraph.length > 5000)) e.details = 'Paragraphs must be 5,000 characters or fewer.';
    return e;
  }

  // ── Detail sections ──────────────────────────────────────────
  function updateDetail(key, field, value) {
    setDetails((p) => p.map((d) => (d.key === key ? { ...d, [field]: value } : d)));
    setErrors((p) => ({ ...p, details: undefined }));
  }
  function moveDetail(idx, dir) {
    setDetails((p) => {
      const n = [...p];
      const j = idx + dir;
      if (j < 0 || j >= n.length) return p;
      [n[idx], n[j]] = [n[j], n[idx]];
      return n;
    });
  }

  // ── Images ───────────────────────────────────────────────────
  function handleFiles(files) {
    const rejected = [];
    const accepted = [];
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith('image/')) rejected.push(`${f.name} is not an image`);
      else if (f.size > MAX_IMAGE_BYTES) rejected.push(`${f.name} is larger than 5 MB`);
      else accepted.push(f);
    });
    setImageNotice(rejected.length ? rejected.join('; ') + '.' : null);
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setNewImages((p) => [...p, { file, src: e.target.result }]);
      reader.readAsDataURL(file);
    });
  }

  async function removeSavedImage(image) {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    const res = await deleteProductImageAction(initialProduct.id, image.id);
    if (res.ok) setSavedImages((p) => p.filter((i) => i.id !== image.id));
    else setImageNotice(res.error);
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      title: form.title,
      amount: form.amount,
      description: form.description,
      details,
    };

    const saved = isEdit
      ? await updateProductAction(initialProduct.id, payload)
      : await createProductAction(payload);

    if (!saved.ok) {
      setSubmitError(saved.error);
      setSubmitting(false);
      return;
    }

    // The API takes one image per request. Report any that fail rather than losing the product.
    const failed = [];
    for (const img of newImages) {
      const fd = new FormData();
      fd.append('file', img.file);
      const res = await uploadProductImageAction(saved.data.id, fd);
      if (!res.ok) failed.push(`${img.file.name}: ${res.error}`);
    }

    setSuccess({
      title: saved.data.title,
      uploaded: newImages.length - failed.length,
      failed,
    });
    setSubmitting(false);
  }

  function reset() {
    if (!isEdit) {
      setForm({ title: '', amount: '', description: '' });
      setDetails([]);
    }
    setNewImages([]);
    setImageNotice(null);
    setSuccess(null);
    setSubmitError(null);
  }

  // ── Success screen ────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-moss/10 border border-moss/30 rounded-xl p-8 text-center space-y-4"
      >
        <div className="w-14 h-14 bg-moss/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-moss" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-semibold text-forest">
            {isEdit ? 'Product Updated!' : 'Product Added!'}
          </h3>
          <p className="text-sm text-brown/60 mt-1">
            <span className="font-medium text-ink">{success.title}</span> has been saved.
            {success.uploaded > 0 && ` ${success.uploaded} image${success.uploaded > 1 ? 's' : ''} uploaded.`}
          </p>
          {success.failed.length > 0 && (
            <div className="mt-3 text-left text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="font-medium">
                The product was saved, but {success.failed.length} image{success.failed.length > 1 ? 's' : ''} failed to upload:
              </p>
              <ul className="list-disc pl-4 mt-1">
                {success.failed.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <p className="mt-1">Edit the product to try again.</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center pt-2">
          {isEdit ? (
            <Link href={`/admin/products/${initialProduct.id}/edit`} onClick={() => window.location.reload()}>
              <Button variant="secondary">Keep Editing</Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={reset}>Add Another</Button>
          )}
          <Link href="/admin/products">
            <Button variant="primary">Back to Products</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Basics ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FieldLabel required>Title</FieldLabel>
          <input type="text" value={form.title} maxLength={200}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Ashwagandha Root Extract"
            className={inputCls(errors.title)} />
          <FieldError>{errors.title}</FieldError>
        </div>

        <div>
          <FieldLabel required>Price (INR)</FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/50 text-sm">₹</span>
            <input type="number" min="0" step="0.01" value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              className={cn(inputCls(errors.amount), 'pl-7')} />
          </div>
          <FieldError>{errors.amount}</FieldError>
        </div>

        <div className="md:col-span-2">
          <FieldLabel>Description</FieldLabel>
          <textarea rows={3} value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the product…"
            className={cn(inputCls(errors.description), 'resize-none')} />
          <FieldError>{errors.description}</FieldError>
        </div>
      </div>

      {/* ── Detail sections ── */}
      <div className="border border-tan/30 rounded-xl overflow-hidden">
        <div className="bg-cream/60 px-4 py-3 border-b border-tan/30 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Product details</p>
            <p className="text-xs text-brown/50 mt-0.5">
              Sections shown on the product page, each with a title, optional subtitle and a paragraph (up to {MAX_DETAILS}).
            </p>
          </div>
          <button type="button"
            onClick={() => setDetails((p) => [...p, newDetail()])}
            disabled={details.length >= MAX_DETAILS}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-tan/40 rounded-lg text-brown hover:bg-cream transition-colors disabled:opacity-40">
            <Plus className="w-4 h-4" /> Add section
          </button>
        </div>
        <div className="p-4 space-y-3">
          <AnimatePresence initial={false}>
            {details.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm text-brown/40 text-center py-6">
                No detail sections yet.
              </motion.p>
            )}
            {details.map((d, idx) => (
              <motion.div key={d.key}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-white border border-tan/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brown/50 uppercase tracking-wider">Section {idx + 1}</span>
                  <div className="flex items-center gap-1 text-brown/40">
                    <button type="button" onClick={() => moveDetail(idx, -1)} disabled={idx === 0}
                      className="p-1 hover:text-ink disabled:opacity-30" aria-label="Move up">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => moveDetail(idx, 1)} disabled={idx === details.length - 1}
                      className="p-1 hover:text-ink disabled:opacity-30" aria-label="Move down">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setDetails((p) => p.filter((x) => x.key !== d.key))}
                      className="p-1 hover:text-red-400" aria-label="Remove section">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <input type="text" value={d.title} maxLength={200}
                  onChange={(e) => updateDetail(d.key, 'title', e.target.value)}
                  placeholder="Title" className={subInputCls} />
                <input type="text" value={d.subtitle} maxLength={200}
                  onChange={(e) => updateDetail(d.key, 'subtitle', e.target.value)}
                  placeholder="Subtitle (optional)" className={subInputCls} />
                <textarea rows={3} value={d.paragraph} maxLength={5000}
                  onChange={(e) => updateDetail(d.key, 'paragraph', e.target.value)}
                  placeholder="Paragraph" className={cn(subInputCls, 'resize-none')} />
              </motion.div>
            ))}
          </AnimatePresence>
          <FieldError>{errors.details}</FieldError>
        </div>
      </div>

      {/* ── Images ── */}
      <div className="border border-tan/30 rounded-xl overflow-hidden">
        <div className="bg-cream/60 px-4 py-3 border-b border-tan/30 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Product images</p>
            <p className="text-xs text-brown/50 mt-0.5">Images only, up to 5 MB each. New images upload when you save.</p>
          </div>
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-tan/40 rounded-lg text-brown hover:bg-cream transition-colors">
            <ImagePlus className="w-4 h-4" /> Add images
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
        </div>

        <div className="p-4 space-y-3">
          {savedImages.length === 0 && newImages.length === 0 ? (
            <div
              className="border-2 border-dashed border-tan/30 rounded-lg p-8 text-center cursor-pointer hover:border-sage/50 transition-colors"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
              <Upload className="w-6 h-6 text-brown/30 mx-auto mb-2" />
              <p className="text-sm text-brown/40">Drop images here or click to browse</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {savedImages.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-tan/30 bg-tan/10">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeSavedImage(img)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete image">
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded">saved</span>
                </div>
              ))}
              <AnimatePresence>
                {newImages.map((img, idx) => (
                  <motion.div key={img.file.name + idx}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-sage/40">
                    <img src={img.src} alt={img.file.name} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setNewImages((p) => p.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
                <motion.button type="button" onClick={() => fileRef.current?.click()}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="aspect-square rounded-lg border-2 border-dashed border-tan/30 flex items-center justify-center hover:border-sage/50 transition-colors">
                  <Plus className="w-5 h-5 text-brown/30" />
                </motion.button>
              </AnimatePresence>
            </div>
          )}
          {imageNotice && <p className="text-xs text-red-600">{imageNotice}</p>}
        </div>
      </div>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {submitError && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {submitError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-1">
        <Link href="/admin/products">
          <Button variant="ghost" type="button">
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
        </Link>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Update Product' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

const subInputCls =
  'w-full px-3 py-2 text-sm bg-white border border-tan/50 rounded-lg text-gray-900 placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all';

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ children }) {
  return (
    <AnimatePresence>
      {children && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs text-red-500 mt-1">{children}</motion.p>
      )}
    </AnimatePresence>
  );
}

function inputCls(error) {
  return cn(
    'w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900',
    'placeholder:text-brown/40 focus:outline-none focus:ring-2 transition-all',
    error
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
      : 'border-tan/60 focus:ring-sage/40 focus:border-sage'
  );
}
