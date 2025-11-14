// src/components/CompaniesGridMinimal.tsx
import React from 'react';
import type { CompanyWithData } from '../pages/Home';
import type { Company } from '../lib/supabase';
import CompanyCard from './CompanyCard';

type Props = {
  companies: CompanyWithData[];
  onSelectCompany: (company: Company) => void;
};

export default function CompaniesGridMinimal({ companies, onSelectCompany }: Props) {
  if (!companies || companies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">No hay empresas disponibles</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((item) => (
        <li key={item.company.id}>
          <CompanyCard
            company={item.company}
            products={item.products}
            services={item.services}
            onSelectCompany={onSelectCompany}
          />
        </li>
      ))}
    </ul>
  );
}
