import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useRef } from 'react';
import {
  fetchLinkByShortCode,
  incrementLinkAccessCount,
} from '@/api/links-api';
import { Card, NotFoundComponent } from '@/components/common';

const fetchLinkByShortCodeOptions = (shortCode: string) =>
  queryOptions({
    queryKey: [`${shortCode}-link`],
    queryFn: () => fetchLinkByShortCode(shortCode),
  });

export const Route = createFileRoute('/$shortCode')({
  component: RouteComponent,
  errorComponent: NotFoundComponent,
  loader: async ({ context: { queryClient }, params: { shortCode } }) => {
    await queryClient.ensureQueryData(fetchLinkByShortCodeOptions(shortCode));
  },
});

function RouteComponent() {
  const hasRedirected = useRef(false);
  const shortCode = Route.useParams({ select: data => data.shortCode });
  const { data } = useSuspenseQuery(fetchLinkByShortCodeOptions(shortCode));
  const isSuccess = data.success;

  const redirect = useEffectEvent(() => {
    if (!isSuccess || !data.result?.link?.original_url || hasRedirected.current)
      return;
    hasRedirected.current = true;

    incrementLinkAccessCount(shortCode).then(res => {
      if (!res.success) {
        hasRedirected.current = false;
        return;
      }

      window.location.href = data.result.link.original_url;
    });
  });

  useEffect(() => {
    if (hasRedirected.current || !isSuccess) return;
    redirect();
  }, [isSuccess]);

  if (!isSuccess) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex items-center max-w-145">
      <Card size="large">
        <div className="flex flex-col items-center gap-6">
          <img src="/logo_icon.svg" alt="Brev.ly Logo" height={48} width={48} />
          <h1 className="text-xl text-gray-600">Redirecionando...</h1>
          <div className="flex flex-col gap-1 text-base text-gray-500 text-center">
            <p>O link será aberto automaticamente em alguns instantes.</p>
            <p>
              Não foi redirecionado?{' '}
              <span
                onClick={redirect}
                className="text-blue-base underline cursor-pointer"
              >
                Acesse aqui
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
