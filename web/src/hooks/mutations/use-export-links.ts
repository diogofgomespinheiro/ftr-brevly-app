import { useMutation } from '@tanstack/react-query';
import { exportLinks } from '@/api/links-api';

export function useExportLinksMutation() {
  return useMutation({
    mutationFn: () => exportLinks(),
  });
}
