import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema } from '@/lib/validators/blogSchema';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import RichTextEditor from '@/components/admin/ui/RichTextEditor';
import { 
  Save, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Info,
  Globe,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function BlogForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
  const [uploading, setUploading] = useState(false);

  // Load blog categories
  useEffect(() => {
    fetch('/api/admin/blog-categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: '',
      tags: [],
      reading_time: 5,
      status: 'draft',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
    }
  });

  const postTitle = watch('title');

  // Auto-generate slug
  useEffect(() => {
    if (!isEdit && postTitle) {
      const generated = postTitle
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', generated, { shouldValidate: true });
    }
  }, [postTitle, isEdit, setValue]);

  // Sync react-hook-form state with cover image
  useEffect(() => {
    setValue('cover_image', coverImage);
  }, [coverImage, setValue]);

  // Handle secure file uploads via API route to bypass storage RLS restrictions
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const params = new URLSearchParams({
        name: file.name,
        type: file.type,
        folder: 'blog'
      });

      const res = await fetch(`/api/admin/upload?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yükleme başarısız oldu.');

      setCoverImage(data.url);
      toast.success('Kapak görseli yüklendi.');
    } catch (err) {
      toast.error('Görsel yüklenemedi: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values) => {
    const endpoint = isEdit ? `/api/admin/blog/${initialData.id}` : '/api/admin/blog';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          cover_image: coverImage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yazı kaydedilemedi.');

      toast.success(isEdit ? 'Yazı güncellendi.' : 'Yazı başarıyla yayınlandı.');
      router.push('/admin/blog');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const tabClass = (tab) => `flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all ${
    activeTab === tab 
      ? 'border-[#7FA34D] text-[#7FA34D]' 
      : 'border-transparent text-slate-400 hover:text-slate-200'
  }`;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      {/* Form Navigation Tabs */}
      <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-6">
        <button type="button" onClick={() => setActiveTab('general')} className={tabClass('general')}>
          <Info className="w-4 h-4" />
          <span>Yazı İçeriği</span>
        </button>
        <button type="button" onClick={() => setActiveTab('seo')} className={tabClass('seo')}>
          <Globe className="w-4 h-4" />
          <span>SEO Ayarları</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Yazı Başlığı *</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                  placeholder="Hacamat Tedavisinin Faydaları"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Slug (URL)*</label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                  placeholder="hacamat-tedavisinin-faydalari"
                />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Blog Kategorisi</label>
                <select
                  {...register('category_id')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Okuma Süresi (Dakika)</label>
                <input
                  type="number"
                  {...register('reading_time', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all font-mono"
                  placeholder="5"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Etiketler (Virgülle Ayırın)</label>
                <input
                  type="text"
                  placeholder="hacamat, saglik, bitkisel"
                  onChange={(e) => {
                    const array = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setValue('tags', array);
                  }}
                  defaultValue={initialData?.tags?.join(', ') || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/60">
              <div className="md:col-span-1">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kapak Görseli</span>
                <div className="relative border border-slate-800 hover:border-[#7FA34D]/50 rounded-xl h-44 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-950/40 overflow-hidden">
                  {coverImage ? (
                    <>
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {uploading ? (
                        <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-slate-400" />
                          <span className="text-[11px] font-medium text-slate-300">Resim Seçin</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Resim Web Adresi (Manuel URL)</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kısa Özet (Excerpt)</label>
                  <textarea
                    {...register('excerpt')}
                    rows="2"
                    className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all resize-none"
                    placeholder="Blog yazısının kısa giriş veya özet metni..."
                    maxLength="500"
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-3">Yazı İçeriği *</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">SEO Başlığı (Meta Title)</label>
                <input
                  type="text"
                  {...register('seo_title')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                  placeholder="Hacamat Tedavisinin Faydaları Nelerdir? | NURVERA"
                  maxLength="60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Anahtar Kelimeler (Meta Keywords)</label>
                <input
                  type="text"
                  {...register('seo_keywords')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                  placeholder="hacamat faydaları, hacamat tedirginlikleri, doğal tedavi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">SEO Açıklaması (Meta Description)</label>
              <textarea
                {...register('seo_description')}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all resize-none"
                placeholder="Yazının arama motoru snippet'ında görünecek 160 karaktere kadar özet metni..."
                maxLength="160"
              />
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Durum:</span>
            <select
              {...register('status')}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-[#7FA34D]"
            >
              <option value="draft">Taslak</option>
              <option value="published">Hemen Yayınla</option>
              <option value="archived">Arşivle</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Yazıyı Kaydet</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
