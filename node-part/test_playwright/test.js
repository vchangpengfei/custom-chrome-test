const { chromium } = require('playwright');

async function openWebsiteWithCustomChrome() {
    chromium_path = 'D:\\dev\\chromium\\chromium\\src\\out\\debug\\chrome.exe'
    // Launch browser with custom Chrome path
    // const browser = await chromium.launch({
    //     executablePath: chromium_path,  // Replace with your Chrome path
    //     // executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',  // Replace with your Chrome path
    //     headless: false,  // Set to true if you want to run in headless mode
    //     args: ['--no-sandbox','--incognito'], // 设置启动参数
    //     timeout:90000
    // });

    const browser = await chromium.connectOverCDP('http://localhost:9222', {
        timeout: 9000000, // 设置超时时间为 30 秒（默认通常为 30000ms）
    });

    const context = await browser.newContext()
    // await context.addInitScript(() => {
    //   window.cpf = 'xxx';
    // });
    // Create a new page
    const page = await context.newPage();
    // await page.addInitScript(() => {
    //   window.cpf = 'xxx';
    // });

    // const cdpSession = await page.context().newCDPSession(page);
    // Navigate to the website
    // 发送 CDP 命令
    // await cdpSession.send('Runtime.enable');

    // await page.goto('http://localhost:63342/custom-chrome-test/bot/test_log.html?_ijt=8459ninf6ctsqk118cvnof1vro&_ij_reload=RELOAD_ON_SAVE')
    await page.goto('https://www.hyatt.com/zh-CN/home/')
    console.log('----end-----')
    await page.goto('https://www.breakingtravelnews.com')


    // Keep the browser open (remove this in production)
    // await browser.close();
}

openWebsiteWithCustomChrome().catch(console.error);
