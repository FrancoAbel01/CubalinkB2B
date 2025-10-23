// src/components/CompaniesList.tsx
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Company } from '../../lib/supabase';


export default function CompaniesList({ companies, updateCompanyStatus, getStatusBadge }: { companies: Company[]; updateCompanyStatus: (id: string, s: 'pending'|'active'|'inactive') => void; getStatusBadge: (s: string) => JSX.Element }) {
  if (companies.length === 0) {
    return <p className="text-slate-600 text-center py-8">No hay empresas registradas</p>;
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div key={company.id} className="border border-slate-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800">{company.name}</h3>
              <p className="text-slate-600 text-sm mt-1">{company.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-sm text-slate-500">Creada: {new Date(company.created_at).toLocaleDateString('es-ES')}</p>
                {company.subscription_expires_at && <p className="text-sm text-slate-500">Expira: {new Date(company.subscription_expires_at).toLocaleDateString('es-ES')}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(company.subscription_status)}
              <div className="flex gap-2">
                {company.subscription_status !== 'active' && (
                  <button onClick={() => updateCompanyStatus(company.id, 'active')} className="text-green-600 hover:text-green-700 p-2 rounded hover:bg-green-50" title="Activar">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {company.subscription_status !== 'pending' && (
                  <button onClick={() => updateCompanyStatus(company.id, 'pending')} className="text-yellow-600 hover:text-yellow-700 p-2 rounded hover:bg-yellow-50" title="Marcar como pendiente">
                    <Clock className="w-5 h-5" />
                  </button>
                )}
                {company.subscription_status !== 'inactive' && (
                  <button onClick={() => updateCompanyStatus(company.id, 'inactive')} className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50" title="Desactivar">
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
