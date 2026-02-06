'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set('q', query.trim())
    }
    const url = `/?${params.toString()}`
    router.push(url)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          id="search-input"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for books..."
          className="w-full px-6 py-4 text-lg bg-zinc-900/50 border-2 border-amber-500/30 rounded-full text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
        />
        <button
          type="submit"
          id="search-button"
          disabled={isPending}
          className="absolute right-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-900 font-bold rounded-full hover:from-amber-400 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Searching
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  )
}
