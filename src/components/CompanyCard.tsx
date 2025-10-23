import { Building2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Company, Product, Service } from '../lib/supabase';

interface CompanyCardProps {
  company: Company;
  products: Product[];
  services: Service[];
  onSelectCompany: (company: Company) => void;
}

export function CompanyCard({ company, products, services, onSelectCompany }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Building2 className="w-20 h-20 text-slate-400" />
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{company.name}</h2>
        <p className="text-slate-600 mb-4 line-clamp-2">{company.description}</p>

        <div className="space-y-2 mb-4">
          {company.email && (
            <div className="flex items-center text-sm text-slate-600">
              <Mail className="w-4 h-4 mr-2 text-slate-400" />
              <a href={`mailto:${company.email}`} className="hover:text-blue-600 transition-colors">
                {company.email}
              </a>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center text-sm text-slate-600">
              <Phone className="w-4 h-4 mr-2 text-slate-400" />
              <a href={`tel:${company.phone}`} className="hover:text-blue-600 transition-colors">
                {company.phone}
              </a>
            </div>
          )}
          {company.website && (
            <div className="flex items-center text-sm text-slate-600">
              <Globe className="w-4 h-4 mr-2 text-slate-400" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Sitio web
              </a>
            </div>
          )}
          {company.address && (
            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              <span>{company.address}</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 text-sm text-slate-600 mb-4">
          <div>
            <span className="font-semibold text-slate-800">{products.length}</span> productos
          </div>
          <div>
            <span className="font-semibold text-slate-800">{services.length}</span> servicios
          </div>
        </div>

        <button
          onClick={() => onSelectCompany(company)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}
