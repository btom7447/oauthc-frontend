"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "1",
    name: "Emeka Okafor",
    email: "admin@oauthc.gov.ng",
    password: "password",
    role: "admin",
  },
  {
    id: "2",
    name: "Amaka Nwosu",
    email: "staff@oauthc.gov.ng",
    password: "password",
    role: "staff",
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
  {
    id: "4",
    name: "Dr. Ngozi Chukwu",
    email: "doctor2@oauthc.gov.ng",
    password: "password",
    role: "doctor",
    specialty: "Radiology",
    department: "Radiology",
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

// ─── CMS section access ───────────────────────────────────────────────────────
export type CmsSection =
  | "announcements"
  | "doctors"
  | "departments"
  | "health-services"
  | "diseases-symptoms"
  | "tests-procedures"
  | "research-ethics"
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
  "research-ethics":   ["admin", "staff"],
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
  profile:      ["doctor"],
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
