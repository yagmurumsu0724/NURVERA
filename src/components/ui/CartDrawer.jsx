import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-nurvera-bg">
          <h2 className="text-xl font-serif font-bold text-nurvera-text flex items-center">
            <ShoppingBag className="mr-2 text-nurvera-olive" size={24} />
            Sepetim
          </h2>
          <button 
            onClick={closeCart}
            className="text-gray-400 hover:text-nurvera-accent transition-colors p-2 bg-white rounded-full shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag size={64} className="mb-4 opacity-20" />
              <p className="text-lg">Sepetiniz şu an boş.</p>
              <button 
                onClick={closeCart}
                className="mt-6 px-8 py-3 bg-nurvera-olive text-white rounded-xl hover:bg-opacity-90 font-medium transition-all shadow-md"
              >
                Alışverişe Başla
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 relative group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image 
                      src={item.product.image} 
                      alt={item.product.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div className="flex justify-between items-start pr-6">
                      <div>
                        <h3 className="font-serif font-bold text-[15px] text-nurvera-text leading-tight">{item.product.name}</h3>
                        <p className="text-[13px] text-gray-500 mt-1">{item.product.volume}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="absolute right-3 top-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-200 bg-gray-50/50 min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-nurvera-olive text-[15px]">
                        {item.product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Ara Toplam</span>
              <span className="font-serif text-3xl font-bold text-nurvera-text">
                {getTotalPrice().toFixed(2).replace('.', ',')} ₺
              </span>
            </div>
            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="w-full py-4 bg-nurvera-olive text-white rounded-2xl font-bold text-lg hover:bg-[#4a5e29] transition-all shadow-[0_8px_20px_rgba(91,115,51,0.3)] flex justify-center items-center hover:-translate-y-0.5"
            >
              Güvenle Öde
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
