// src/components/UsersList.tsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { UserProfile } from '../../lib/supabase';


export default function UsersList({ users, confirmDeleteUser }: { users: UserProfile[]; confirmDeleteUser: (id: string) => void }) {
  if (users.length === 0) return <p className="text-slate-600 text-center py-8">No hay usuarios registrados</p>;

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <div key={u.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{u.full_name || '—'}</p>
            <p className="text-sm text-slate-500">ID: {u.user_id}</p>
            <p className="text-sm text-slate-500">Rol: {u.role}</p>
            <p className="text-sm text-slate-500">Creado: {new Date(u.created_at).toLocaleDateString('es-ES')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { /* opcional: editar usuario */ }} className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50"><Edit className="w-5 h-5" /></button>
            <button onClick={() => confirmDeleteUser(u.user_id)} className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
