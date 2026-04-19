import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { create } from "zustand";
import type { UserProfile } from "../types";

interface AuthState {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  principal: string | null;
  providerError: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setPrincipal: (principal: string | null) => void;
  setAuthenticated: (value: boolean) => void;
  setProviderError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userProfile: null,
  isAuthenticated: false,
  principal: null,
  providerError: null,
  setProfile: (profile) => set({ userProfile: profile }),
  setPrincipal: (principal) => set({ principal }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setProviderError: (error) => set({ providerError: error }),
  reset: () =>
    set({
      userProfile: null,
      isAuthenticated: false,
      principal: null,
      providerError: null,
    }),
}));

/** Convenience hook that syncs II state into authStore */
export function useAuthSync() {
  const {
    isAuthenticated,
    identity,
    login,
    clear,
    isInitializing,
    isLoggingIn,
    loginStatus,
  } = useInternetIdentity();
  const { setAuthenticated, setPrincipal, reset, setProviderError } =
    useAuthStore();

  const principal = identity?.getPrincipal().toString() ?? null;

  const handleLogin = () => {
    setProviderError(null);
    login();
  };

  const handleLogout = () => {
    clear();
    reset();
    // Clear all browser storage to remove any residual session data
    localStorage.clear();
    sessionStorage.clear();
  };

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principal,
    identity,
    login: handleLogin,
    logout: handleLogout,
    setAuthenticated,
    setPrincipal,
  };
}
