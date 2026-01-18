import { LinkIcon } from '@phosphor-icons/react';

export function EmptyLinksSection() {
  return (
    <div className="border-t border-gray-200 pb-6 pt-8 flex flex-col items-center justify-center gap-3">
      <LinkIcon size={32} className="text-gray-400" />
      <span className="text-xs text-gray-500 uppercase">
        Ainda não existem links cadastrados
      </span>
    </div>
  );
}
