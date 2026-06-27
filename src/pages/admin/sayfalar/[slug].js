import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Save, 
  Layers, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  LayoutTemplate
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function PageBuilderPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [pageData, setPageData] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/admin/pages-content?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
          setBlocks(data.blocks || []);
        } else {
          toast.error('Sayfa içeriği yüklenemedi.');
          router.push('/admin/sayfalar');
        }
      } catch (err) {
        toast.error('Bağlantı hatası.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, router]);

  // Block creation
  const handleAddBlock = (type) => {
    let newBlock = { type, id: `${type}_${Date.now()}` };
    
    if (type === 'hero') {
      newBlock.title = 'Giriş Başlığı';
      newBlock.subtitle = 'Giriş Alt Metni';
      newBlock.image_url = '';
      newBlock.btn_text = 'Keşfet';
      newBlock.btn_url = '/urunler';
    } else if (type === 'text') {
      newBlock.title = 'Başlık Yazın';
      newBlock.content = '<p>İçerik yazısı buraya gelecek...</p>';
    } else if (type === 'features') {
      newBlock.title = 'Neden Biz?';
      newBlock.items = [{ title: 'Doğal Hammaddeler', desc: 'Tamamen katkısız bitkiler.', icon: 'Leaf' }];
    } else if (type === 'faq') {
      newBlock.title = 'Sıkça Sorulan Sorular';
      newBlock.items = [{ q: 'Soru Başlığı', a: 'Cevap metni buraya yazılacak.' }];
    } else if (type === 'cta') {
      newBlock.title = 'Doğal Bakım Keşfi';
      newBlock.desc = 'Hemen sipariş verin, ücretsiz kargodan yararlanın.';
      newBlock.btn_text = 'Satın Al';
      newBlock.btn_url = '/checkout';
    }

    setBlocks(prev => [...prev, newBlock]);
    setExpandedIndex(blocks.length); // expand newly added block
    toast.success('Blok eklendi.');
  };

  // Block movement & deletion
  const moveBlock = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setBlocks(newBlocks);
    setExpandedIndex(targetIndex);
  };

  const handleDeleteBlock = (index) => {
    if (confirm('Bu bloğu silmek istediğinize emin misiniz?')) {
      setBlocks(prev => prev.filter((_, i) => i !== index));
      setExpandedIndex(null);
      toast.success('Blok kaldırıldı.');
    }
  };

  // Update block fields
  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    setBlocks(newBlocks);
  };

  // Sub-items change handler (for features & faq lists)
  const handleSubItemChange = (blockIndex, itemIndex, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].items[itemIndex][field] = value;
    setBlocks(newBlocks);
  };

  const addSubItem = (blockIndex, type) => {
    const newBlocks = [...blocks];
    if (type === 'features') {
      newBlocks[blockIndex].items.push({ title: 'Yeni Özellik', desc: 'Açıklama', icon: 'Star' });
    } else if (type === 'faq') {
      newBlocks[blockIndex].items.push({ q: 'Soru', a: 'Cevap' });
    }
    setBlocks(newBlocks);
  };

  const removeSubItem = (blockIndex, itemIndex) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].items = newBlocks[blockIndex].items.filter((_, i) => i !== itemIndex);
    setBlocks(newBlocks);
  };

  const handleSavePage = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages-content?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_title: pageData.page_title,
          blocks,
          is_published: pageData.is_published
        })
      });

      if (res.ok) {
        toast.success('Sayfa başarıyla güncellendi.');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Kaydetme başarısız.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setSaving(false);
    }
  };

  const blockTypes = [
    { type: 'hero', label: 'Hero / Giriş Slider' },
    { type: 'text', label: 'Açıklama / Metin Alanı' },
    { type: 'features', label: 'Özellikler Grid' },
    { type: 'faq', label: 'Sık Sorulan Sorular' },
    { type: 'cta', label: 'Call To Action (CTA)' }
  ];

  return (
    <AdminLayout title={pageData ? `${pageData.page_title} Düzenleyici` : 'Sayfa Düzenleyici'}>
      <div className="flex flex-col gap-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link 
            href="/admin/sayfalar" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sayfa Listesine Dön</span>
          </Link>

          {pageData && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-400">
                <input
                  type="checkbox"
                  checked={pageData.is_published}
                  onChange={(e) => setPageData({ ...pageData, is_published: e.target.checked })}
                  className="rounded border-slate-800 text-[#7FA34D] focus:ring-0 bg-slate-950 w-4 h-4"
                />
                <span>Sayfayı Yayınla</span>
              </label>

              <button
                onClick={handleSavePage}
                disabled={saving}
                className="px-4 py-2 bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-slate-900/40 border border-slate-800 rounded-xl">
            <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* BLOCKS EDITOR PANEL (2/3) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sayfa Blokları ({blocks.length})</h3>
              
              {blocks.length > 0 ? (
                blocks.map((block, idx) => {
                  const isExpanded = expandedIndex === idx;
                  return (
                    <div 
                      key={block.id} 
                      className={`bg-slate-900/30 border border-slate-800 rounded-xl transition-all overflow-hidden ${
                        isExpanded ? 'ring-1 ring-[#7FA34D]/30 border-[#7FA34D]/30' : ''
                      }`}
                    >
                      {/* Block Title Header Bar */}
                      <div 
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-sm text-white">
                            {block.type.toUpperCase()} - {block.title || 'Başlıksız'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveBlock(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-all"
                            title="Yukarı Taşı"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveBlock(idx, 'down')}
                            disabled={idx === blocks.length - 1}
                            className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-all"
                            title="Aşağı Taşı"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(idx)}
                            className="p-1 rounded bg-slate-850 hover:bg-red-500/20 text-slate-450 hover:text-red-400 transition-all"
                            title="Blok Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                            className="p-1 rounded bg-slate-850 text-slate-400 transition-all"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Block Contents Form */}
                      {isExpanded && (
                        <div className="p-5 border-t border-slate-800 bg-slate-950/20 space-y-4 animate-slideDown">
                          
                          {/* HERO BLOCK FIELDS */}
                          {block.type === 'hero' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Başlık</label>
                                <input type="text" value={block.title} onChange={(e) => handleBlockChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Alt Başlık</label>
                                <input type="text" value={block.subtitle} onChange={(e) => handleBlockChange(idx, 'subtitle', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Arka Plan Resim URL</label>
                                <input type="text" value={block.image_url} onChange={(e) => handleBlockChange(idx, 'image_url', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Buton Metni</label>
                                  <input type="text" value={block.btn_text} onChange={(e) => handleBlockChange(idx, 'btn_text', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Buton URL</label>
                                  <input type="text" value={block.btn_url} onChange={(e) => handleBlockChange(idx, 'btn_url', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TEXT BLOCK FIELDS */}
                          {block.type === 'text' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Bölüm Başlığı</label>
                                <input type="text" value={block.title} onChange={(e) => handleBlockChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Metin İçeriği (HTML)</label>
                                <textarea value={block.content} onChange={(e) => handleBlockChange(idx, 'content', e.target.value)} rows="5" className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white font-mono" />
                              </div>
                            </div>
                          )}

                          {/* FEATURES BLOCK FIELDS */}
                          {block.type === 'features' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Bölüm Başlığı</label>
                                <input type="text" value={block.title} onChange={(e) => handleBlockChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              
                              <div className="space-y-3 pt-2 border-t border-slate-850">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-[#7FA34D] uppercase">Izgara Öğeleri ({block.items?.length || 0})</span>
                                  <button type="button" onClick={() => addSubItem(idx, 'features')} className="flex items-center gap-1 text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold">
                                    <Plus className="w-3 h-3" /> Ekle
                                  </button>
                                </div>

                                {block.items?.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 space-y-2 relative">
                                    <button type="button" onClick={() => removeSubItem(idx, itemIdx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2 pr-6">
                                      <div>
                                        <input type="text" value={item.title} onChange={(e) => handleSubItemChange(idx, itemIdx, 'title', e.target.value)} placeholder="Özellik Başlığı" className="w-full px-2 py-1.5 rounded border border-slate-800 bg-slate-950 text-[11px] text-white" />
                                      </div>
                                      <div>
                                        <input type="text" value={item.icon} onChange={(e) => handleSubItemChange(idx, itemIdx, 'icon', e.target.value)} placeholder="İkon (Örn: Leaf, Star)" className="w-full px-2 py-1.5 rounded border border-slate-800 bg-slate-950 text-[11px] text-white" />
                                      </div>
                                      <div className="col-span-2">
                                        <input type="text" value={item.desc} onChange={(e) => handleSubItemChange(idx, itemIdx, 'desc', e.target.value)} placeholder="Özellik açıklaması..." className="w-full px-2 py-1.5 rounded border border-slate-800 bg-slate-950 text-[11px] text-white" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* FAQ ACCORDION BLOCK FIELDS */}
                          {block.type === 'faq' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Bölüm Başlığı</label>
                                <input type="text" value={block.title} onChange={(e) => handleBlockChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>

                              <div className="space-y-3 pt-2 border-t border-slate-850">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-[#7FA34D] uppercase">Soru & Cevaplar ({block.items?.length || 0})</span>
                                  <button type="button" onClick={() => addSubItem(idx, 'faq')} className="flex items-center gap-1 text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold">
                                    <Plus className="w-3 h-3" /> Ekle
                                  </button>
                                </div>

                                {block.items?.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-955 p-3 border border-slate-850 rounded-lg space-y-2 relative">
                                    <button type="button" onClick={() => removeSubItem(idx, itemIdx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="space-y-2 pr-6">
                                      <input type="text" value={item.q} onChange={(e) => handleSubItemChange(idx, itemIdx, 'q', e.target.value)} placeholder="Soru?" className="w-full px-2 py-1.5 rounded border border-slate-800 bg-slate-950 text-[11px] text-white" />
                                      <textarea value={item.a} onChange={(e) => handleSubItemChange(idx, itemIdx, 'a', e.target.value)} placeholder="Cevap..." rows="2" className="w-full px-2 py-1.5 rounded border border-slate-800 bg-slate-950 text-[11px] text-white resize-none" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CTA CALL TO ACTION FIELDS */}
                          {block.type === 'cta' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Başlık</label>
                                <input type="text" value={block.title} onChange={(e) => handleBlockChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Açıklama</label>
                                <input type="text" value={block.desc} onChange={(e) => handleBlockChange(idx, 'desc', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                              </div>
                              <div className="grid grid-cols-2 gap-2 col-span-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Buton Metni</label>
                                  <input type="text" value={block.btn_text} onChange={(e) => handleBlockChange(idx, 'btn_text', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Buton URL</label>
                                  <input type="text" value={block.btn_url} onChange={(e) => handleBlockChange(idx, 'btn_url', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white" />
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                  <LayoutTemplate className="w-8 h-8 opacity-30" />
                  <span>Bu sayfada henüz hiç blok bulunmuyor. Sağdaki panelden yeni blok ekleyin.</span>
                </div>
              )}
            </div>

            {/* ADD BLOCKS TOOLBOX SIDEBAR (1/3) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm space-y-6">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#7FA34D]" />
                Blok Ekleme Kutusu
              </h4>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Aşağıdaki önceden tanımlanmış blok tiplerinden birini seçerek sayfa yapısına yeni bölümler ekleyebilirsiniz.
              </p>

              <div className="flex flex-col gap-2">
                {blockTypes.map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleAddBlock(item.type)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:border-[#7FA34D]/50 hover:bg-[#1E4D3A]/20 transition-all flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <Plus className="w-4 h-4 text-[#7FA34D]" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

PageBuilderPage.getLayout = (page) => page;

export default withAdminAuth(PageBuilderPage);
