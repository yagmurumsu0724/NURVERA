import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';

export default function ProfileTab({ user, profile }) {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      zip: '',
      country: 'Türkiye'
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || { street: '', city: '', zip: '', country: 'Türkiye' }
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
        });

      if (error) throw error;
      toast.success('Profil bilgileriniz güncellendi.');
    } catch (err) {
      toast.error('Güncelleme sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-serif font-bold text-nurvera-text mb-6">Profil Bilgilerim</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adınız</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soyadınız</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-[15px]"
            />
            <p className="text-xs text-gray-400 mt-1">E-posta adresiniz değiştirilemez.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
              placeholder="05XX XXX XX XX"
            />
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100">
          <h4 className="text-lg font-serif font-bold text-nurvera-text mb-4">Adres Bilgileri</h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açık Adres</label>
              <textarea
                name="address.street"
                value={formData.address?.street || ''}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px] resize-none"
                placeholder="Mahalle, sokak, bina ve daire no..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İl / Şehir</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address?.city || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu</label>
                <input
                  type="text"
                  name="address.zip"
                  value={formData.address?.zip || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ülke</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address?.country || 'Türkiye'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-nurvera-olive text-white rounded-xl font-semibold shadow-md hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Bilgileri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
