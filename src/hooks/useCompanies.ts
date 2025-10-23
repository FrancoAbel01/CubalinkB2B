// File: src/hooks/useCompanies.ts
import { useEffect, useState } from 'react';
import { supabase, Company, Product, Service } from '../lib/supabase';
import type { CompanyWithData } from '../pages/Home';

export default function useCompanies() {
  const [companiesData, setCompaniesData] = useState<CompanyWithData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyWithData[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<CompanyWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companiesData);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = companiesData.filter((item) =>
        (item.company.name || '').toLowerCase().includes(term) ||
        (item.company.description || '').toLowerCase().includes(term) ||
        item.products.some((p: Product) => (p.name || '').toLowerCase().includes(term)) ||
        item.services.some((s: Service) => (s.name || '').toLowerCase().includes(term))
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companiesData]);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (companiesError) throw companiesError;

      const companiesWithData: CompanyWithData[] = await Promise.all(
        (companies || []).map(async (company: Company) => {
          const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('company_id', company.id)
            .order('name');

          const { data: services } = await supabase
            .from('services')
            .select('*')
            .eq('company_id', company.id)
            .order('name');

          return {
            company,
            products: products || [],
            services: services || [],
          };
        })
      );

      setCompaniesData(companiesWithData);
      setFilteredCompanies(companiesWithData);
      setFeaturedCompanies(companiesWithData.slice(0, Math.min(5, companiesWithData.length)));
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }

  return {
    companiesData,
    filteredCompanies,
    featuredCompanies,
    loading,
    searchTerm,
    setSearchTerm,
    fetchCompanies,
  };
}
