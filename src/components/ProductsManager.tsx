// src/components/ProductsManager.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase, Product, Company } from '../lib/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import Alert, { AlertVariant } from './Alert';

interface ProductsManagerProps {
  products: Product[];
  company: Company | null;
  canManage: boolean;
  onProductsUpdated: () => void;
}

export function ProductsManager({ products, company, canManage, onProductsUpdated }: ProductsManagerProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);

  // Modal de confirmación
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert state (reemplaza alert(...) nativos)
  const [alertState, setAlertState] = useState<{
    variant: AlertVariant;
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  useEffect(() => {
    if (productForm.image_url) setProductImagePreview(productForm.image_url);
    else setProductImagePreview(null);
  }, [productForm.image_url]);

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
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', image_url: '' });
    setProductImagePreview(null);
    // opcional: scroll suave
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price != null ? String(product.price) : '',
      image_url: product.image_url ?? '',
    });
    setProductImagePreview(product.image_url ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleProductSubmit(e: React.FormEvent) {
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
      const priceNumeric = productForm.price ? Number(productForm.price) : null;

      if (editingProduct) {
        const updates = {
          name: productForm.name,
          description: productForm.description,
          price: priceNumeric,
          image_url: productForm.image_url || null,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('products').update(updates).eq('id', editingProduct.id);
        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Producto actualizado',
          message: 'Los cambios se guardaron correctamente.',
          show: true,
        });
      } else {
        const payload = {
          name: productForm.name,
          description: productForm.description,
          price: priceNumeric,
          image_url: productForm.image_url || null,
          company_id: company.id,
        };
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Producto creado',
          message: 'El producto se creó correctamente.',
          show: true,
        });
      }

      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', image_url: '' });
      setProductImagePreview(null);
      onProductsUpdated();
    } catch (err) {
      console.error('Error saving product:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al guardar el producto. Intenta nuevamente.',
        show: true,
      });
    }
  }

  function openDeleteModal(productId: string) {
    setConfirmDeleteId(productId);
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', confirmDeleteId);
      if (error) throw error;

      setAlertState({
        variant: 'success',
        title: 'Producto eliminado',
        message: 'El producto fue eliminado correctamente.',
        show: true,
      });

      onProductsUpdated();
    } catch (err) {
      console.error('Error deleting product:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al eliminar el producto. Intenta nuevamente.',
        show: true,
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  return (
    <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-2">
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-900 text-lg font-semibold leading-tight">Productos</h2>
            <p className="text-slate-600 text-sm mt-1">{products.length} productos</p>
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
            <span>Nuevo producto</span>
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

      {/* Formulario (compacto, minimal) */}
      <form onSubmit={handleProductSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <h3 className="text-slate-900 text-sm font-semibold mb-3">{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-600 block mb-1">Descripción</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Descripción corta"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-600 block mb-1">URL de imagen (opcional)</label>
            <input
              type="url"
              value={productForm.image_url}
              onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://.../imagen.jpg"
            />
            {productImagePreview && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">Vista previa</p>
                <img src={productImagePreview} alt="preview" className="w-32 h-32 object-cover rounded-md border border-slate-100" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setProductForm({ name: '', description: '', price: '', image_url: '' });
              setProductImagePreview(null);
            }}
            className="px-3 py-2 bg-red-800 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${canManage ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400' : 'bg-indigo-300'}`}
          >
            {editingProduct ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>

      {/* Grid de productos (cards) */}
      {products.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">Aún no has creado productos</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="border border-slate-100 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded-md mb-3" />
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded-md mb-3" />
              )}

              <div className="flex-1">
                <h4 className="text-slate-900 text-sm font-semibold truncate">{p.name}</h4>
                <p className="text-slate-600 text-xs mt-1 line-clamp-3">{p.description}</p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-slate-800 font-medium text-sm">{p.price != null ? `€ ${Number(p.price).toFixed(2)}` : ''}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProduct(p)}
                    disabled={!canManage}
                    className={`p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      canManage ? 'text-slate-900 hover:bg-slate-100 focus:ring-slate-300' : 'text-slate-300'
                    }`}
                    aria-label="Editar producto"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openDeleteModal(p.id)}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Confirmación modal */}
      <ConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => { if (!isDeleting) setConfirmDeleteId(null); }}
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </article>
  );
}
