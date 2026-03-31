"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Role = "super-admin" | "admin" | "doctor";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  specialty?: string;
  department?: string;
};

const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "1",
    name: "Emeka Okafor",
    email: "super@oauthc.gov.ng",
    password: "password",
    role: "super-admin",
  },
  {
    id: "2",
    name: "Amaka Nwosu",
    email: "admin@oauthc.gov.ng",
    password: "password",
    role: "admin",
  },
  {
    id: "3",
    name: "Dr. Adewale Ojo",
    email: "doctor@oauthc.gov.ng",
    password: "password",
    role: "doctor",
    specialty: "Cardiology",
    department: "Cardiology",
  },
];

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("oauthc_admin_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return { error: "Invalid email or password." };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...authUser } = found;
    setUser(authUser);
    localStorage.setItem("oauthc_admin_user", JSON.stringify(authUser));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("oauthc_admin_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function canAccess(role: Role, feature: "cms" | "users" | "appointments" | "profile") {
  const matrix: Record<typeof feature, Role[]> = {
    cms: ["super-admin", "admin"],
    users: ["super-admin"],
    appointments: ["super-admin", "admin", "doctor"],
    profile: ["doctor"],
  };
  return matrix[feature].includes(role);
}
