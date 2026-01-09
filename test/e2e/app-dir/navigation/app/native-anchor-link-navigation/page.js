import Link from 'next/link'

export default function NativeAnchorLinkPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: '16px' }}>
      <p id="page-title">Native Anchor Link Navigation Test</p>

      {/* Navigation using native anchor tags (not Next.js Link) */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'white',
          padding: '10px',
          zIndex: 100,
        }}
      >
        <a
          href="#section-1"
          id="link-to-section-1"
          style={{ marginRight: '10px' }}
        >
          Section 1
        </a>
        <a
          href="#section-2"
          id="link-to-section-2"
          style={{ marginRight: '10px' }}
        >
          Section 2
        </a>
        <a
          href="#section-3"
          id="link-to-section-3"
          style={{ marginRight: '10px' }}
        >
          Section 3
        </a>
        <Link href="/native-anchor-link-navigation/other" id="link-to-other">
          Other Page
        </Link>
      </nav>

      <div style={{ marginTop: '60px' }}>
        {/* Spacer to make scrolling observable */}
        <div style={{ height: '500px', background: '#f0f0f0' }}>
          Scroll spacer
        </div>

        <section
          id="section-1"
          style={{ height: '500px', background: '#e0f0e0', padding: '20px' }}
        >
          <h2>Section 1</h2>
          <p id="section-1-content">This is section 1 content</p>
        </section>

        <div style={{ height: '500px', background: '#f0f0f0' }}>
          Scroll spacer
        </div>

        <section
          id="section-2"
          style={{ height: '500px', background: '#e0e0f0', padding: '20px' }}
        >
          <h2>Section 2</h2>
          <p id="section-2-content">This is section 2 content</p>
        </section>

        <div style={{ height: '500px', background: '#f0f0f0' }}>
          Scroll spacer
        </div>

        <section
          id="section-3"
          style={{ height: '500px', background: '#f0e0e0', padding: '20px' }}
        >
          <h2>Section 3</h2>
          <p id="section-3-content">This is section 3 content</p>
        </section>

        <div style={{ height: '500px', background: '#f0f0f0' }}>
          Bottom spacer
        </div>
      </div>
    </div>
  )
}
