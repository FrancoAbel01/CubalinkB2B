// src/components/AlertContainer.tsx
import React from 'react';
import Alert, { AlertVariant } from '../Alert';


export default function AlertContainer({ alertState, onClose }: { alertState: { variant: AlertVariant; title?: React.ReactNode; message?: React.ReactNode; show: boolean }; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm z-50">
      <Alert variant={alertState.variant} title={alertState.title} message={alertState.message} show={alertState.show} dismissible onClose={onClose} />
    </div>
  );
}
