// src/pages/CompanyDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { supabase, Company } from '../lib/supabase';

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompanyData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchCompanyData(companyId: string) {
    try {
      // Pedimos solo los campos que necesitamos
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, description, logo_url, website, email, phone, address, sector')
        .eq('id', companyId)
        .maybeSingle();

      if (companyError) throw companyError;
      if (!companyData) {
        navigate('/');
        return;
      }

      setCompany(companyData as Company);
    } catch (error) {
      console.error('Error fetching company:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando empresa...</p>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al directorio
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-28 h-28 rounded-md bg-slate-200 flex items-center justify-center text-slate-500 font-semibold">
                  {company.name ? company.name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase() : '—'}
                </div>
              </div>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">{company.name}</h1>
            <p className="text-slate-600 text-lg mb-6">{company.description}</p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Información de contacto</h3>
              <div className="space-y-3">
                {company.email && (
                  <div className="flex items-center text-slate-700">
                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                    <a href={`mailto:${company.email}`} className="hover:text-blue-600 transition-colors">
                      {company.email}
                    </a>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-center text-slate-700">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <a href={`tel:${company.phone}`} className="hover:text-blue-600 transition-colors">
                      {company.phone}
                    </a>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center text-slate-700">
                    <Globe className="w-5 h-5 mr-3 text-blue-600" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.address && (
                  <div className="flex items-start text-slate-700">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                    <span>{company.address}</span>
                  </div>
                )}

                {/* Sector */}
                {(company as any).sector && (
                  <div className="flex items-center text-slate-700">
                    <span className="inline-block mr-3 text-xs font-medium text-slate-500 uppercase">Sector</span>
                    <span className="text-sm">{(company as any).sector}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
