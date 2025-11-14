// src/components/Forbidden.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Mail } from 'lucide-react';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-12 bg-slate-50">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-lg border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Illustration pane */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-white">
            <div className="flex flex-col items-center text-center">
              <svg
                width="160"
                height="160"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect x="0" y="0" width="120" height="120" rx="18" fill="url(#g)" />
                <path d="M35 40c6-8 16-12 25-12s19 4 25 12" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                <circle cx="45" cy="60" r="6" fill="#0f172a" />
                <circle cx="75" cy="60" r="6" fill="#0f172a" />
                <path d="M45 78c6 6 24 6 30 0" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ecfeff" />
                    <stop offset="100%" stopColor="#eef2ff" />
                  </linearGradient>
                </defs>
              </svg>

              <h2 className="mt-6 text-2xl font-semibold text-slate-900">Página no encontrada</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">Lo sentimos — la ruta que buscas no existe o no tienes permisos para verla.</p>
            </div>
          </div>

          {/* Actions pane */}
          <div className="p-8 flex flex-col justify-center gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Error 404 · No disponible</p>
              <h1 className="mt-3 text-4xl font-extrabold text-slate-900">Ups — algo no cuadra</h1>
              <p className="mt-2 text-sm text-slate-600">Puedes volver al inicio, regresar a la página anterior o contactar al equipo si crees que esto es un error.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow hover:from-sky-700 hover:to-indigo-700 transition"
              >
                
                Ir al inicio
              </button>

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium hover:bg-slate-50 transition"
              >
                
                Volver
              </button>

              <a
                href="mailto:cubalinkb2b@gmail.com"
                className="ml-auto inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-transparent border border-transparent text-slate-700 hover:underline"
              >
               
                Contactar soporte
              </a>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              <p>
                Si clickeaste un enlace interno o pegaste una URL manualmente, revisa la dirección. Si el problema persiste, contacta al equipo.
              </p>
            </div>

            <footer className="mt-6 text-xs text-slate-300">© {new Date().getFullYear()} TuEmpresa</footer>
          </div>
        </div>
      </div>
    </main>
  );
}
