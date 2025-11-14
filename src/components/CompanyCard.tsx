// // src/components/CompanyCard.tsx
// import React from 'react';
// import { Building2, User, ShoppingBag, Check, Mail, Phone, Globe, MapPin } from 'lucide-react';
// import { Company, Product, Service } from '../lib/supabase';

// interface CompanyCardProps {
//   company: Company;
//   products: Product[];
//   services: Service[];
//   onSelectCompany: (company: Company) => void;
//   showFollow?: boolean;
//   followed?: boolean;
// }

// export default function CompanyCard({
//   company,
//   products,
//   services,
//   onSelectCompany,
//   showFollow = true,
//   followed = false,
// }: CompanyCardProps) {
//   const initials = (name?: string) =>
//     !name ? '--' : name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

//   const hostname = company.website
//     ? (() => {
//         try {
//           return new URL(company.website!).hostname.replace('www.', '');
//         } catch {
//           return null;
//         }
//       })()
//     : null;

//   return (
//     <article
//       onClick={() => onSelectCompany(company)}
//       role="button"
//       className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.01] transform transition-transform duration-300 cursor-pointer"
//       aria-label={`Ver detalles de ${company.name ?? 'empresa'}`}
//     >
//       {/* Banner (imagen fondo) */}
//       <div className="relative h-64 w-full bg-slate-800">
//         {company.logo_url ? (
//           <img
//             src={company.logo_url}
//             alt={company.name ?? 'logo'}
//             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//             loading="lazy"
//           />
//         ) : (
//           <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600">
//             <Building2 className="w-20 h-20 text-slate-300" />
//           </div>
//         )}

//         {/* Degradado oscuro para contraste del texto (seguimos mostrando por si hay texto encima) */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

//         {company.sector && (
//           <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white border border-white/6">
//             {company.sector}
//           </div>
//         )}
//       </div>

//       {/* Floating info panel */}
//       <div className="relative -mt-10 px-5 pb-6">
//         {/* ---------- NOTA: fondo sólido y texto oscuro para garantizar visibilidad ---------- */}
//         <div className="relative bg-white text-slate-900 rounded-2xl p-5 shadow-xl overflow-visible">
//           {/* soft inner glow (no cubre el contenido) */}
//           <div className="absolute -inset-1 pointer-events-none rounded-2xl border border-black/5" />

//           <div className="flex items-start gap-4">
//             {/* Avatar / small */}
//             <div className="flex-shrink-0 -mt-8">
//               {company.logo_url ? (
//                 <img
//                   src={company.logo_url}
//                   alt={company.name ?? 'logo small'}
//                   className="w-20 h-20 rounded-lg object-cover ring-1 ring-black/10 shadow-md"
//                 />
//               ) : (
//                 <div className="w-20 h-20 rounded-lg bg-slate-700 flex items-center justify-center text-white text-lg font-semibold ring-1 ring-black/10 shadow-md">
//                   {initials(company.name)}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg sm:text-xl font-semibold leading-tight break-words max-w-full">
//                   {company.name ?? 'Nombre no disponible'}
//                 </h3>

//                 {(company as any).verified && (
//                   <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full">
//                     <Check className="w-4 h-4 text-sky-600" />
//                   </span>
//                 )}
//               </div>

//               {company.username && (
//                 <div className="text-xs text-slate-600 mt-0.5 break-words">{`@${company.username}`}</div>
//               )}

//               {/* Mostrar descripción completa o texto por defecto */}
//               <p className="mt-3 text-sm whitespace-normal break-words max-w-full text-slate-700">
//                 {company.description ?? 'Descripción no disponible.'}
//               </p>

//               {/*
//                 Cambié la estructura para que el teléfono quede debajo del correo.
//                 Uso una grid con 1 columna en móvil y 2 columnas en pantallas >= sm.
//                 El email y el teléfono están agrupados en una columna (flex-col) para asegurar
//                 que el teléfono aparezca siempre debajo del correo.
//               */}
//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
//                 <div className="flex flex-col gap-2">
//                   {company.email ? (
//                     <div className="flex items-center gap-2">
//                       <Mail className="w-4 h-4 text-slate-500" />
//                       <a
//                         href={`mailto:${company.email}`}
//                         onClick={(e) => e.stopPropagation()}
//                         className="break-words max-w-full whitespace-normal hover:underline"
//                       >
//                         {company.email}
//                       </a>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2 text-slate-400">
//                       <Mail className="w-4 h-4 text-slate-400" />
//                       <span>No email</span>
//                     </div>
//                   )}

