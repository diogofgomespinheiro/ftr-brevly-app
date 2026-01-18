import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--color-gray-100)',
          border: '1px solid var(--color-gray-200)',
          color: 'var(--color-gray-600)',
        },
      }}
    />
  );
}
