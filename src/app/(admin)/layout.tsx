import { AuthProvider } from "@/lib/admin-auth";
import { Toaster } from "react-hot-toast";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      {children}
    </AuthProvider>
  );
}
