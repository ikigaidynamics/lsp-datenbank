import { useCallback, useState } from "react";

import * as api from "@/api/partnerships";
import type {
  KooperationStatus,
  Partnership,
  PartnershipCreate,
  PartnershipUpdate,
} from "@/api/types";

interface Filters {
  search?: string;
  land?: string;
  kooperation?: string;
}

interface UsePartnerships {
  partnerships: Partnership[];
  isLoading: boolean;
  error: string | null;
  fetchAll: (filters?: Filters) => Promise<void>;
  create: (data: PartnershipCreate) => Promise<Partnership>;
  update: (id: number, data: PartnershipUpdate) => Promise<Partnership>;
  updateStatus: (id: number, status: KooperationStatus) => Promise<Partnership>;
  remove: (id: number) => Promise<void>;
}

export function usePartnerships(): UsePartnerships {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFilters, setLastFilters] = useState<Filters>({});

  const fetchAll = useCallback(async (filters: Filters = {}) => {
    setIsLoading(true);
    setError(null);
    setLastFilters(filters);
    try {
      const data = await api.getPartnerships(filters);
      setPartnerships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Laden fehlgeschlagen.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAll(lastFilters);
  }, [fetchAll, lastFilters]);

  const create = useCallback(
    async (data: PartnershipCreate) => {
      const created = await api.createPartnership(data);
      await refetch();
      return created;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: number, data: PartnershipUpdate) => {
      const updated = await api.updatePartnership(id, data);
      await refetch();
      return updated;
    },
    [refetch],
  );

  const updateStatus = useCallback(
    async (id: number, status: KooperationStatus) => {
      const updated = await api.updateKooperationStatus(id, status);
      await refetch();
      return updated;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: number) => {
      await api.deletePartnership(id);
      await refetch();
    },
    [refetch],
  );

  return {
    partnerships,
    isLoading,
    error,
    fetchAll,
    create,
    update,
    updateStatus,
    remove,
  };
}
