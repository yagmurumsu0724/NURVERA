import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Plus, Search, Edit2, Trash2, Package, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Fetch Categories for Filter
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  // Fetch Products with Filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        category_id: categoryId,
        status
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Ürünler yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1);
  }, [search, categoryId, status]);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryId, status]);

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Ürün başarıyla silindi.');
        fetchProducts();
      } else {
        toast.error(data.error || 'Ürün silinemedi.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    }
  };

  const tableHeaders = [
    {
      label: 'Görsel',
      render: (row) => {
        const firstImg = row.images && row.images.length > 0 ? row.images[0] : null;
        return firstImg ? (
          <img src={firstImg} alt={row.name} className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700/50" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-500">
            <ImageIcon className="w-4 h-4" />
          </div>
        );
      }
    },
    {
      label: 'Ürün Adı / SKU',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white truncate max-w-[200px]" title={row.name}>
            {row.name}
          </span>
          <span className="text-xs text-slate-400 font-mono mt-0.5">{row.sku || 'SKU Belirtilmemiş'}</span>
        </div>
      )
    },
    {
      label: 'Kategori',
      render: (row) => (
        <span className="text-xs text-slate-300">
          {row.categories?.name || '-'}
        </span>
      )
    },
    {
      label: 'Fiyat',
      render: (row) => (
        <div className="flex flex-col font-mono text-xs">
          <span className="text-emerald-400 font-bold">{row.price} TL</span>
          {row.old_price && (
            <span className="text-slate-500 line-through mt-0.5">{row.old_price} TL</span>
          )}
        </div>
      )
    },
    {
      label: 'Stok / Durum',
      render: (row) => {
        let stockColor = 'text-emerald-400';
        if (row.stock === 0) stockColor = 'text-red-400 font-bold';
        else if (row.stock <= 5) stockColor = 'text-amber-400 font-semibold animate-pulse';

        return (
          <div className="flex flex-col text-xs">
            <span className={stockColor}>{row.stock} Adet</span>
            <span className="text-[10px] text-slate-500 uppercase mt-0.5">
              {row.stock_status === 'in_stock' ? 'Stokta' : row.stock_status === 'out_of_stock' ? 'Tükendi' : 'Ön Sipariş'}
            </span>
          </div>
        );
      }
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
              href={`/urunler/${row.slug}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Sitede Görüntüle"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link 
            href={`/admin/urunler/${row.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
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
    <AdminLayout title="Ürünler">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#7FA34D]" />
            <h3 className="text-white font-semibold">Tüm Ürünler ({total})</h3>
          </div>

          <Link
            href="/admin/urunler/yeni"
            className="px-4 py-2 bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Ürün adı, SKU veya barkod ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
            />
          </div>

          {/* Category Filter */}
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

          {/* Status Filter */}
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

        {/* Data Table */}
        <DataTable
          headers={tableHeaders}
          data={products}
          loading={loading}
          pagination={{
            page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage)
          }}
          emptyMessage="Aradığınız kriterlere uygun ürün bulunamadı."
        />

      </div>
    </AdminLayout>
  );
}

ProductListPage.getLayout = (page) => page;

export default withAdminAuth(ProductListPage);
