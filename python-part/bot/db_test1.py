from DrissionPage import ChromiumPage, ChromiumOptions
from DrissionPage._base.chromium import Chromium



browser = Chromium(8088)
page = browser.latest_tab
# page.get('https://gitee.com/login', retry=3, timeout=15, interval=2)
page.get('https://www.breakingtravelnews.com')
page.get('https://www.hyatt.com/zh-CN/home/')
# # 定位到账号文本框，获取文本框元素
# ele = page.ele('#user_login')
# # 输入对文本框输入账号
# ele.input('您的账号')
# # 定位到密码文本框并输入密码
# page.ele('#user_password').input('您的密码')
# # 点击登录按钮
# page.ele('@value=登 录').click()

