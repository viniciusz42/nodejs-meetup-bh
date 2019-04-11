const puppeteer = require('puppeteer');

(async () => {
  try {

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const next = 'ul.pager li.next a'
    await page.goto('http://books.toscrape.com')

    let data = []
    while (true) {
      try {
        const books = await page.evaluate(() => {
          const list = [...document.querySelectorAll('.product_pod')]
          return list.map(element => ({
            title: element.querySelector('h3 a').innerText,
            price: element.querySelector('.product_price p.price_color').innerText,
            rating: element.querySelector('.star-rating').getAttribute('class').replace('star-rating ', '')
          }))
        })
        data.push(books)
        await page.waitForSelector(next, { timeout: 3000 })
        await page.click(next)
      } catch (e) {
        break
      }
    }

    console.log(data)

    await browser.close()
  } catch (e) {
    console.log(e)
    await browser.close()
  }
})()
