import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Plus, Search, Edit2, Trash2, FileText, FolderPlus, AlertCircle, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function BlogListPage() {
  const [posts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Blog Category Management Panel State
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // Fetch Categories
  const fetchCategories = () => {
    fetch('/api/admin/blog-categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate category slug
  useEffect(() => {
    const generated = catName
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
    setCatSlug(generated);
  }, [catName]);

  // Fetch Blog Posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        category_id: categoryId,
        status
      });

      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.posts || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Blog yazıları yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, categoryId, status]);

  useEffect(() => {
    fetchPosts();
  }, [page, search, categoryId, status]);

  const handleDeletePost = async (id) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Yazı başarıyla silindi.');
        fetchPosts();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Silme hatası.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName || !catSlug) {
      toast.error('Ad ve Slug gereklidir.');
      return;
    }

    try {
      const res = await fetch('/api/admin/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, slug: catSlug, description: catDescription })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Kategori eklendi.');
        fetchCategories();
        setCatName('');
        setCatDescription('');
      } else {
        toast.error(data.error || 'Kategori eklenemedi.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/admin/blog-categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Kategori silindi.');
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Silinemedi.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    }
  };

  const tableHeaders = [
    {
      label: 'Görsel',
      render: (row) => row.cover_image ? (
        <img src={row.cover_image} alt={row.title} className="w-12 h-8 rounded object-cover bg-slate-800 border border-slate-700/50" />
      ) : (
        <div className="w-12 h-8 rounded bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-500">
          <FileText className="w-3.5 h-3.5" />
        </div>
      )
    },
    {
      label: 'Yazı Başlığı / Tarih',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white truncate max-w-[240px]" title={row.title}>
            {row.title}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            {new Date(row.created_at).toLocaleDateString('tr-TR')} • Yazar: {row.author_name || 'Admin'}
          </span>
        </div>
      )
    },
    {
      label: 'Kategori',
      render: (row) => (
        <span className="text-xs text-slate-300">
          {row.blog_categories?.name || '-'}
        </span>
      )
    },
    {
      label: 'Okuma Süresi',
      render: (row) => (
        <span className="text-xs text-slate-300 font-mono">
          {row.reading_time || '5'} dk
        </span>
      )
    },
    {
      label: 'Durum',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          row.status === 'published' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : row.status === 'draft'
            ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {row.status === 'published' ? 'Yayında' : row.status === 'draft' ? 'Taslak' : 'Arşiv'}
        </span>
      )
    },
    {
      label: 'İşlemler',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'published' && (
            <a 
              href={`/blog/${row.slug}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Sitede Oku"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link 
            href={`/admin/blog/${row.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDeletePost(row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Blog Yazıları">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* POSTS LIST (2/3 or full) */}
        <div className={`${showCategoryPanel ? 'xl:col-span-2' : 'xl:col-span-3'} bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm`}>
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#7FA34D]" />
              <h3 className="text-white font-semibold">Tüm Yazılar ({total})</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryPanel(!showCategoryPanel)}
                className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${
                  showCategoryPanel 
                    ? 'border-[#7FA34D] bg-[#1E4D3A]/20 text-[#7FA34D]' 
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                <FolderPlus className="w-4 h-4" />
                <span>Kategorileri Yönet</span>
              </button>

              <Link
                href="/admin/blog/yeni"
                className="px-4 py-2 bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Yazı Yaz</span>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Yazı başlığı veya özet ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
              />
            </div>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
            >
              <option value="">Tüm Durumlar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşiv</option>
            </select>
          </div>

          <DataTable
            headers={tableHeaders}
            data={posts}
            loading={loading}
            pagination={{
              page,
              totalPages,
              onPageChange: (newPage) => setPage(newPage)
            }}
            emptyMessage="Aradığınız kriterlere uygun blog yazısı bulunamadı."
          />
        </div>

        {/* SIDE CATEGORIES PANEL (1/3) */}
        {showCategoryPanel && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold">Blog Kategorileri</h4>
              <button 
                onClick={() => setShowCategoryPanel(false)}
                className="p-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Form */}
            <form onSubmit={handleAddCategory} className="space-y-3 bg-slate-950/40 border border-slate-850 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Yeni Kategori</span>
              <div>
                <input
                  type="text"
                  placeholder="Kategori Adı"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Slug (URL)"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Kısa açıklama (isteğe bağlı)..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none resize-none"
                  rows="2"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 text-xs font-bold rounded-lg transition-all"
              >
                Kategori Ekle
              </button>
            </form>

            {/* Category List */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Kategori Listesi</span>
              <div className="divide-y divide-slate-850/60 max-h-60 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{cat.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{cat.slug}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-650 text-xs text-center py-4">Kategori yok</div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

BlogListPage.getLayout = (page) => page;

export default withAdminAuth(BlogListPage);
