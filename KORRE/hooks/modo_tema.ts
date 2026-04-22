import { create } from 'zustand';

interface TemaStore {
  tema: 'escuro' | 'claro';
  toggleTema: () => void;
  setTema: (tema: 'escuro' | 'claro') => void;
}

export const useTema = create<TemaStore>((set) => ({
  tema: 'escuro', // Default é escuro conforme solicitado
  toggleTema: () =>
    set((state) => ({
      tema: state.tema === 'escuro' ? 'claro' : 'escuro',
    })),
  setTema: (tema) => set({ tema }),
}));
