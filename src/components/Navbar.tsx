// src/components/Navbar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, LogOut, LogIn, UserPlus, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import menuImg from '../img/menu.png';

export function Navbar({ onOpenMobile }: { onOpenMobile?: () => void }) {
  const { user, userProfile, company, signOut, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const linkBase =
    'text-sm font-medium transition-colors px-2 py-1 rounded-md tracking-wide';

  return (
    <nav className="shadow-sm border-b border-slate-200 bg-white" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRID 3 columnas: left / center / right */}
        <div className="grid grid-cols-3 items-center h-16">
          {/* LEFT: logo (col 1) */}
          <div className="flex items-center col-start-1 col-end-2">
            <NavLink to="/" className="flex items-center space-x-3" aria-label="Inicio">
              <img
                src={menuImg}
                alt="Logo CubaLink"
                className="h-8 w-auto object-contain"
                loading="lazy"
                draggable={false}
              />
            </NavLink>
          </div>



          {/* CENTER: enlaces principales (col 2) - oculto en mobile */}
          <div className="hidden md:flex justify-center space-x-6 col-start-2 col-end-3" role="group" aria-label="Enlaces principales">
            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? 'text-blue-600' : 'text-black'}`}>
              Empresas
            </NavLink>

            <NavLink to="/feed" className={({ isActive }) => `${linkBase} ${isActive ? 'text-blue-600' : 'text-black'}`}>
              Publicaciones
            </NavLink>

            <NavLink to="/services" className={({ isActive }) => `${linkBase} ${isActive ? 'text-blue-600' : 'text-black'}`}>
              Servicios
            </NavLink>
          </div>

          {/* RIGHT: auth actions (col 3) - hidden en mobile */}
          <div className="flex items-center justify-end col-start-3 col-end-4">
            <div className="hidden md:flex items-center space-x-3">
              {loading ? (
                <div className="text-sm text-black">Cargando...</div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  {userProfile?.role === 'admin' && (
                    <NavLink to="/admin" className={({ isActive }) => `${linkBase} ${isActive ? 'text-blue-600' : 'text-black'}`}>
                      Admin
                    </NavLink>
                  )}

                  {(company || userProfile?.role === 'company') && (
                    <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? 'text-blue-600' : 'text-black'}`}>
                      Mi Empresa
                    </NavLink>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-md hover:bg-slate-50"
                    aria-label="Cerrar sesión"
                    type="button"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-black">Salir</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <NavLink to="/login" className={({ isActive }) => `flex items-center gap-2 ${linkBase} ${isActive ? 'text-blue-600' : 'text-black'}`}>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar sesión</span>
                  </NavLink>

                  <NavLink to="/register" className={({ isActive }) => `flex items-center gap-2 ${linkBase} border border-slate-200 px-3 py-1 rounded-lg ${isActive ? 'text-blue-600' : 'text-black'}`}>
                    <UserPlus className="w-4 h-4" />
                    <span>Registrarse</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* HAMBURGER: visible solo en mobile. Está aquí para estar siempre right-most */}
            <button
              onClick={onOpenMobile}
              className="ml-3 md:ml-0 md:hidden p-2 rounded-md"
              aria-label="Abrir menú"
              type="button"
            >
              <Menu className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
