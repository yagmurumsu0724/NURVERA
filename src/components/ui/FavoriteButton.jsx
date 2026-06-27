import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useSession } from 'next-auth/react';
import { Heart, Plus, Check, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoriteButton({ productId, className = "" }) {
  const supabase = useSupabaseClient();
  const { session: supabaseSession } = useSessionContext();
  const { data: nextAuthSession } = useSession();
  
  const isAuthenticated = !!supabaseSession || !!nextAuthSession;
  const user = supabaseSession?.user || nextAuthSession?.user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [activeCollectionIds, setActiveCollectionIds] = useState([]);
  const [isFavoritedInNull, setIsFavoritedInNull] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if product is favorited overall to color the heart
  const isFavorited = isFavoritedInNull || activeCollectionIds.length > 0;

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Just fetch the active states for this product on mount
      fetchProductState();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, productId]);

  // Fetch collections when modal opens
  useEffect(() => {
    if (isModalOpen && isAuthenticated && user?.id) {
      fetchCollections();
    }
  }, [isModalOpen, isAuthenticated, user?.id]);

  const fetchCollections = async () => {
    try {
      const { data: cols, error: colError } = await supabase
        .from('favorite_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (colError) throw colError;
      setCollections(cols || []);
    } catch (err) {
      console.error("Koleksiyonlar yüklenemedi:", err);
    }
  };

  const fetchProductState = async () => {
    setLoading(true);
    try {
      // (Collections are now fetched when modal opens)

      // 2. Fetch which collections this product is in
      const { data: favs, error: favError } = await supabase
        .from('favorites')
        .select('collection_id')
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (favError) throw favError;

      const activeIds = favs.filter(f => f.collection_id !== null).map(f => f.collection_id);
      const inNull = favs.some(f => f.collection_id === null);

      setActiveCollectionIds(activeIds);
      setIsFavoritedInNull(inNull);
    } catch (err) {
      console.error("Favoriler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeartClick = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!isAuthenticated) {
      toast.error('Favorilere eklemek için lütfen giriş yapın.');
      return;
    }
    
    // Quick Add / Remove from Default Collection
    if (saving) return;
    setSaving(true);

    try {
      if (isFavorited) {
        // Remove from all collections for quick remove
        const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
        if (error) throw error;
        
        setIsFavoritedInNull(false);
        setActiveCollectionIds([]);
        toast.success('Favorilerden çıkarıldı.');
      } else {
        // Add to default collection
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          product_id: productId,
          collection_id: null
        });
        if (error) throw error;
        
        setIsFavoritedInNull(true);
        toast((t) => (
          <div className="flex items-center gap-3">
            <span>Favorilere eklendi.</span>
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                setIsModalOpen(true);
              }}
              className="text-nurvera-olive font-bold text-sm hover:underline"
            >
              Klasöre Taşı
            </button>
          </div>
        ));
      }
    } catch (err) {
      const errorMessage = err?.message || 'İşlem başarısız oldu.';
      toast.error(`Hata: ${errorMessage}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsModalOpen(false);
  };

  const toggleCollection = async (collectionId) => {
    if (saving) return;
    setSaving(true);

    try {
      const isCurrentlyActive = collectionId === null ? isFavoritedInNull : activeCollectionIds.includes(collectionId);

      if (isCurrentlyActive) {
        // Remove from collection
        let query = supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
        if (collectionId === null) {
          query = query.is('collection_id', null);
        } else {
          query = query.eq('collection_id', collectionId);
        }
        
        const { error } = await query;
        if (error) throw error;

        if (collectionId === null) {
          setIsFavoritedInNull(false);
        } else {
          setActiveCollectionIds(prev => prev.filter(id => id !== collectionId));
        }
        toast.success('Favorilerden çıkarıldı.');
      } else {
        // Add to collection
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          product_id: productId,
          collection_id: collectionId
        });
        
        if (error) throw error;

        if (collectionId === null) {
          setIsFavoritedInNull(true);
        } else {
          setActiveCollectionIds(prev => [...prev, collectionId]);
        }
        toast.success('Favorilere eklendi.');
      }
    } catch (err) {
      toast.error('İşlem başarısız oldu.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim() || saving) return;
    setSaving(true);

    try {
      // Create collection
      const { data, error } = await supabase
        .from('favorite_collections')
        .insert({
          user_id: user.id,
          name: newCollectionName.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setCollections(prev => [data, ...prev]);
      setNewCollectionName('');
      
      // Automatically add product to this new collection
      await toggleCollection(data.id);
      
    } catch (err) {
      toast.error('Koleksiyon oluşturulamadı.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleHeartClick}
        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10 
          ${isFavorited ? 'bg-red-50 text-red-500 shadow-sm' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-sm'} 
          ${className}`}
        title="Favorilere Ekle"
      >
        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-serif font-semibold text-lg text-nurvera-text">Favoriye Ekle</h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 text-nurvera-olive animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Default Collection */}
                  <button
                    onClick={() => toggleCollection(null)}
                    disabled={saving}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:border-nurvera-olive/50 bg-gray-50/50"
                  >
                    <span className="font-medium text-sm text-gray-800">Tüm Favoriler (Varsayılan)</span>
                    {isFavoritedInNull && <Check className="w-4 h-4 text-nurvera-olive" />}
                  </button>

                  {/* Custom Collections */}
                  {collections.map(col => (
                    <button
                      key={col.id}
                      onClick={() => toggleCollection(col.id)}
                      disabled={saving}
                      className="w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:border-nurvera-olive/50 bg-white"
                    >
                      <span className="font-medium text-sm text-gray-800">{col.name}</span>
                      {activeCollectionIds.includes(col.id) && <Check className="w-4 h-4 text-nurvera-olive" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <form onSubmit={createCollection} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Yeni koleksiyon adı..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all"
                />
                <button
                  type="submit"
                  disabled={!newCollectionName.trim() || saving}
                  className="p-2 bg-nurvera-olive text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
