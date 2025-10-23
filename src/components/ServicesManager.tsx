// src/components/ServicesManager.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase, Service, Company } from '../lib/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import Alert, { AlertVariant } from './Alert';

interface ServicesManagerProps {
  services: Service[];
  company: Company | null;
  canManage: boolean;
  onServicesUpdated: () => void;
}

export function ServicesManager({ services, company, canManage, onServicesUpdated }: ServicesManagerProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
  });

  // Modal confirmación
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert state (reemplaza alert(...) nativos)
  const [alertState, setAlertState] = useState<{
    variant: AlertVariant;
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  // auto-hide alerts después de X ms
  useEffect(() => {
    if (!alertState.show) return;
    const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
    return () => clearTimeout(t);
  }, [alertState.show]);

  function openCreateForm() {
    if (!canManage) {
      setAlertState({
        variant: 'danger',
        title: 'Suscripción inactiva',
        message: 'Tu suscripción no está activa. Contacta al administrador para activarla.',
        show: true,
      });
      return;
    }
    setEditingService(null);
    setServiceForm({ name: '', description: '' });
    window.scrollTo({ behavior: 'smooth' });
  }

  function handleEditService(service: Service) {
    setEditingService(service);
    setServiceForm({ name: service.name, description: service.description ?? '' });
    window.scrollTo({ behavior: 'smooth' });
  }

  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;

    if (company.subscription_status !== 'active') {
      setAlertState({
        variant: 'danger',
        title: 'Suscripción inactiva',
        message: 'Tu suscripción no está activa. Contacta al administrador para activarla.',
        show: true,
      });
      return;
    }

    try {
      if (editingService) {
        const updates = {
          name: serviceForm.name,
          description: serviceForm.description,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('services').update(updates).eq('id', editingService.id);
        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Servicio actualizado',
          message: 'Los cambios se guardaron correctamente.',
          show: true,
        });
      } else {
        const payload = {
          name: serviceForm.name,
          description: serviceForm.description,
          company_id: company.id,
        };
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Servicio creado',
          message: 'El servicio se creó correctamente.',
          show: true,
        });
      }

      setEditingService(null);
      setServiceForm({ name: '', description: '' });
      onServicesUpdated();
    } catch (err) {
      console.error('Error saving service:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al guardar el servicio. Intenta nuevamente.',
        show: true,
      });
    }
  }

  function openDeleteModal(serviceId: string) {
    setConfirmDeleteId(serviceId);
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('services').delete().eq('id', confirmDeleteId);
      if (error) throw error;

      setAlertState({
        variant: 'success',
        title: 'Servicio eliminado',
        message: 'El servicio fue eliminado correctamente.',
        show: true,
      });

      onServicesUpdated();
    } catch (err) {
      console.error('Error deleting service:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al eliminar el servicio. Intenta nuevamente.',
        show: true,
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  return (
    <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-900 text-lg font-semibold leading-tight">Servicios</h2>
            <p className="text-slate-600 text-sm mt-1">{services.length} servicios</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateForm}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              canManage ? 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo servicio</span>
          </button>
        </div>
      </header>

      {/* Alert global (info / success / danger) */}
      <div className="mb-4">
        <Alert
          variant={alertState.variant}
          title={alertState.title}
          message={alertState.message}
          show={alertState.show}
          dismissible
          onClose={() => setAlertState((s) => ({ ...s, show: false }))}
        />
      </div>

      {/* Formulario compacto */}
      <form onSubmit={handleServiceSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <h3 className="text-slate-900 text-sm font-semibold mb-3">{editingService ? 'Editar servicio' : 'Nuevo servicio'}</h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nombre del servicio"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-600 block mb-1">Descripción</label>
            <textarea
              rows={3}
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Descripción breve"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              setEditingService(null);
              setServiceForm({ name: '', description: '' });
            }}
            className="px-3 py-2 bg-red-800 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${canManage ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400' : 'bg-indigo-300'}`}
          >
            {editingService ? 'Guardar cambios' : 'Crear servicio'}
          </button>
        </div>
      </form>

      {/* Lista de servicios (cards simples) */}
      {services.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">Aún no has creado servicios</p>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <article key={s.id} className="border border-slate-100 rounded-lg p-4 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-slate-900 text-sm font-semibold">{s.name}</h4>
                <p className="text-slate-600 text-xs mt-1">{s.description}</p>
                <p className="text-xs text-slate-400 mt-2">Creado: {new Date(s.created_at).toLocaleDateString('es-ES')}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditService(s)}
                  disabled={!canManage}
                  className={`p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${canManage ? 'text-slate-900 hover:bg-slate-100 focus:ring-slate-300' : 'text-slate-300'}`}
                  aria-label="Editar servicio"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openDeleteModal(s.id)}
                  className="p-2 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
                  aria-label="Eliminar servicio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => { if (!isDeleting) setConfirmDeleteId(null); }}
        onConfirm={handleConfirmDelete}
        title="Eliminar servicio"
        message="¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </article>
  );
}
