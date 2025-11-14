










// // src/components/CompanyProfile.tsx
// import React, { useEffect, useState } from 'react';
// import { Edit } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import type { Company } from '../lib/supabase';
// import Alert, { AlertVariant } from './Alert';

// interface CompanyProfileProps {
//   company: Company | null;
//   onCompanyUpdated: () => void;
// }

// type CompanyEditForm = {
//   name: string;
//   description: string;
//   logo_url: string;
//   banner_url: string;
//   website: string;
//   email: string;
//   phone: string;
//   address: string;
//   username: string;
//   contact_name: string;
//   legal_identifier: string;
//   keywords_csv: string; // CSV -> string[] | null
//   sector: string;
// };

// export default function CompanyProfile({ company, onCompanyUpdated }: CompanyProfileProps) {
//   const [editingCompany, setEditingCompany] = useState(false);
//   const [companySaving, setCompanySaving] = useState(false);
//   const [companyEditForm, setCompanyEditForm] = useState<CompanyEditForm>({
//     name: '',
//     description: '',
//     logo_url: '',
//     banner_url: '',
//     website: '',
//     email: '',
//     phone: '',
//     address: '',
//     username: '',
//     contact_name: '',
//     legal_identifier: '',
//     keywords_csv: '',
//     sector: '',
//   });
//   const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);

//   // Estado para alertas
//   const [alertState, setAlertState] = useState<{
//     variant: AlertVariant;
//     title?: React.ReactNode;
//     message?: React.ReactNode;
//     show: boolean;
//   }>({ variant: 'info', show: false });

//   useEffect(() => {
//     if (company) {
//       setCompanyEditForm({
//         name: company.name ?? '',
//         description: company.description ?? '',
//         logo_url: company.logo_url ?? '',
//         banner_url: (company as any).banner_url ?? '',
//         website: company.website ?? '',
//         email: company.email ?? '',
//         phone: company.phone ?? '',
//         address: company.address ?? '',
//         username: (company as any).username ?? '',
//         contact_name: (company as any).contact_name ?? '',
//         legal_identifier: (company as any).legal_identifier ?? '',
//         keywords_csv: Array.isArray((company as any).keywords) ? (company as any).keywords.join(', ') : '',
//         sector: (company as any).sector ?? '',
//       });
//       setCompanyLogoPreview(company.logo_url ?? null);
//     }
//   }, [company]);

//   useEffect(() => {
//     if (companyEditForm.logo_url) setCompanyLogoPreview(companyEditForm.logo_url);
//   }, [companyEditForm.logo_url]);

//   // Auto-hide alert después de X segundos
//   useEffect(() => {
//     if (!alertState.show) return;
//     const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
//     return () => clearTimeout(t);
//   }, [alertState.show]);

//   function initials(name?: string) {
//     if (!name) return '';
//     return name
//       .split(' ')
//       .map((s) => s[0])
//       .slice(0, 2)
//       .join('')
//       .toUpperCase();
//   }

//   function openEditCompany() {
//     if (!company) return;
//     setEditingCompany(true);
//     setAlertState({
//       variant: 'info',
//       title: 'Modo edición',
//       message: 'Edita los campos que necesites y pulsa "Guardar cambios".',
//       show: true,
//     });
//   }

//   async function saveCompanyEdits() {
//     if (!company) return;
//     setCompanySaving(true);

//     try {
//       // keywords: CSV -> string[] | null
//       const keywordsArr =
//         companyEditForm.keywords_csv && companyEditForm.keywords_csv.trim() !== ''
//           ? companyEditForm.keywords_csv
//               .split(',')
//               .map((k) => k.trim())
//               .filter(Boolean)
//           : null;

//       const updates: any = {
//         name: companyEditForm.name,
//         description: companyEditForm.description,
//         logo_url: companyEditForm.logo_url || null,
//         banner_url: companyEditForm.banner_url || null,
//         website: companyEditForm.website || null,
//         email: companyEditForm.email || null,
//         phone: companyEditForm.phone || null,
//         address: companyEditForm.address || null,
//         username: companyEditForm.username || null,
//         contact_name: companyEditForm.contact_name || null,
//         legal_identifier: companyEditForm.legal_identifier || null,
//         keywords: keywordsArr,
//         sector: companyEditForm.sector || null,
//         updated_at: new Date().toISOString(),
//       };

