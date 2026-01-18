import { WarningIcon } from '@phosphor-icons/react';
import { type ComponentProps, useState } from 'react';
import { tv, type VariantProps } from 'tailwind-variants/lite';

const wrapperVariants = tv({
  base: 'flex items-center rounded-lg border bg-gray-100 transition-colors',
  variants: {
    state: {
      default: 'border-gray-300',
      focused: 'border-blue-base',
      error: 'border-danger',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

const labelVariants = tv({
  base: 'text-xs uppercase tracking-wide transition-colors',
  variants: {
    state: {
      default: 'text-gray-500',
      focused: 'text-blue-base font-semibold',
      error: 'text-danger font-semibold',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

type InputProps = ComponentProps<'input'> &
  VariantProps<typeof wrapperVariants> & {
    label?: string;
    error?: string;
    mask?: string;
  };

export function Input({
  label,
  error,
  mask,
  className,
  id,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const showError = !!error;

  function getState() {
    if (showError) return 'error';
    if (isFocused) return 'focused';
    return 'default';
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className={labelVariants({ state: getState() })}
        >
          {label}
        </label>
      )}
      <div className={wrapperVariants({ state: getState() })}>
        {mask && (
          <span className="pl-4 text-base font-normal text-gray-400 select-none">
            {mask}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full p-4 bg-transparent rounded-lg
            text-base font-normal text-gray-600 placeholder:text-gray-400
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${mask ? 'pl-0' : ''}
            ${className || ''}
          `}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </div>
      {error && (
        <div className="flex gap-2 items-center justify-start">
          <WarningIcon size={16} className="text-danger" />
          <span className="text-sm text-gray-500">{error}</span>
        </div>
      )}
    </div>
  );
}
