import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((item) => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { product, quantity: 1 }] });
        }
        
        // Sepete eklendiğinde sepeti aç
        get().openCart();
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map((item) => 
            item.product.id === productId 
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      // Helper function to calculate total price (assuming price is formatted as '290,00 ₺')
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          // Parse price string to number: '290,00 ₺' -> 290.00
          const priceMatch = item.product.price.match(/\d+(,\d+)?/);
          if (!priceMatch) return total;
          
          const priceValue = parseFloat(priceMatch[0].replace(',', '.'));
          return total + (priceValue * item.quantity);
        }, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'nurvera-cart-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useCartStore;