//       const { error } = await supabase.from('companies').update(updates).eq('id', company.id);
//       if (error) throw error;

//       setAlertState({
//         variant: 'success',
//         title: 'Cambios guardados',
//         message: 'Los datos de la empresa se actualizaron correctamente.',
//         show: true,
//       });

//       onCompanyUpdated();
//       setEditingCompany(false);
//     } catch (err) {
//       console.error('Error saving company edits:', err);
//       setAlertState({
//         variant: 'danger',
//         title: 'Error',
//         message: 'No se pudieron guardar los cambios. Intenta nuevamente.',
//         show: true,
//       });
//     } finally {
//       setCompanySaving(false);
//     }
//   }

//   if (!company) return null;

//   return (
//     <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-2">
//       <header className="flex items-start justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="flex-shrink-0">
//             {companyLogoPreview ? (
//               <img
//                 src={companyLogoPreview}
//                 alt={company.name ?? 'logo'}
//                 className="w-20 h-20 rounded-lg object-cover border border-slate-200"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-slate-900 text-white font-semibold text-sm">
//                 <span className="select-none">{initials(company.name)}</span>
//               </div>
//             )}
//           </div>

//           <div>
//             <h1 className="text-slate-900 text-lg font-semibold leading-tight">{company.name}</h1>
//             <p className="text-slate-700 text-sm mt-1 max-w-xl">{company.description}</p>
//             <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
//               {company.website && (
//                 <a
//                   href={company.website}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="underline underline-offset-2 hover:text-slate-900"
//                 >
//                   {new URL(company.website).hostname.replace('www.', '')}
//                 </a>
//               )}
//               {company.email && <span>· {company.email}</span>}
//               {company.phone && <span>· {company.phone}</span>}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={openEditCompany}
//             aria-label="Editar empresa"
//             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
//           >
//             <Edit className="w-4 h-4" />
//             <span>Editar</span>
//           </button>
//         </div>
//       </header>

//       {/* Alert global (info / success / danger) */}
//       <div className="mt-4">
//         <Alert
//           variant={alertState.variant}
//           title={alertState.title}
//           message={alertState.message}
//           show={alertState.show}
//           dismissible
//           onClose={() => setAlertState((s) => ({ ...s, show: false }))}
//         />
//       </div>

//       {editingCompany && (
//         <section className="mt-6 grid grid-cols-1 gap-4">
//           <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//               {/* Name & description */}
//               <div className="md:col-span-2">
//                 <label className="text-xs font-medium text-slate-600">Nombre</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.name}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, name: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="text-xs font-medium text-slate-600">Descripción</label>
//                 <textarea
//                   rows={3}
//                   value={companyEditForm.description}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, description: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               {/* Logo & banner */}
//               <div>
//                 <label className="text-xs font-medium text-slate-600">Logo URL</label>
//                 <input
//                   type="url"
//                   value={companyEditForm.logo_url}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, logo_url: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="https://.../logo.png"
//                 />
//                 {companyLogoPreview && (
//                   <div className="mt-2">
//                     <p className="text-xs text-slate-500 mb-1">Vista previa</p>
//                     <img src={companyLogoPreview} alt="preview" className="w-24 h-24 object-cover rounded-md border border-slate-100" />
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-slate-600">Banner URL</label>
//                 <input
//                   type="url"
//                   value={companyEditForm.banner_url}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, banner_url: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="https://.../banner.jpg"
//                 />
//               </div>

//               {/* Basic contact */}
//               <div>
//                 <label className="text-xs font-medium text-slate-600">Sitio web</label>
//                 <input
//                   type="url"
//                   value={companyEditForm.website}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, website: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="https://miempresa.com"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-slate-600">Email</label>
//                 <input
//                   type="email"
//                   value={companyEditForm.email}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, email: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="contacto@empresa.com"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-slate-600">Teléfono</label>
//                 <input
//                   type="tel"
//                   value={companyEditForm.phone}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, phone: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="+34 600 000 000"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="text-xs font-medium text-slate-600">Dirección</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.address}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, address: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Calle, Ciudad, País"
//                 />
//               </div>

