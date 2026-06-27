import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Users, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error('Kullanıcılar yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id, field, value) => {
    const payload = { [field]: value };
    
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Kullanıcı başarıyla güncellendi.');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Güncelleme hatası.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    }
  };

  const tableHeaders = [
    {
      label: 'Kullanıcı E-posta',
      render: (row) => (
        <span className="font-semibold text-white">
          {row.email}
        </span>
      )
    },
    {
      label: 'Yetki Rolü',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleUpdateUser(row.id, 'role', e.target.value)}
          className="px-2 py-1 rounded border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-[#7FA34D]"
        >
          <option value="admin">Yönetici (Admin)</option>
          <option value="editor">Editör (Editor)</option>
          <option value="moderator">Moderator</option>
        </select>
      )
    },
    {
      label: 'Durum',
      render: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.is_active}
            onChange={(e) => handleUpdateUser(row.id, 'is_active', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7FA34D]"></div>
          <span className="ml-3 text-xs text-slate-350">{row.is_active ? 'Aktif' : 'Pasif'}</span>
        </label>
      )
    },
    {
      label: 'Son Giriş Tarihi',
      render: (row) => (
        <span className="text-xs text-slate-400 font-mono">
          {row.last_sign_in ? new Date(row.last_sign_in).toLocaleString('tr-TR') : 'Hiç giriş yapılmadı'}
        </span>
      )
    }
  ];

  return (
    <AdminLayout title="Kullanıcılar & Roller">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#7FA34D]" />
            <h3 className="text-white font-semibold">Tüm Sistem Yöneticileri ({users.length})</h3>
          </div>
          
          <button 
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Information Banner */}
        <div className="mb-6 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg text-xs text-slate-350 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white mb-1">Kullanıcı Rolü & Yetkilendirme Bilgisi</p>
            <p className="leading-relaxed">
              Buradaki ayarlar, Supabase Auth tabanında kayıtlı olan yöneticilerin panele erişim seviyelerini kontrol eder. 
              Müşteri portalı (NextAuth) kullanan normal üyeler buradaki listeye dahil değildir. 
              Rol veya Durum değişiklikleri, kullanıcının bir sonraki sayfa geçişinde anında etkili olacaktır.
            </p>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          headers={tableHeaders}
          data={users}
          loading={loading}
          emptyMessage="Kayıtlı yönetici bulunamadı."
        />

      </div>
    </AdminLayout>
  );
}

UsersManagementPage.getLayout = (page) => page;

export default withAdminAuth(UsersManagementPage, ['admin']); // Admin strictly!
