import {
  CopyIcon,
  DownloadSimpleIcon,
  SpinnerIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { exportLinks, fetchLinks, fetchLinksMock } from '@/api/links-api';

import { Button, Card } from '@/components/common';
import { EmptyLinksSection, LoadingSection } from '@/components/home';

const fetchLinksQueryOptions = queryOptions({
  queryKey: ['links'],
  queryFn: () => fetchLinksMock(10000),
});

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const { data, isLoading } = useQuery(fetchLinksQueryOptions);
  const exportLinksMutation = useMutation({
    mutationFn: () => exportLinks(),
  });

  const isSuccess = data?.success;
  const hasAvailableLinks =
    !isLoading && isSuccess && data.result.links.length > 0;
  const isEmpty = !isLoading && isSuccess && data.result.links.length == 0;

  function formatUrl(url: string, maxLength = 35): string {
    const formattedUrl = url.replace('http://', '').replace('https://', '');
    if (formattedUrl.length <= maxLength) return formattedUrl;
    return `${formattedUrl.slice(0, maxLength)}...`;
  }

  async function generateCsv() {
    if (!hasAvailableLinks) return;
    const result = await exportLinksMutation.mutateAsync();

    if (!result.success) return;
    window.open(result.result.report_url, '_blank');
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-245 sm:gap-8 py-8 sm:py-22">
      <div className="flex justify-center sm:justify-start">
        <img src="/logo.svg" alt="Brev.ly logo" height={24} width={97} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
        <Card className="flex-1 sm:max-w-96 h-fit">
          <div className="flex flex-col gap-5 sm:gap-6">
            <h2 className="text-lg text-gray-600">Novo Link</h2>
            <div></div>
            <Button className="w-full" disabled>
              Salvar link
            </Button>
          </div>
        </Card>
        <Card className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 overflow-hidden">
              <div
                className="h-full w-1/3 bg-blue-base"
                style={{
                  animation: 'slide 1.5s ease-in-out infinite',
                }}
              />
            </div>
          )}
          <div>
            <div className="flex justify-between">
              <h2 className="text-lg text-gray-600">Meus links</h2>
              <Button
                color="secondary"
                size="icon"
                disabled={!hasAvailableLinks || exportLinksMutation.isPending}
                onClick={generateCsv}
              >
                {exportLinksMutation.isPending && (
                  <SpinnerIcon
                    size={16}
                    className="animate-spin text-gray-400"
                    style={{ animationDuration: '1.8s' }}
                  />
                )}
                {!exportLinksMutation.isPending && (
                  <DownloadSimpleIcon className="text-gray-600" size={16} />
                )}
                <span>Baixar CSV</span>
              </Button>
            </div>
            <div className="flex flex-col pt-3 sm:pt-4 gap-3 sm:gap-4">
              {isLoading && <LoadingSection />}
              {isEmpty && <EmptyLinksSection />}
              {hasAvailableLinks &&
                data.result.links.map(link => (
                  <div
                    key={link.id}
                    className="flex justify-between pt-3 sm:pt-4 border-t border-gray-200"
                  >
                    <div className="flex flex-col gap-1">
                      <div
                        className="text-base text-blue-base cursor-pointer"
                        onClick={() =>
                          window.open(`/${link.short_code}`, '_blank')
                        }
                        title={`${window.location.origin}/${link.short_code}`}
                      >
                        brev.ly/{link.short_code}
                      </div>
                      <div
                        className="text-sm text-gray-500"
                        title={link.original_url}
                      >
                        {formatUrl(link.original_url)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="text-sm text-gray-500">
                        {link.access_count} acessos
                      </div>
                      <div className="flex gap-1">
                        <Button
                          color="secondary"
                          size="icon"
                          title="Copiar link"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${window.location.origin}/${link.short_code}`
                            )
                          }
                        >
                          <CopyIcon className="text-gray-600" size={16} />
                        </Button>
                        <Button color="secondary" size="icon">
                          <TrashIcon className="text-gray-600" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