//               {/* New contact/legal/metadata */}
//               <div>
//                 <label className="text-xs font-medium text-slate-600">Nombre de contacto</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.contact_name}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, contact_name: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Nombre Apellido"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-slate-600">Identificador legal</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.legal_identifier}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, legal_identifier: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="CUIT / NIF / CIF"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-slate-600">Username / handle</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.username}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, username: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="mi-empresa"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-slate-600">Sector</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.sector}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, sector: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Restauración, Tecnología..."
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="text-xs font-medium text-slate-600">Keywords (separadas por coma)</label>
//                 <input
//                   type="text"
//                   value={companyEditForm.keywords_csv}
//                   onChange={(e) => setCompanyEditForm({ ...companyEditForm, keywords_csv: e.target.value })}
//                   className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="comida, delivery, restaurante"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex items-center gap-3 justify-end">
//               <button
//                 onClick={() => setEditingCompany(false)}
//                 className="px-3 py-2 rounded-md bg-red-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
//               >
//                 Cancelar
//               </button>

//               <button
//                 onClick={saveCompanyEdits}
//                 disabled={companySaving}
//                 className={`px-4 py-2 rounded-md text-sm font-medium text-white ${companySaving ? 'bg-blue-800' : 'bg-slate-900 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
//               >
//                 {companySaving ? 'Guardando...' : 'Guardar cambios'}
//               </button>
//             </div>
//           </div>
//         </section>
//       )}
//     </article>
//   );
// }
// src/components/CompanyProfile.tsx














import React, { useEffect, useState, useRef } from 'react';
import { Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Company } from '../lib/supabase';
import Alert, { AlertVariant } from './Alert';

interface CompanyProfileProps {
  company: Company | null;
  onCompanyUpdated: () => void;
  companyTypes?: string[]; // <-- nueva prop opcional
}

type CompanyEditForm = {
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  contact_name: string;
  legal_identifier: string;
  keywords_csv: string; // CSV -> string[] | null
  sector: string;
};

const DEFAULT_COMPANY_TYPES = [
  'Gastronomía',
  'Tecnología',
  'Software',
  'Tienda',
  'Electrónica',
  'Energía',
  'Automotriz',
];

