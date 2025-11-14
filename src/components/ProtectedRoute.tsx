// // src/components/ProtectedRoute.tsx
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // asumes que exporta useAuth()

// type Props = {
//   children: JSX.Element;
// };

// /**
//  * Protege rutas que requieren login.
//  * Redirige a /login y pasa la ubicación actual en state so the app can redirect back after login.
//  */
// export default function ProtectedRoute({ children }: Props) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-40">
//         <div className="loader">Cargando...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }
// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: JSX.Element;
  allowedRoles?: string[];
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: Props) {
  const { user, userProfile, company, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) return children;

  const normalize = (s?: string | null) => (s ? String(s).toLowerCase() : null);
  const allowed = allowedRoles.map((r) => r.toLowerCase());

  const metaRole = normalize(
    user?.user_metadata?.role ?? user?.app_metadata?.role ?? user?.role
  );

  const profileRole = normalize(userProfile?.role); // ✅ corregido aquí

  const hasCompany = !!company;

  if (allowed.includes("empresa") || allowed.includes("company")) {
    if (hasCompany) return children;
  }

  if (metaRole && allowed.includes(metaRole)) return children;
  if (profileRole && allowed.includes(profileRole)) return children;

  const isAdminFlag = !!(userProfile as any)?.is_admin || !!(user as any)?.is_admin;
  if (allowed.includes("admin") && isAdminFlag) return children;

  return <Navigate to="/" replace />;
}
