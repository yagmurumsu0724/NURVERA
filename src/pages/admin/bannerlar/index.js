import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Layers, Plus, Edit2, Trash2, Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function BannersPage() {
  const supabase = useSupabaseClient();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [bannerType, setBannerType] = useState('hero_slider');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTarget, setLinkTarget] = useState('_self');
  const [buttonText, setButtonText] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [popupDelay, setPopupDelay] = useState('3');
  const [popupTrigger, setPopupTrigger] = useState('load');

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      } else {
        toast.error('Bannerlar yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setBannerType('hero_slider');
    setImageUrl('');
    setMobileImageUrl('');
    setLinkUrl('');
    setLinkTarget('_self');
    setButtonText('');
    setSortOrder('0');
    setIsActive(true);
    setPopupDelay('3');
    setPopupTrigger('load');
  };

  const handleEditInit = (banner) => {
    setEditId(banner.id);
    setTitle(banner.title);
    setBannerType(banner.banner_type);
    setImageUrl(banner.image_url);
    setMobileImageUrl(banner.mobile_image_url || '');
    setLinkUrl(banner.link_url || '');
    setLinkTarget(banner.link_target || '_self');
    setButtonText(banner.button_text || '');
    setSortOrder(String(banner.sort_order || 0));
    setIsActive(banner.is_active);
    setPopupDelay(String(banner.popup_delay || 3));
    setPopupTrigger(banner.popup_trigger || 'load');
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'desktop') setUploadingDesktop(true);
    if (type === 'mobile') setUploadingMobile(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('nurvera-media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('nurvera-media')
        .getPublicUrl(filePath);

      if (type === 'desktop') setImageUrl(publicUrl);
      if (type === 'mobile') setMobileImageUrl(publicUrl);

      toast.success('Görsel başarıyla yüklendi.');
    } catch (err) {
      toast.error('Görsel yüklenemedi: ' + err.message);
    } finally {
      setUploadingDesktop(false);
      setUploadingMobile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      toast.error('Başlık ve Masaüstü Görsel URL alanları zorunludur.');
      return;
    }

    const payload = {
      title,
      banner_type: bannerType,
      image_url: imageUrl,
      mobile_image_url: mobileImageUrl || null,
      link_url: linkUrl || null,
      link_target: linkTarget,
      button_text: buttonText || null,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
      popup_delay: Number(popupDelay) || 3,
      popup_trigger: popupTrigger
    };

    const method = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `/api/admin/banners?id=${editId}` : '/api/admin/banners';

    const promise = fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İşlem başarısız.');
      return data;
    });

    toast.promise(promise, {
      loading: editId ? 'Banner güncelleniyor...' : 'Banner ekleniyor...',
      success: () => {
        fetchBanners();
        resetForm();
        return editId ? 'Banner güncellendi.' : 'Banner başarıyla eklendi.';
      },
      error: (err) => err.message
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu bannerı silmek istediğinize emin misiniz?')) return;

    const promise = fetch(`/api/admin/banners?id=${id}`, {
      method: 'DELETE'
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Silme işlemi başarısız.');
      return data;
    });

    toast.promise(promise, {
      loading: 'Banner siliniyor...',
      success: () => {
        fetchBanners();
        return 'Banner silindi.';
      },
      error: (err) => err.message
    });
  };

  const typeLabels = {
    hero_slider: 'Giriş Slider',
    campaign: 'Kampanya Kartı',
    popup: 'Popup Bildirim',
    mobile: 'Mobil Özel Banner',
    desktop: 'Masaüstü Özel Banner'
  };

  return (
    <AdminLayout title="Bannerlar & Kampanyalar">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORM PANEL (1/3) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7FA34D]" />
              {editId ? 'Banner Düzenle' : 'Yeni Banner Ekle'}
            </h3>
            {editId && (
              <button 
                onClick={resetForm}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Vazgeç"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Banner Başlığı *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                placeholder="Yaz Kampanyası Başladı!"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Banner Tipi</label>
              <select
                value={bannerType}
                onChange={(e) => setBannerType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
              >
                <option value="hero_slider">Giriş Slider (Hero)</option>
                <option value="campaign">Kampanya Kartı</option>
                <option value="popup">Popup Bildirim</option>
                <option value="desktop">Masaüstü Banner</option>
                <option value="mobile">Mobil Banner</option>
              </select>
            </div>

            {/* Desktop Image Upload & URL */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-400 uppercase mb-2">Masaüstü Görseli *</span>
              <div className="grid grid-cols-4 gap-2 items-center">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Resim URL'si"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="col-span-1 relative h-9 border border-dashed border-slate-800 hover:border-[#7FA34D]/50 rounded-lg flex items-center justify-center cursor-pointer bg-slate-950/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'desktop')}
                    disabled={uploadingDesktop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploadingDesktop ? (
                    <div className="w-4 h-4 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Image Upload & URL */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-400 uppercase mb-2">Mobil Görseli (Opsiyonel)</span>
              <div className="grid grid-cols-4 gap-2 items-center">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={mobileImageUrl}
                    onChange={(e) => setMobileImageUrl(e.target.value)}
                    placeholder="Mobil Resim URL'si"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="col-span-1 relative h-9 border border-dashed border-slate-800 hover:border-[#7FA34D]/50 rounded-lg flex items-center justify-center cursor-pointer bg-slate-950/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'mobile')}
                    disabled={uploadingMobile}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploadingMobile ? (
                    <div className="w-4 h-4 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Link Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Yönlendirme URL (Link)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                  placeholder="/urunler/aynisefa"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Buton Metni</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                  placeholder="İncele"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Link Hedefi</label>
              <select
                value={linkTarget}
                onChange={(e) => setLinkTarget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
              >
                <option value="_self">Aynı Sekmede Aç (_self)</option>
                <option value="_blank">Yeni Sekmede Aç (_blank)</option>
              </select>
            </div>

            {/* POPUP CONDITIONAL FIELDS */}
            {bannerType === 'popup' && (
              <div className="p-4 bg-slate-955 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <span className="text-[10px] uppercase font-bold text-[#7FA34D] tracking-wider block">Popup Ayarları</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Gecikme (Sn)</label>
                    <input
                      type="number"
                      value={popupDelay}
                      onChange={(e) => setPopupDelay(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-850 bg-slate-950 text-xs text-white focus:outline-none font-mono"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Tetikleyici</label>
                    <select
                      value={popupTrigger}
                      onChange={(e) => setPopupTrigger(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-850 bg-slate-950 text-xs text-white focus:outline-none"
                    >
                      <option value="load">Sayfa Açılınca</option>
                      <option value="scroll">Kaydırınca</option>
                      <option value="exit">Çıkış Niyetinde</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Sorting and Active Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sıralama Sırası</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none font-mono"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Durum</label>
                <div className="flex items-center h-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7FA34D]"></div>
                    <span className="ml-3 text-sm font-medium text-slate-300">Aktif</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-slate-950 bg-[#7FA34D] hover:bg-[#8eb85c] focus:outline-none transition-all flex items-center justify-center gap-2"
            >
              {editId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editId ? 'Güncelle' : 'Banner Oluştur'}
            </button>

          </form>
        </div>

        {/* LIST PANEL (2/3) */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-6">Yayındaki Görsel & Kampanyalar</h3>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : banners.length > 0 ? (
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3">Önizleme</th>
                    <th className="px-4 py-3">Başlık</th>
                    <th className="px-4 py-3">Tür</th>
                    <th className="px-4 py-3">Sıra</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        {banner.image_url ? (
                          <img 
                            src={banner.image_url} 
                            alt={banner.title} 
                            className="w-16 h-10 rounded object-cover bg-slate-850 border border-slate-850" 
                          />
                        ) : (
                          <div className="w-16 h-10 rounded bg-slate-850 flex items-center justify-center text-slate-500">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white truncate max-w-[200px]">{banner.title}</span>
                          {banner.link_url && (
                            <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">{banner.link_url}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded">
                          {typeLabels[banner.banner_type] || banner.banner_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">{banner.sort_order}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          banner.is_active 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {banner.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditInit(banner)}
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                              editId === banner.id ? 'text-[#7FA34D] bg-[#1E4D3A]/20 border border-[#7FA34D]/30' : ''
                            }`}
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
                <AlertCircle className="w-8 h-8 opacity-40" />
                <span>Hiç banner bulunmuyor.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

BannersPage.getLayout = (page) => page;

export default withAdminAuth(BannersPage);
