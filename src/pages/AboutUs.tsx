// src/pages/AboutUs.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Tag, FileText } from 'lucide-react';

/**
 * AboutUs — todo en un solo archivo/component
 * - Incluye NavOptionCard interno.
 * - Enlaces a /services, /pricing, /blog usando <Link>.
 * - Marca la tarjeta activa según la ruta actual.
 * - Copy/paste directo a src/pages/AboutUs.tsx
 */

type NavOption = {
  to: string;
  title: string;
  description?: string;
  Icon?: React.ComponentType<any>;
};

function NavOptionCard({ option, active }: { option: NavOption; active?: boolean }) {
  const Icon = option.Icon ?? Briefcase;
  return (
    <Link
      to={option.to}
      aria-label={`Ir a ${option.title}`}
      className={`block group focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-2xl transition transform ${
        active ? 'ring-2 ring-sky-200 bg-white shadow-md -translate-y-0.5' : 'bg-white border border-slate-100 hover:shadow-md'
      }`}
    >
      <article className="p-5 h-full flex flex-col justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
              active ? 'bg-sky-50' : 'bg-slate-50'
            }`}
          >
            <Icon className="w-6 h-6 text-slate-700" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-800 truncate">{option.title}</h3>
            <p className="mt-1 text-sm text-slate-500 line-clamp-3">{option.description ?? 'Ver más información.'}</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400">Abrir →</div>
      </article>
    </Link>
  );
}

export default function AboutUs() {
  const location = useLocation();

  const options: NavOption[] = [
    {
      to: '/services',
      title: 'Servicios',
      description: 'Explora los servicios que ofrecemos: consultoría, implementación y soporte.',
      Icon: Briefcase,
    },
    {
      to: '/pricing',
      title: 'Precios',
      description: 'Planes y tarifas para empresas y autónomos. Encuentra la opción que mejor se adapte a ti.',
      Icon: Tag,
    },
    {
      to: '/blog',
      title: 'Blog',
      description: 'Artículos, guías y novedades sobre productos, casos de uso y mejores prácticas.',
      Icon: FileText,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Nosotros</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Bienvenido — desde aquí puedes navegar a las secciones principales del sistema.
          </p>
        </header>

        {/* Grid */}
        <section aria-label="Navegación interna" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <NavOptionCard key={opt.to} option={opt} active={location.pathname === opt.to} />
          ))}
        </section>

        {/* Inline content hint */}
        <div className="mt-8 text-sm text-slate-500">
          <p>
            Estos enlaces navegan dentro de la app. Si quieres que parte del contenido se muestre **en la misma
            página** (por ejemplo un preview o panel a la derecha), dime y lo incorporo aquí mismo.
          </p>
        </div>
      </div>
    </main>
  );
}
