import NavButton from '../components/nav-button'

export const dynamic = 'force-dynamic'

export default function SecondPage() {
  return (
    <div>
      <h1 id="second-title">Second Page</h1>
      <p>Use navigation to move between pages for cache checks.</p>
      <div>
        <NavButton to="/" label="Back to home" id="to-home" />
      </div>
      <div>
        <NavButton
          to="/?q=test"
          label="Back to search results"
          id="to-search-results"
        />
      </div>
    </div>
  )
}
