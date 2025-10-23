// src/components/ServiceForm.tsx
import React from 'react';
import { ExtraService } from '../../lib/supabase';


export default function ServiceForm({ editingService, serviceForm, setServiceForm, onCancel, onSubmit }:
  {
    editingService: ExtraService | null;
    serviceForm: any;
    setServiceForm: (s: any) => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
  }) {
  return (
    <form onSubmit={onSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg">
      <h3 className="font-semibold text-slate-800 mb-4">{editingService ? 'Editar servicio' : 'Nuevo servicio'}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nombre *</label>
          <input required type="text" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Descripción *</label>
          <textarea required rows={3} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Precio (€) *</label>
          <input required type="number" step="0.01" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">URL de imagen</label>
          <input type="url" value={serviceForm.image_url} onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>

        <div className="flex items-center">
          <input id="is_active" type="checkbox" checked={serviceForm.is_active} onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600" />
          <label htmlFor="is_active" className="ml-2 text-sm text-slate-700">Servicio activo</label>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">{editingService ? 'Actualizar' : 'Crear'}</button>
          <button type="button" onClick={onCancel} className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded-lg transition-colors">Cancelar</button>
        </div>
      </div>
    </form>
  );
}
