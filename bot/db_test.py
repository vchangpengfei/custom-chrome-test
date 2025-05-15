from DrissionPage import ChromiumPage, ChromiumOptions

chromium_path = 'C:\\dev\\chrome-win64\\chrome.exe'  # 替换为你的 Chromium 可执行文件的实际路径
# chromium_path = '/Users/young/cpf/chromium132/src/out/debug/Chromium.app/Contents/MacOS/Chromium'  # 替换为你的 Chromium 可执行文件的实际路径
# chromium_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
co = ChromiumOptions().set_paths(browser_path=chromium_path)
# 1、设置无头模式：co.headless(True)
# 2、设置无痕模式：co.incognito(True)
# 3、设置访客模式：co.set_argument('--guest')
# 4、设置请求头user-agent：co.set_user_agent()
# 5、设置指定端口号：co.set_local_port(7890)
# 6、设置代理：co.set_proxy('http://localhost:1080')
page = ChromiumPage(co)
# page.run_cdp('Network.enable', **{"maxPostDataSize":65536})
# page.run_cdp('Network.setAttachDebugStack', **{"enabled":True})
# page.run_cdp('Page.enable')
# page.run_cdp('Page.getResourceTree')
# page.run_cdp('Runtime.enable')
# page.run_cdp('DOM.enable')
# page.run_cdp('CSS.enable')
# page.run_cdp('Debugger.enable', **{"maxScriptsCacheSize":10000000})
# page.run_cdp('Debugger.setPauseOnExceptions', **{"state":"none"})
# page.run_cdp('Debugger.setAsyncCallStackDepth', **{"maxDepth":32})
# page.run_cdp('Overlay.enable')
# page.run_cdp('Overlay.setShowViewportSizeOnResize', **{"show":True})
# page.run_cdp('Animation.enable', **{})
# page.run_cdp('Autofill.enable', **{})
# page.run_cdp('Autofill.setAddresses', **{"addresses":[]})
# page.run_cdp('Profiler.enable', **{})
# page.run_cdp('Log.enable', **{})
# page.run_cdp('Log.startViolationsReport', **{"config":[{"name":"longTask","threshold":200},{"name":"longLayout","threshold":30},{"name":"blockedEvent","threshold":100},{"name":"blockedParser","threshold":-1},{"name":"handler","threshold":150},{"name":"recurringHandler","threshold":50},{"name":"discouragedAPIUse","threshold":-1}]})
# page.run_cdp('Emulation.setEmulatedMedia', **{"media":"","features":[{"name":"color-gamut","value":""},{"name":"prefers-color-scheme","value":""},{"name":"forced-colors","value":""},{"name":"prefers-contrast","value":""},{"name":"prefers-reduced-data","value":""},{"name":"prefers-reduced-motion","value":""},{"name":"prefers-reduced-transparency","value":""}]})
# page.run_cdp('Emulation.setEmulatedVisionDeficiency', **{"type":"none"})
# page.run_cdp('Audits.enable', **{})
# page.run_cdp('ServiceWorker.enable', **{})
# page.run_cdp('Inspector.enable', **{})
# page.run_cdp('Target.setAutoAttach', **{"autoAttach":True,"waitForDebuggerOnStart":True,"flatten":True})
# page.run_cdp('Target.setDiscoverTargets', **{"discover":True})
# page.run_cdp('Target.setRemoteLocations', **{"locations":[{"host":"localhost","port":9229}]})
# page.run_cdp('Runtime.addBinding', **{"name":"__chromium_devtools_metrics_reporter","executionContextName":"DevTools Performance Metrics"})
# page.run_cdp('Network.clearAcceptedEncodingsOverride', **{})
# page.run_cdp('Debugger.setBlackboxPatterns', **{"patterns":["/node_modules/|^node:"],"skipAnonymous":False})
# page.run_cdp('DOMDebugger.setBreakOnCSPViolation', **{"violationTypes":[]})
# page.run_cdp('Runtime.runIfWaitingForDebugger', **{})
# page.run_cdp('Page.setAdBlockingEnabled', **{"enabled":False})
# page.run_cdp('Emulation.setFocusEmulationEnabled', **{"enabled":False})
# page.run_cdp('Accessibility.enable', **{})
# page.run_cdp('CSS.trackComputedStyleUpdates', **{"propertiesToTrack":[{"name":"display","value":"grid"},{"name":"display","value":"inline-grid"},{"name":"display","value":"flex"},{"name":"display","value":"inline-flex"},{"name":"container-type","value":"inline-size"},{"name":"container-type","value":"block-size"},{"name":"container-type","value":"size"}]})
# # page.run_cdp('CSS.takeComputedStyleUpdates', **{})
# page.run_cdp('DOM.getDocument', **{})


page.run_cdp('Performance.enable', **{})
page.run_cdp('Fetch.enable', **{})




# page.get('https://gitee.com/login', retry=3, timeout=15, interval=2)
page.get('https://www.hyatt.com/zh-CN/home/')
page.get('https://www.breakingtravelnews.com')

page.close()
# # 定位到账号文本框，获取文本框元素
# ele = page.ele('#user_login')
# # 输入对文本框输入账号
# ele.input('您的账号')
# # 定位到密码文本框并输入密码
# page.ele('#user_password').input('您的密码')
# # 点击登录按钮
# page.ele('@value=登 录').click()

