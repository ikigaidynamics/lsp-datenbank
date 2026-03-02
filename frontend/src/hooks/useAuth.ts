import { useCallback, useEffect, useState } from "react";

import * as authApi from "@/api/auth";
import type { AuthUser, LoginRequest, UserRole } from "@/api/types";

const ROLE_LEVEL: Record<UserRole, number> = {
  readonly: 0,
  readwrite: 1,
  admin: 2,
};

interface UseAuth {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (minRole: UserRole) => boolean;
}

export function useAuth(): UseAuth {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setError(null);
    try {
      const authUser = await authApi.login(data);
      setUser(authUser);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login fehlgeschlagen.";
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const hasRole = useCallback(
    (minRole: UserRole): boolean => {
      if (!user) return false;
      return ROLE_LEVEL[user.role] >= ROLE_LEVEL[minRole];
    },
    [user],
  );

  return { user, isLoading, error, login, logout, hasRole };
}
