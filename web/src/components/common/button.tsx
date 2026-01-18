import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants/lite';

const buttonVariants = tv({
  base: [
    'flex gap-1.5 items-center justify-center text-base',
    'cursor-pointer select-none',
    'transition-colors duration-150 ease-out',
    'hover:brightness-95',
    'active:brightness-90',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    'aria-disabled:opacity-50 aria-disabled:pointer-events-none',
  ],

  variants: {
    color: {
      primary: 'text-white bg-blue-base focus-visible:ring-blue-base',
      secondary: 'text-gray-500 bg-gray-200 focus-visible:ring-gray-400',
    },
    size: {
      default: 'py-4 px-8 rounded-lg',
      icon: 'p-2 rounded-sm',
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'default',
  },
});

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  color,
  size,
  className,
  asChild,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={buttonVariants({ color, size, className })}
      {...props}
    />
  );
}
