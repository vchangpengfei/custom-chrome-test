from playwright.sync_api import sync_playwright


def run(playwright):
    # 指定 Chromium 的可执行文件路径
    # chromium_path = 'C:\\Users\\Administrator\\AppData\\Local\\Chromium\\Application\\chrome.exe'  # 替换为你的 Chromium 可执行文件的实际路径
    chromium_path = 'D:\\dev\\chromium\\chromium\\src\\out\\debug\\chrome.exe'
    # chromium_path = 'C:\\dev\\chrome-win64\\chrome.exe'
    # chromium_path = '/Applications/Chromium.app/Contents/MacOS/Chromium'  # 替换为你的 Chromium 可执行文件的实际路径
    # chromium_path = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\msedge.exe'  # 替换为你的 Chromium 可执行文件的实际路径

    # 启动浏览器，使用指定的可执行文件路径
    browser = playwright.chromium.launch(executable_path=chromium_path, headless=False,args=['--no-sandbox','--incognito'])
    # browser = playwright.chromium.connect_over_cdp(endpoint_url = "http://127.0.0.1:9222")

    # context = browser.new_context(no_viewport=True,)
    context = browser.new_context()
    page = context.new_page()

    page.goto('http://localhost:63342/custom-chrome-test/bot/test._cdp_stack.html?_ijt=jvn3bso364ktndcm5u87o48e3u&_ij_reload=RELOAD_ON_SAVE')

    page.goto('https://jina.ai/reader/')
    page.goto('https://www.breakingtravelnews.com')

    # page.goto('https://abrahamjuliot.github.io/creepjs/tests/window.html')
    # page.goto('https://www.bestwestern.com/')

    # page.goto('https://www.marriott.com/search/availabilityCalendar.mi?destinationAddress.country=&lengthOfStay=1&fromDate=05%2F01%2F2025&toDate=05%2F02%2F2025&numberOfRooms=1&numberOfAdults=1&guestCountBox=1+Adults+Per+Room&childrenCountBox=0+Children+Per+Room&roomCountBox=1+Rooms&childrenCount=0&childrenAges=&clusterCode=none&corporateCode=&groupCode=&isHwsGroupSearch=true&propertyCode=LONHW&useRewardsPoints=false&flexibleDateSearch=false&t-start=05%2F01%2F2025&t-end=05%2F02%2F2025&fromDateDefaultFormat=05%2F01%2F2025&toDateDefaultFormat=05%2F02%2F2025&fromToDate_submit=05%2F02%2F2025&fromToDate=')
    # page.goto('https://www.baidu.com')

    # page.goto('https://bot.sannysoft.com/')
    # page.goto('http://localhost:63342/OpenManus/examples/test/playwright_test/html/111.html?_ijt=9fk64c7ptm8l6vvkkqjvf1j57l&_ij_reload=RELOAD_ON_SAVE')
    # page.goto('https://www.ipaddress.my/?lang=zh_CN')
    # page.goto('https://pixelscan.net/')
    # page.goto('https://arh.antoinevastel.com/bots/areyouheadless')
    # page.goto('https://www.hermes.com/us/en/') # 无限debuger




    # page.goto('https://www.tripadvisor.com/')
    # test_tripadvisor(page);
    # page.goto('https://www.hilton.com/zh-hans/locations/singapore/')
    # test_hilton(context,page);
    page.goto('http://localhost:63342/custom-chrome-test/bot/test._cdp_stack.html?_ijt=urb8km2hdngjke1tmha9iuitnd&_ij_reload=RELOAD_ON_SAVE')
    page.goto('https://www.hyatt.com/zh-CN/home/')
    page.goto('https://www.marriott.com/search/availabilityCalendar.mi?destinationAddress.country=&lengthOfStay=1&fromDate=05%2F01%2F2025&toDate=05%2F02%2F2025&numberOfRooms=1&numberOfAdults=1&guestCountBox=1+Adults+Per+Room&childrenCountBox=0+Children+Per+Room&roomCountBox=1+Rooms&childrenCount=0&childrenAges=&clusterCode=none&corporateCode=&groupCode=&isHwsGroupSearch=true&propertyCode=LONHW&useRewardsPoints=false&flexibleDateSearch=false&t-start=05%2F01%2F2025&t-end=05%2F02%2F2025&fromDateDefaultFormat=05%2F01%2F2025&toDateDefaultFormat=05%2F02%2F2025&fromToDate_submit=05%2F02%2F2025&fromToDate=')

    # page.goto('https://www.browserscan.net/bot-detection')
    # page.goto('https://fingerprintjs.github.io/BotD/')
    # page.goto('https://blog.aepkill.com/demos/devtools-detector/')
    # page.goto('https://fingerprint.com/products/bot-detection/')
    # page.goto('https://deviceandbrowserinfo.com/are_you_a_bot')
    # page.goto('https://browserleaks.com/webgl')
    # page.goto('https://www.marriott.com.cn/destinations/hong-kong-hotels-china-travel.mi')
    # test_marriott(context,page)

    # 等待页面加载完成或执行其他操作...
    # 例如，你可以添加一些代码来等待特定的元素出现或执行一些交互操作

    # 完成后关闭浏览器
    browser.close()

