const { chromium } = require('playwright');

async function openWebsiteWithCustomChrome() {
    // Launch browser with custom Chrome path
    const browser = await chromium.launch({
        executablePath: 'D:\\dev\\chromium\\chromium\\src\\out\\debug\\chrome.exe',  // Replace with your Chrome path
        // executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',  // Replace with your Chrome path
        headless: false,  // Set to true if you want to run in headless mode
        args: ['--no-sandbox','--incognito'], // 设置启动参数
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
    await page.goto('http://mp.weixin.qq.com/s?__biz=Mzk0OTMwODIzMA==&mid=2247634119&idx=1&sn=9fb4c0eafc36267c338d0287b0d90658&chksm=c26aee9d9622e28374f54de99c6fc7ce3c300e75980c53684b007fcac7868f00ff23e89e9bbb#rd');
    await page.locator('#js_verify').click();
}

openWebsiteWithCustomChrome().catch(console.error);
