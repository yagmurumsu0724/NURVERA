import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Activity, ShieldAlert, Calendar, Laptop } from 'lucide-react';
import toast from 'react-hot-toast';

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [action, setAction] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
        action,
        resource_type: resourceType
      });

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Log verileri yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [action, resourceType]);

  useEffect(() => {
    fetchLogs();
  }, [page, action, resourceType]);

  const actionColors = {
    create: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    update: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    delete: 'bg-red-500/10 text-red-400 border border-red-500/20',
    login: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    logout: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  };

  const actionLabels = {
    create: 'Ekleme',
    update: 'Güncelleme',
    delete: 'Silme',
    login: 'Giriş',
    logout: 'Çıkış'
  };

  const tableHeaders = [
    {
      label: 'Kullanıcı',
      render: (row) => (
        <span className="font-semibold text-white text-xs">
          {row.user_email || 'Sistem (Otomatik)'}
        </span>
      )
    },
    {
      label: 'İşlem Tipi',
      render: (row) => {
        const color = actionColors[row.action] || 'bg-slate-550/10 text-slate-400 border border-slate-500/20';
        const label = actionLabels[row.action] || row.action;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${color}`}>
            {label}
          </span>
        );
      }
    },
    {
      label: 'Modül / Kaynak',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-200 capitalize">{row.resource_type}</span>
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">ID: {row.resource_id || '-'}</span>
        </div>
      )
    },
    {
      label: 'Tarih & Saat',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date(row.created_at).toLocaleString('tr-TR')}</span>
        </div>
      )
    },
    {
      label: 'IP & Cihaz',
      render: (row) => (
        <div className="flex flex-col text-[10px] text-slate-400 font-mono gap-0.5">
          <span>IP: {row.ip_address || 'Bilinmiyor'}</span>
          <span className="truncate max-w-[150px] text-slate-500 flex items-center gap-1" title={row.user_agent}>
            <Laptop className="w-3 h-3 text-slate-600" />
            {row.user_agent || 'Bilinmiyor'}
          </span>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Sistem İşlem Logları">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Header Title */}
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-[#7FA34D]" />
          <h3 className="text-white font-semibold">Tüm İşlem Kayıtları ({total})</h3>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
          >
            <option value="">Tüm İşlemler</option>
            <option value="create">Ekleme (Create)</option>
            <option value="update">Güncelleme (Update)</option>
            <option value="delete">Silme (Delete)</option>
            <option value="login">Giriş (Login)</option>
            <option value="logout">Çıkış (Logout)</option>
          </select>

          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none"
          >
            <option value="">Tüm Modüller</option>
            <option value="product">Ürünler</option>
            <option value="category">Kategoriler</option>
            <option value="blog">Blog Yazıları</option>
            <option value="order">Siparişler</option>
            <option value="banner">Bannerlar</option>
            <option value="settings">Site Ayarları</option>
            <option value="seo">SEO Ayarları</option>
          </select>
        </div>

        {/* DataTable */}
        <DataTable
          headers={tableHeaders}
          data={logs}
          loading={loading}
          pagination={{
            page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage)
          }}
          emptyMessage="İşlem kaydı bulunamadı."
        />

      </div>
    </AdminLayout>
  );
}

AuditLogsPage.getLayout = (page) => page;

export default withAdminAuth(AuditLogsPage, ['admin']); // Admin strictly!
