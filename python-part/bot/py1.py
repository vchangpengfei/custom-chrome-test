import time
# from playwright_stealth import stealth_sync

from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        # browser = p.chromium.connect_over_cdp("http://localhost:12311")
        browser = p.chromium.launch(headless=False,executable_path=r"D:\\Users\\pfchang\\AppData\\Local\\Chromium\\Application\\chrome.exe")
        page = browser.new_page()
        page.add_init_script("""
         (function() {
         Object.keys(console).forEach(k=>{console[k] = function(){}});
         })();
         """)

        page.goto("https://www.hyatt.com/en-US/shop/rooms/istph?location=&checkinDate=2025-05-13&checkoutDate=2025-05-14&rooms=1&adults=2&kids=0&rate=Standard")
        time.sleep(130)
        browser.close()


if __name__ == "__main__":
    run()