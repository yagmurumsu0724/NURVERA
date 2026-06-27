import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Settings, Save, Info, Phone, Image as ImageIcon, Share2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

function SiteSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  // General Settings
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [footerText, setFooterText] = useState('');

  // Contact Settings
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState('');

  // Branding Settings
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Social Links
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        
        // General
        setSiteName(data.site_name || '');
        setSiteDescription(data.site_description || '');
        setWorkingHours(data.working_hours || '');
        setFooterText(data.footer_text || '');

        // Contact
        setContactPhone(data.contact_phone || '');
        setContactEmail(data.contact_email || '');
        setContactAddress(data.contact_address || '');
        setWhatsappNumber(data.whatsapp_number || '');
        setMapsEmbedUrl(data.maps_embed_url || '');

        // Branding
        setLogoUrl(data.logo_url || '');
        setFaviconUrl(data.favicon_url || '');

        // Social
        setInstagramUrl(data.instagram_url || '');
        setFacebookUrl(data.facebook_url || '');
        setYoutubeUrl(data.youtube_url || '');
        setTiktokUrl(data.tiktok_url || '');
      } else {
        toast.error('Site ayarları yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      site_name: siteName,
      site_description: siteDescription,
      working_hours: workingHours,
      footer_text: footerText,

      contact_phone: contactPhone,
      contact_email: contactEmail,
      contact_address: contactAddress,
      whatsapp_number: whatsappNumber,
      maps_embed_url: mapsEmbedUrl,

      logo_url: logoUrl,
      favicon_url: faviconUrl,

      instagram_url: instagramUrl,
      facebook_url: facebookUrl,
      youtube_url: youtubeUrl,
      tiktok_url: tiktokUrl
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Ayarlar başarıyla kaydedildi.');
        fetchSettings();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Kaydetme başarısız.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const tabClass = (tab) => `flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all ${
    activeTab === tab 
      ? 'border-[#7FA34D] text-[#7FA34D]' 
      : 'border-transparent text-slate-400 hover:text-slate-200'
  }`;

  return (
    <AdminLayout title="Sistem Ayarları">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-6">
          <button type="button" onClick={() => setActiveTab('general')} className={tabClass('general')}>
            <Info className="w-4 h-4" />
            <span>Genel Ayarlar</span>
          </button>
          <button type="button" onClick={() => setActiveTab('contact')} className={tabClass('contact')}>
            <Phone className="w-4 h-4" />
            <span>İletişim Bilgileri</span>
          </button>
          <button type="button" onClick={() => setActiveTab('branding')} className={tabClass('branding')}>
            <ImageIcon className="w-4 h-4" />
            <span>Logo & Görsel</span>
          </button>
          <button type="button" onClick={() => setActiveTab('social')} className={tabClass('social')}>
            <Share2 className="w-4 h-4" />
            <span>Sosyal Medya</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#7FA34D]" />
            <span className="text-slate-400 text-xs font-semibold">Ayarlar yükleniyor...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Site Adı</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="NURVERA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Site Açıklaması</label>
                  <input
                    type="text"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="Doğal Sağlık ve Şifa Ürünleri"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Çalışma Saatleri</label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="Pzt-Cum: 09:00 - 18:00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Footer Alt Bilgisi (Telif Hakları)</label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="© 2026 NURVERA. Tüm hakları saklıdır."
                  />
                </div>
              </div>
            )}

            {/* TAB: CONTACT */}
            {activeTab === 'contact' && (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Telefon Numarası</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">WhatsApp Destek Hattı</label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Destek E-posta Adresi</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="destek@nurvera.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Fiziksel Adres</label>
                  <textarea
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none resize-none"
                    placeholder="İstanbul, Türkiye"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={mapsEmbedUrl}
                    onChange={(e) => setMapsEmbedUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none text-xs"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
              </div>
            )}

            {/* TAB: BRANDING */}
            {activeTab === 'branding' && (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Site Logo Görseli (URL)</label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="/images/nurvera_logo.png"
                  />
                  {logoUrl && (
                    <div className="mt-4 p-3 bg-slate-950/40 rounded-lg border border-slate-800 flex justify-center">
                      <img src={logoUrl} alt="Logo önizleme" className="max-h-16 object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Favicon Adresi (URL)</label>
                  <input
                    type="text"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>
            )}

            {/* TAB: SOCIAL */}
            {activeTab === 'social' && (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Instagram Adresi</label>
                    <input
                      type="text"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#C13584]/20 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#C13584]"
                      placeholder="https://instagram.com/nurvera"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Facebook Adresi</label>
                    <input
                      type="text"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1877F2]/20 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#1877F2]"
                      placeholder="https://facebook.com/nurvera"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">YouTube Adresi</label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#FF0000]/20 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#FF0000]"
                      placeholder="https://youtube.com/c/nurvera"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">TikTok Adresi</label>
                    <input
                      type="text"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
                      placeholder="https://tiktok.com/@nurvera"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-800 flex justify-end">
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
                    <span>Ayarları Kaydet</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
}

SiteSettingsPage.getLayout = (page) => page;

export default withAdminAuth(SiteSettingsPage, ['admin']); // Admin only!