def test_marriott(context,page):
    page.set_default_timeout(1000000)
    page.goto('https://www.marriott.com.cn/')
    page.wait_for_timeout(3000)

    xpath_expression = '// *[ @ id = "onetrust-accept-btn-handler"]'  # 替换为实际的XPath表达式
    page.click(f"xpath={xpath_expression}")

    page.wait_for_timeout(3000)
    page.type('input[id="downshift-1-input"]', 'shanghai', delay=100)  # delay 单位为毫秒
    page.wait_for_timeout(3000)
    page.press('input[id="downshift-1-input"]', "Enter")
    page.wait_for_timeout(3000)

    xpath_expression = '// *[ @ id = "main-content"] / div / div[3] / div / div / div / div / div[3] / button'  # 替换为实际的XPath表达式
    page.click(f"xpath={xpath_expression}")
    page.wait_for_timeout(3000)

def test_hilton(context,page):
    # 设置全局超时时间为 10 秒
    page.set_default_timeout(100000)
    page.goto('https://www.hilton.com/')
    page.wait_for_timeout(3000)
    # page.fill('input[name="query"]', "shanghai")

    # 使用 page.type() 模拟逐字输入，设置每个字符之间的延迟
    page.type('input[name="query"]', 'shanghai', delay=100)  # delay 单位为毫秒

    page.wait_for_timeout(3000)
    page.press('input[name="query"]', "Enter")
    # 等待一段时间以观察结果（可选）
    page.wait_for_timeout(3000)

    with context.expect_page() as new_page_info:
        xpath_expression = '// *[ @ id = "__next"] / div / div[2] / main / div[1] / div[1] / div / div / div / div / form / div / div / div / \
                                     div[5] / button'  # 替换为实际的XPath表达式
        page.click(f"xpath={xpath_expression}")
        new_page = new_page_info.value
        new_page.wait_for_timeout(3000)

        xpath_expression = '//*[@id="__next"]/main/div/div[3]/div[1]/div[3]/div[1]/ul/li[1]/div/div[2]/div[1]/div[2]/div/div[2]/div/a'  # 替换为实际的XPath表达式
        new_page.click(f"xpath={xpath_expression}")


def test_tripadvisor(page):
    page.goto('https://www.tripadvisor.com/')
    # type = "search" 的input输入shanghai
    # 定位 type="search" 的 input 元素，并输入 "shanghai"
    page.wait_for_timeout(3000)
    page.fill('input[type="search"]', "shanghai")
    page.wait_for_timeout(3000)
    page.press('input[type="search"]', "Enter")
    # 等待一段时间以观察结果（可选）
    page.wait_for_timeout(3000)

    xpath_expression = '//*[@id="lithium-root"]/main/div[6]/div[2]/div/div[3]/div[1]/span/div/ul/li[1]/span/div/a/div/div[1]/div/div/div/div/div/div/div[4]'  # 替换为实际的XPath表达式
    page.click(f"xpath={xpath_expression}")

    page.wait_for_timeout(3000)



with sync_playwright() as playwright:
    run(playwright)
