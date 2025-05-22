const puppeteer = require('puppeteer');

(async () => {
    chromium_path = 'D:\\dev\\chromium\\chromium\\src\\out\\debug\\chrome.exe'
    const browser = await puppeteer.launch({
        executablePath: chromium_path, // 指定 Chrome 浏览器路径
        args: ['--no-sandbox', '--incognito'], // 设置启动参数
        headless: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.breakingtravelnews.com')
    await page.goto('https://www.hyatt.com/zh-CN/home/')

    // 其他操作...

    await browser.close();
})();