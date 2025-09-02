import { useState, useEffect } from "react";

/**
 * A type-safe version of useState that persists to localStorage.
 */
export function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Handle storage write errors (quota exceeded, etc.)
    }
  }, [key, state]);

  return [state, setState];
}
