import { Suspense } from 'react'
import SearchBar from './components/search-bar'

async function fetchData(
  query: string
): Promise<{ timestamp: number; query: string }> {
  if (!query) {
    return { timestamp: Date.now(), query: '' }
  }

  console.log('fetchData called with query:', query)

  // Match the user's app - fetch with revalidate (no Date.now() in URL)
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`,
    { next: { revalidate: 300 } }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch')
  }

  await res.json()
  return { timestamp: Date.now(), query }
}

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q ?? ''
  const data = await fetchData(query)

  return (
    <div>
      <h1 id="home-title">Home</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchBar />
      </Suspense>
      {query && (
        <div>
          <p id="search-query">Query: {query}</p>
          <p id="search-timestamp">Timestamp: {data.timestamp}</p>
        </div>
      )}
    </div>
  )
}
