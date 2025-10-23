// src/pages/Admin.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Company, ExtraService, UserProfile } from '../lib/supabase';
import Alert, { AlertVariant } from '../components/Alert';
import { ConfirmationModal } from '../components/ConfirmationModal';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabs from '../components/admin/AdminTabs';
import CompaniesList from '../components/admin/CompaniesList';
import ServicesPanel from '../components/admin/ServicesPanel';
import UsersList from '../components/admin/UsersList';
import AlertContainer from '../components/admin/AlertContainer';



type ConfirmAction =
  | { kind: 'cleanupPosts' }
  | { kind: 'deleteService'; serviceId: string }
  | { kind: 'deleteUser'; userId: string };

export default function Admin() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [services, setServices] = useState<ExtraService[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'companies' | 'services' | 'users'>('companies');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<ExtraService | null>(null);

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_active: true,
  });

  // Alerts
  const [alertState, setAlertState] = useState<{
    variant: AlertVariant;
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  // Confirmation centralizada
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    action?: ConfirmAction;
  }>({ open: false });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!userProfile) return;

    if (userProfile.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, navigate]);

  useEffect(() => {
    if (!alertState.show) return;
    const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
    return () => clearTimeout(t);
  }, [alertState.show]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: servicesData } = await supabase
        .from('extra_services')
        .select('*')
        .order('name');

      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.warn('Error fetching users:', usersError);
      } else {
        setUsers(usersData || []);
      }

      setCompanies(companiesData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Ocurrió un error al cargar los datos del panel.',
        show: true,
      });
    } finally {
      setLoading(false);
    }
  }

  function confirmCleanupOldPosts() {
    setConfirmState({ open: true, action: { kind: 'cleanupPosts' } });
  }

  function confirmDeleteService(serviceId: string) {
    setConfirmState({ open: true, action: { kind: 'deleteService', serviceId } });
  }

  function confirmDeleteUser(userId: string) {
    setConfirmState({ open: true, action: { kind: 'deleteUser', userId } });
  }

  async function performConfirmedAction() {
    if (!confirmState.action) return;
    setIsProcessing(true);

    try {
      if (confirmState.action.kind === 'cleanupPosts') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { error } = await supabase
          .from('posts')
          .delete()
          .lt('updated_at', thirtyDaysAgo.toISOString());

        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Limpieza completada',
          message: 'Publicaciones antiguas eliminadas correctamente.',
          show: true,
        });
        fetchData();
      }

      if (confirmState.action.kind === 'deleteService') {
        const serviceId = confirmState.action.serviceId;
        const { error } = await supabase
          .from('extra_services')
          .delete()
          .eq('id', serviceId);

        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Servicio eliminado',
          message: 'El servicio fue eliminado correctamente.',
          show: true,
        });
        fetchData();
      }

      if (confirmState.action.kind === 'deleteUser') {
        const targetUserId = confirmState.action.userId;

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setAlertState({
            variant: 'danger',
            title: 'Error',
            message: 'Error: no hay sesión activa.',
            show: true,
          });
          return;
        }
        const token = sessionData?.session?.access_token;
        if (!token) {
          setAlertState({
            variant: 'danger',
            title: 'Error',
            message: 'Error: sesión no autenticada.',
            show: true,
          });
          return;
        }

        const invokeRes: any = await supabase.functions.invoke('delete-user', {
          body: { user_id: targetUserId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (invokeRes?.error) {
          console.error('Function error:', invokeRes.error);
          setAlertState({
            variant: 'danger',
            title: 'Error',
            message: `Error al borrar usuario: ${invokeRes.error.message || invokeRes.error}`,
            show: true,
          });
          return;
        }

        if (invokeRes?.data) {
          const parsed = invokeRes.data;
          if (parsed?.error) {
            console.error('Function returned error:', parsed.error);
            setAlertState({
              variant: 'danger',
              title: 'Error',
              message: `Error al borrar usuario: ${parsed.error}`,
              show: true,
            });
            return;
          }
        } else if (invokeRes instanceof Uint8Array || invokeRes?.res) {
          try {
            const text = await (invokeRes as any).text?.() ?? new TextDecoder().decode(invokeRes as Uint8Array);
            const parsed = JSON.parse(text);
            if (parsed?.error) {
              console.error('Function returned error:', parsed.error);
              setAlertState({
                variant: 'danger',
                title: 'Error',
                message: `Error al borrar usuario: ${parsed.error}`,
                show: true,
              });
              return;
            }
          } catch (e) {
            // Si no se puede parsear, asumimos OK
          }
        }

        setUsers((prev) => prev.filter((u) => u.user_id !== targetUserId));
        setAlertState({
          variant: 'success',
          title: 'Usuario eliminado',
          message: 'Usuario eliminado correctamente.',
          show: true,
        });
      }
    } catch (err) {
      console.error('Error in confirmed action:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Ocurrió un error al ejecutar la acción. Revisa la consola.',
        show: true,
      });
    } finally {
      setIsProcessing(false);
      setConfirmState({ open: false });
    }
  }

  async function updateCompanyStatus(companyId: string, newStatus: 'pending' | 'active' | 'inactive') {
    try {
      const updateData: any = { subscription_status: newStatus };

      if (newStatus === 'active') {
        const activatedAt = new Date();
        const expiresAt = new Date(activatedAt);
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        updateData.subscription_activated_at = activatedAt.toISOString();
        updateData.subscription_expires_at = expiresAt.toISOString();
      }

      const { error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', companyId);

      if (error) throw error;

      fetchData();
      setAlertState({
        variant: 'success',
        title: 'Estado actualizado',
        message: 'Estado de la empresa actualizado correctamente.',
        show: true,
      });
    } catch (error) {
      console.error('Error updating company:', error);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al actualizar el estado.',
        show: true,
      });
    }
  }

  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const serviceData = {
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        image_url: serviceForm.image_url || null,
        is_active: serviceForm.is_active,
      };

      if (editingService) {
        const { error } = await supabase
          .from('extra_services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        setAlertState({ variant: 'success', title: 'Actualizado', message: 'Servicio actualizado.', show: true });
      } else {
        const { error } = await supabase
          .from('extra_services')
          .insert([serviceData]);

        if (error) throw error;
        setAlertState({ variant: 'success', title: 'Creado', message: 'Servicio creado.', show: true });
      }

      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ name: '', description: '', price: '', image_url: '', is_active: true });
      fetchData();
    } catch (error) {
      console.error('Error saving service:', error);
      setAlertState({ variant: 'danger', title: 'Error', message: 'Error al guardar el servicio', show: true });
    }
  }

  function handleEditService(service: ExtraService) {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      image_url: service.image_url || '',
      is_active: service.is_active,
    });
    setShowServiceForm(true);
  }

  function getStatusBadge(status: string) {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };

    const labels = {
      pending: 'Pendiente',
      active: 'Activa',
      inactive: 'Inactiva',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <AdminHeader onCleanup={confirmCleanupOldPosts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-slate-200">
            <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={{ companies: companies.length, services: services.length, users: users.length }} />
          </div>

          <div className="p-6">
            {activeTab === 'companies' ? (
              <CompaniesList companies={companies} updateCompanyStatus={updateCompanyStatus} getStatusBadge={getStatusBadge} />
            ) : activeTab === 'services' ? (
              <ServicesPanel
                services={services}
                showServiceForm={showServiceForm}
                setShowServiceForm={setShowServiceForm}
                editingService={editingService}
                handleEditService={handleEditService}
                confirmDeleteService={confirmDeleteService}
                serviceForm={serviceForm}
                setServiceForm={setServiceForm}
                handleServiceSubmit={handleServiceSubmit}
              />
            ) : (
              <UsersList users={users} confirmDeleteUser={confirmDeleteUser} />
            )}
          </div>
        </div>
      </div>

      <AlertContainer alertState={alertState} onClose={() => setAlertState((s) => ({ ...s, show: false }))} />

      <ConfirmationModal
        isOpen={confirmState.open}
        onClose={() => { if (!isProcessing) setConfirmState({ open: false }); }}
        onConfirm={performConfirmedAction}
        title={
          confirmState.action?.kind === 'cleanupPosts'
            ? 'Eliminar publicaciones antiguas'
            : confirmState.action?.kind === 'deleteService'
            ? 'Eliminar servicio'
            : 'Eliminar usuario'
        }
        message={
          confirmState.action?.kind === 'cleanupPosts'
            ? '¿Estás seguro de que deseas eliminar todas las publicaciones que no han sido modificadas en más de 30 días?'
            : confirmState.action?.kind === 'deleteService'
            ? '¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.'
            : '¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isProcessing}
      />
    </div>
  );
}
