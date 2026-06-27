import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Edit2, Layout, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function PagesListPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages-content');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        toast.error('Sayfalar yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const tableHeaders = [
    {
      label: 'Sayfa Başlığı',
      render: (row) => (
        <span className="font-semibold text-white">
          {row.page_title}
        </span>
      )
    },
    {
      label: 'Slug (URL)',
      render: (row) => (
        <span className="font-mono text-xs text-slate-400">
          /{row.page_slug === 'home' ? '' : row.page_slug}
        </span>
      )
    },
    {
      label: 'Son Güncelleme',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date(row.updated_at).toLocaleDateString('tr-TR')}</span>
        </div>
      )
    },
    {
      label: 'Durum',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          row.is_published 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        }`}>
          {row.is_published ? 'Yayında' : 'Taslak'}
        </span>
      )
    },
    {
      label: 'İşlemler',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end">
          <Link 
            href={`/admin/sayfalar/${row.page_slug}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Edit2 className="w-4 h-4" />
            <span>İçeriği Düzenle</span>
          </Link>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Sayfa İçerikleri">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Header Title */}
        <div className="flex items-center gap-2 mb-6">
          <Layout className="w-5 h-5 text-[#7FA34D]" />
          <h3 className="text-white font-semibold">Tüm Sayfalar ({pages.length})</h3>
        </div>

        {/* DataTable */}
        <DataTable
          headers={tableHeaders}
          data={pages}
          loading={loading}
          emptyMessage="Kayıtlı sayfa bulunamadı."
        />

      </div>
    </AdminLayout>
  );
}

PagesListPage.getLayout = (page) => page;

export default withAdminAuth(PagesListPage);
