import { createContext, useContext, useMemo } from "react";
import { useUserStore } from "./user";

interface GlobalStoreType {
  user: ReturnType<typeof useUserStore>;
}

export const GlobalStoreContext = createContext<GlobalStoreType | null>(null);

export const useGlobalState = () => {
  const user = useUserStore();
  const results = useMemo(() => ({
    user
  }), [user])
  return results;
}

export const useGlobalStore = () => {
  const store = useContext(GlobalStoreContext);
  if (!store) {
    throw new Error('useGlobalStore must be used within a GlobalStoreProvider');
  }
  return store;
}

