import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 300;

interface UseFilters {
  search: string;
  land: string;
  kooperation: string;
  debouncedSearch: string;
  setSearch: (value: string) => void;
  setLand: (value: string) => void;
  setKooperation: (value: string) => void;
  reset: () => void;
}

export function useFilters(): UseFilters {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [land, setLand] = useState("");
  const [kooperation, setKooperation] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const reset = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setLand("");
    setKooperation("");
  }, []);

  return {
    search,
    land,
    kooperation,
    debouncedSearch,
    setSearch,
    setLand,
    setKooperation,
    reset,
  };
}
