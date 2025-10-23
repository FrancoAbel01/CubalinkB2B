// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, FileText, Briefcase, Grid, Settings, Home as HomeIcon } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Empresas', icon: <HomeIcon className="w-4 h-4" />, end: true },
  { to: '/feed', label: 'Publicaciones', icon: <FileText className="w-4 h-4" /> },
  { to: '/services', label: 'Servicios', icon: <Briefcase className="w-4 h-4" /> },
  { to: '/dashboard', label: 'Mi Empresa', icon: <Grid className="w-4 h-4" /> },
  { to: '/admin', label: 'Admin', icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white" aria-label="Sidebar">
      <div className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7" />
          <span className="text-base font-semibold text-black">CubaLink B2B</span>
        </div>
      </div>

      <nav className="px-2 py-4 space-y-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={Boolean(l.end)}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors tracking-wide ${
                isActive ? 'text-blue-600' : 'text-black hover:bg-slate-50'
              }`
            }
          >
            <span className="opacity-90">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-6">
        <div className="text-xs text-slate-500">© {new Date().getFullYear()} CubaLink</div>
      </div>
    </aside>
  );
}
