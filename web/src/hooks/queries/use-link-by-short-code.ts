import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchLinkByShortCode } from '@/api/links-api';

export const linkByShortCodeQueryOptions = (shortCode: string) =>
  queryOptions({
    queryKey: [`${shortCode}-link`],
    queryFn: () => fetchLinkByShortCode(shortCode),
  });

export function useLinkByShortCodeQuery(shortCode: string) {
  return useSuspenseQuery(linkByShortCodeQueryOptions(shortCode));
}
