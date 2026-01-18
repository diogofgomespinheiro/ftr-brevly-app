import { WarningIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';

export function ErrorLinksSection() {
  const queryClient = useQueryClient();

  function handleRetry() {
    queryClient.invalidateQueries({ queryKey: ['links'] });
  }

  return (
    <div className="border-t border-gray-200 pb-6 pt-8 flex flex-col items-center justify-center gap-3">
      <WarningIcon size={32} className="text-danger" />
      <span className="text-xs text-gray-500 uppercase">
        Houve um erro a carregar os links, tente novamente{' '}
        <span
          className="font-semibold text-blue-base underline cursor-pointer"
          onClick={handleRetry}
        >
          aqui
        </span>
      </span>
    </div>
  );
}
