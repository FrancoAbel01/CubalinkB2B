import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { supabase, ExtraService } from '../lib/supabase';

export function Services() {
  const [services, setServices] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('extra_services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex item-center">
            {/* <Briefcase className="w-10 h-10 text-blue-600 mr-3" /> */}
            <div className='text-center w-full'>
              <h1 className="text-3xl text-center font-bold text-black">Servicios Adicionales</h1>
              <p className="text-black text-center mt-1">
                Servicios exclusivos ofrecidos por el administrador de la plataforma
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">
              No hay servicios adicionales disponibles en este momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2">{service.name}</h3>
                  <p className="text-black mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-blue-900">
                      €{service.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                    <button className="bg-black hover:bg-blue-900 text-white px-4 py-2 rounded-lg transition-colors">
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
