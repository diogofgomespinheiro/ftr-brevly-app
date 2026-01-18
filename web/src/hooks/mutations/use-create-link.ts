import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLink } from '@/api/links-api';
import type { CreateLinkDTO } from '@/types';

export function useCreateLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLinkDTO) => createLink(data),
    onSuccess: result => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['links'] });
      }
    },
  });
}
