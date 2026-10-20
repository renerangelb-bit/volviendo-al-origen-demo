import { create } from 'zustand';

export type Toast = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  tone?: 'default' | 'success' | 'error';
};

type Panel = 'cart' | 'search' | 'chat' | 'menu' | null;

type UiState = {
  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
};

let seq = 1;

export const useUi = create<UiState>()((set, get) => ({
  panel: null,
  open: (panel) => set((s) => ({ panel, toasts: panel === 'cart' ? [] : s.toasts })),
  close: () => set({ panel: null }),
  toasts: [],
  toast: (t) => {
    const id = seq++;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    window.setTimeout(() => get().dismiss(id), 4500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
