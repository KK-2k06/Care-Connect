import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignupPage(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e){
    e.preventDefault()
    // Client-side basic check; backend will validate again
    if(form.password !== form.confirmPassword){
      alert('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if(!res.ok){
        const msg = data?.error || data?.errors?.[0]?.msg || 'Signup failed'
        setError(msg)
      }else{
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      }
    }catch(err){
      setError('Network error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md px-4 py-8">
        <section className="rounded-2xl bg-white dark:bg-neutral-800 shadow-lg p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Create an account</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-medium px-4 py-2.5 transition shadow"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <p className="mt-6 text-sm text-gray-700 dark:text-gray-300 text-center">
            Already have an account?{' '}
            <Link to="/login" className="underline text-indigo-600 hover:text-indigo-700">Log in</Link>
          </p>
        </section>
      </div>
    </div>
  )
}


