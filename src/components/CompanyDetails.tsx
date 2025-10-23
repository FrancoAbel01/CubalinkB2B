import { X, Mail, Phone, MapPin, Globe, Package, Briefcase } from 'lucide-react';
import { Company, Product, Service } from '../lib/supabase';

interface CompanyDetailsProps {
  company: Company;
  products: Product[];
  services: Service[];
  onClose: () => void;
}

export function CompanyDetails({ company, products, services, onClose }: CompanyDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-2xl">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-32 h-32 text-slate-400" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6 text-slate-700" />
          </button>
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
            </div>
          </div>

          {products.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-800">Productos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-slate-800 mb-2">{product.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{product.description}</p>
                    {product.price && (
                      <p className="text-lg font-bold text-blue-600">
                        €{product.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {services.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-800">Servicios</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {services.map((service) => (
                  <div key={service.id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                    <h4 className="font-semibold text-slate-800 mb-2">{service.name}</h4>
                    <p className="text-sm text-slate-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
