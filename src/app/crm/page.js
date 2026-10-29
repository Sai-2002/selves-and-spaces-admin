import { Leaf } from 'lucide-react';

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto">
          <Leaf className="w-8 h-8 text-forest" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-ink">Therapist Portal</h1>
        <p className="text-brown/60 text-sm max-w-xs mx-auto">
          The therapist dashboard is coming soon. Check back later.
        </p>
      </div>
    </div>
  );
}
