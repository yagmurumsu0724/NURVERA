import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Heart, Trash2, FolderOpen, Folder, Loader, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import FavoriteButton from '@/components/ui/FavoriteButton';

export default function FavoritesTab({ user }) {
  const supabase = useSupabaseClient();
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState('all'); // 'all' or collection.id
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user, supabase, activeCollectionId]);

  async function fetchData() {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch collections
      const { data: cols, error: colError } = await supabase
        .from('favorite_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (colError) throw colError;
      setCollections(cols || []);

      // Fetch favorites based on active collection
      let query = supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          collection_id,
          created_at,
          products (id, name, price, images, slug)
        `)
        .eq('user_id', user.id);

      if (activeCollectionId !== 'all') {
        if (activeCollectionId === 'default') {
          query = query.is('collection_id', null);
        } else {
          query = query.eq('collection_id', activeCollectionId);
        }
      }

      query = query.order('created_at', { ascending: false });
      
      const { data: favs, error: favError } = await query;
      if (favError) throw favError;
      
      // If "all" is selected, we might have duplicate products if a product is in multiple collections.
      // Let's deduplicate by product_id if activeCollectionId === 'all'
      let finalFavs = favs || [];
      if (activeCollectionId === 'all') {
        const uniqueProducts = new Map();
        finalFavs.forEach(fav => {
          if (!uniqueProducts.has(fav.product_id)) {
            uniqueProducts.set(fav.product_id, fav);
          }
        });
        finalFavs = Array.from(uniqueProducts.values());
      }
      
      setFavorites(finalFavs);
    } catch (err) {
      toast.error(`Hata: ${err.message || 'Veriler yüklenemedi'}`);
      console.error("FetchError:", err);
    } finally {
      setLoading(false);
    }
  }

  const deleteCollection = async (id, name) => {
    if (!window.confirm(`"${name}" koleksiyonunu silmek istediğinize emin misiniz?`)) return;
    try {
      const { error } = await supabase.from('favorite_collections').delete().eq('id', id);
      if (error) throw error;
      toast.success('Koleksiyon silindi.');
      if (activeCollectionId === id) setActiveCollectionId('all');
      fetchData();
    } catch (err) {
      toast.error('Silme işlemi başarısız oldu.');
    }
  };

  const removeFavorite = async (favId) => {
    try {
      const { error } = await supabase.from('favorites').delete().eq('id', favId);
      if (error) throw error;
      setFavorites(favorites.filter(fav => fav.id !== favId));
      toast.success('Ürün koleksiyondan çıkarıldı.');
    } catch (err) {
      toast.error('İşlem başarısız oldu.');
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim() || saving) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('favorite_collections')
        .insert({
          user_id: user.id,
          name: newCollectionName.trim()
        })
        .select()
        .single();

      if (error) throw error;
      
      setNewCollectionName('');
      toast.success('Koleksiyon oluşturuldu.');
      fetchData(); // Refresh collections
    } catch (err) {
      toast.error('Koleksiyon oluşturulamadı.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-serif font-bold text-nurvera-text">Favori Koleksiyonlarım</h3>
        
        <form onSubmit={createCollection} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Yeni klasör adı..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="flex-1 sm:w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all"
          />
          <button
            type="submit"
            disabled={!newCollectionName.trim() || saving}
            className="p-2 bg-nurvera-olive text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            title="Koleksiyon Oluştur"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>
      
      {/* Koleksiyon Sekmeleri */}
      <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-100">
        <button
          onClick={() => setActiveCollectionId('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeCollectionId === 'all' 
              ? 'bg-nurvera-olive text-white shadow-sm' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4" /> Tüm Favoriler
        </button>
        <button
          onClick={() => setActiveCollectionId('default')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeCollectionId === 'default' 
              ? 'bg-nurvera-olive text-white shadow-sm' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Folder className="w-4 h-4" /> Klasörsüzler
        </button>
        
        {collections.map(col => (
          <div key={col.id} className="relative group">
            <button
              onClick={() => setActiveCollectionId(col.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 pr-10 ${
                activeCollectionId === col.id 
                  ? 'bg-nurvera-olive text-white shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FolderOpen className="w-4 h-4" /> {col.name}
            </button>
            <button
              onClick={() => deleteCollection(col.id, col.name)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                activeCollectionId === col.id ? 'text-white/70 hover:text-white hover:bg-black/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title="Koleksiyonu Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-nurvera-olive border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 relative">
              
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <FavoriteButton productId={fav.product_id} />
              </div>
              
              <Link href={`/urunler/${fav.products?.slug}`}>
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  {fav.products?.images && fav.products.images.length > 0 ? (
                    <img
                      src={fav.products.images[0]}
                      alt={fav.products?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-5 text-center bg-white">
                  <h4 className="text-[15px] font-semibold text-gray-900 group-hover:text-nurvera-olive transition-colors line-clamp-2 min-h-[40px] mb-2">
                    {fav.products?.name}
                  </h4>
                  <div className="text-[15px] font-bold text-nurvera-olive">
                    ₺{fav.products?.price}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="w-16 h-16 text-gray-200 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Bu koleksiyonda ürün bulunmuyor</h4>
          <p className="text-gray-500 max-w-sm mb-6">Ürün görsellerindeki kalp ikonuna tıklayarak ürünleri bu koleksiyona ekleyebilirsiniz.</p>
          <Link href="/urunler" className="px-6 py-3 bg-nurvera-olive text-white rounded-xl font-medium hover:bg-opacity-90 transition-all">
            Ürünleri Keşfet
          </Link>
        </div>
      )}
    </div>
  );
}
