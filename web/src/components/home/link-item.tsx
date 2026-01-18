import { CopyIcon, SpinnerIcon, TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/common';
import type { Link } from '@/types';
import { buildShortUrl, copyToClipboard, formatUrl } from '@/utils';

type LinkItemProps = {
  link: Link;
  onCopy?: (success: boolean) => void;
  onDelete?: (shortCode: string) => void;
  isDeleting?: boolean;
};

export function LinkItem({
  link,
  onCopy,
  onDelete,
  isDeleting,
}: LinkItemProps) {
  const shortUrl = buildShortUrl(link.short_code);

  async function handleCopy() {
    const success = await copyToClipboard(shortUrl);
    onCopy?.(success);
  }

  function handleOpenLink() {
    window.open(`/${link.short_code}`, '_blank');
  }

  function handleDelete() {
    onDelete?.(link.short_code);
  }

  return (
    <div className="flex justify-between pt-3 sm:pt-4 border-t border-gray-200">
      <div className="flex flex-col gap-1">
        <div
          className="text-base text-blue-base cursor-pointer"
          onClick={handleOpenLink}
          title={shortUrl}
        >
          brev.ly/{link.short_code}
        </div>
        <div className="text-sm text-gray-500" title={link.original_url}>
          {formatUrl(link.original_url)}
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="text-sm text-gray-500">{link.access_count} acessos</div>
        <div className="flex gap-1">
          <Button
            color="secondary"
            size="icon"
            title="Copiar link"
            onClick={handleCopy}
          >
            <CopyIcon className="text-gray-600" size={16} />
          </Button>
          <Button
            color="secondary"
            size="icon"
            title="Apagar link"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <SpinnerIcon
                size={16}
                className="animate-spin text-gray-400"
                style={{ animationDuration: '1.8s' }}
              />
            ) : (
              <TrashIcon className="text-gray-600" size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
