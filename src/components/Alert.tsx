import React, { useEffect, useState } from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  message?: React.ReactNode;
  /** If provided, component becomes controlled by this prop. */
  show?: boolean;
  /** If true, shows a close button and allows dismissing. */
  dismissible?: boolean;
  onClose?: () => void;
  /** Extra actions (buttons, links) to render on the right side */
  actions?: React.ReactNode;
  className?: string;
}

const ICONS: Record<AlertVariant, React.ReactNode> = {
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 12h1v4h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  danger: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const VARIANT_STYLES: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  danger: "bg-red-50 border-red-200 text-red-800",
};

/**
 * Reusable Alert component built with Tailwind only (no framer-motion).
 * - Accessible (role=alert, aria-live)
 * - Controlled or uncontrolled (show prop optional)
 * - Dismissible with a small tailwind-powered transition
 * - Action slot for buttons
 */
export default function Alert({
  variant = "info",
  title,
  message,
  show: controlledShow,
  dismissible = false,
  onClose,
  actions,
  className = "",
}: AlertProps) {
  const [internalShow, setInternalShow] = useState(true);
  const [closing, setClosing] = useState(false);
  const isControlled = typeof controlledShow === "boolean";
  const visible = isControlled ? controlledShow! : internalShow;

  // If the parent toggles `show` from true -> false, start the closing animation.
  useEffect(() => {
    if (!visible) {
      setClosing(true);
      const t = setTimeout(() => setClosing(false), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  function handleClose() {
    // start CSS transition
    setClosing(true);
    // after transition, actually hide and notify
    setTimeout(() => {
      if (!isControlled) setInternalShow(false);
      setClosing(false);
      onClose?.();
    }, 200);
  }

  // keep in DOM while visible or animating out
  if (!visible && !closing) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`w-full border-l-4 rounded-lg p-4 flex items-start gap-3 ${VARIANT_STYLES[variant]} ${className} transition-all duration-200 transform ${
        closing ? "opacity-0 -translate-y-1 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">{ICONS[variant]}</div>

      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {message && <div className="mt-1 text-sm">{message}</div>}
      </div>

      {actions && <div className="ml-4 flex items-center gap-2">{actions}</div>}

      {dismissible && (
        <button
          onClick={handleClose}
          aria-label="Cerrar alerta"
          className="ml-3 -mr-1 p-1 rounded-md hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Demo file included in the same module so you can copy/paste or inspect usage quickly.
 */
export function AlertDemo() {
  const [showDanger, setShowDanger] = useState(true);

  return (
    <div className="space-y-4">
      <Alert
        variant="info"
        title="Información"
        message="Este es un mensaje informativo."
        dismissible
      />

      <Alert
        variant="success"
        title="Éxito"
        message={"La operación se completó correctamente."}
        actions={<button className="px-3 py-1 rounded bg-white/80 text-sm">Ver</button>}
      />

      <Alert
        variant="warning"
        title="Atención"
        message={"Hay cambios pendientes que debes revisar."}
        dismissible
      />

      <Alert
        variant="danger"
        title="Error"
        message={"Ocurrió un error al procesar la solicitud."}
        show={showDanger}
        dismissible
        onClose={() => setShowDanger(false)}
      />
    </div>
  );
}
