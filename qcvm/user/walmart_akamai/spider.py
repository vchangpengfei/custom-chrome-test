import requests
from parsel import Selector
import execjs


class YinheSpider:
    def __init__(self) -> None:
        self.encjs = open('./spider.js').read()

    def get_index_1(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        }
        url = "http://www.chinastock.com.cn/newsite/cgs-services/stockFinance/businessAnnc.html"
        print(url)
        params = {
            "type": "marginList"
        }
        response = requests.get(url, headers=headers, params=params)
        print(response)
        s = Selector(text=response.text)
        content = s.xpath('//meta[@content][2]/@content').get()
        self.encjs = self.encjs.replace('yq_content', content)
        yq_content_script0 = s.xpath(
            "//script[@r='m']/text()").getall()[0]
        self.encjs = self.encjs.replace(
            '\'yq_script0\'', yq_content_script0)
        yq_script2 = s.xpath(
            "//script[@r='m']/text()").getall()[1]
        self.encjs = self.encjs.replace(
            '\'yq_script2\'', yq_script2)
        outjs_url=s.xpath(
            "//script[@r='m'][2]/@src").get()
        cookie = response.cookies.get_dict()
        coo_ws = cookie['1EzPGwRUoQaWS']
        coo_ali_tc = cookie['aliyungf_tc']
        coo_acw_tc = cookie['acw_tc']
        return outjs_url,coo_ali_tc,coo_acw_tc,coo_ws

    def get_outjs(self,url,coo_ali_tc,coo_acw_tc, coo_ws):
        headers = {
            "Referer": "http://www.chinastock.com.cn/newsite/cgs-services/stockFinance/businessAnnc.html?type=marginList",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        }
        cookies = {
            "aliyungf_tc": coo_ali_tc,
            "acw_tc": coo_acw_tc,
            "1EzPGwRUoQaWS": coo_ws
        }
        url = f"http://www.chinastock.com.cn{url}"
        print(url)
        response = requests.get(url, headers=headers, cookies=cookies)
        print(response)
        self.encjs = self.encjs.replace('\'yq_script1\'', response.text)

    def get_index_2(self,coo_ali_tc,coo_acw_tc, coo_ws,coo_wt):
        headers = {
            "Referer": "http://www.chinastock.com.cn/newsite/cgs-services/stockFinance/businessAnnc.html?type=marginList",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        }
        cookies = {
            "aliyungf_tc": coo_ali_tc,
            "acw_tc": coo_acw_tc,
            "1EzPGwRUoQaWS": coo_ws,
            "1EzPGwRUoQaWT": coo_wt
        }
        url = "http://www.chinastock.com.cn/newsite/cgs-services/stockFinance/businessAnnc.html"
        print(url)
        params = {
            "type": "marginList"
        }
        response = requests.get(url, headers=headers, cookies=cookies, params=params)
        print(response)
        print(response.content.decode('utf-8'))


    def main(self):
        outjs_url,coo_ali_tc,coo_acw_tc,coo_ws = self.get_index_1()
        self.get_outjs( outjs_url,coo_ali_tc,coo_ali_tc,coo_ws)
        with open('./debug.js','w') as f:
            f.write(self.encjs)
        coo_wt = execjs.compile(self.encjs).call('main')
        self.get_index_2(coo_ali_tc,coo_acw_tc, coo_ws,coo_wt)


if __name__ == "__main__":
    spider = YinheSpider()
    spider.main()
