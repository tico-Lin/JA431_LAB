import { useState, useEffect, useCallback, useRef } from 'react';

export interface DraftData<T> {
  currentStep: number;
  lastUpdated: number;
  formData: T;
}

interface UseFormDraftReturn<T> {
  draft: DraftData<T> | null;
  saveDraft: (formData: T, step?: number) => void;
  clearDraft: () => void;
  isInitialized: boolean;
}

export function useFormDraft<T>(
  storageKey: string,
  debounceMs: number = 600,
): UseFormDraftReturn<T> {
  const [draft, setDraft] = useState<DraftData<T> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as DraftData<T>;
        setDraft(parsed);
      }
    } catch (e) {
      console.error('Failed to parse form draft from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, [storageKey]);

  const saveDraft = useCallback(
    (formData: T, step: number = 0) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Update local state immediately so subsequent reads are correct
      const newDraft: DraftData<T> = {
        currentStep: step,
        lastUpdated: Date.now(),
        formData,
      };
      setDraft(newDraft);

      // Debounce localStorage write
      timeoutRef.current = setTimeout(() => {
        localStorage.setItem(storageKey, JSON.stringify(newDraft));
      }, debounceMs);
    },
    [storageKey, debounceMs],
  );

  const clearDraft = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDraft(null);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { draft, saveDraft, clearDraft, isInitialized };
}
