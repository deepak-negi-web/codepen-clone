import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function screenshot(req, res) {
  const { html } = req.body;
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setContent(html);
  const content = await page.$("body");
  const imageBuffer = await content.screenshot({
    omitBackground: true,
  });
  res.json({ imageBuffer, imageBase64: imageBuffer.toString("base64") });
}
