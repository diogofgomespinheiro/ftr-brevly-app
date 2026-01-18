import { tv, type VariantProps } from 'tailwind-variants/lite';

const cardVariants = tv({
  base: 'bg-white rounded-lg',
  variants: {
    size: {
      default: 'p-6 sm:p-8',
      large: 'px-5 py-12 sm:px-12 sm:py-16',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type Props = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof cardVariants>;

export const Card = ({ children, className, size }: Props) => {
  return <div className={cardVariants({ size, className })}>{children}</div>;
};
