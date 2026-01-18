import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

import { Card } from '@/components/common';
import { CreateLinkForm, LinksHeader, LinksList } from '@/components/home';
import {
  useDeleteLinkMutation,
  useExportLinksMutation,
  useLinksQuery,
} from '@/hooks';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const [deletingShortCodes, setDeletingShortCodes] = useState<string[] | []>(
    []
  );

  const { data, isLoading } = useLinksQuery();
  const exportLinksMutation = useExportLinksMutation();
  const deleteLinkMutation = useDeleteLinkMutation();

  const isSuccess = data?.success === true;
  const links = isSuccess ? data.result.links : [];
  const hasAvailableLinks = !isLoading && isSuccess && links.length > 0;
  const isEmpty = !isLoading && isSuccess && links.length === 0;
  const isError = !isLoading && !isSuccess;

  async function handleExport() {
    if (!hasAvailableLinks) return;
    const result = await exportLinksMutation.mutateAsync();

    if (!result.success) {
      toast.error('Erro ao exportar links');
      return;
    }
    window.open(result.result.report_url, '_blank');
  }

  function handleCopyLink(success: boolean) {
    if (success) {
      toast.success('Link copiado!');
    } else {
      toast.error('Erro ao copiar link');
    }
  }

  async function handleDeleteLink(shortCode: string) {
    setDeletingShortCodes(prevState => {
      return [...prevState, shortCode];
    });
    const result = await deleteLinkMutation.mutateAsync(shortCode);
    setDeletingShortCodes(prevState => {
      return prevState.filter(item => item !== shortCode);
    });

    if (result.success) {
      toast.success('Link apagado!');
    } else {
      toast.error('Erro ao apagar link');
    }
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
            <CreateLinkForm />
          </div>
        </Card>
        <Card className="flex-1 relative overflow-hidden h-fit">
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
            <LinksHeader
              onExport={handleExport}
              isExporting={exportLinksMutation.isPending}
              hasLinks={hasAvailableLinks}
            />
            <div className="flex flex-col pt-3 sm:pt-4 gap-3 sm:gap-4">
              <LinksList
                links={links}
                isLoading={isLoading}
                isEmpty={isEmpty}
                isError={isError}
                onCopyLink={handleCopyLink}
                onDeleteLink={handleDeleteLink}
                deletingShortCodes={deletingShortCodes}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
