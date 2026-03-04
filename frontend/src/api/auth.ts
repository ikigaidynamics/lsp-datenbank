import { fetchWithAuth } from "./client";
import type { AuthUser, LoginRequest, ProfileUpdateRequest } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function login(data: LoginRequest): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? "Login fehlgeschlagen.");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  return fetchWithAuth<void>("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return fetchWithAuth<AuthUser>("/api/auth/me");
}

export async function updateProfile(data: ProfileUpdateRequest): Promise<AuthUser> {
  return fetchWithAuth<AuthUser>("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify({
      current_password: data.currentPassword,
      new_username: data.newUsername || null,
      new_display_name: data.newDisplayName || null,
      new_password: data.newPassword || null,
    }),
  });
}
