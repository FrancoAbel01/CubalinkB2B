// File: src/components/CompaniesGrid.tsx
import React from 'react';
import type { CompanyWithData } from '../pages/Home';
import { CompanyCard } from './CompanyCard';


export default function CompaniesGrid({
  companies,
  onSelectCompany,
}: {
  companies: CompanyWithData[];
  onSelectCompany: (company: any) => void;
}) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">No hay empresas disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((item) => (
        <CompanyCard
          key={item.company.id}
          company={item.company}
          products={item.products}
          services={item.services}
          onSelectCompany={onSelectCompany}
        />
      ))}
    </div>
  );
}
