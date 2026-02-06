import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('router cache with staleTimes.dynamic', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should not send duplicate RSC requests for repeated same-URL navigations', async () => {
    const rscRequests: string[] = []

    const browser = await next.browser('/', {
      beforePageLoad(page) {
        page.on('request', (req) => {
          const url = req.url()
          if (url.includes('_rsc') && url.includes('q=test')) {
            rscRequests.push(url)
          }
        })
      },
    })

    await browser.waitForElementByCss('#home-title')
    rscRequests.length = 0

    await browser.elementByCss('#search-input').type('test')
    await browser.elementByCss('#search-button').click()
    await browser.waitForElementByCss('#search-query')

    await retry(async () => {
      expect(rscRequests.length).toBe(1)
    })

    // Subsequent clicks to the same URL should use the cache
    await browser.elementByCss('#search-button').click()
    await browser.elementByCss('#search-button').click()
    await browser.elementByCss('#search-button').click()

    await retry(async () => {
      expect(rscRequests.length).toBe(1)
    })
  })

  it('should use cached RSC data when re-searching the same query after clearing', async () => {
    const rscRequests: string[] = []

    const browser = await next.browser('/', {
      beforePageLoad(page) {
        page.on('request', (req) => {
          const url = req.url()
          if (url.includes('_rsc') && url.includes('q=test')) {
            rscRequests.push(url)
          }
        })
      },
    })

    await browser.waitForElementByCss('#home-title')
    rscRequests.length = 0

    // First search
    await browser.elementByCss('#search-input').type('test')
    await browser.elementByCss('#search-button').click()
    await browser.waitForElementByCss('#search-query')

    await retry(async () => {
      expect(rscRequests.length).toBe(1)
    })

    // Clear input and navigate back to /
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

    // Re-search same query — should use cache
    rscRequests.length = 0
    await browser.elementByCss('#search-input').type('test')
    await browser.elementByCss('#search-button').click()
    await browser.waitForElementByCss('#search-query')

    await retry(async () => {
      expect(rscRequests.length).toBe(0)
    })
  })
})
