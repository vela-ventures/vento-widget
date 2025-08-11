/** @type {import('tailwindcss').Config} */
export default {
  // Include all Tailwind classes for component library users
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Only the classes actually used in our components
    'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full', 'leading-none',
    'bg-primary', 'text-primary-foreground',
    'bg-background', 'text-foreground',
    'border-border', 'border-input',
    'shadow-lg', 'shadow-xl', 'shadow-2xl',
    'hover:scale-105', 'hover:shadow-xl',
    'active:scale-95',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2',
    'disabled:opacity-50', 'disabled:cursor-not-allowed',
    'transition-all', 'duration-200', 'duration-300',
    'fixed', 'z-50', 'z-40',
    'bottom-6', 'right-6',
    'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
    'h-12', 'w-12', 'h-10', 'w-full', 'h-9', 'w-9',
    'flex', 'items-center', 'justify-center',
    'p-6', 'p-4', 'px-3', 'py-2', 'px-4', 'pt-0', 'pb-4',
    'space-y-6', 'space-y-4', 'space-y-2', 'space-x-2',
    'text-lg', 'text-xl', 'text-2xl', 'text-sm', 'font-semibold', 'font-medium',
    'text-muted-foreground',
    'max-w-lg', 'max-h-[85vh]', 'overflow-hidden', 'w-[380px]',
    'inset-0', 'bg-black/80', 'bg-black/60', 'backdrop-blur-sm',
    'absolute', 'right-4', 'top-4',
    'rounded-sm', 'opacity-70', 'hover:opacity-100',
    'transition-opacity',
    'disabled:pointer-events-none',
    'data-[state=open]:bg-accent', 'data-[state=open]:text-muted-foreground',
    'ring-offset-background',
  ],
  important: '.vento-widget', // Scope all utilities to this selector
  corePlugins: {
    preflight: false, // Disable global resets to prevent host app conflicts
  },
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};