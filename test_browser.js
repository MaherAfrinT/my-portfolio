import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 5000 });
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(bodyHTML);
    await browser.close();
  } catch (error) {
    console.error("Error running puppeteer:", error);
  }
})();
