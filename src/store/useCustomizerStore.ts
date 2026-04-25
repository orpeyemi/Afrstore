import { create } from 'zustand';

interface CustomizerState {
  model: string;
  material: 'akwete' | 'ankara' | 'leather';
  accentColor: string;
  initials: string;
  view: 'side' | 'top' | 'front';
  setModel: (model: string) => void;
  setMaterial: (material: 'akwete' | 'ankara' | 'leather') => void;
  setAccentColor: (color: string) => void;
  setInitials: (initials: string) => void;
  setView: (view: 'side' | 'top' | 'front') => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  model: 'sneaker_luxury',
  material: 'akwete',
  accentColor: '#D4AF37',
  initials: '',
  view: 'side',
  setModel: (model) => set({ model }),
  setMaterial: (material) => set({ material }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setInitials: (initials) => set({ initials }),
  setView: (view) => set({ view }),
}));
