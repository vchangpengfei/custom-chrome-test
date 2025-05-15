
// 全局对象配置
debugger;
let yqvm = {
    "toolsFunc": {},//功能函数相关，插件
    "envFunc": {},// 具体环境实现相关
    "config": {}, // 配置相关
    "memory": {}, // 内存
}
yqvm.debug_array=[] //用于debugger
yqvm.config.proxy = true;// 是否开启代理
yqvm.config.print = true; // 是否输出日志
yqvm.config.random=false //是否hook随机
yqvm.memory.symbolProxy = Symbol("proxy");// 独一无二的属性, 标记是否已代理
yqvm.memory.symbolData = Symbol("data");// 用来保存当前对象上的原型属性
yqvm.memory.symbolToString = Symbol("toString");// 用来保存当前对象上的原型属性
yqvm.memory.symbolError = Symbol("error");// 用来保存报错标记
yqvm.memory.filterProxyProp = ['eva', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'eval', 'Math', 'constructor', '__proto__', 'toString', 'setTimeout', 'setInterval', 'escape', 'Number', 'decodeURIComponent', 'JSON', 'RegExp', 'addEventListener', 'removeItem', 'setItem', 'getElementsByTagName', 'clearInterval', 'getItem', 'toJSON', 'visibility', yqvm.memory.symbolObjName, yqvm.memory.symbolProxy, yqvm.memory.symbolRawFatherObj, yqvm.memory.symbolRawSelfObj, yqvm.memory.symbolData];// 需要过滤的属性，环境内置属性不代理（防proxy的toString检测）
yqvm.memory.filterLogProxyProp = [yqvm.memory.symbolProxy, yqvm.memory.symbolData];// 放置不希望出现的代理日志//暂时不用该功能
yqvm.memory.globalVar = {} //全局变量
yqvm.memory.globalVar.cookieJson = {} //json格式的cookie
yqvm.memory.globalVar.startime=Date.now() //performance页面性能相关
yqvm.memory.globalVar.fontList = ["SimHei", "SimSun", "NSimSun", "FangSong", "KaiTi",
    "Verdana",
    "Helvetica Neue LT Pro 35 Thin",
    "tahoma",
    "Kannada Sangam MN",
    "verdana",
    "Telugu Sangam MN",
    "times new roman",
    "Courier New",
    "helvetica",
    "LG-FZKaTong-M19-V2.2",
    "Georgia",
    "georgia",
    "Malayalam Sangam MN",
    "courier new",
    "sans-serif",
    "monaco",
    "Arial",
    "Noto Sans Myanmar",
    "Myanmar Sangam MN",
    "Apple Color Emoji",
    "arial",
    "Devanagari Sangam MN",
    "Gujarati Sangam MN",
    "cursive",
    "baskerville",
    "Noto Sans Kannada",
    "fantasy",
    "Tamil Sangam MN",
    "palatino",
    "courier",
    "Oriya Sangam MN",
    "Bangla Sangam MN",
    "Gurmukhi Sangam MN",
    "monospace",
    "Times New Roman"]; // 浏览器能够识别的字体
yqvm.memory.asyncTask = {};// 异步任务池
yqvm.memory.asyncEvent = {
    load:{}
};// 异步事件池
yqvm.memory.globalVar.timeoutID = 0;
yqvm.memory.globalVar.asyncSeq = 0;
yqvm.memory.globalVar.id = 0; //代理对象时候自增,以防同名
yqvm.memory.symbolRawFatherObj = Symbol('fatherObj')//用于更改apply行为内部this指向到原生对象,而非Proxy对象
yqvm.memory.symbolRawSelfObj = Symbol('selfObj')//用于更改construct行为内部this指向到原生对象,而非Proxy对象
yqvm.memory.symbolObjName = Symbol('name')//用于表示被创建的元素名称,方便在内存中通过此属性精准定位到
yqvm.memory.symbolRawName = Symbol('rawName')//用于表示被创建的元素名称,方便在内存中通过此属性精准定位到
yqvm.memory.webgl_WebGLShaderPrecisionFormat={
    '35633_36337': { rangeMin: 127, rangeMax: 127, precision: 23 },
    '35633_36336': { rangeMin: 127, rangeMax: 127, precision: 23 },
    '35633_36341': { rangeMin: 31, rangeMax: 30, precision: 0 },
    '35633_36340': { rangeMin: 31, rangeMax: 30, precision: 0 },
    '35633_36339': { rangeMin: 31, rangeMax: 30, precision: 0 },
    '35632_36338': { rangeMin: 127, rangeMax: 127, precision: 23 },
    '35632_36337': { rangeMin: 127, rangeMax: 127, precision: 23 },
    '35632_36336': { rangeMin: 127, rangeMax: 127, precision: 23 },
    '35632_36341': { rangeMin: 31, rangeMax: 30, precision: 0 },
    '35632_36340': { rangeMin: 31, rangeMax: 30, precision: 0 },
    '35632_36339': { rangeMin: 31, rangeMax: 30, precision: 0 },
    '35633_36338': { precision: 23, rangeMax: 127, rangeMin: 127 }
}
