// File: src/pages/Home.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company, Product, Service } from '../lib/supabase';
import useCompanies from '../hooks/useCompanies';
import SearchHeader from '../components/SearchHeader';

import CompaniesGrid from '../components/CompaniesGrid';
import { FeaturedCompaniesCarousel } from '../components/FeaturedCompaniesCarousel';

export type CompanyWithData = {
  company: Company;
  products: Product[];
  services: Service[];
};

const DEFAULT_COMPANY_TYPES = [
  'Gastronomía',
  'Tecnología',
  'Software',
  'Tienda',
  'Electrónica',
  'Energía',
  'Automotriz',
];

// Helper: normaliza strings (trim, toLowerCase, remove accents)
function normalizeStr(v: unknown) {
  if (v === null || v === undefined) return '';
  const s = String(v).trim().toLowerCase();
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Extrae el campo `sector` de distintas formas posibles del objeto companyItem
function extractSectorFromItem(item: any): string {
  if (!item) return '';
  // 1) si el item tiene sector directo
  if (typeof item.sector !== 'undefined' && item.sector !== null) return item.sector;
  // 2) si el item es CompanyWithData { company, products, services }
  if (item.company) {
    // company puede ser el object Company o tener data
    if (typeof item.company.sector !== 'undefined' && item.company.sector !== null) return item.company.sector;
    if (item.company.data && typeof item.company.data.sector !== 'undefined' && item.company.data.sector !== null)
      return item.company.data.sector;
  }
  // 3) posibles lugares alternativos (por si usas otra estructura)
  if (item?.data?.sector) return item.data.sector;
  if (item?.attributes?.sector) return item.attributes.sector;
  return '';
}

export default function Home() {
  const navigate = useNavigate();
  const {
    companiesData,
    filteredCompanies, // asumimos que este ya incorpora searchTerm (devuelto por useCompanies)
    featuredCompanies,
    loading,
    searchTerm,
    setSearchTerm,
  } = useCompanies();

  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  function handleSelectCompany(company: Company) {
    navigate(`/company/${company.id}`);
  }

  // Normalizamos una vez los sectores seleccionados
  const normalizedSelected = useMemo(
    () => selectedSectors.map((s) => normalizeStr(s)).filter(Boolean),
    [selectedSectors]
  );

  // Filtrado tolerante por `sector`, pero primero extraemos el sector correctamente
  const displayedCompanies = useMemo(() => {
    if (!filteredCompanies || filteredCompanies.length === 0) return [];

    if (!normalizedSelected || normalizedSelected.length === 0) return filteredCompanies;

    return filteredCompanies.filter((c: any) => {
      const sectorRaw = extractSectorFromItem(c);

      // Si sectorRaw es array
      if (Array.isArray(sectorRaw)) {
        return sectorRaw.some((item) => {
          const norm = normalizeStr(item);
          if (!norm) return false;
          const parts = norm.split(/[\\/,&|;]+/).map((p) => p.trim()).filter(Boolean);
          return normalizedSelected.some((sel) => sel && (norm.includes(sel) || parts.includes(sel)));
        });
      }

      // Si es string (o convertible)
      const sector = normalizeStr(sectorRaw);
      if (!sector) return false;

      const parts = sector.split(/[\\/,&|;]+/).map((p) => p.trim()).filter(Boolean);

      return normalizedSelected.some((sel) => {
        if (!sel) return false;
        return sector.includes(sel) || parts.includes(sel);
      });
    });
  }, [filteredCompanies, normalizedSelected]);

  // DEBUG: descomenta para inspeccionar en consola (muy útil)
  /*
  useEffect(() => {
    console.log('selectedSectors:', selectedSectors);
    console.log('normalizedSelected:', normalizedSelected);
    console.log(
      'sample sectors from filteredCompanies:',
      (filteredCompanies || []).slice(0, 15).map((c: any, i: number) => ({
        index: i,
        raw: extractSectorFromItem(c),
        normalized: normalizeStr(extractSectorFromItem(c)),
      }))
    );
  }, [selectedSectors, filteredCompanies]);
  */

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {featuredCompanies && featuredCompanies.length > 0 && (
          <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <h1 className="text-4xl text-center font-bold text-black mb-6 px-4 sm:px-6 lg:px-8">
              Empresas Destacadas
            </h1>
            <div className="w-full">
              <FeaturedCompaniesCarousel />
            </div>
          </div>
        )}

        <SearchHeader
          searchTerm={searchTerm}
          onSearchChange={(v) => setSearchTerm(v)}
          companyTypes={DEFAULT_COMPANY_TYPES}
          selectedTypes={selectedSectors}
          onFilterChange={(types) => setSelectedSectors(types)}
          allowMultiple={true}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {searchTerm || selectedSectors.length > 0
              ? `Resultados (${displayedCompanies.length})`
              : `Todas las Empresas (${displayedCompanies.length})`}
          </h2>
          {selectedSectors.length > 0 && (
            <p className="text-sm text-slate-600 mt-1">Filtrado por: {selectedSectors.join(', ')}</p>
          )}
        </div>

        {loading ? (
          <div className="min-h-[240px] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-slate-600">Cargando empresas...</p>
            </div>
          </div>
        ) : (
          <CompaniesGrid companies={displayedCompanies} onSelectCompany={handleSelectCompany} />
        )}
      </main>
    </div>
  );
}
