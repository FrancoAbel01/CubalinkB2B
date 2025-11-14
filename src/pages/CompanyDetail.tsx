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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando empresa...</p>
        </div>
      </div>
    );
  }

  if (!company) return null;

  const initials = company.name
    ? company.name
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '--';

  const mapQuery = company.address ? encodeURIComponent(company.address) : '';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Volver al directorio"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al directorio</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left: image / visual */}
            <div className="md:w-1/3 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex items-center justify-center">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name ?? 'logo'}
                  className="w-48 h-48 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="w-48 h-48 rounded-lg bg-slate-200 flex items-center justify-center text-4xl font-semibold text-slate-600 shadow-md">
                  {initials}
                </div>
              )}
            </div>

            {/* Right: content */}
            <div className="md:flex-1 p-8">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 truncate">{company.name ?? 'Sin nombre'}</h1>

                    {/** If your Company type doesn't have verified, this will be ignored; kept minimal */}
                    {(company as any).verified && (
                      <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                        Verificada
                      </span>
                    )}
                  </div>

                  {company.username && <div className="text-sm text-slate-500 mt-1">@{company.username}</div>}

                  <p className="mt-4 text-slate-600 text-base leading-relaxed">{company.description ?? ''}</p>

                  {/* sector */}
                  {company.sector && (
                    <div className="mt-4">
                      <span className="inline-block bg-slate-50 text-slate-700 text-sm px-3 py-1 rounded">
                        {company.sector}
                      </span>
                    </div>
                  )}
                </div>

                {/* Compact actions block (desktop) */}
                <div className="hidden md:flex md:flex-col md:items-end gap-3">
                  <div className="flex flex-col gap-2">
                    {company.email && (
                      <a
                        href={`mailto:${company.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm hover:bg-slate-50"
                      >
                        <Mail className="w-4 h-4" /> Email
                      </a>
                    )}
                    {company.phone && (
                      <a
                        href={`tel:${company.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm hover:bg-slate-50"
                      >
                        <Phone className="w-4 h-4" /> Llamar
                      </a>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm hover:bg-slate-50"
                      >
                        <Globe className="w-4 h-4" /> Sitio
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Two-column details: Contact | Location */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Información de contacto</h3>
                  <div className="space-y-3 text-slate-700">
                    {company.email ? (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <a href={`mailto:${company.email}`} className="hover:text-blue-600 transition-colors">
                          {company.email}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-slate-400">
                        <Mail className="w-5 h-5" />
                        <span>No email</span>
                      </div>
                    )}

                    {company.phone ? (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <a href={`tel:${company.phone}`} className="hover:text-blue-600 transition-colors">
                          {company.phone}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-slate-400">
                        <Phone className="w-5 h-5" />
                        <span>No phone</span>
                      </div>
                    )}

                    {company.website ? (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {company.website}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Ubicación</h3>
                  {company.address ? (
                    <div className="text-slate-700 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="break-words">{company.address}</div>
                          <div className="mt-3 flex gap-3">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm px-3 py-2 border rounded hover:bg-slate-100"
                            >
                              Ver en mapas
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400">Dirección no disponible</div>
                  )}
                </div>
              </div>

              {/* Mobile actions */}
              <div className="mt-6 md:hidden flex flex-col gap-3">
                <div className="flex gap-3">
                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border rounded"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  )}
                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border rounded"
                    >
                      <Phone className="w-4 h-4" /> Llamar
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border rounded"
                    >
                      <Globe className="w-4 h-4" /> Sitio
                    </a>
                  )}
                </div>
              </div>
            </div>{/* md:flex-1 */}
          </div>{/* md:flex */}
        </div>{/* card */}
      </div>
    </div>
  );
}

export default CompanyDetail;
