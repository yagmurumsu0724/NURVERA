import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Search, Save, Globe, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGES_LIST = [
  { slug: 'home', title: 'Ana Sayfa' },
  { slug: 'about', title: 'Hakkımızda' },
  { slug: 'contact', title: 'İletişim' },
  { slug: 'hacamat', title: 'Hacamat Tedavisi' },
  { slug: 'suluk', title: 'Sülük Tedavisi' },
  { slug: 'privacy', title: 'Gizlilik Politikası' },
  { slug: 'kvkk', title: 'KVKK Metni' },
  { slug: 'return-policy', title: 'İade Politikası' },
  { slug: 'shipping', title: 'Kargo & Teslimat' }
];

function SeoManagementPage() {
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robots, setRobots] = useState('index, follow');

  const fetchSeoData = async (slug) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seo?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        setMetaKeywords(data.meta_keywords || '');
        setOgTitle(data.og_title || '');
        setOgDescription(data.og_description || '');
        setOgImage(data.og_image || '');
        setCanonicalUrl(data.canonical_url || '');
        setRobots(data.robots || 'index, follow');
      } else {
        toast.error('SEO verileri yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData(selectedSlug);
  }, [selectedSlug]);

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      page_slug: selectedSlug,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
      og_title: ogTitle,
      og_description: ogDescription,
      og_image: ogImage,
      canonical_url: canonicalUrl,
      robots
    };

    try {
      const res = await fetch(`/api/admin/seo?slug=${selectedSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('SEO ayarları başarıyla güncellendi.');
        fetchSeoData(selectedSlug);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Güncelleme başarısız.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="SEO Yönetimi">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* PAGES SELECTOR SIDEBAR (1/3) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#7FA34D]" />
            Sayfalar
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            SEO etiketlerini düzenlemek istediğiniz sayfayı seçin:
          </p>

          <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-1">
            {PAGES_LIST.map((page) => (
              <button
                key={page.slug}
                type="button"
                onClick={() => setSelectedSlug(page.slug)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedSlug === page.slug 
                    ? 'border-[#7FA34D] bg-[#1E4D3A]/20 text-white' 
                    : 'border-slate-850 bg-slate-950/40 text-slate-450 hover:text-slate-200'
                }`}
              >
                {page.title}
                <span className="block font-mono text-[9px] text-slate-500 mt-1">/{page.slug === 'home' ? '' : page.slug}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SEO META FORM (2/3) */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
            <h3 className="text-white font-semibold">
              {PAGES_LIST.find(p => p.slug === selectedSlug)?.title} SEO Ayarları
            </h3>
            {loading && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7FA34D]" />
                <span>Yükleniyor...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-6">
            
            {/* Meta Tags */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-[#7FA34D] tracking-wider block">Standart Arama Motoru Etiketleri</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Başlık (Title)</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="En fazla 60 karakter"
                    maxLength="60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Anahtar Kelimeler (Keywords)</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="hacamat, sülük, bitkisel yağlar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Açıklama (Meta Description)</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none resize-none"
                  placeholder="En fazla 160 karakter"
                  maxLength="160"
                />
              </div>
            </div>

            {/* Social Share / OG tags */}
            <div className="space-y-4 pt-6 border-t border-slate-850">
              <span className="text-[10px] uppercase font-bold text-[#7FA34D] tracking-wider block font-sans">Open Graph (Sosyal Medya Paylaşım) Etiketleri</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Paylaşım Başlığı (OG Title)</label>
                  <input
                    type="text"
                    value={ogTitle || metaTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="Paylaşıldığında görünecek başlık"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Paylaşım Resim URL (OG Image)</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="Paylaşıldığında görünecek görsel adresi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Paylaşım Açıklaması (OG Description)</label>
                <textarea
                  value={ogDescription || metaDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none resize-none"
                  placeholder="Paylaşıldığında görünecek açıklama metni"
                />
              </div>
            </div>

            {/* Crawler Config */}
            <div className="space-y-4 pt-6 border-t border-slate-850">
              <span className="text-[10px] uppercase font-bold text-[#7FA34D] tracking-wider block font-sans">Arama Motoru Robot Ayarları</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Özgün URL (Canonical URL)</label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="https://nurvera.com/sayfa"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Robots Etiketleri</label>
                  <select
                    value={robots}
                    onChange={(e) => setRobots(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                  >
                    <option value="index, follow">Indexle ve Takip Et (index, follow)</option>
                    <option value="noindex, follow">Indexleme, Takip Et (noindex, follow)</option>
                    <option value="index, nofollow">Indexle, Takip Etme (index, nofollow)</option>
                    <option value="noindex, nofollow">Tamamen Engelle (noindex, nofollow)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-850 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 font-bold transition-all flex items-center gap-2 disabled:opacity-50 text-sm shadow-md"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>SEO Ayarlarını Kaydet</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </AdminLayout>
  );
}

SeoManagementPage.getLayout = (page) => page;

export default withAdminAuth(SeoManagementPage);
