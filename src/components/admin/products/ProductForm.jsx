import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/lib/validators/productSchema';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { 
  Save, 
  Trash2, 
  Upload, 
  Plus, 
  Image as ImageIcon, 
  Info,
  DollarSign,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [images, setImages] = useState(initialData?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // Load categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, submitCount }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      size: initialData.schema_data?.size || '',
      usage: initialData.schema_data?.usage || '',
      ingredients: initialData.schema_data?.ingredients || '',
    } : {
      name: '',
      slug: '',
      short_description: '',
      description: '',
      category_id: '',
      brand: '',
      sku: '',
      barcode: '',
      price: 0,
      old_price: null,
      discount_percent: null,
      tax_rate: 18,
      stock: 0,
      stock_status: 'in_stock',
      weight: null,
      is_featured: false,
      is_new: false,
      is_popular: false,
      show_on_homepage: false,
      status: 'draft',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      size: '',
      usage: '',
      ingredients: '',
    }
  });

  const productName = watch('name');

  // Auto-generate slug from name in real-time if not in edit mode
  useEffect(() => {
    if (!isEdit && productName) {
      const generated = productName
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
  }, [productName, isEdit, setValue]);

  // Keep react-hook-form state in sync with images state
  useEffect(() => {
    setValue('images', images);
  }, [images, setValue]);

  // Toast validation errors if form submission fails
  useEffect(() => {
    if (Object.keys(errors).length > 0 && submitCount > 0) {
      toast.error('Lütfen formdaki işaretli hatalı alanları düzeltin.');
    }
  }, [submitCount]);

  // Handle secure file uploads via API route to bypass storage RLS restrictions
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const params = new URLSearchParams({
        name: file.name,
        type: file.type,
        folder: 'products'
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

      setImages(prev => [...prev, data.url]);
      toast.success('Görsel başarıyla yüklendi.');
    } catch (err) {
      toast.error('Yükleme hatası: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput) return;
    if (!imageUrlInput.startsWith('http')) {
      toast.error('Lütfen geçerli bir web adresi girin.');
      return;
    }
    setImages(prev => [...prev, imageUrlInput]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values) => {
    if (images.length === 0) {
      toast.error('Lütfen en az bir adet ürün görseli ekleyin.');
      return;
    }

    const endpoint = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          images
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          const detailedErrors = Object.entries(data.details)
            .filter(([key]) => key !== '_errors')
            .map(([key, value]) => {
              const fieldNames = {
                name: 'Ürün Adı',
                slug: 'Slug (URL)',
                price: 'Fiyat',
                stock: 'Stok Miktarı',
                category_id: 'Kategori',
                description: 'Tam Açıklama',
                short_description: 'Kısa Açıklama',
                size: 'Boyut/Hacim',
                usage: 'Kullanım Şekli',
                ingredients: 'İçindekiler'
              };
              return `${fieldNames[key] || key}: ${value._errors?.join(', ') || 'Geçersiz değer'}`;
            });
          throw new Error(`Sunucu doğrulama hatası:\n• ${detailedErrors.join('\n• ')}`);
        }
        throw new Error(data.error || 'Bir hata oluştu.');
      }

      toast.success(isEdit ? 'Ürün güncellendi.' : 'Ürün başarıyla oluşturuldu.');
      router.push('/admin/urunler');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const generalFields = ['name', 'slug', 'category_id', 'short_description', 'description', 'size', 'usage', 'ingredients'];
  const pricingFields = ['price', 'old_price', 'tax_rate', 'stock', 'stock_status', 'weight'];
  const seoFields = ['seo_title', 'seo_keywords', 'seo_description'];

  const hasGeneralErrors = generalFields.some(field => errors[field]);
  const hasPricingErrors = pricingFields.some(field => errors[field]);
  const hasSeoErrors = seoFields.some(field => errors[field]);

  const tabClass = (tab) => `flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all ${
    activeTab === tab 
      ? 'border-[#556B2F] text-[#556B2F]' 
      : 'border-transparent text-slate-400 hover:text-slate-600'
  }`;

  return (
    <div className="bg-white border border-[#F2EEE5] rounded-xl p-6 shadow-sm">
      {/* Form Navigation Tabs */}
      <div className="flex border-b border-[#F2EEE5] mb-8 overflow-x-auto gap-6">
        <button type="button" onClick={() => setActiveTab('general')} className={tabClass('general')}>
          <Info className="w-4 h-4" />
          <span>Genel Bilgiler</span>
          {hasGeneralErrors && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
        </button>
        <button type="button" onClick={() => setActiveTab('pricing')} className={tabClass('pricing')}>
          <DollarSign className="w-4 h-4" />
          <span>Fiyat & Stok</span>
          {hasPricingErrors && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
        </button>
        <button type="button" onClick={() => setActiveTab('media')} className={tabClass('media')}>
          <ImageIcon className="w-4 h-4" />
          <span>Görseller ({images.length})</span>
          {images.length === 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
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
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Ürün Adı *</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="Aynısafa Masaj Kremi"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Slug (URL)*</label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="aynisefa-masaj-kremi"
                />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Kategori</label>
                <select
                  {...register('category_id')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">SKU (Stok Kodu)</label>
                <input
                  type="text"
                  {...register('sku')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="NRV-AYN-01"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Barkod</label>
                <input
                  type="text"
                  {...register('barcode')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="8680000000000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Boyut / Hacim</label>
                <input
                  type="text"
                  {...register('size')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="Örn: 100 ml, 50 gr"
                />
                {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Kısa Açıklama</label>
              <textarea
                {...register('short_description')}
                rows="2"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all resize-none"
                placeholder="Listeleme sayfalarında görünecek kısa açıklama..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Tam Açıklama</label>
              <textarea
                {...register('description')}
                rows="6"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                placeholder="Ürün detay sayfasında görünecek detaylı açıklama..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Kullanım Şekli</label>
                <textarea
                  {...register('usage')}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="Ürünün nasıl kullanılması gerektiğini açıklayın..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">İçindekiler</label>
                <textarea
                  {...register('ingredients')}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="İçindekileri (INCI formatında) listeleyin..."
                />
              </div>
            </div>

            {/* Badges / Checkboxes */}
            <div className="pt-4 border-t border-[#F2EEE5]">
              <span className="block text-xs font-semibold text-slate-500 uppercase mb-4">Öne Çıkarma Seçenekleri</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_featured')} className="rounded border-slate-350 text-[#556B2F] focus:ring-[#556B2F]/30 w-4 h-4" />
                  <span className="text-sm text-slate-700">Öne Çıkar</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_new')} className="rounded border-slate-350 text-[#556B2F] focus:ring-[#556B2F]/30 w-4 h-4" />
                  <span className="text-sm text-slate-700">Yeni Ürün</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_popular')} className="rounded border-slate-350 text-[#556B2F] focus:ring-[#556B2F]/30 w-4 h-4" />
                  <span className="text-sm text-slate-700">Popüler</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('show_on_homepage')} className="rounded border-slate-350 text-[#556B2F] focus:ring-[#556B2F]/30 w-4 h-4" />
                  <span className="text-sm text-slate-700">Ana Sayfada Göster</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PRICING & STOCK TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Satış Fiyatı (TL)*</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all font-mono"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Eski Fiyat / Üstü Çizili (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('old_price', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Vergi Oranı (%)</label>
                <input
                  type="number"
                  {...register('tax_rate', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all font-mono"
                  placeholder="18"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Stok Miktarı *</label>
                <input
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all font-mono"
                  placeholder="0"
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Stok Durumu</label>
                <select
                  {...register('stock_status')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                >
                  <option value="in_stock">Stokta Var</option>
                  <option value="out_of_stock">Tükendi</option>
                  <option value="pre_order">Ön Sipariş</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Ağırlık (Gram)</label>
                <input
                  type="number"
                  {...register('weight', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all font-mono"
                  placeholder="Örn: 250"
                />
              </div>
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase mb-4">Ürün Görselleri</span>
              
              {/* Dropzone Upload Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                
                {/* Upload File */}
                <div className="relative border-2 border-dashed border-slate-200 hover:border-[#556B2F]/50 rounded-2xl h-36 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#F8F7F3]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploading ? (
                    <div className="w-8 h-8 border-2 border-[#556B2F] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700">Dosya Seçin veya Sürükleyin</span>
                      <span className="text-[10px] text-slate-500">PNG, JPG, WEBP (Maks 5MB)</span>
                    </>
                  )}
                </div>

                {/* Add by URL */}
                <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between bg-[#F8F7F3]/40">
                  <span className="text-xs font-medium text-slate-500">Web URL ile Resim Ekle</span>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-250 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#556B2F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 rounded-lg bg-[#556B2F] hover:bg-[#3E5A38] text-white text-xs font-bold transition-all"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

              </div>

              {/* Images Preview Grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 bg-[#F8F7F3]">
                      <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-2 rounded-lg bg-red-650 hover:bg-red-500 text-white transition-colors"
                          title="Görseli Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-[#556B2F] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                          Kapak
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                  <ImageIcon className="w-8 h-8 opacity-30" />
                  <span>Henüz görsel eklenmedi. En az bir görsel gereklidir.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">SEO Başlığı (Meta Title)</label>
                <input
                  type="text"
                  {...register('seo_title')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="Aynısafa Kremi - Doğal Bakım | NURVERA"
                  maxLength="100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Anahtar Kelimeler (Meta Keywords)</label>
                <input
                  type="text"
                  {...register('seo_keywords')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all"
                  placeholder="aynısafa, krem, doğal bakım, bitkisel krem"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">SEO Açıklaması (Meta Description)</label>
              <textarea
                {...register('seo_description')}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 focus:border-[#556B2F] transition-all resize-none"
                placeholder="Arama motoru sonuçlarında listelenecek açıklama metni..."
                maxLength="250"
              />
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON & STATUS SELECTOR */}
        <div className="pt-6 border-t border-[#F2EEE5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Yayın Durumu:</span>
            <select
              {...register('status')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#556B2F]"
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayınla</option>
              <option value="archived">Arşivle</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-[#556B2F] hover:bg-[#3E5A38] text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Ürünü Kaydet</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
