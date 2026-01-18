import { SpinnerIcon } from '@phosphor-icons/react';

export function LoadingSection() {
  return (
    <div className="border-t border-gray-200 pb-6 pt-8 flex flex-col items-center justify-center gap-3">
      <SpinnerIcon
        size={32}
        className="animate-spin text-gray-400"
        style={{ animationDuration: '1.8s' }}
      />
      <span className="text-xs text-gray-500 uppercase">
        Carregando links...
      </span>
    </div>
  );
}
