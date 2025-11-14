// src/components/MobileDrawer.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Building2,
  FileText,
  Briefcase,
  Grid,
  Settings,
  Home as HomeIcon,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PUBLIC_LINKS = [
  { to: '/', label: 'Empresas', icon: <HomeIcon className="w-4 h-4" />, end: true },
  { to: '/feed', label: 'Publicaciones', icon: <FileText className="w-4 h-4" /> },
  { to: '/services', label: 'Servicios', icon: <Briefcase className="w-4 h-4" /> },
  { to: '/blog', label: 'Blogs', icon: <Briefcase className="w-4 h-4" /> },
  { to: '/pricing', label: 'Planes', icon: <Briefcase className="w-4 h-4" /> },
];

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { user, userProfile, company, signOut, loading } = useAuth();

  function handleNav(to: string) {
    navigate(to);
    onClose();
  }

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      // asegúrate de cerrar el drawer y redirigir siempre
      onClose();
      navigate('/');
    }
  }

  return (
    <div
      className={`fixed inset-0 z-40 transition-all ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-72 max-w-full bg-white shadow-xl transform transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6" />
            <span className="text-sm font-semibold text-black">CubaLink</span>
          </div>
          <button onClick={onClose} aria-label="Cerrar menú" className="p-2 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {/* Enlaces públicos */}
          {PUBLIC_LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => handleNav(l.to)}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-slate-50"
            >
              <span className="opacity-90">{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}

          <hr className="my-2 border-slate-100" />

          {/* Links condicionados por auth */}
          {loading ? (
            <div className="px-3 text-sm text-slate-500">Cargando...</div>
          ) : user ? (
            <>
              {/* Mi Empresa - si aplica */}
              {(company || userProfile?.role === 'company') && (
                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-slate-50"
                >
                  <span className="opacity-90">
                    <Grid className="w-4 h-4" />
                  </span>
                  <span>Mi Empresa</span>
                </button>
              )}

              {/* Admin - si aplica */}
              {userProfile?.role === 'admin' && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-slate-50"
                >
                  <span className="opacity-90">
                    <Settings className="w-4 h-4" />
                  </span>
                  <span>Admin</span>
                </button>
              )}

              {/* Salir */}
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-slate-50"
              >
                <span className="opacity-90">
                  <LogOut className="w-4 h-4" />
                </span>
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              {/* No autenticado: Login / Register */}
              <button
                onClick={() => handleNav('/login')}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-slate-50"
              >
                <span className="opacity-90">
                  <LogIn className="w-4 h-4" />
                </span>
                <span>Iniciar sesión</span>
              </button>

              <button
                onClick={() => handleNav('/register')}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-slate-50"
              >
                <span className="opacity-90">
                  <UserPlus className="w-4 h-4" />
                </span>
                <span>Registrarse</span>
              </button>
            </>
          )}
        </nav>

        <div className="px-4 py-6 mt-auto">
          <div className="text-xs text-slate-500">© {new Date().getFullYear()} CubaLink</div>
        </div>
      </div>
    </div>
  );
}
