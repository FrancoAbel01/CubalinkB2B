// src/components/AdminTabs.tsx
import React from 'react';
import { Users as UsersIcon, Briefcase } from 'lucide-react';

interface Counts { companies: number; services: number; users: number }

export default function AdminTabs({ activeTab, setActiveTab, counts }: { activeTab: string; setActiveTab: (t: any) => void; counts: Counts }) {
  return (
    <div className="flex space-x-8 px-6">
      <button onClick={() => setActiveTab('companies')} className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'companies' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
        <UsersIcon className="w-5 h-5 inline mr-2" /> Empresas ({counts.companies})
      </button>

      <button onClick={() => setActiveTab('services')} className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
        <Briefcase className="w-5 h-5 inline mr-2" /> Servicios ({counts.services})
      </button>

      <button onClick={() => setActiveTab('users')} className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
        <UsersIcon className="w-5 h-5 inline mr-2" /> Usuarios ({counts.users})
      </button>
    </div>
  );
}
