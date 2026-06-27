import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import BlogForm from '@/components/admin/blog/BlogForm';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function EditBlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const id = slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          toast.error('Blog yazısı yüklenemedi veya bulunamadı.');
          router.push('/admin/blog');
        }
      } catch (err) {
        toast.error('Bağlantı hatası.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  return (
    <AdminLayout title="Yazıyı Düzenle">
      <div className="flex flex-col gap-6">
        {/* Back Link */}
        <div className="flex items-center">
          <Link 
            href="/admin/blog" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Yazı Listesine Dön</span>
          </Link>
        </div>

        {/* Form Container */}
        {loading ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-400 text-xs font-semibold">Yazı yükleniyor...</span>
            </div>
          </div>
        ) : post ? (
          <BlogForm initialData={post} isEdit={true} />
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center text-slate-500 py-12">
            Yazı bulunamadı.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

EditBlogPostPage.getLayout = (page) => page;

export default withAdminAuth(EditBlogPostPage);
