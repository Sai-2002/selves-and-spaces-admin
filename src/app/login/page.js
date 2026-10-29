'use client';

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { login } from '@/lib/auth';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #2B4A3A 0%, #4A7C59 50%, #7B9E87 100%)',
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-cream/30"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cream/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-cream" />
            </div>
            <span className="text-cream font-serif text-lg font-semibold">Selves &amp; Spaces</span>
          </div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-5xl text-cream leading-tight mb-6">
              Healing begins<br />with presence.
            </h2>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              A calm, compassionate space for managing your therapy clinic — clients, orders, and wellness products all in one place.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-6">
          {[
            { value: '24', label: 'Active Clients' },
            { value: '12', label: 'Products' },
            { value: '98%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-cream font-serif text-2xl font-semibold">{stat.value}</p>
              <p className="text-cream/50 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-cream" />
            </div>
            <span className="text-forest font-serif text-lg font-semibold">Selves &amp; Spaces</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-serif font-semibold text-ink mb-2">Welcome back</h1>
            <p className="text-brown/60 text-sm">Sign in to your admin portal</p>
          </div>

          <form action={action} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 text-sm bg-white border border-tan/60 rounded-lg text-ink placeholder:text-brown/40 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white border border-tan/60 rounded-lg text-ink placeholder:text-brown/40 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-all pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {state?.error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              >
                {state.error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              disabled={pending}
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
