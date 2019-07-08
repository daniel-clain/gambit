
import setup from '../tests/gui-tests/steps/setup';
import enterNameAndSubmit from '../tests/gui-tests/steps/enter-name-and-submit';
import { Page, Browser } from 'puppeteer';

interface BrowserObj{
  page: Page
  browser: Browser
}
const playerNames: string[] = ['Frank', 'Dave', 'Steve', 'Charles']
const browsers: BrowserObj[] = []

beforeEach(async () => {
  const windowDimensions = {width: 500, height: 500}
  await Promise.all(playerNames.map(async(player, i) => {
    const windowLocation = {x: i%2 == 0 ?  0 : windowDimensions.width, y: i <2 ? 0 : windowDimensions.height}
    const obj = await setup(windowLocation, windowDimensions)
    browsers.push(obj)
    return
  }))
});

afterEach(async () => {
  console.log('after');
  await Promise.all(browsers.map(async obj => {
    await obj.browser.close()
  }))
})  

const allPagesWait = async () => {
  await Promise.all(browsers.map(obj => obj.page.waitFor(5000)))
}

test(`automating 4 players entereing thier name and becoming connected`, async () => {
  await Promise.all(browsers.map(async (obj, i) => {
    await enterNameAndSubmit(obj.page, playerNames[i])
  }))
  await allPagesWait()
  return expect('dick').toBe('dick')
})