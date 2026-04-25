import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  material: string;
  accentColor: string;
  initials: string;
  size: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, material: string, accentColor: string, initials: string, size: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const existingItemIndex = state.items.findIndex(
      (item) => 
        item.id === newItem.id && 
        item.material === newItem.material && 
        item.accentColor === newItem.accentColor && 
        item.initials === newItem.initials &&
        item.size === newItem.size
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...state.items];
      updatedItems[existingItemIndex].quantity += 1;
      return { 
        items: updatedItems,
        total: state.total + newItem.price
      };
    }

    return { 
      items: [...state.items, { ...newItem, quantity: 1 }],
      total: state.total + newItem.price
    };
  }),
  removeItem: (id, material, accentColor, initials, size) => set((state) => {
    const itemToRemove = state.items.find(
      (item) => 
        item.id === id && 
        item.material === material && 
        item.accentColor === accentColor && 
        item.initials === initials &&
        item.size === size
    );
    
    if (!itemToRemove) return state;

    return {
      items: state.items.filter(
        (item) => 
          !(item.id === id && 
            item.material === material && 
            item.accentColor === accentColor && 
            item.initials === initials &&
            item.size === size)
      ),
      total: state.total - (itemToRemove.price * itemToRemove.quantity)
    };
  }),
  clearCart: () => set({ items: [], total: 0 }),
  total: 0,
}));
