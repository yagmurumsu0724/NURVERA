import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProductForm from '@/components/admin/products/ProductForm';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

function NewProductPage() {
  return (
    <AdminLayout title="Yeni Ürün Ekle">
      <div className="flex flex-col gap-6">
        {/* Back Link */}
        <div className="flex items-center">
          <Link 
            href="/admin/urunler" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#556B2F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ürün Listesine Dön</span>
          </Link>
        </div>

        {/* Product Form */}
        <ProductForm isEdit={false} />
      </div>
    </AdminLayout>
  );
}

NewProductPage.getLayout = (page) => page;

export default withAdminAuth(NewProductPage);
