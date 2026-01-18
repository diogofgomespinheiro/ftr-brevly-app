import type { Link } from '@/types';
import { EmptyLinksSection } from './empty-links-section';
import { ErrorLinksSection } from './error-links-section';
import { LinkItem } from './link-item';
import { LoadingSection } from './loading-section';

type LinksListProps = {
  links: Link[];
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  onCopyLink?: (success: boolean) => void;
  onDeleteLink?: (shortCode: string) => void;
  deletingShortCodes: string[];
};

export function LinksList({
  links,
  isLoading,
  isEmpty,
  isError,
  onCopyLink,
  onDeleteLink,
  deletingShortCodes,
}: LinksListProps) {
  if (isLoading) {
    return <LoadingSection />;
  }

  if (isEmpty) {
    return <EmptyLinksSection />;
  }

  if (isError) {
    return <ErrorLinksSection />;
  }

  return (
    <>
      {links.map(link => (
        <LinkItem
          key={link.id}
          link={link}
          onCopy={onCopyLink}
          onDelete={onDeleteLink}
          isDeleting={deletingShortCodes.includes(link.short_code)}
        />
      ))}
    </>
  );
}
