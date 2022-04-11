import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer";
async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;
  if (!executablePath) {
    // running locally
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }
  await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { html } = req.body;
    let imageBuffer = null;
    let browser = null;
    try {
      if (!html || !html.trim()) {
        res.json({
          status: "error",
          message: "No html provided",
        });
        return;
      }
      browser = await getBrowserInstance();
      const page = await browser.newPage();
      await page.setContent(html);
      const content = await page.$("body");
      imageBuffer = await content.screenshot({
        omitBackground: true,
      });
      await page.close();
      await browser.close();
    } catch (error) {
      console.log(error);
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
    res.json({ imageBuffer, imageBase64: imageBuffer.toString("base64") });
  }
  return res.json({ status: "error", message: "Invalid request" });
}
