// src/components/CompanyForm.tsx
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Alert, { AlertVariant } from './Alert';

interface CompanyFormProps {
  onCompanyCreated: () => void;
}

export function CompanyForm({ onCompanyCreated }: CompanyFormProps) {
  const { user } = useAuth();
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    website: '',
    email: '',
    phone: '',
    address: '',
  });
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);

  // Estado para alertas
  const [alertState, setAlertState] = useState<{
    variant: AlertVariant;
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  // Preview para URL del logo de compañía
  const handleLogoUrlChange = (url: string) => {
    setCompanyForm({ ...companyForm, logo_url: url });
    if (url) {
      setCompanyLogoPreview(url);
    } else {
      setCompanyLogoPreview(null);
    }
  };

  async function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setAlertState({
        variant: 'danger',
        title: 'No autenticado',
        message: 'Debes iniciar sesión para crear una empresa.',
        show: true,
      });
      return;
    }

    try {
      const payload = { ...companyForm, user_id: user.id };
      const { error } = await supabase.from('companies').insert([payload]);
      if (error) throw error;

      // Mostrar alerta de éxito
      setAlertState({
        variant: 'success',
        title: 'Empresa creada',
        message: 'La empresa fue creada correctamente. El administrador activará la cuenta tras la verificación.',
        show: true,
      });

      // Llamada al callback del padre (por ejemplo para refrescar la lista / navegar)
      onCompanyCreated();

      // opcional: limpiar formulario (si lo deseas)
      setCompanyForm({
        name: '',
        description: '',
        logo_url: '',
        website: '',
        email: '',
        phone: '',
        address: '',
      });
      setCompanyLogoPreview(null);
    } catch (err) {
      console.error('Error creating company:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Ocurrió un error al crear la empresa. Revisa la consola para más detalles.',
        show: true,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center mb-6">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-800">Registra tu empresa</h1>
          </div>

          {/* Info usando el componente Alert */}
          <div className="mb-6">
            <Alert
              variant="info"
              title="Información"
              message={
                <>
                  Después de crear tu empresa, deberás contactar al administrador en <strong>admin@directorio.com</strong> para realizar el pago de la suscripción mensual y activar tu cuenta.
                </>
              }
              dismissible
              show={true}
              onClose={() => {
                /* Este alert de info lo dejamos estático (podrías ocultarlo con estado si quieres) */
              }}
            />
          </div>

          {/* Alert dinámico (success / danger) */}
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

          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la empresa *</label>
              <input
                type="text"
                required
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descripción *</label>
              <textarea
                required
                rows={3}
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL del logo (opcional)</label>
              <input
                type="url"
                value={companyForm.logo_url}
                onChange={(e) => handleLogoUrlChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="https://ejemplo.com/logo.png"
              />
              {companyLogoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-slate-600 mb-1">Vista previa:</p>
                  <img src={companyLogoPreview} alt="Preview logo" className="w-32 h-32 object-cover rounded-md" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sitio web</label>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email de contacto</label>
                <input
                  type="email"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
                <input
                  type="text"
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
              Crear empresa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
