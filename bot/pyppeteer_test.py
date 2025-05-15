import asyncio
from pyppeteer import launch

async def main():
    chromium_path = 'D:\\Users\\pfchang\\AppData\\Local\\Chromium\\Application\\chrome.exe'  # 替换为你的 Chromium 可执行文件的实际路径
    # chromium_path = 'C:\\dev\\chrome-win64\\chrome.exe'
    browser = await launch(headless=False,executablePath=chromium_path)  # headless=False 显示浏览器窗口
    page = await browser.newPage()

    await page.goto('https://blog.aepkill.com/demos/devtools-detector/')
    await page.goto('https://fingerprint.com/products/bot-detection/')
    await page.goto('https://deviceandbrowserinfo.com/are_you_a_bot')

    await page.goto('https://www.browserscan.net/bot-detection')
    await page.goto('https://fingerprintjs.github.io/BotD/')
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())