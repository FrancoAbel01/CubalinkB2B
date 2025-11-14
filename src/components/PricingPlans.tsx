// src/components/PricingPlansMinimal.tsx
// React + TypeScript + TailwindCSS — versión con botón WhatsApp reemplazado por icono

import React, { useMemo, useState } from "react";
import { CheckCircle, CreditCard, Wifi, X, MessageCircle } from "lucide-react";

export type Plan = {
  id: string;
  name: string;
  price: number;
  subtitle?: string;
  features?: string[];
  badge?: string;
};

export type PricingPlansProps = {
  whatsappNumber?: string;
  currency?: string;
  locale?: string;
  plans?: Plan[];
  onStripeCheckout?: (plan: Plan) => void;
  onCryptoCheckout?: (plan: Plan) => void;
};

const DEFAULT_PLANS: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    price: 10,
    subtitle: "Freelancers",
    features: ["Funciones básicas", "Soporte por email", "1 usuario"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 18,
    subtitle: "Equipos pequeños",
    features: ["Todo en Pro", "Soporte prioritario", "5 usuarios"],
    badge: "Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 45,
    subtitle: "Empresas",
    features: ["Funciones avanzadas", "SLA empresarial", "Cuenta dedicada"],
  },
];

function formatPrice(amount: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <CheckCircle className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

export default function PricingPlansMinimal({
  whatsappNumber = "1234567890",
  currency = "USD",
  locale = "en-US",
  plans = DEFAULT_PLANS,
  onStripeCheckout,
  onCryptoCheckout,
}: PricingPlansProps) {
  const [activeId, setActiveId] = useState<string>(plans[1]?.id ?? plans[0].id);
  const [modal, setModal] = useState<null | { type: "stripe" | "crypto"; plan: Plan }>(null);

  const selectedPlan = useMemo(() => plans.find((p) => p.id === activeId) ?? plans[0], [plans, activeId]);

  const handleStripe = (plan: Plan) => {
    if (onStripeCheckout) return onStripeCheckout(plan);
    setModal({ type: "stripe", plan });
  };

  const handleCrypto = (plan: Plan) => {
    if (onCryptoCheckout) return onCryptoCheckout(plan);
    setModal({ type: "crypto", plan });
  };

  const handleWhatsApp = (plan: Plan) => {
    const clean = whatsappNumber.replace(/\D+/g, "");
    const msg = `Hola, quiero más información sobre el plan ${plan.name} (${currency} ${plan.price}/mes).`;
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Planes y precios</h2>
        <p className="mt-2 text-sm text-slate-600">
          Escoge el plan que mejor se adapte a tu proyecto.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => {
          const active = activeId === plan.id;
          return (
            <article
              key={plan.id}
              onClick={() => setActiveId(plan.id)}
              className={`relative flex flex-col gap-4 p-6 rounded-2xl border cursor-pointer transition-all
                ${active ? "ring-2 ring-sky-400/40 shadow-lg scale-[1.03]" : "hover:shadow-md"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{plan.name}</h3>
                  {plan.subtitle && <p className="text-xs text-slate-500">{plan.subtitle}</p>}
                </div>
                {plan.badge && <Badge label={plan.badge} />}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(plan.price, currency, locale)}
                </span>
                <span className="text-xs text-slate-600">/ mes</span>
              </div>

              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {(plan.features ?? []).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStripe(plan);
                    }}
                    className="px-3 py-2 rounded-md bg-sky-100 text-sky-700 text-sm flex items-center gap-1"
                  >
                    <CreditCard className="w-4 h-4" />
                    Tarjeta
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCrypto(plan);
                    }}
                    className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm flex items-center gap-1"
                  >
                    <Wifi className="w-4 h-4" />
                    Crypto
                  </button>
                </div>

                {/* WHATSAPP SOLO ÍCONO */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsApp(plan);
                  }}
                  className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 shadow"
                  aria-label="Contactar por WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-lg max-w-md w-full z-10">
            <h3 className="text-lg font-semibold text-slate-900">
              {modal.type === "stripe" ? "Pago con Tarjeta" : "Pago con Cripto"}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Integración pendiente. Usa los callbacks para implementar tu flujo real.
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-md bg-slate-100 text-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
