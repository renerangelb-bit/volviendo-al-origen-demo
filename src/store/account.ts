import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Address } from '@/lib/orders';
import type { User } from '@/data/demo-account';

export type { User };
import { DEMO_USER } from '@/data/demo-account';
export { DEMO_USER, DEMO_ADDRESSES } from '@/data/demo-account';

const DEMO_FAVORITES = ['champu-solido-romero-eucalipto', 'velas-aromaticas', 'jabon-lavanda', 'cold-cream'];

type AccountState = {
  user: User | null;
  addresses: Address[];
  defaultAddressId: string | null;
  favorites: string[];
  stockAlerts: { slug: string; email: string }[];
  newsletterEmail: string | null;
  login: (user: User, addresses?: Address[]) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  saveAddress: (a: Omit<Address, 'id'> & { id?: string }) => string;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  toggleFavorite: (slug: string) => boolean;
  addStockAlert: (slug: string, email: string) => void;
  subscribe: (email: string) => void;
};

export const useAccount = create<AccountState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      defaultAddressId: null,
      favorites: [],
      stockAlerts: [],
      newsletterEmail: null,
      login: (user, addresses) =>
        set((s) => {
          const list = addresses ?? s.addresses;
          const isDemo = user.email === DEMO_USER.email;
          return {
            user,
            addresses: list,
            defaultAddressId: list.some((a) => a.id === s.defaultAddressId) ? s.defaultAddressId : (list[0]?.id ?? null),
            // La cuenta demo trae favoritos de ejemplo para presentar la sección.
            favorites: isDemo && s.favorites.length === 0 ? DEMO_FAVORITES : s.favorites,
          };
        }),
      logout: () => set({ user: null, addresses: [], defaultAddressId: null }),
      updateProfile: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      saveAddress: (a) => {
        const id = a.id ?? `dir-${Date.now().toString(36)}`;
        set((s) => {
          const exists = s.addresses.some((x) => x.id === id);
          const addresses = exists ? s.addresses.map((x) => (x.id === id ? { ...a, id } : x)) : [...s.addresses, { ...a, id }];
          return { addresses, defaultAddressId: s.defaultAddressId ?? id };
        });
        return id;
      },
      removeAddress: (id) =>
        set((s) => {
          const addresses = s.addresses.filter((x) => x.id !== id);
          return { addresses, defaultAddressId: s.defaultAddressId === id ? (addresses[0]?.id ?? null) : s.defaultAddressId };
        }),
      setDefaultAddress: (id) => set({ defaultAddressId: id }),
      toggleFavorite: (slug) => {
        const has = get().favorites.includes(slug);
        set((s) => ({ favorites: has ? s.favorites.filter((f) => f !== slug) : [slug, ...s.favorites] }));
        return !has;
      },
      addStockAlert: (slug, email) =>
        set((s) => ({ stockAlerts: [...s.stockAlerts.filter((a) => !(a.slug === slug && a.email === email)), { slug, email }] })),
      subscribe: (email) => set({ newsletterEmail: email }),
    }),
    { name: 'vao-account', version: 1, storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
