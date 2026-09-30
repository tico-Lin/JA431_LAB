import { useSyncExternalStore } from 'react';

let memoryToken: string | null = null;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => memoryToken;

export const useGitHubAuth = () => {
  const token = useSyncExternalStore(subscribe, getSnapshot);

  const setToken = (newToken: string | null) => {
    memoryToken = newToken;
    listeners.forEach((l) => l());
  };

  return { token, setToken };
};
