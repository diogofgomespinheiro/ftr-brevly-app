import { SpinnerIcon } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button, Input } from '@/components/common';
import { useCreateLinkMutation } from '@/hooks';

const createLinkSchema = z.object({
  original_url: z.url('URL inválida').min(1, 'URL é obrigatória'),
  short_code: z
    .string('Código é obrigatório')
    .refine(
      val => !val || /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/.test(val),
      'Código deve conter apenas letras, números, hífen ou underscore'
    )
    .min(4, { error: 'Código deve conter no mínimo 4 caracteres' })
    .max(12, { error: 'Código deve conter no máximo 12 caracteres' }),
});

type FormErrors = {
  original_url?: string;
  short_code?: string;
};

export function CreateLinkForm() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const createLinkMutation = useCreateLinkMutation();

  function validateForm(): boolean {
    const result = createLinkSchema.safeParse({
      original_url: originalUrl,
      short_code: shortCode || undefined,
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await createLinkMutation.mutateAsync({
      original_url: originalUrl,
      short_code: shortCode,
    });

    if (result.success) {
      toast.success('Link criado com sucesso!');
      setOriginalUrl('');
      setShortCode('');
      setErrors({});
    } else {
      if (result?.error?.type === 'CONFLICT_ERROR') {
        setErrors({ short_code: 'Este código já está em uso' });
      } else {
        toast.error(result?.error?.message || 'Erro ao criar link');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Link original"
          placeholder="www.exemplo.com"
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          error={errors.original_url}
          disabled={createLinkMutation.isPending}
        />
        <Input
          label="Link encurtado"
          placeholder="meu-link"
          mask="brev.ly/"
          value={shortCode}
          onChange={e => setShortCode(e.target.value)}
          error={errors.short_code}
          disabled={createLinkMutation.isPending}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={createLinkMutation.isPending}
      >
        {createLinkMutation.isPending ? (
          <>
            <SpinnerIcon
              size={16}
              className="animate-spin"
              style={{ animationDuration: '1.8s' }}
            />
            <span>A criar...</span>
          </>
        ) : (
          'Salvar link'
        )}
      </Button>
    </form>
  );
}
