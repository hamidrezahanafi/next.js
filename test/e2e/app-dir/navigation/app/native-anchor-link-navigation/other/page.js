import Link from 'next/link'

export default function OtherPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: '16px' }}>
      <p id="other-page-title">Other Page</p>
      <Link href="/native-anchor-link-navigation" id="link-back">
        Back to anchor test
      </Link>
      <Link
        href="/native-anchor-link-navigation#section-2"
        id="link-back-with-hash"
      >
        Back to anchor test with hash
      </Link>
    </div>
  )
}
