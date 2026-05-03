'use client'

import { useState, Suspense } from 'react'
import { signIn } from '@/lib/auth/auth.service'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

function LoginForm() {
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const result = await signIn(
      fd.get('email') as string,
      fd.get('password') as string,
    )
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💰</div>
          <h1 className="text-2xl font-bold text-slate-900">CasaFinance</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de despesas domésticas</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email" name="email" type="email"
              required autoComplete="email" placeholder="nome@exemplo.pt"
            />
            <FormField
              label="Password" name="password" type="password"
              required autoComplete="current-password" placeholder="••••••••"
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
