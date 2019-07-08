
import ConnectionStates from '../../../../types/connection-states';
import enterNameAndSubmit from '../../steps/enter-name-and-submit';
import setup from '../../steps/setup';

let browser
let page
beforeEach(async () => {
  const obj = await setup({x: 100, y: 100},{width: 500, height: 500})
  browser = obj.browser
  page = obj.page
});

afterEach(async () => {
  await browser.close()
})  

const expectedHeaderConnectionText: ConnectionStates = 'Connected'

test(`head connection text expected to be ${expectedHeaderConnectionText}`, async () => {
  await enterNameAndSubmit(page)
  const headerConnectionText = await page.evaluate(() => document.querySelector('#header #connection-state .value').textContent);
  expect(headerConnectionText).toBe(expectedHeaderConnectionText)
})