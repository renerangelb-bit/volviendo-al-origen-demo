'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart';
import { useAccount } from '@/store/account';
import { useOrders } from '@/store/orders';

/** Lee carrito, cuenta y pedidos de localStorage después de hidratar y los sincroniza entre pestañas. */
export function StoreHydration() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useAccount.persist.rehydrate();
    void useOrders.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'vao-cart') void useCart.persist.rehydrate();
      if (e.key === 'vao-account') void useAccount.persist.rehydrate();
      if (e.key === 'vao-orders') void useOrders.persist.rehydrate();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return null;
}