//                   {company.phone ? (
//                     <div className="flex items-center gap-2 text-black">
                     
//                       <a href={`tel:${company.phone}`} onClick={(e) => e.stopPropagation()} className="break-words">
//                         {company.phone}
//                       </a>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2 text-slate-400">
                     
//                       <span>No phone</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* espacio vacío para mantener 2 columnas en sm, si se quiere usar para otro dato se puede reemplazar */}
//                 <div />

//                 {hostname ? (
//                   <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
//                     <Globe className="w-4 h-4 text-slate-500" />
//                     <a
//                       href={company.website ?? undefined}
//                       target="_blank"
//                       rel="noreferrer"
//                       onClick={(e) => e.stopPropagation()}
//                       className="break-words max-w-full whitespace-normal hover:underline"
//                     >
//                       {hostname}
//                     </a>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 col-span-1 sm:col-span-2 text-slate-400">
//                     <Globe className="w-4 h-4 text-slate-400" />
//                     <span>No website</span>
//                   </div>
//                 )}

//                 {company.address ? (
//                   <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
//                     <MapPin className="w-4 h-4 text-slate-500" />
//                     <span className="break-words whitespace-normal max-w-full">{company.address}</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 col-span-1 sm:col-span-2 text-slate-400">
//                     <MapPin className="w-4 h-4 text-slate-400" />
//                     <span>No address</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }
// src/components/CompanyCardMinimal.tsx
import React from 'react';
import { Mail, Phone, Globe, Check } from 'lucide-react';
import type { Company, Product, Service } from '../lib/supabase';

function initials(name?: string) {
  if (!name) return '--';
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function hostnameFrom(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return null;
  }
}

type CardProps = {
  company: Company;
  products?: Product[];
  services?: Service[];
  onSelectCompany: (company: Company) => void;
};

export default function CompanyCard({ company, onSelectCompany }: CardProps) {
  const host = hostnameFrom(company.website);

  return (
    <article
      role="button"
      onClick={() => onSelectCompany(company)}
      className="w-full bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer p-4 flex gap-4 items-start"
      aria-label={`Ver detalles de ${company.name ?? 'empresa'}`}
    >
      <div className="flex-shrink-0">
        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.name ?? 'logo'}
            className="w-12 h-12 rounded-lg object-cover"
            loading="lazy"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-semibold">
            {initials(company.name)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{company.name ?? 'Sin nombre'}</h3>
          {(company as any).verified && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-slate-50 rounded-full" title="Verificado">
              <Check className="w-3 h-3 text-sky-500" />
            </span>
          )}
          {company.sector && (
            <span className="ml-auto text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
              {company.sector}
            </span>
          )}
        </div>

        {company.username && (
          <div className="text-xs text-slate-400 truncate">@{company.username}</div>
        )}

        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{company.description ?? 'Descripción no disponible.'}</p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500 items-center">
          <div className="flex items-center gap-2 truncate col-span-3 sm:col-span-1">
            <Mail className="w-3.5 h-3.5" />
            {company.email ? (
              <a href={`mailto:${company.email}`} onClick={(e) => e.stopPropagation()} className="truncate hover:underline">
                {company.email}
              </a>
            ) : (
              <span className="truncate text-slate-300">—</span>
            )}
          </div>

          <div className="flex items-center gap-2 truncate col-span-3 sm:col-span-1">
            <Phone className="w-3.5 h-3.5" />
            {company.phone ? (
              <a href={`tel:${company.phone}`} onClick={(e) => e.stopPropagation()} className="truncate">
                {company.phone}
              </a>
            ) : (
              <span className="truncate text-slate-300">—</span>
            )}
          </div>

          <div className="flex items-center gap-2 truncate col-span-3 sm:col-span-1">
            <Globe className="w-3.5 h-3.5" />
            {host ? (
              <a
                href={company.website ?? undefined}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="truncate hover:underline"
              >
                {host}
              </a>
            ) : (
              <span className="truncate text-slate-300">—</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
