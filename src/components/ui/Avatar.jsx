import { cn, getInitials, avatarColor } from '@/lib/utils';

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export default function Avatar({ name, size = 'md', className }) {
  const initials = getInitials(name);
  const colorClass = avatarColor(name);
  const sizeClass = sizeMap[size] ?? sizeMap.md;

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none',
        sizeClass,
        colorClass,
        className
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
