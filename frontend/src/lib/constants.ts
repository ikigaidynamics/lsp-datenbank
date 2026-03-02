import type { KooperationStatus } from "@/api/types";

export const COUNTRIES = [
  "Deutschland",
  "Polen",
  "Österreich",
  "Tschechien",
  "Schweiz",
  "Niederlande",
  "Belgien",
  "Frankreich",
] as const;

export const KOOPERATION_STATUS: KooperationStatus[] = [
  "Keine",
  "Geplant",
  "Aktiv",
  "Abgeschlossen",
];

export const KOOPERATION_COLORS: Record<KooperationStatus, string> = {
  Keine: "bg-gray-100 text-gray-800",
  Geplant: "bg-yellow-100 text-yellow-800",
  Aktiv: "bg-green-100 text-green-800",
  Abgeschlossen: "bg-blue-100 text-blue-800",
};
