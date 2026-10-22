"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Event khusus untuk memberi tahu hook di tab yang sama. Event "storage"
// bawaan browser hanya terpicu di tab lain.
const LOCAL_STORAGE_EVENT = "local-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_STORAGE_EVENT, callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Snapshot berupa string mentah agar perbandingannya stabil antar render.
  const getSnapshot = useCallback(() => readRaw(key), [key]);
  // Di server localStorage tidak ada, jadi pakai null (= initialValue)
  // supaya hasil render server dan hydration pertama di client sama.
  const getServerSnapshot = () => null;

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => parse(raw, initialValue), [raw, initialValue]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = parse(readRaw(key), initialValue);
      const resolved = next instanceof Function ? next(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch (error) {
        console.error(`Gagal menyimpan "${key}" ke localStorage`, error);
      }
      window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
    },
    [key, initialValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Gagal menghapus "${key}" dari localStorage`, error);
    }
    window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
  }, [key]);

  return [value, setValue, removeValue, raw !== null] as const;
}
