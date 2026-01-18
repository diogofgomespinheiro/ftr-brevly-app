import { DownloadSimpleIcon, SpinnerIcon } from '@phosphor-icons/react';
import { Button } from '@/components/common';

type LinksHeaderProps = {
  onExport: () => void;
  isExporting: boolean;
  hasLinks: boolean;
};

export function LinksHeader({
  onExport,
  isExporting,
  hasLinks,
}: LinksHeaderProps) {
  return (
    <div className="flex justify-between">
      <h2 className="text-lg text-gray-600">Meus links</h2>
      <Button
        color="secondary"
        size="icon"
        disabled={!hasLinks || isExporting}
        onClick={onExport}
      >
        {isExporting ? (
          <SpinnerIcon
            size={16}
            className="animate-spin text-gray-400"
            style={{ animationDuration: '1.8s' }}
          />
        ) : (
          <DownloadSimpleIcon className="text-gray-600" size={16} />
        )}
        <span>Baixar CSV</span>
      </Button>
    </div>
  );
}
