// 需要代理的对象
window = yqvm.toolsFunc.proxy(window, "window");
document = yqvm.toolsFunc.proxy(document, "document");
location = yqvm.toolsFunc.proxy(location, "location");
localStorage = yqvm.toolsFunc.proxy(localStorage, "localStorage");
sessionStorage = yqvm.toolsFunc.proxy(sessionStorage, "sessionStorage");
navigator = yqvm.toolsFunc.proxy(navigator, "navigator");
URL = yqvm.toolsFunc.proxy(URL, "url");
Image = yqvm.toolsFunc.proxy(Image, "image");
Worker = yqvm.toolsFunc.proxy(Worker, "worker");