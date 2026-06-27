import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { MessageSquare, Check, X, Trash2, Reply, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState('pending'); // default to show pending comments needing action
  const [page, setPage] = useState(1);

  // Reply Modal State
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        status: status === 'all' ? '' : status
      });

      const res = await fetch(`/api/admin/comments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Yorumlar yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    fetchComments();
  }, [page, status]);

  const handleUpdateStatus = async (id, newStatus) => {
    const promise = fetch(`/api/admin/comments?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'İşlem başarısız.');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Güncelleniyor...',
      success: () => {
        fetchComments();
        return 'Yorum durumu güncellendi.';
      },
      error: (err) => err.message
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu yorumu tamamen silmek istediğinize emin misiniz?')) return;

    const promise = fetch(`/api/admin/comments?id=${id}`, {
      method: 'DELETE'
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Silinemedi.');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Siliniyor...',
      success: () => {
        fetchComments();
        return 'Yorum silindi.';
      },
      error: (err) => err.message
    });
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/admin/comments?id=${replyTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_reply: replyText,
          status: 'approved' // Automatically approve upon reply
        })
      });

      if (res.ok) {
        toast.success('Yanıt kaydedildi ve yorum onaylandı.');
        setReplyTarget(null);
        setReplyText('');
        fetchComments();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Yanıtlanamadı.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setReplying(false);
    }
  };

  const tableHeaders = [
    {
      label: 'Müşteri',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{row.customer_name}</span>
          <span className="text-[10px] text-slate-400">{row.customer_email || 'Email Belirtilmemiş'}</span>
        </div>
      )
    },
    {
      label: 'Ürün',
      render: (row) => (
        <span className="text-xs text-slate-350 truncate max-w-[150px] block" title={row.products?.name}>
          {row.products?.name || '-'}
        </span>
      )
    },
    {
      label: 'Değerlendirme',
      render: (row) => (
        <div className="flex gap-0.5 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < row.rating ? 'fill-amber-500 opacity-100' : 'opacity-20'}`} />
          ))}
        </div>
      )
    },
    {
      label: 'Yorum Metni',
      render: (row) => (
        <div className="flex flex-col gap-1 max-w-[280px]">
          <p className="text-xs text-slate-200 leading-relaxed italic" title={row.content}>
            "{row.content}"
          </p>
          {row.admin_reply && (
            <p className="text-[10px] text-[#7FA34D] bg-[#1E4D3A]/20 border border-[#7FA34D]/15 p-1.5 rounded mt-1">
              <span className="font-bold uppercase tracking-wider block text-[8px] mb-0.5">Cevabınız:</span>
              {row.admin_reply}
            </p>
          )}
        </div>
      )
    },
    {
      label: 'Tarih',
      render: (row) => (
        <span className="text-xs text-slate-450 font-mono">
          {new Date(row.created_at).toLocaleDateString('tr-TR')}
        </span>
      )
    },
    {
      label: 'İşlemler',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleUpdateStatus(row.id, 'approved')}
                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                title="Onayla"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(row.id, 'rejected')}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-405 transition-colors"
                title="Reddet"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => { setReplyTarget(row); setReplyText(row.admin_reply || ''); }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
            title="Cevapla"
          >
            <Reply className="w-4 h-4" />
          </button>
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
    <AdminLayout title="Yorum Moderasyonu">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#7FA34D]" />
            <h3 className="text-white font-semibold">Gelen Yorumlar ({total})</h3>
          </div>

          {/* Tab Filter switcher */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
            {[
              { id: 'pending', label: 'Bekleyenler' },
              { id: 'approved', label: 'Onaylı' },
              { id: 'rejected', label: 'Red' },
              { id: 'all', label: 'Tümü' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatus(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  status === tab.id 
                    ? 'bg-[#7FA34D] text-slate-950 shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          headers={tableHeaders}
          data={comments}
          loading={loading}
          pagination={{
            page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage)
          }}
          emptyMessage="İçerik bulunamadı."
        />

        {/* INLINE REPLY MODAL */}
        {replyTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative animate-zoomIn">
              <button
                onClick={() => setReplyTarget(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Reply className="w-5 h-5 text-[#7FA34D]" />
                Yorumu Yanıtla
              </h4>

              <div className="mb-4 p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{replyTarget.customer_name}:</span>
                <p className="text-xs text-slate-300 italic mt-1">"{replyTarget.content}"</p>
              </div>

              <form onSubmit={handleReplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Yanıt Metni</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    rows="4"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#7FA34D] resize-none"
                    placeholder="Müşteriye verilecek yanıt..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setReplyTarget(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={replying}
                    className="px-4 py-2.5 rounded-xl bg-[#7FA34D] hover:bg-[#8eb85c] text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {replying ? 'Kaydediliyor...' : 'Yanıtı Gönder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

CommentsPage.getLayout = (page) => page;

export default withAdminAuth(CommentsPage);