export default function CompanyProfile({
  company,
  onCompanyUpdated,
  companyTypes = DEFAULT_COMPANY_TYPES,
}: CompanyProfileProps) {
  const [editingCompany, setEditingCompany] = useState(false);
  const [companySaving, setCompanySaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false); // nuevo estado para subida de logo
  const [companyEditForm, setCompanyEditForm] = useState<CompanyEditForm>({
    name: '',
    description: '',
    logo_url: '',
    banner_url: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    contact_name: '',
    legal_identifier: '',
    keywords_csv: '',
    sector: '',
  });
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);

  // Estado para alertas
  const [alertState, setAlertState] = useState<{
    variant: AlertVariant;
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (company) {
      setCompanyEditForm({
        name: company.name ?? '',
        description: company.description ?? '',
        logo_url: company.logo_url ?? '',
        banner_url: (company as any).banner_url ?? '',
        website: company.website ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        address: company.address ?? '',
        username: (company as any).username ?? '',
        contact_name: (company as any).contact_name ?? '',
        legal_identifier: (company as any).legal_identifier ?? '',
        keywords_csv: Array.isArray((company as any).keywords) ? (company as any).keywords.join(', ') : '',
        sector: (company as any).sector ?? '',
      });
      setCompanyLogoPreview(company.logo_url ?? null);
    }
  }, [company]);

  useEffect(() => {
    if (companyEditForm.logo_url) setCompanyLogoPreview(companyEditForm.logo_url);
  }, [companyEditForm.logo_url]);

  // Auto-hide alert después de X segundos
  useEffect(() => {
    if (!alertState.show) return;
    const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
    return () => clearTimeout(t);
  }, [alertState.show]);

  function initials(name?: string) {
    if (!name) return '';
    return name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  function openEditCompany() {
    if (!company) return;
    setEditingCompany(true);
    setAlertState({
      variant: 'info',
      title: 'Modo edición',
      message: 'Edita los campos que necesites y pulsa "Guardar cambios".',
      show: true,
    });
  }

  // ---------------------------
  // NUEVO: manejar selección de fichero y subida
  // ---------------------------
  function handleLogoFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    // preview local inmediato
    const url = URL.createObjectURL(file);
    setCompanyLogoPreview(url);

    // subir inmediatamente y obtener public url
    uploadLogoFile(file).catch((err) => {
      console.error('uploadLogoFile error:', err);
    });
  }

  async function uploadLogoFile(file: File) {
    if (!company) {
      setAlertState({ variant: 'danger', title: 'Error', message: 'Empresa no cargada', show: true });
      return;
    }

    setLogoUploading(true);
    try {
      // determinar extensión segura
      const parts = file.name.split('.');
      const ext = parts.length > 1 ? parts.pop() : 'png';
      const cleanExt = ext?.split('?')[0].split('#')[0] ?? 'png';
      const filePath = `companies/${company.id}/logo-${Date.now()}.${cleanExt}`;

      // subir al bucket público 'images'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Supabase upload error', uploadError);
        setAlertState({ variant: 'danger', title: 'Error de subida', message: uploadError.message, show: true });
        return;
      }

      // obtener public URL (bucket es público)
      const { data: publicData } = supabase.storage.from('images').getPublicUrl(filePath);
      const publicUrl = publicData?.publicUrl ?? null;

      if (!publicUrl) {
        setAlertState({ variant: 'danger', title: 'Error', message: 'No se pudo obtener la URL pública del archivo.', show: true });
        return;
      }

      // actualizar el form (no hacemos commit a la tabla todavía, solo ponemos la url lista para guardar)
      setCompanyEditForm((prev) => ({ ...prev, logo_url: publicUrl }));
      setCompanyLogoPreview(publicUrl);

      setAlertState({ variant: 'success', title: 'Logo subido', message: 'Logo subido correctamente al bucket.', show: true });
    } catch (err: any) {
      console.error('uploadLogoFile unexpected error', err);
      setAlertState({ variant: 'danger', title: 'Error', message: err?.message ?? String(err), show: true });
    } finally {
      setLogoUploading(false);
      // liberar object URL si era un blob temporal (opcional)
    }
  }

  // ---------------------------
  // Guardar cambios (ya existente)
  // ---------------------------
  async function saveCompanyEdits() {
    if (!company) return;
    setCompanySaving(true);

    try {
      // keywords: CSV -> string[] | null
      const keywordsArr =
        companyEditForm.keywords_csv && companyEditForm.keywords_csv.trim() !== ''
          ? companyEditForm.keywords_csv
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : null;

      const updates: any = {
        name: companyEditForm.name,
        description: companyEditForm.description,
        logo_url: companyEditForm.logo_url || null,
        banner_url: companyEditForm.banner_url || null,
        website: companyEditForm.website || null,
        email: companyEditForm.email || null,
        phone: companyEditForm.phone || null,
        address: companyEditForm.address || null,
        username: companyEditForm.username || null,
        contact_name: companyEditForm.contact_name || null,
        legal_identifier: companyEditForm.legal_identifier || null,
        keywords: keywordsArr,
        sector: companyEditForm.sector || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('companies').update(updates).eq('id', company.id);
      if (error) throw error;

      setAlertState({
        variant: 'success',
        title: 'Cambios guardados',
        message: 'Los datos de la empresa se actualizaron correctamente.',
        show: true,
      });

      onCompanyUpdated();
      setEditingCompany(false);
    } catch (err) {
      console.error('Error saving company edits:', err);
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'No se pudieron guardar los cambios. Intenta nuevamente.',
        show: true,
      });
    } finally {
      setCompanySaving(false);
    }
  }

  if (!company) return null;

  return (
    <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-2">
      <header className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {companyLogoPreview ? (
              <img
                src={companyLogoPreview}
                alt={company.name ?? 'logo'}
                className="w-20 h-20 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-slate-900 text-white font-semibold text-sm">
                <span className="select-none">{initials(company.name)}</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-slate-900 text-lg font-semibold leading-tight">{company.name}</h1>
            <p className="text-slate-700 text-sm mt-1 max-w-xl">{company.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-slate-900"
                >
                  {new URL(company.website).hostname.replace('www.', '')}
                </a>
              )}
              {company.email && <span>· {company.email}</span>}
              {company.phone && <span>· {company.phone}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openEditCompany}
            aria-label="Editar empresa"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
        </div>
      </header>

      {/* Alert global (info / success / danger) */}
      <div className="mt-4">
        <Alert
          variant={alertState.variant}
          title={alertState.title}
          message={alertState.message}
          show={alertState.show}
          dismissible
          onClose={() => setAlertState((s) => ({ ...s, show: false }))}
        />
      </div>

      {editingCompany && (
        <section className="mt-6 grid grid-cols-1 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Name & description */}
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Nombre</label>
                <input
                  type="text"
                  value={companyEditForm.name}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, name: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Descripción</label>
                <textarea
                  rows={3}
                  value={companyEditForm.description}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, description: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Logo & banner */}
              <div>
                <label className="text-xs font-medium text-slate-600">Logo</label>

                <div className="mt-2 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {companyLogoPreview ? (
                      <img src={companyLogoPreview} alt="preview" className="w-24 h-24 object-cover rounded-md border border-slate-100" />
                    ) : (
                      <div className="w-24 h-24 rounded-md bg-slate-200 flex items-center justify-center text-sm text-slate-500">Sin logo</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-2">Sube un logo (PNG/JPG). Se guardará en el bucket público <code>images</code>.</p>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 rounded-md bg-white border border-slate-200 text-sm hover:bg-slate-50"
                      >
                        Seleccionar fichero
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          // Si ya hay una URL en el form, se puede eliminar/limpiar
                          setCompanyEditForm((p) => ({ ...p, logo_url: '' }));
                          setCompanyLogoPreview(null);
                        }}
                        className="px-3 py-2 rounded-md bg-red-50 text-red-700 border border-red-100 text-sm"
                      >
                        Eliminar
                      </button>

                      <div className="ml-auto text-xs text-slate-500">
                        {logoUploading ? 'Subiendo...' : 'No se sube hasta seleccionar'}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Después de subir el logo, pulsa <strong>Guardar cambios</strong> para persistir la URL en la base de datos.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Banner URL</label>
                <input
                  type="url"
                  value={companyEditForm.banner_url}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, banner_url: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://.../banner.jpg"
                />
              </div>

              {/* Basic contact */}
              <div>
                <label className="text-xs font-medium text-slate-600">Sitio web</label>
                <input
                  type="url"
                  value={companyEditForm.website}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, website: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://miempresa.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  value={companyEditForm.email}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, email: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Teléfono</label>
                <input
                  type="tel"
                  value={companyEditForm.phone}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, phone: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Dirección</label>
                <input
                  type="text"
                  value={companyEditForm.address}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, address: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Calle, Ciudad, País"
                />
              </div>

              {/* New contact/legal/metadata */}
              <div>
                <label className="text-xs font-medium text-slate-600">Nombre de contacto</label>
                <input
                  type="text"
                  value={companyEditForm.contact_name}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, contact_name: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre Apellido"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Identificador legal</label>
                <input
                  type="text"
                  value={companyEditForm.legal_identifier}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, legal_identifier: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="CUIT / NIF / CIF"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Username / handle</label>
                <input
                  type="text"
                  value={companyEditForm.username}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, username: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="mi-empresa"
                />
              </div>

              {/* Sector: ahora select usando companyTypes */}
              <div>
                <label className="text-xs font-medium text-slate-600">Sector</label>
                <select
                  value={companyEditForm.sector}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, sector: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Selecciona un sector --</option>
                  {companyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Usa este campo para que la empresa quede categorizada y pueda filtrarse.</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Keywords (separadas por coma)</label>
                <input
                  type="text"
                  value={companyEditForm.keywords_csv}
                  onChange={(e) => setCompanyEditForm({ ...companyEditForm, keywords_csv: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="comida, delivery, restaurante"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 justify-end">
              <button
                onClick={() => setEditingCompany(false)}
                className="px-3 py-2 rounded-md bg-red-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
              >
                Cancelar
              </button>

              <button
                onClick={saveCompanyEdits}
                disabled={companySaving}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${companySaving ? 'bg-blue-800' : 'bg-slate-900 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
              >
                {companySaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
