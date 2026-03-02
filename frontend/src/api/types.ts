export type KooperationStatus = "Keine" | "Geplant" | "Aktiv" | "Abgeschlossen";

export type UserRole = "readonly" | "readwrite" | "admin";

// --- Partnership ---

export interface Partnership {
  id: number;
  parkName: string;
  land: string;
  stadt: string;
  gruendungsjahr: number | null;
  bisherigeKooperation: KooperationStatus | null;
  datum: string | null;
  themen: string[];
  bemerkungen: string | null;
  parkAnsprechpartner: string | null;
  kontaktdetails: string | null;
  webpraesenz: string | null;
  universitaetName: string;
  standort: string | null;
  forschungsschwerpunkte: string[];
  uniAnsprechpartner: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipCreate {
  parkName: string;
  land: string;
  stadt: string;
  gruendungsjahr?: number | null;
  bisherigeKooperation?: KooperationStatus | null;
  datum?: string | null;
  themen?: string[];
  bemerkungen?: string | null;
  parkAnsprechpartner?: string | null;
  kontaktdetails?: string | null;
  webpraesenz?: string | null;
  universitaetName: string;
  standort?: string | null;
  forschungsschwerpunkte?: string[];
  uniAnsprechpartner?: string | null;
  website?: string | null;
}

export interface PartnershipUpdate {
  parkName?: string | null;
  land?: string | null;
  stadt?: string | null;
  gruendungsjahr?: number | null;
  bisherigeKooperation?: KooperationStatus | null;
  datum?: string | null;
  themen?: string[] | null;
  bemerkungen?: string | null;
  parkAnsprechpartner?: string | null;
  kontaktdetails?: string | null;
  webpraesenz?: string | null;
  universitaetName?: string | null;
  standort?: string | null;
  forschungsschwerpunkte?: string[] | null;
  uniAnsprechpartner?: string | null;
  website?: string | null;
}

// --- Auth ---

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  displayName: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// --- User management ---

export interface UserResponse {
  id: number;
  username: string;
  role: UserRole;
  displayName: string | null;
  createdAt: string;
}

export interface UserCreate {
  username: string;
  password: string;
  role: UserRole;
  displayName?: string | null;
}

export interface UserRoleUpdate {
  role: UserRole;
}
