import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage(){
  const [role, setRole] = useState('user')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Login form with sliding panes */}
          <section className="rounded-2xl bg-gray-50 dark:bg-neutral-800/60 shadow-lg p-8 md:p-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Login</h2>
              <div className="inline-flex rounded-lg bg-gray-200 dark:bg-neutral-700 p-1">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`px-3 py-1.5 text-sm rounded-md transition ${role === 'user' ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`ml-1 px-3 py-1.5 text-sm rounded-md transition ${role === 'admin' ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  Admin Login
                </button>
              </div>
            </div>

            {/* Sliding container to keep card height consistent */}
            <div className="mt-8 overflow-hidden">
              <div
                className="flex w-[200%] transition-transform duration-500 ease-in-out"
                style={{ transform: role === 'user' ? 'translateX(0%)' : 'translateX(-50%)' }}
              >
                {/* User form */}
                <form className="w-1/2 pr-4 space-y-5 min-h-[320px]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="agree" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="agree" className="text-sm text-gray-700 dark:text-gray-200">
                      agree to <Link to="/terms" className="underline text-indigo-600 hover:text-indigo-700">terms and conditions</Link>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 transition shadow"
                  >
                    Login as User
                  </button>
                </form>

                {/* Admin form (same height) */}
                <form className="w-1/2 pl-4 space-y-5 min-h-[320px]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Admin Email</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Admin Code</label>
                    <input
                      type="text"
                      placeholder="Enter admin code"
                      className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 transition shadow"
                  >
                    Login as Admin
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Right: Project description */}
          <section className="rounded-2xl bg-white dark:bg-neutral-800 shadow-lg p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Smart India Hackathon Project
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              Building an intelligent platform that simplifies access to resources, enables seamless bookings,
              and offers conversational AI assistance. Our solution focuses on accessibility, speed, and a
              delightful user experience.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-200">
              <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /> AI-powered assistance</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" /> Easy booking workflows</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-rose-500" /> Curated learning resources</li>
            </ul>
          </section>

          
        </div>
      </div>
    </div>
  )
}


