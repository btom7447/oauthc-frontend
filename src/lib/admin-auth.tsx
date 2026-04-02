"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api, tokens } from "@/lib/api-client";

export type Role = "admin" | "staff" | "doctor";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  specialty?: string;
  department?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (data: SignupData) => Promise<{ error?: string }>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isLoading: boolean;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
};

const USER_KEY = "oauthc_admin_user";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage + validate with /auth/me
  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = localStorage.getItem(USER_KEY);
        const hasToken = tokens.getAccess();

        if (stored && hasToken) {
          // Show cached user immediately for fast UI
          setUser(JSON.parse(stored));

          // Validate token is still good
          const res = await api.get<AuthUser>("/auth/me");
          if (res.ok && res.data) {
            const freshUser = res.data;
            setUser(freshUser);
            localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          } else {
            // Token invalid and refresh failed — clean up
            setUser(null);
            localStorage.removeItem(USER_KEY);
            tokens.clear();
          }
        }
      } catch {
        // ignore hydration errors
      }
      setIsLoading(false);
    };
    hydrate();
  }, []);

  // Listen for forced logout from api-client (expired refresh token)
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      localStorage.removeItem(USER_KEY);
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    const res = await api.post<{ token: string; refreshToken: string; user: AuthUser }>(
      "/auth/login",
      { email, password },
      { auth: false }
    );

    if (!res.ok || !res.data) {
      return { error: res.error || "Login failed" };
    }

    tokens.set(res.data.token, res.data.refreshToken);
    setUser(res.data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return {};
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<{ error?: string }> => {
    const res = await api.post("/auth/signup", data, { auth: false });
    if (!res.ok) {
      return { error: res.error || "Signup failed" };
    }
    return {};
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokens.getRefresh();
    // Fire and forget — don't block UI on this
    api.post("/auth/logout", { refreshToken }).catch(() => {});
    setUser(null);
    localStorage.removeItem(USER_KEY);
    tokens.clear();
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── CMS section access ───────────────────────────────────────────────────────
export type CmsSection =
  | "announcements"
  | "doctors"
  | "departments"
  | "health-services"
  | "diseases-symptoms"
  | "tests-procedures"
  | "locations"
  | "schools"
  | "marquee";

const CMS_ACCESS: Record<CmsSection, Role[]> = {
  announcements:       ["admin", "staff"],
  doctors:             ["admin", "staff"],
  departments:         ["admin", "staff"],
  "health-services":   ["admin"],
  "diseases-symptoms": ["admin"],
  "tests-procedures":  ["admin"],
  locations:           ["admin", "staff"],
  schools:             ["admin"],
  marquee:             ["admin", "staff"],
};

// ─── General feature access ───────────────────────────────────────────────────
export type GeneralFeature =
  | "cms"           // can see any CMS section
  | "users"         // user management
  | "appointments"  // any appointments access
  | "profile"       // own profile editing (doctors)
  | "inbox";        // contact/newsletter/research submissions inbox

const GENERAL_ACCESS: Record<GeneralFeature, Role[]> = {
  cms:          ["admin", "staff"],
  users:        ["admin"],
  appointments: ["admin", "staff", "doctor"],
  profile:      ["admin", "staff", "doctor"],
  inbox:        ["admin", "staff"],
};

export function canAccess(role: Role, feature: GeneralFeature | CmsSection): boolean {
  if (feature in GENERAL_ACCESS) {
    return GENERAL_ACCESS[feature as GeneralFeature].includes(role);
  }
  if (feature in CMS_ACCESS) {
    return CMS_ACCESS[feature as CmsSection].includes(role);
  }
  return false;
}

export function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    admin: "Administrator",
    staff: "Staff",
    doctor: "Doctor",
  };
  return labels[role];
}
