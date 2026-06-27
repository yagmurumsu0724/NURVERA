import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import BlogForm from '@/components/admin/blog/BlogForm';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

function NewBlogPostPage() {
  return (
    <AdminLayout title="Yeni Yazı Yaz">
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

        {/* Blog Form */}
        <BlogForm isEdit={false} />
      </div>
    </AdminLayout>
  );
}

NewBlogPostPage.getLayout = (page) => page;

export default withAdminAuth(NewBlogPostPage);
