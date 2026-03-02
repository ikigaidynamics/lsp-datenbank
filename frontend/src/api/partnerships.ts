import { fetchWithAuth } from "./client";
import type {
  KooperationStatus,
  Partnership,
  PartnershipCreate,
  PartnershipUpdate,
} from "./types";

interface ListFilters {
  search?: string;
  land?: string;
  kooperation?: string;
}

export async function getPartnerships(
  filters: ListFilters = {},
): Promise<Partnership[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.land) params.set("land", filters.land);
  if (filters.kooperation) params.set("kooperation", filters.kooperation);

  const query = params.toString();
  const path = query ? `/api/partnerships?${query}` : "/api/partnerships";
  return fetchWithAuth<Partnership[]>(path);
}

export async function getPartnership(id: number): Promise<Partnership> {
  return fetchWithAuth<Partnership>(`/api/partnerships/${id}`);
}

export async function createPartnership(
  data: PartnershipCreate,
): Promise<Partnership> {
  // Convert camelCase frontend keys to snake_case backend keys
  return fetchWithAuth<Partnership>("/api/partnerships", {
    method: "POST",
    body: JSON.stringify({
      park_name: data.parkName,
      land: data.land,
      stadt: data.stadt,
      gruendungsjahr: data.gruendungsjahr,
      bisherige_kooperation: data.bisherigeKooperation,
      datum: data.datum,
      themen: data.themen,
      bemerkungen: data.bemerkungen,
      park_ansprechpartner: data.parkAnsprechpartner,
      kontaktdetails: data.kontaktdetails,
      webpraesenz: data.webpraesenz,
      universitaet_name: data.universitaetName,
      standort: data.standort,
      forschungsschwerpunkte: data.forschungsschwerpunkte,
      uni_ansprechpartner: data.uniAnsprechpartner,
      website: data.website,
    }),
  });
}

export async function updatePartnership(
  id: number,
  data: PartnershipUpdate,
): Promise<Partnership> {
  // Only send fields that are explicitly set
  const body: Record<string, unknown> = {};
  if (data.parkName !== undefined) body.park_name = data.parkName;
  if (data.land !== undefined) body.land = data.land;
  if (data.stadt !== undefined) body.stadt = data.stadt;
  if (data.gruendungsjahr !== undefined) body.gruendungsjahr = data.gruendungsjahr;
  if (data.bisherigeKooperation !== undefined) body.bisherige_kooperation = data.bisherigeKooperation;
  if (data.datum !== undefined) body.datum = data.datum;
  if (data.themen !== undefined) body.themen = data.themen;
  if (data.bemerkungen !== undefined) body.bemerkungen = data.bemerkungen;
  if (data.parkAnsprechpartner !== undefined) body.park_ansprechpartner = data.parkAnsprechpartner;
  if (data.kontaktdetails !== undefined) body.kontaktdetails = data.kontaktdetails;
  if (data.webpraesenz !== undefined) body.webpraesenz = data.webpraesenz;
  if (data.universitaetName !== undefined) body.universitaet_name = data.universitaetName;
  if (data.standort !== undefined) body.standort = data.standort;
  if (data.forschungsschwerpunkte !== undefined) body.forschungsschwerpunkte = data.forschungsschwerpunkte;
  if (data.uniAnsprechpartner !== undefined) body.uni_ansprechpartner = data.uniAnsprechpartner;
  if (data.website !== undefined) body.website = data.website;

  return fetchWithAuth<Partnership>(`/api/partnerships/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function updateKooperationStatus(
  id: number,
  status: KooperationStatus,
): Promise<Partnership> {
  return fetchWithAuth<Partnership>(`/api/partnerships/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ bisherige_kooperation: status }),
  });
}

export async function deletePartnership(id: number): Promise<void> {
  return fetchWithAuth<void>(`/api/partnerships/${id}`, {
    method: "DELETE",
  });
}
