// src/components/PostsManager.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { supabase, Post, Company } from '../lib/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import Alert, { AlertVariant } from './Alert';

interface PostsManagerProps {
  posts: Post[];
  company: Company | null;
  canManage: boolean;
  onPostsUpdated: () => void;
}

export function PostsManager({ posts, company, canManage, onPostsUpdated }: PostsManagerProps) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image_url: '',
  });
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);

  // Modal confirmación
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert state (reemplaza los alert(...) nativos)
  const [alertState, setAlertState] = useState<{
    variant: AlertVariant;
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  useEffect(() => {
    if (postForm.image_url) {
      setPostImagePreview(postForm.image_url);
    } else {
      setPostImagePreview(null);
    }
  }, [postForm.image_url]);

  // auto-hide alerts después de X ms
  useEffect(() => {
    if (!alertState.show) return;
    const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
    return () => clearTimeout(t);
  }, [alertState.show]);

  function handleEditPost(post: Post) {
    if (!canManage) {
      setAlertState({
        variant: 'danger',
        title: 'Suscripción inactiva',
        message: 'Tu suscripción no está activa. Contacta al administrador para activarla.',
        show: true,
      });
      return;
    }

    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      image_url: post.image_url || '',
    });
    setPostImagePreview(post.image_url || null);
    setShowPostForm(true);
    // Scroll suave al formulario si fuera necesario:
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openDeleteModal(postId: string) {
    setConfirmDeleteId(postId);
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('posts').delete().eq('id', confirmDeleteId);
      if (error) throw error;

      setAlertState({
        variant: 'success',
        title: 'Publicación eliminada',
        message: 'La publicación se eliminó correctamente.',
        show: true,
      });

      onPostsUpdated();
    } catch (err) {
      console.error('Error deleting post:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al eliminar la publicación. Intenta nuevamente.',
        show: true,
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  async function handlePostSubmit(e: React.FormEvent) {
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

    if (!editingPost && posts.length >= 10) {
      setAlertState({
        variant: 'danger',
        title: 'Límite alcanzado',
        message: 'Has alcanzado el límite de 10 publicaciones. Elimina alguna publicación existente para crear una nueva.',
        show: true,
      });
      return;
    }

    try {
      if (editingPost) {
        const updates = {
          title: postForm.title,
          content: postForm.content,
          image_url: postForm.image_url || null,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('posts').update(updates).eq('id', editingPost.id);
        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Actualizada',
          message: 'La publicación fue actualizada correctamente.',
          show: true,
        });
      } else {
        const payload = {
          title: postForm.title,
          content: postForm.content,
          image_url: postForm.image_url || null,
          company_id: company.id,
        };
        const { error } = await supabase.from('posts').insert([payload]);
        if (error) throw error;

        setAlertState({
          variant: 'success',
          title: 'Publicada',
          message: 'La publicación se creó correctamente.',
          show: true,
        });
      }

      setShowPostForm(false);
      setEditingPost(null);
      setPostForm({ title: '', content: '', image_url: '' });
      setPostImagePreview(null);
      onPostsUpdated();
    } catch (err) {
      console.error('Error saving post:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'Error al guardar la publicación. Intenta nuevamente.',
        show: true,
      });
    }
  }

  return (
    <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-2">
      {/* Header */}
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-900 text-lg font-semibold leading-tight">Mis publicaciones</h2>
            <p className="text-slate-600 text-sm mt-1">{posts.length} de 10 publicaciones usadas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!canManage) {
                setAlertState({
                  variant: 'danger',
                  title: 'Suscripción inactiva',
                  message: 'Tu suscripción no está activa. Contacta al administrador para activarla.',
                  show: true,
                });
                return;
              }
              if (posts.length >= 10) {
                setAlertState({
                  variant: 'danger',
                  title: 'Límite alcanzado',
                  message: 'Has alcanzado el límite de 10 publicaciones. Elimina alguna publicación existente para crear una nueva.',
                  show: true,
                });
                return;
              }
              setEditingPost(null);
              setPostForm({ title: '', content: '', image_url: '' });
              setPostImagePreview(null);
              setShowPostForm((s) => !s);
            }}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              canManage && posts.length < 10
                ? 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nueva publicación</span>
          </button>
        </div>
      </header>

      {/* Global alert (info / success / danger) */}
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

      {/* Formulario (estilo minimal) */}
      {showPostForm && (
        <form onSubmit={handlePostSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <h3 className="text-slate-900 text-sm font-semibold mb-3">
            {editingPost ? 'Editar publicación' : 'Nueva publicación'}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Título *</label>
              <input
                type="text"
                required
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Título breve y claro"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Contenido *</label>
              <textarea
                required
                rows={4}
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Escribe el contenido de la publicación..."
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">URL de imagen (opcional)</label>
              <input
                type="url"
                value={postForm.image_url}
                onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://.../imagen.jpg"
              />
              {postImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500 mb-1">Vista previa</p>
                  <img src={postImagePreview} alt="preview" className="w-32 h-32 object-cover rounded-md border border-slate-100" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPostForm(false);
                  setEditingPost(null);
                  setPostForm({ title: '', content: '', image_url: '' });
                  setPostImagePreview(null);
                }}
                className="px-3 py-2 bg-red-800 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  editingPost ? (company && company.subscription_status === 'active' ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400' : 'bg-indigo-300') : (company && company.subscription_status === 'active' ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400' : 'bg-indigo-300')
                }`}
              >
                {editingPost ? 'Actualizar' : 'Publicar'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Lista de publicaciones */}
      {posts.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">Aún no has creado ninguna publicación</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="border border-slate-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-slate-900 text-sm font-semibold truncate">{post.title}</h4>
                  <p className="text-slate-600 text-sm mt-1 line-clamp-3">{post.content}</p>
                  <div className="mt-3 text-xs text-slate-500">
                    {new Date(post.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      disabled={!canManage}
                      className={`p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        canManage ? 'text-slate-900 hover:bg-slate-100 focus:ring-slate-300' : 'text-slate-300'
                      }`}
                      aria-label="Editar publicación"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openDeleteModal(post.id)}
                      className="p-2 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
                      aria-label="Eliminar publicación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {post.image_url && (
                    <img src={post.image_url} alt={post.title} className="w-36 h-24 object-cover rounded-md border border-slate-100 mt-2" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal confirmación */}
      <ConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => {
          if (!isDeleting) setConfirmDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar publicación"
        message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </article>
  );
}
