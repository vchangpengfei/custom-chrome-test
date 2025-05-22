from DrissionPage import ChromiumPage, ChromiumOptions

# chromium_path = 'C:\\dev\\chrome-win64\\chrome.exe'  # 替换为你的 Chromium 可执行文件的实际路径
# chromium_path = 'C:\\Users\\Administrator\\AppData\\Local\\Chromium\\Application\\chrome.exe'
# chromium_path = "C:\Program Files\Google\Chrome\Application\chrome.exe"  # 替换为你的 Chromium 可执行文件的实际路径
chromium_path = 'D:\\dev\\chromium\\chromium\\src\\out\\debug\\chrome.exe'
co = ChromiumOptions()
co.set_paths(browser_path=chromium_path)
co.set_argument('--no-sandbox')
co.set_argument('--incognito')
# co = ChromiumOptions().set_paths(address='127.0.0.1:9222')
# 1、设置无头模式：co.headless(True)
# 2、设置无痕模式：co.incognito(True)
# 3、设置访客模式：co.set_argument('--guest')
# 4、设置请求头user-agent：co.set_user_agent()
# 5、设置指定端口号：co.set_local_port(7890)
# 6、设置代理：co.set_proxy('http://localhost:1080')
page = ChromiumPage(co)


# page.run_cdp('Page.setLifecycleEventsEnabled', enabled=True)
# page.run_cdp('Runtime.runIfWaitingForDebugger')
# page.run_cdp("Runtime.enable")
page.run_cdp("Target.setAutoAttach",autoAttach=True,waitForDebuggerOnStart=True,flatten=True)
# page.run_cdp("Target.setAutoAttach",autoAttach=True,waitForDebuggerOnStart=True,flatten=True)
# {"id":2,"method":"Target.setAutoAttach","params":{"autoAttach":true,"waitForDebuggerOnStart":true,"flatten":true}}
# page.run_cdp("Target.createBrowserContext",disposeOnDetach=True)
# {"id":3,"method":"Target.createBrowserContext","params":{"disposeOnDetach":true}}
# page.run_cdp("Page.setLifecycleEventsEnabled",enabled=True)
# {"id":10,"method":"Page.setLifecycleEventsEnabled","params":{"enabled":true},"sessionId":"3CC96877B2E5D30141FD8BB97BDF07CA"}
# page.get('https://gitee.com/login', retry=3, timeout=15, interval=2)

page.run_cdp("Emulation.setFocusEmulationEnabled",enabled=True)
# {"id":15,"method":"Emulation.setFocusEmulationEnabled","params":{"enabled":true},"sessionId":"3CC96877B2E5D30141FD8BB97BDF07CA"}
page.get('https://www.breakingtravelnews.com')
page.get('http://localhost:63342/custom-chrome-test/bot/test._cdp_stack.html?_ijt=urb8km2hdngjke1tmha9iuitnd&_ij_reload=RELOAD_ON_SAVE')
page.get('https://www.hyatt.com/zh-CN/home/')


page.close()
# # 定位到账号文本框，获取文本框元素
# ele = page.ele('#user_login')
# # 输入对文本框输入账号
# ele.input('您的账号')
# # 定位到密码文本框并输入密码
# page.ele('#user_password').input('您的密码')
# # 点击登录按钮
# page.ele('@value=登 录').click()

