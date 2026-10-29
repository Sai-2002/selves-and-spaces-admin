import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 w-4 h-4 text-brown/50 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-9 pr-4 py-2 text-sm bg-white/70 border border-tan/60 rounded-lg',
          'text-ink placeholder:text-brown/40',
          'focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage',
          'transition-all duration-150'
        )}
      />
    </div>
  );
}
