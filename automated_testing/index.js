const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const {
  MODEL_X_ACCESSORIES,
  WALL_CONNECTOR,
  QUICK_ADD_BUTTON,
  PRODUCT_NAME,
  CART_PRODUCT_NAME,
  TOTAL,
  PRICE,
  QUANTITY,
  ADD
} = require('./constants');

describe('Shop Tesla', () => {
  let browser
  let page
  let sleep = 3000

  before(async () => {
    browser = await puppeteer.launch({ headless: false })
    page = await browser.newPage()
    await page.exposeFunction('currency', val => parseFloat(val.replace(/[^\d.]/g, '')))
  })

  after(async () => {
    await browser.close()
  })

  it('should open the tesla shop page and navigate to Model X accessories', async () => {
    await page.goto('https://shop.tesla.com')
    await page.waitForSelector(MODEL_X_ACCESSORIES)
    await page.click(MODEL_X_ACCESSORIES)
    await page.waitFor(sleep)
    expect(page.url()).to.contain('category/vehicle-accessories/model-x')
  })

  it('should quick add a product to the cart', async () => {
    await page.waitForSelector(WALL_CONNECTOR)
    await page.hover(WALL_CONNECTOR)
    await page.waitForSelector(QUICK_ADD_BUTTON)
    await page.click(QUICK_ADD_BUTTON)
    await page.waitForSelector(CART_PRODUCT_NAME)

    const product_name = await page.$eval(PRODUCT_NAME, el => el.innerText)
    const cart_product_name = await page.$eval(CART_PRODUCT_NAME, el => el.innerText)

    expect(product_name).equal(cart_product_name)
  })

  it('should add one more product', async () => {
    await page.waitFor(sleep)
    await page.click(ADD)
    await page.waitFor(sleep)
    const quantity = await page.$eval(QUANTITY, el => Number(el.innerText))
    const total = await page.$eval(TOTAL, el => currency(el.innerText))
    const price = await page.$eval(PRICE, el => currency(el.innerText))

    expect(total).equal(price * quantity)
  })
})


















































