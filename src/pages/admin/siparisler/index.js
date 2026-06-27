import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Search, Eye, ShoppingBag, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        status
      });

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Siparişler yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  useEffect(() => {
    fetchOrders();
  }, [page, search, status]);

  const orderStatusMap = {
    pending: { label: 'Beklemede', class: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    confirmed: { label: 'Onaylandı', class: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    processing: { label: 'Hazırlanıyor', class: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
    shipped: { label: 'Kargolandı', class: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
    delivered: { label: 'Teslim Edildi', class: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    cancelled: { label: 'İptal Edildi', class: 'bg-red-500/10 text-red-400 border border-red-500/20' },
    refunded: { label: 'İade Edildi', class: 'bg-slate-550/10 text-slate-400 border border-slate-500/20' }
  };

  const paymentStatusMap = {
    pending: { label: 'Ödenmedi', class: 'text-amber-500' },
    paid: { label: 'Ödendi', class: 'text-emerald-400 font-bold' },
    failed: { label: 'Başarısız', class: 'text-red-400' },
    refunded: { label: 'İade', class: 'text-slate-400' }
  };

  const tableHeaders = [
    {
      label: 'Sipariş No',
      render: (row) => (
        <span className="font-mono font-bold text-white tracking-wider">
          {row.order_number || `Sipariş #${row.id.substring(0,8)}`}
        </span>
      )
    },
    {
      label: 'Müşteri',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{row.customer_name}</span>
          <span className="text-xs text-slate-400 truncate max-w-[180px]">{row.customer_email}</span>
        </div>
      )
    },
    {
      label: 'Tarih',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-550" />
          <span>{new Date(row.created_at).toLocaleDateString('tr-TR')}</span>
        </div>
      )
    },
    {
      label: 'Toplam Tutar',
      render: (row) => (
        <span className="font-mono text-emerald-400 font-bold">
          {row.total} TL
        </span>
      )
    },
    {
      label: 'Ödeme Durumu',
      render: (row) => {
        const item = paymentStatusMap[row.payment_status] || { label: row.payment_status, class: 'text-slate-400' };
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span className={item.class}>{item.label}</span>
          </div>
        );
      }
    },
    {
      label: 'Sipariş Durumu',
      render: (row) => {
        const item = orderStatusMap[row.status] || { label: row.status, class: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.class}`}>
            {item.label}
          </span>
        );
      }
    },
    {
      label: 'İşlemler',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end">
          <Link 
            href={`/admin/siparisler/${row.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="w-4 h-4" />
            <span>Detay</span>
          </Link>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Siparişler">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Header Title */}
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5 text-[#7FA34D]" />
          <h3 className="text-white font-semibold">Tüm Siparişler ({total})</h3>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Sipariş numarası veya müşteri ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
          >
            <option value="">Tüm Sipariş Durumları</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="processing">Hazırlanıyor</option>
            <option value="shipped">Kargolandı</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal Edildi</option>
            <option value="refunded">İade Edildi</option>
          </select>
        </div>

        {/* DataTable */}
        <DataTable
          headers={tableHeaders}
          data={orders}
          loading={loading}
          pagination={{
            page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage)
          }}
          emptyMessage="Kriterlere uygun sipariş bulunamadı."
        />

      </div>
    </AdminLayout>
  );
}

OrdersListPage.getLayout = (page) => page;

export default withAdminAuth(OrdersListPage);
