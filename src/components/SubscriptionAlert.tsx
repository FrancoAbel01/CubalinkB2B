// src/components/SubscriptionAlert.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Company } from '../lib/supabase';

interface SubscriptionAlertProps {
  company: Company | null;
}

export function SubscriptionAlert({ company }: SubscriptionAlertProps) {
  if (!company) return null;

  const status = company.subscription_status;
  const adminEmail = 'admin@directorio.com';

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const daysUntil = (iso?: string) => {
    if (!iso) return null;
    const expiresAt = new Date(iso);
    const now = new Date();
    // calcular días completos, si ya pasó dará <= 0
    return Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Contenedor base (alto contraste, tipografía pequeña)
  const containerBase = 'w-full max-w-4xl mx-auto rounded-2xl p-4 mb-6 border shadow-sm';
  const textSmall = 'text-sm';

  if (status === 'pending') {
    return (
      <article
        role="status"
        aria-live="polite"
        className={`${containerBase} bg-yellow-50 border-yellow-200 text-yellow-900`}
      >
        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 flex-shrink-0 text-yellow-700" />
          <div>
            <h3 className="text-sm font-semibold mb-1">Suscripción pendiente</h3>
            <p className={`${textSmall} text-yellow-800`}>
              Tu empresa está registrada pero la suscripción está pendiente de aprobación. Contacta al
              administrador en{' '}
              <a className="underline font-medium" href={`mailto:${adminEmail}`}>
                {adminEmail}
              </a>{' '}
              para completar el pago y activar la cuenta.
            </p>
          </div>
        </div>
      </article>
    );
  }

  if (status === 'inactive') {
    return (
      <article
        role="status"
        aria-live="polite"
        className={`${containerBase} bg-red-50 border-red-200 text-red-900`}
      >
        <div className="flex items-start gap-3">
          <XCircle className="w-6 h-6 flex-shrink-0 text-red-700" />
          <div>
            <h3 className="text-sm font-semibold mb-1">Suscripción inactiva</h3>
            <p className={`${textSmall} text-red-800`}>
              Tu suscripción ha expirado. No podrás crear ni editar contenido hasta renovarla. Ponte en
              contacto con{' '}
              <a className="underline font-medium" href={`mailto:${adminEmail}`}>
                {adminEmail}
              </a>{' '}
              para reactivar tu cuenta.
            </p>
          </div>
        </div>
      </article>
    );
  }

  // status === 'active' o similar
  if (status === 'active' && company.subscription_expires_at) {
    const daysLeft = daysUntil(company.subscription_expires_at);

    // Próximo a vencerse (7 días o menos)
    if (daysLeft !== null && daysLeft <= 7) {
      return (
        <article
          role="status"
          aria-live="polite"
          className={`${containerBase} bg-orange-50 border-orange-200 text-orange-900`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-orange-700" />
            <div>
              <h3 className="text-sm font-semibold mb-1">Suscripción próxima a vencer</h3>
              <p className={`${textSmall} text-orange-800`}>
                Tu suscripción expira en <strong>{daysLeft} {daysLeft === 1 ? 'día' : 'días'}</strong> (
                {formatDate(company.subscription_expires_at)}). Contacta a{' '}
                <a className="underline font-medium" href={`mailto:${adminEmail}`}>
                  {adminEmail}
                </a>{' '}
                para renovarla.
              </p>
            </div>
          </div>
        </article>
      );
    }

    // Suscripción activa con suficiente tiempo
    return (
      <article
        role="status"
        aria-live="polite"
        className={`${containerBase} bg-green-50 border-green-200 text-green-900`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-700" />
          <div>
            <h3 className="text-sm font-semibold mb-1">Suscripción activa</h3>
            <p className={`${textSmall} text-green-800`}>
              Tu suscripción está activa hasta <strong>{formatDate(company.subscription_expires_at)}</strong>.
            </p>
          </div>
        </div>
      </article>
    );
  }

  return null;
}
