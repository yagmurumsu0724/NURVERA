import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Plus, Edit2, Trash2, Folder, Eye, Search, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        toast.error('Kategoriler yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name in real-time
  useEffect(() => {
    if (!editId) {
      const generated = name
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
      setSlug(generated);
    }
  }, [name, editId]);

  const resetForm = () => {
    setEditId(null);
    setName('');
    setSlug('');
    setDescription('');
    setParentId('');
    setImageUrl('');
    setSortOrder('0');
    setIsActive(true);
    setSeoTitle('');
    setSeoDescription('');
  };

  const handleEditInit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setParentId(cat.parent_id || '');
    setImageUrl(cat.image_url || '');
    setSortOrder(String(cat.sort_order || 0));
    setIsActive(cat.is_active);
    setSeoTitle(cat.seo_title || '');
    setSeoDescription(cat.seo_description || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !slug) {
      toast.error('Ad ve Slug alanları zorunludur.');
      return;
    }

    const payload = {
      name,
      slug,
      description,
      parent_id: parentId || null,
      image_url: imageUrl,
      sort_order: Number(sortOrder),
      is_active: isActive,
      seo_title: seoTitle,
      seo_description: seoDescription
    };

    const method = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `/api/admin/categories?id=${editId}` : '/api/admin/categories';

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
      loading: editId ? 'Kategori güncelleniyor...' : 'Kategori ekleniyor...',
      success: (data) => {
        fetchCategories();
        resetForm();
        return editId ? 'Kategori güncellendi.' : 'Kategori başarıyla eklendi.';
      },
      error: (err) => err.message
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? Alt kategorileri varsa üst kategorileri kaldırılacaktır.')) {
      return;
    }

    const promise = fetch(`/api/admin/categories?id=${id}`, {
      method: 'DELETE'
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Silme işlemi başarısız.');
      return data;
    });

    toast.promise(promise, {
      loading: 'Kategori siliniyor...',
      success: () => {
        fetchCategories();
        return 'Kategori silindi.';
      },
      error: (err) => err.message
    });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to find parent name
  const getParentName = (pId) => {
    const parent = categories.find(c => c.id === pId);
    return parent ? parent.name : '-';
  };

  return (
    <AdminLayout title="Kategoriler">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORM PANEL (1/3) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Folder className="w-5 h-5 text-[#7FA34D]" />
              {editId ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
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
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kategori Adı</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                placeholder="Örn: Aynısafa Krem"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                placeholder="aynisefa-krem"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Üst Kategori</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
              >
                <option value="">(Yok - Ana Kategori)</option>
                {categories
                  .filter(c => c.id !== editId) // Cannot select self or sub-self
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Görsel URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                placeholder="https://example.com/image.png"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all resize-none"
                placeholder="Kategori hakkında kısa açıklama..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sıralama Sırası</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all font-mono"
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

            <div className="pt-4 border-t border-slate-800 space-y-4">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">SEO Ayarları</span>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">SEO Başlığı</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                  placeholder="Meta title"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">SEO Açıklaması</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all resize-none"
                  placeholder="Meta description"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 mt-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-slate-950 bg-[#7FA34D] hover:bg-[#8eb85c] focus:outline-none transition-all flex items-center justify-center gap-2"
            >
              {editId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editId ? 'Güncelle' : 'Kategori Oluştur'}
            </button>
          </form>
        </div>

        {/* LIST PANEL (2/3) */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-white font-semibold">Tüm Kategoriler ({categories.length})</h3>
              
              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredCategories.length > 0 ? (
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3">Resim</th>
                      <th className="px-4 py-3">Kategori Adı</th>
                      <th className="px-4 py-3">Slug (URL)</th>
                      <th className="px-4 py-3">Üst Kategori</th>
                      <th className="px-4 py-3">Sıra</th>
                      <th className="px-4 py-3">Durum</th>
                      <th className="px-4 py-3 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-8 h-8 rounded-lg object-cover bg-slate-800 border border-slate-700/50" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-500">
                              <Folder className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">{cat.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{cat.slug}</td>
                        <td className="px-4 py-3 text-slate-400">{getParentName(cat.parent_id)}</td>
                        <td className="px-4 py-3 font-mono">{cat.sort_order}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            cat.is_active 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {cat.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditInit(cat)}
                              className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                                editId === cat.id ? 'text-[#7FA34D] bg-[#1E4D3A]/20 border border-[#7FA34D]/30' : ''
                              }`}
                              title="Düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
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
                  <span>Kategori bulunamadı.</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

CategoriesPage.getLayout = (page) => page;

export default withAdminAuth(CategoriesPage);
