// src/components/AdminHeader.tsx
import React from 'react';
import { Shield, Trash2 } from 'lucide-react';

interface Props {
  onCleanup: () => void;
}

export default function AdminHeader({ onCleanup }: Props) {
  return (
    <header className="bg-white shadow-sm rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-10 h-10 text-blue-800 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-black">Panel de Administración</h1>
              <p className="text-black mt-1">Gestiona empresas, servicios y usuarios de la plataforma</p>
            </div>
          </div>
          <button onClick={onCleanup} className="flex items-center bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5 mr-2" />
            Limpiar posts antiguos
          </button>
        </div>
      </div>
    </header>
  );
}
