// src/components/ServicesPanel.tsx
import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

import ServiceForm from './ServiceForm';
import { ExtraService } from '../../lib/supabase';

type BoolSetter = React.Dispatch<React.SetStateAction<boolean>>;

export default function ServicesPanel({
  services,
  showServiceForm,
  setShowServiceForm,
  editingService,
  handleEditService,
  confirmDeleteService,
  serviceForm,
  setServiceForm,
  handleServiceSubmit,
}: {
  services: ExtraService[];
  showServiceForm: boolean;
  // <-- aceptar tanto boolean como función actualizadora
  setShowServiceForm: BoolSetter;
  editingService: ExtraService | null;
  handleEditService: (s: ExtraService) => void;
  confirmDeleteService: (id: string) => void;
  serviceForm: any;
  setServiceForm: (f: any) => void;
  handleServiceSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            // ahora TypeScript acepta el updater functional
            setShowServiceForm((s) => !s);
          }}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo servicio
        </button>
      </div>

      {showServiceForm && (
        <ServiceForm
          editingService={editingService}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          onCancel={() => {
            setShowServiceForm(false);
          }}
          onSubmit={handleServiceSubmit}
        />
      )}

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No hay servicios creados</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-slate-800">{service.name}</h3>
                    {!service.is_active && <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">Inactivo</span>}
                  </div>
                  <p className="text-slate-600 text-sm mt-1">{service.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">€{service.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEditService(service)} className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => confirmDeleteService(service.id)} className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
