import {Page} from 'puppeteer';
const enterNameAndSubmit = async (page: Page, name = 'Daniel') => {  
  await page.focus('#name-input')
  await page.keyboard.type(name)
  await page.click('#submit-name-button')
}

export default enterNameAndSubmit