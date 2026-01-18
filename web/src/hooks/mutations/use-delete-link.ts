import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLink } from '@/api/links-api';

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortCode: string) => deleteLink(shortCode),
    onSuccess: result => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['links'] });
      }
    },
  });
}
