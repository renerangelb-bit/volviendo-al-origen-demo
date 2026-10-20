import { useSyncExternalStore } from 'react';

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

/**
 * true cuando el store ya leyó localStorage. En el servidor y durante la hidratación es false,
 * así el HTML inicial coincide y luego aparecen carrito, cuenta y pedidos guardados.
 */
export function useHydrated(store: PersistedStore) {
  return useSyncExternalStore(
    (cb) => store.persist.onFinishHydration(cb),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
