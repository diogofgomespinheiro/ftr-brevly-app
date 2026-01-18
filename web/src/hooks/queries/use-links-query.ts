import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchLinks } from '@/api/links-api';

export const linksQueryOptions = queryOptions({
  queryKey: ['links'],
  queryFn: () => fetchLinks(),
});

export function useLinksQuery() {
  return useQuery(linksQueryOptions);
}
