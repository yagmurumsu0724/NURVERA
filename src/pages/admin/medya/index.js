import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { UploadCloud, Trash2, Search, Image as ImageIcon, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');
  const fileInputRef = useRef(null);

  const folders = [
    { id: 'all', name: 'Tümü' },
    { id: 'products', name: 'Ürünler' },
    { id: 'blog', name: 'Blog' },
    { id: 'banners', name: 'Bannerlar' },
    { id: 'pages', name: 'Sayfalar' },
    { id: 'general', name: 'Genel' }
  ];

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = activeFolder === 'all' 
        ? '/api/admin/media' 
        : `/api/admin/media?folder=${activeFolder}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data);
      } else {
        toast.error('Medyalar yüklenemedi.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeFolder]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Dosya boyutu en fazla 5MB olabilir.');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Dosya yükleniyor...');

    try {
      // Yükleme klasörünü belirliyoruz, 'all' seçiliyse 'general' olarak kaydet
      const uploadFolder = activeFolder === 'all' ? 'general' : activeFolder;
      
      const res = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}&folder=${uploadFolder}`, {
        method: 'POST',
        body: file,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Yükleme başarısız');
      }

      toast.success('Dosya başarıyla yüklendi.', { id: toastId });
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh list
      fetchMedia();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!confirm('Bu medyayı silmek istediğinize emin misiniz?')) {
      return;
    }

    const toastId = toast.loading('Medya siliniyor...');

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, filePath })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Silme başarısız');
      }

      toast.success('Medya başarıyla silindi.', { id: toastId });
      fetchMedia(); // Refresh list
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL kopyalandı.');
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaFiles.filter(media => 
    media.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    media.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Medya Kütüphanesi">
      <div className="flex flex-col h-[calc(100vh-140px)]">
        
        {/* TOP BAR */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 backdrop-blur-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Folders Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeFolder === folder.id 
                    ? 'bg-[#7FA34D] text-slate-950 shadow-md' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {folder.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Medya ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FA34D]/20 focus:border-[#7FA34D] transition-all"
              />
            </div>

            <button
              onClick={fetchMedia}
              className="p-2 rounded-xl border border-slate-800 bg-slate-800/50 text-slate-400 hover:text-white transition-all"
              title="Yenile"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Upload Button */}
            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-transparent shadow-md text-sm font-semibold transition-all cursor-pointer ${
              uploading 
                ? 'bg-[#7FA34D]/50 text-white cursor-not-allowed' 
                : 'bg-[#7FA34D] text-slate-950 hover:bg-[#8eb85c]'
            }`}>
              <UploadCloud className="w-5 h-5" />
              <span>{uploading ? 'Yükleniyor...' : 'Yeni Yükle'}</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*,application/pdf"
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* MEDIA GRID */}
        <div className="flex-1 overflow-y-auto bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((media) => (
                <div key={media.id} className="group relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-[#7FA34D]/50 transition-all">
                  
                  {/* Preview Area */}
                  <div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden relative cursor-pointer" onClick={() => copyToClipboard(media.file_url)}>
                    {media.file_type?.startsWith('image/') ? (
                      <img 
                        src={media.file_url} 
                        alt={media.original_name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <FileText className="w-12 h-12" />
                        <span className="text-xs uppercase font-mono">{media.file_type?.split('/').pop()}</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium px-3 py-1 bg-slate-900/80 rounded-lg">
                        URL Kopyala
                      </span>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-white truncate" title={media.original_name}>
                      {media.original_name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500 font-mono">
                        {formatSize(media.file_size)}
                      </span>
                      <button
                        onClick={() => handleDelete(media.id, media.file_path)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <ImageIcon className="w-12 h-12 opacity-20" />
              <p>Bu klasörde henüz medya bulunmuyor.</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}

MediaPage.getLayout = (page) => page;

export default withAdminAuth(MediaPage);
