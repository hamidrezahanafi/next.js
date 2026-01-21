import { nextTestSetup } from 'e2e-utils'

describe('duplicate-requests-stale-time', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  // This test verifies that staleTimes.dynamic caching works correctly.
  // When clicking search repeatedly for the same query, only the first click
  // should make an RSC request - subsequent clicks should use cached data.
  //
  // NOTE: A user reported that in real browsers, duplicate requests ARE sent
  // even with staleTimes.dynamic set. However, this bug could not be reproduced
  // in the Playwright e2e test environment. If you can reproduce the bug here,
  // please update this test to fail and then fix the underlying issue.
  it('should not send duplicate requests when clicking search repeatedly for same query', async () => {
    const rscRequests: string[] = []

    const browser = await next.browser('/', {
      beforePageLoad(page) {
        page.on('request', (req) => {
          const url = req.url()
          // Track all _rsc requests with q=test
          if (url.includes('_rsc') && url.includes('q=test')) {
            rscRequests.push(url)
            console.log('RSC request:', url)
          }
        })
      },
    })

    // Wait for home page to load
    await browser.waitForElementByCss('#home-title')

    // Clear any initial requests
    rscRequests.length = 0

    // Type "test" in the search input
    await browser.elementByCss('#search-input').type('test')

    // Click search button - first search
    await browser.elementByCss('#search-button').click()
    await browser.waitForElementByCss('#search-query')
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('After 1st click - RSC requests:', rscRequests.length)
    expect(rscRequests.length).toBe(1)

    // Click search button again - should use cache, NOT make new request
    await browser.elementByCss('#search-button').click()
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('After 2nd click - RSC requests:', rscRequests.length)

    // Click search button again
    await browser.elementByCss('#search-button').click()
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('After 3rd click - RSC requests:', rscRequests.length)

    // Click search button again
    await browser.elementByCss('#search-button').click()
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('After 4th click - RSC requests:', rscRequests.length)
    console.log('All requests:', rscRequests)

    // With staleTimes.dynamic set, clicking search repeatedly for the same query
    // should only make 1 request total (the first one)
    // If this test fails with > 1, there's a caching bug
    expect(rscRequests.length).toBe(1)
  })

  // Test the original reported scenario: search -> clear -> re-search same query
  it('should use cached data when re-searching the same query after clearing', async () => {
    const rscRequests: string[] = []

    const browser = await next.browser('/', {
      beforePageLoad(page) {
        page.on('request', (req) => {
          const url = req.url()
          if (url.includes('_rsc') && url.includes('q=test')) {
            rscRequests.push(url)
            console.log('RSC request:', url)
          }
        })
      },
    })

    await browser.waitForElementByCss('#home-title')
    rscRequests.length = 0

    // Step 1: Search for "test"
    await browser.elementByCss('#search-input').type('test')
    await browser.elementByCss('#search-button').click()
    await browser.waitForElementByCss('#search-query')
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('First search - requests:', rscRequests.length)
    expect(rscRequests.length).toBe(1)

    // Step 2: Clear and search empty to navigate back to /
    await browser.eval(() => {
      const input = document.querySelector('#search-input') as HTMLInputElement
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set
        nativeInputValueSetter?.call(input, '')
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await browser.elementByCss('#search-button').click()
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Step 3: Search for "test" again - should use cache
    rscRequests.length = 0
    await browser.elementByCss('#search-input').type('test')
    await browser.elementByCss('#search-button').click()
    await browser.waitForElementByCss('#search-query')
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Second search for same query - requests:', rscRequests.length)
    console.log('Requests:', rscRequests)

    // With staleTimes.dynamic set, re-searching the same query should use cache
    // Expected: 0 requests (cached)
    // BUG: If > 0, the cache is not working
    expect(rscRequests.length).toBe(0)
  })
})
