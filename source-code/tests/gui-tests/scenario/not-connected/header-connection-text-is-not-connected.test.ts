import setup from '../../steps/setup';
import ConnectionStates from '../../../../types/connection-states';


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

const expectedHeaderConnectionText: ConnectionStates = 'Not Connected'
test(`head connection text expected to be ${expectedHeaderConnectionText}`, async () => {
  const headerConnectionText = await page.evaluate(() => document.querySelector('#header #connection-state .value').textContent);
  expect(headerConnectionText).toBe(expectedHeaderConnectionText)
})