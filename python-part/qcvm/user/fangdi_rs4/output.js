// 全局对象配置
debugger;
let yqvm = {
    "toolsFunc": {},//功能函数相关，插件
    "envFunc": {},// 具体环境实现相关
    "config": {}, // 配置相关
    "memory": {}, // 内存
}
yqvm.config.proxy = true;// 是否开启代理
yqvm.config.print = true; // 是否输出日志
yqvm.memory.symbolProxy = Symbol("proxy");// 独一无二的属性, 标记是否已代理
yqvm.memory.symbolData = Symbol("data");// 用来保存当前对象上的原型属性
yqvm.memory.symbolToString = Symbol("toString");// 用来保存当前对象上的原型属性
yqvm.memory.tag = []; // 内存，存储tag标签
yqvm.memory.filterProxyProp = ['eva', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'eval', 'Math', 'constructor', '__proto__', 'toString', 'setTimeout', 'setInterval', 'escape', 'Number', 'decodeURIComponent', 'JSON', 'RegExp', 'addEventListener', 'removeItem', 'setItem', 'getElementsByTagName', 'clearInterval', 'getItem', 'toJSON', 'visibility', yqvm.memory.symbolObjName, yqvm.memory.symbolProxy, yqvm.memory.symbolRawFatherObj, yqvm.memory.symbolRawSelfObj, yqvm.memory.symbolData];// 需要过滤的属性，环境内置属性不代理（防proxy的toString检测）
yqvm.memory.filterLogProxyProp = [yqvm.memory.symbolProxy, yqvm.memory.symbolData];// 放置不希望出现的代理日志//暂时不用该功能
yqvm.memory.globalVar = {} //全局变量
yqvm.memory.globalVar.cookieJson = {} //json格式的cookie
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
// 插件功能相关
!function () {
    //-转小驼峰式命名(css)
    yqvm.toolsFunc.toCamelCase = function toCamelCase(str) {
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }
    //创建插件列表
    yqvm.toolsFunc.createPluginArray = function createPluginArray() {
        let pluginArray = {}
        pluginArray = yqvm.toolsFunc.createProxyObj(pluginArray, PluginArray, 'pluginArray')
        yqvm.toolsFunc.setProtoArr.call(pluginArray, 'length', 0)
        return pluginArray
    }
    //添加plugin对象
    yqvm.toolsFunc.addPlugin = function addPlugin(plugin) {
        let pluginArray = yqvm.memory.globalVar.pluginArray;
        if (pluginArray === undefined) {
            pluginArray = yqvm.toolsFunc.createPluginArray();
        }
        let index = pluginArray.length;
        pluginArray[index] = plugin
        Object.defineProperty(pluginArray, plugin.name, { value: plugin, writable: false, enumerable: false, configurable: true })
        yqvm.toolsFunc.setProtoArr.call(pluginArray, 'length', index + 1)
        yqvm.memory.globalVar.pluginArray = pluginArray
        return pluginArray
    }
    // 创建MimeTypeArray对象
    yqvm.toolsFunc.createMimeTypeArray = function createMimeTypeArray() {
        let mimeTypeArray = {};
        mimeTypeArray = yqvm.toolsFunc.createProxyObj(mimeTypeArray, MimeTypeArray, "mimeTypeArray");
        yqvm.toolsFunc.setProtoArr.call(mimeTypeArray, "length", 0);
        return mimeTypeArray;
    }
    // 添加MimeType
    yqvm.toolsFunc.addMimeType = function addMimeType(mimeType) {
        let mimeTypeArray = yqvm.memory.globalVar.mimeTypeArray;
        if (mimeTypeArray === undefined) {
            mimeTypeArray = yqvm.toolsFunc.createMimeTypeArray();
        }
        let index = mimeTypeArray.length;
        let flag = true;
        for (let i = 0; i < index; i++) {
            if (mimeTypeArray[i].type === mimeType.type) {
                flag = false;
            }
        }
        if (flag) {
            mimeTypeArray[index] = mimeType;
            Object.defineProperty(mimeTypeArray, mimeType.type, { value: mimeType, writable: false, enumerable: false, configurable: true });
            yqvm.toolsFunc.setProtoArr.call(mimeTypeArray, "length", index + 1);
        }
        yqvm.memory.globalVar.mimeTypeArray = mimeTypeArray;
        return mimeTypeArray;
    }
    //创建MimeType
    yqvm.toolsFunc.createMimeType = function createMimeType(mimeTypeJson, plugin) {
        let mimeType = {}
        mimeType = yqvm.toolsFunc.createProxyObj(mimeType, MimeType, 'mimeType')
        yqvm.toolsFunc.setProtoArr.call(mimeType, 'description', mimeTypeJson.description)
        yqvm.toolsFunc.setProtoArr.call(mimeType, 'type', mimeTypeJson.type)
        yqvm.toolsFunc.setProtoArr.call(mimeType, 'suffixes', mimeTypeJson.suffixes)
        yqvm.toolsFunc.setProtoArr.call(mimeType, 'enabledPlugin', plugin)
        yqvm.toolsFunc.addMimeType(mimeType)
        return mimeType
    }
    // 创建plugin
    yqvm.toolsFunc.createPlugin = function createPlugin(data) {
        let plugin = {}
        let mimeTypes = data.mimeTypes;
        plugin = yqvm.toolsFunc.createProxyObj(plugin, Plugin, 'plugin')
        yqvm.toolsFunc.setProtoArr.call(plugin, 'description', data.description)
        yqvm.toolsFunc.setProtoArr.call(plugin, 'filename', data.filename)
        yqvm.toolsFunc.setProtoArr.call(plugin, 'name', data.name)
        yqvm.toolsFunc.setProtoArr.call(plugin, 'length', data.mimeTypes.length)
        for (let i = 0; i < mimeTypes.length; i++) {
            let mimeType = yqvm.toolsFunc.createMimeType(mimeTypes[i], plugin)
            plugin[i] = mimeType;
            Object.defineProperty(plugin, mimeTypes[i].type, { value: mimeType, writable: false, enumerable: false, configurable: true })
        }
        yqvm.toolsFunc.addPlugin(plugin)
        return plugin
    }
    // 解析URL属性
    yqvm.toolsFunc.parseUrl = function parseUrl(str) {
        if (!parseUrl || !parseUrl.options) {
            parseUrl.options = {
                strictMode: false,
                key: ["href", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "pathname", "directory", "file", "search", "hash"],
                q: {
                    name: "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                },
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                }
            };
        }
        if (!str) {
            return '';
        }
        var o = parseUrl.options,
            m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            urlJson = {},
            i = 14;
        while (i--) urlJson[o.key[i]] = m[i] || "";
        urlJson[o.q.name] = {};
        urlJson[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1) urlJson[o.q.name][$1] = $2;
        });
        delete urlJson["queryKey"];
        delete urlJson["userInfo"];
        delete urlJson["user"];
        delete urlJson["password"];
        delete urlJson["relative"];
        delete urlJson["directory"];
        delete urlJson["file"];
        urlJson["protocol"] += ":";
        urlJson["origin"] = urlJson["protocol"] + "//" + urlJson["host"];
        urlJson["search"] = urlJson["search"] && "?" + urlJson["search"];
        urlJson["hash"] = urlJson["hash"] && "#" + urlJson["hash"];
        return urlJson;
    }
    // 单标签字符串解析
    yqvm.toolsFunc.getTagJson = function getTagJson(tagStr) {
        let arrList = tagStr.match("<(.*?)>")[1].split(" ");
        let tagJson = {};
        tagJson["type"] = arrList[0];
        tagJson["prop"] = {};
        for (let i = 1; i < arrList.length; i++) {
            let item = arrList[i].split("=");
            let key = item[0];
            let value = item[1].replaceAll("\"", "").replaceAll("'", "");
            tagJson["prop"][key] = value;
        }
        return tagJson;
    }

    //从全局环境收集对象
    yqvm.toolsFunc.getCollection = function getCollection(type) {
        let collection = [];
        for (let i = 0; i < yqvm.memory.tag.length; i++) {
            let tag = yqvm.memory.tag[i];
            if (yqvm.toolsFunc.getType(tag) === type) {
                collection.push(tag);
            }
        }
        return collection;
    }
    //从全局环境返回对象
    yqvm.toolsFunc.getMemoryObj = function getMemoryObj(type) {
        let result = null
        for (let i = 0; i < yqvm.memory.tag.length; i++) {
            let tag = yqvm.memory.tag[i];
            if (tag['type'] === type) {
                result = tag
            }
        }
        return result
    }
    // 获取原型对象上自身属性值
    yqvm.toolsFunc.getProtoArr = function getProtoArr(key) {
        return this[yqvm.memory.symbolData] && this[yqvm.memory.symbolData][key];
    }
    // 设置原型对象上自身属性值
    yqvm.toolsFunc.setProtoArr = function setProtoArr(key, value) {
        if (!(yqvm.memory.symbolData in this)) {
            Object.defineProperty(this, yqvm.memory.symbolData, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: {}
            });
        }
        this[yqvm.memory.symbolData][key] = value;
    }


    //代理原型对象
    yqvm.toolsFunc.createProxyObj = function createProxy(obj, proto, name) {
        //可以对一个对象的原型链并代理这个对象,name是这个对象的名称
        Object.setPrototypeOf(obj, proto.prototype)
        return yqvm.toolsFunc.proxy(obj, `${name}_${yqvm.memory.globalVar.id++}`)
    }

    // hook 插件
    yqvm.toolsFunc.hook = function hook(func, funcInfo, isDebug, onEnter, onLeave, isExec) {
        // func ： 原函数，需要hook的函数
        // funcInfo: 是一个对象，objName，funcName属性
        // isDebug: 布尔类型, 是否进行调试，关键点定位，回溯调用栈
        // onEnter：函数， 原函数执行前执行的函数，改原函数入参，或者输出入参
        // onLeave： 函数，原函数执行完之后执行的函数，改原函数的返回值，或者输出原函数的返回值
        // isExec ： 布尔， 是否执行原函数，比如无限debuuger函数
        if (typeof func !== 'function') {
            return func;
        }
        if (funcInfo === undefined) {
            funcInfo = {};
            funcInfo.objName = "globalThis";
            funcInfo.funcName = func.name || '';
        }
        if (isDebug === undefined) {
            isDebug = false;
        }
        if (!onEnter) {
            onEnter = function (obj) {
                console.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
            }
        }
        if (!onLeave) {
            onLeave = function (obj) {
                console.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，返回值是[${obj.result}}]`);
            }
        }
        if (isExec === undefined) {
            isExec = true;
        }
        // 替换的函数
        let hookFunc = function () {
            if (isDebug) {
                debugger;
            }
            let obj = {};
            obj.args = [];
            for (let i = 0; i < arguments.length; i++) {
                obj.args[i] = arguments[i];
            }
            // 原函数执行前
            onEnter.call(this, obj); // onEnter(obj);
            // 原函数正在执行
            let result;
            if (isExec) {
                result = func.apply(this, obj.args);
            }
            obj.result = result;
            // 原函数执行后
            onLeave.call(this, obj); // onLeave(obj);
            // 返回结果
            return obj.result;
        }
        // hook 后的函数进行native
        yqvm.toolsFunc.setNative(hookFunc, funcInfo.funcName);
        yqvm.toolsFunc.reNameFunc(hookFunc, funcInfo.funcName);
        return hookFunc;
    }

    // hook 对象的属性，本质是替换属性描述符
    yqvm.toolsFunc.hookObj = function hookObj(obj, objName, propName, isDebug) {
        // obj :需要hook的对象
        // objName: hook对象的名字
        // propName： 需要hook的对象属性名
        // isDubug: 是否需要debugger
        let oldDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
        let newDescriptor = {};
        if (!oldDescriptor.configurable) { // 如果是不可配置的，直接返回
            return;
        }
        // 必须有的属性描述
        newDescriptor.configurable = true;
        newDescriptor.enumerable = oldDescriptor.enumerable;
        if (oldDescriptor.hasOwnProperty("writable")) {
            newDescriptor.writable = oldDescriptor.writable;
        }
        if (oldDescriptor.hasOwnProperty("value")) {
            let value = oldDescriptor.value;
            if (typeof value !== "function") {
                return;
            }
            let funcInfo = {
                "objName": objName,
                "funcName": propName
            }
            newDescriptor.value = yqvm.toolsFunc.hook(value, funcInfo, isDebug);
        }
        if (oldDescriptor.hasOwnProperty("get")) {
            let get = oldDescriptor.get;
            let funcInfo = {
                "objName": objName,
                "funcName": `get ${propName}`
            }
            newDescriptor.get = yqvm.toolsFunc.hook(get, funcInfo, isDebug);
        }
        if (oldDescriptor.hasOwnProperty("set")) {
            let set = oldDescriptor.set;
            let funcInfo = {
                "objName": objName,
                "funcName": `set ${propName}`
            }
            newDescriptor.set = yqvm.toolsFunc.hook(set, funcInfo, isDebug);
        }
        Object.defineProperty(obj, propName, newDescriptor);
    }

    // hook 原型对象的所有属性
    yqvm.toolsFunc.hookProto = function hookProto(proto, isDebug) {
        // proto :函数原型
        // isDebug: 是否debugger
        let protoObj = proto.prototype;
        let name = proto.name;
        for (const prop in Object.getOwnPropertyDescriptors(protoObj)) {
            yqvm.toolsFunc.hookObj(protoObj, `${name}.prototype`, prop, isDebug);
        }
        console.log(`hook ${name}.prototype`);
    }

    // 获取对象类型
    yqvm.toolsFunc.getType = function getType(obj) {
        return Object.prototype.toString.call(obj);
    }

    // 过滤代理属性
    yqvm.toolsFunc.filterProxyProp = function filterProxyProp(prop) {
        for (let i = 0; i < yqvm.memory.filterProxyProp.length; i++) {
            if (yqvm.memory.filterProxyProp[i] === prop || typeof prop === 'symbol') {
                return true;
            }
        }
        return false;
    }
    // 过滤代理日志属性
    yqvm.toolsFunc.filterLogProxyProp = function filterLogProxyProp(prop) {
        for (let i = 0; i < yqvm.memory.filterLogProxyProp.length; i++) {
            if (yqvm.memory.filterLogProxyProp[i] === prop || typeof prop === 'symbol') {
                return true;
            }
        }
        return false;
    }
    // Proxy
    yqvm.toolsFunc.proxy = function proxy(obj, objName) {
        // obj: 原始对象
        // objName: 原始对象的名字
        // 代理前需要注意,一些configuable为false的对象不可被代理,需要滤过
        let RawFatherObj
        if (Object.hasOwnProperty.call(obj, yqvm.memory.symbolRawFatherObj)) {
            RawFatherObj = obj[yqvm.memory.symbolRawFatherObj]
        } else {
            RawFatherObj = void 0
        }
        let RawName = Object.hasOwnProperty.call(obj, yqvm.memory.symbolRawName) && obj[yqvm.memory.symbolRawName]
        let propertyDes = RawFatherObj && Object.getOwnPropertyDescriptor(RawFatherObj, RawName)
        let configurable = propertyDes && propertyDes['configurable']
        if (configurable === false && !Object.hasOwnProperty.call(RawFatherObj, yqvm.memory.symbolToString)) { //构造函数默认prototype是不可配置的,这里用双层确认以过滤出内置对象
            return obj
        }
        if (!yqvm.config.proxy) {
            return obj;
        }
        if (Object.hasOwnProperty.call(obj, yqvm.memory.symbolProxy)) {
            return obj[yqvm.memory.symbolProxy]
        }
        let handler = {
            get: function (target, prop, receiver) {// 三个参数
                let result;
                //拦截
                //if (objName === 'window' && prop === 'Request') { debugger }
                try {//防止报错
                    result = Reflect.get(target, prop, receiver);
                    if (yqvm.toolsFunc.filterProxyProp(prop)) {
                        return result; //Proxy对象白名单
                    }
                    let type = yqvm.toolsFunc.getType(result);
                    if (result instanceof Object) {
                        console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                        //将原生父对象(相对于result)的地址存到result的symbol属性中,方便在apply行为中更改this指向
                        Object.defineProperty(result, yqvm.memory.symbolRawFatherObj, {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value: target
                        })
                        //将原生对象地址存到result的symbol属性中,方便在construct行为中更改this指向
                        Object.defineProperty(result, yqvm.memory.symbolRawSelfObj, {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value: result
                        })
                        //将对象名字存到result的symbol属性中,在过滤不可配置属性时(Object.hasOwnProperty)作为prop字符串
                        Object.defineProperty(result, yqvm.memory.symbolRawName, {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value: prop
                        })
                        // 递归代理
                        result = yqvm.toolsFunc.proxy(result, `${objName}.${prop.toString()}`);
                    } else if (typeof result === "symbol") {
                        console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result.toString()}]}`);
                    } else {
                        console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result}]}`);
                    }

                } catch (e) {
                    console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
                }
                return result;
            },
            set: function (target, prop, value, receiver) {
                let result;
                try {
                    result = Reflect.set(target, prop, value, receiver);
                    if (yqvm.toolsFunc.filterProxyProp(prop)) {
                        return result; //Proxy对象白名单
                    }
                    let type = yqvm.toolsFunc.getType(value);
                    if (value instanceof Object) {
                        console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                    } else if (typeof value === "symbol") {
                        console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value.toString()}]}`);
                    } else {
                        console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value}]}`);
                    }
                } catch (e) {
                    console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
                }
                return result;
            },
            // getOwnPropertyDescriptor: function (target, prop) {
            //     let result;// undefined, 描述符对象
            //     try {
            //         result = Reflect.getOwnPropertyDescriptor(target, prop);
            //         let type = yqvm.toolsFunc.getType(result);
            //         //过滤一些不希望输出的日志，如SymbolProxy,SymbolDate
            //         if (!yqvm.toolsFunc.filterLogProxyProp(prop)) {
            //             console.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
            //         }
            //         // if(typeof result !== "undefined"){
            //         //     result = yqvm.toolsFunc.proxy(result, `${objName}.${prop.toString()}.PropertyDescriptor`);
            //         // }
            //     } catch (e) {
            //         console.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
            //     }
            //     return result;
            // },
            // defineProperty: function (target, prop, descriptor) {
            //     let result;
            //     try {
            //         //将this执行原生对象
            //         //target=target[yqvm.memory.symbolRawFatherObj]
            //         result = Reflect.defineProperty(target, prop, descriptor);
            //         //过滤一些不希望输出的日志，如SymbolProxy,SymbolDate
            //         if (!yqvm.toolsFunc.filterLogProxyProp(prop)) {
            //             console.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}]}`);
            //         }

            //     } catch (e) {
            //         debugger
            //         console.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
            //     }
            //     return result;
            // },
            apply: function (target, thisArg, argumentsList) {
                // target: 函数对象
                // thisArg: 调用函数的this指针
                // argumentsList: 数组， 函数的入参组成的一个列表
                // debug
                //if (objName === 'Document_createElement_canvas_83.getContext') { debugger }
                let result;
                try {
                    result = Reflect.apply(target, thisArg, argumentsList);
                    let type = yqvm.toolsFunc.getType(result);
                    if (result instanceof Object) {
                        let result_objName = `${objName}_obj${yqvm.memory.globalVar.id++}`
                        result = yqvm.toolsFunc.proxy(result, result_objName) //让function返回的对象也自动套上代理
                        console.log(`{apply|function:[${objName}], args:${argumentsList}, type:[${type}]}`);
                    } else if (typeof result === "symbol") {
                        console.log(`{apply|function:[${objName}], args:${argumentsList}, result:[${result.toString()}]}`);
                    } else {
                        console.log(`{apply|function:[${objName}], args:${argumentsList}, result:[${result}]}`);
                    }
                } catch (e) {
                    console.log(`{apply|function:[${objName}],error:[${e.message}]}`);
                }
                return result;
            },
            construct: function (target, argArray, newTarget) {
                // target: 函数对象
                // argArray： 参数列表
                // newTarget：代理对象
                let result;
                try {
                    result = Reflect.construct(target, argArray, newTarget);
                    let type = yqvm.toolsFunc.getType(result);
                    console.log(`{construct|function:[${objName}], type:[${type}]}`);
                } catch (e) {
                    console.log(`{construct|function:[${objName}],error:[${e.message}]}`);
                }
                return result;

            },
            // deleteProperty: function (target, propKey) {
            //     let result = Reflect.deleteProperty(target, propKey);
            //     console.log(`{deleteProperty|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
            //     return result;
            // },
            // has: function (target, propKey) { // in 操作符
            //     let result = Reflect.has(target, propKey);
            //     if (!yqvm.toolsFunc.filterLogProxyProp(propKey)) {
            //         console.log(`{has|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
            //     }
            //     return result;
            // },
            // ownKeys: function (target) {
            //     let result = Reflect.ownKeys(target);
            //     console.log(`{ownKeys|obj:[${objName}]}`);
            //     return result
            // },
            // getPrototypeOf: function (target) {
            //     let result = Reflect.getPrototypeOf(target);
            //     console.log(`{getPrototypeOf|obj:[${objName}]}`);
            //     return result;
            // },
            // setPrototypeOf: function (target, proto) {
            //     let result = Reflect.setPrototypeOf(target, proto);
            //     console.log(`{setPrototypeOf|obj:[${objName}]}`);
            //     return result;
            // },
            // preventExtensions: function (target) {
            //     let result = Reflect.preventExtensions(target, proto);
            //     console.log(`{preventExtensions|obj:[${objName}]}`);
            //     return result;
            // },
            // isExtensible: function (target) {
            //     let result = Reflect.isExtensible(target, proto);
            //     console.log(`{isExtensible|obj:[${objName}]}`);
            //     return result;
            // }
        };
        let proxyObj = new Proxy(obj, handler);
        //防止重复代理，导致代理被用嵌套对比的方式检测出来
        Object.defineProperty(obj, yqvm.memory.symbolProxy, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: proxyObj
        })
        return proxyObj
    }
    // env函数分发器
    yqvm.toolsFunc.dispatch = function dispatch(self, obj, objName, funcName, argList, defaultValue) {
        let name = `${objName}_${funcName}`; // EventTarget_addEventListener
        if (Object.getOwnPropertyDescriptor(obj, "constructor") !== undefined) {
            if (Object.getOwnPropertyDescriptor(self, "constructor") !== undefined) {
                // 如果self 不是实例对象，则抛出异常
                return yqvm.toolsFunc.throwError('TypeError', 'Illegal invocation');
            }
        }
        try {
            return yqvm.envFunc[name].apply(self, argList);
        } catch (e) {
            if (defaultValue === undefined) {
                console.log(`[${name}]正在执行，错误信息: ${e.message}`);
            }
            return defaultValue;
        }
    }
    // 定义对象属性defineProperty
    yqvm.toolsFunc.defineProperty = function defineProperty(obj, prop, oldDescriptor) {
        let newDescriptor = {};
        newDescriptor.configurable = yqvm.config.proxy || oldDescriptor.configurable;// 如果开启代理必须是true
        newDescriptor.enumerable = oldDescriptor.enumerable;
        if (oldDescriptor.hasOwnProperty("writable")) {
            newDescriptor.writable = yqvm.config.proxy || oldDescriptor.writable;// 如果开启代理必须是true
        }
        if (oldDescriptor.hasOwnProperty("value")) {
            let value = oldDescriptor.value;
            if (typeof value === "function") {
                yqvm.toolsFunc.safeFunc(value, prop);
            }
            newDescriptor.value = value;
        }
        if (oldDescriptor.hasOwnProperty("get")) {
            let get = oldDescriptor.get;
            if (typeof get === "function") {
                yqvm.toolsFunc.safeFunc(get, `get ${prop}`);
            }
            newDescriptor.get = get;
        }
        if (oldDescriptor.hasOwnProperty("set")) {
            let set = oldDescriptor.set;
            if (typeof set === "function") {
                yqvm.toolsFunc.safeFunc(set, `set ${prop}`);
            }
            newDescriptor.set = set;
        }
        Object.defineProperty(obj, prop, newDescriptor);
    }
    // 函数native化
    !function () {
        const $toString = Function.prototype.toString;
        const myToString = function () {
            return typeof this === 'function' && this[yqvm.memory.symbolToString] || $toString.call(this);
        }

        function set_native(func, key, value) {
            Object.defineProperty(func, key, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: value
            });
        }

        delete Function.prototype.toString;
        set_native(Function.prototype, "toString", myToString);
        set_native(Function.prototype.toString, yqvm.memory.symbolToString, "function toString() { [native code] }");
        yqvm.toolsFunc.setNative = function (func, funcname) {
            set_native(func, yqvm.memory.symbolToString, `function ${funcname || func.name || ''}() { [native code] }`);
        }
    }();
    // 对象重命名
    yqvm.toolsFunc.reNameObj = function reNameObj(obj, name) {
        Object.defineProperty(obj.prototype, Symbol.toStringTag, {
            configurable: true,
            enumerable: false,
            value: name,
            writable: false
        });
    }
    // 函数重命名
    yqvm.toolsFunc.reNameFunc = function reNameFunc(func, name) {
        Object.defineProperty(func, "name", {
            configurable: true,
            enumerable: false,
            writable: false,
            value: name
        });
    }
    // 函数保护方法
    yqvm.toolsFunc.safeFunc = function safeFunc(func, name) {
        yqvm.toolsFunc.setNative(func, name);
        yqvm.toolsFunc.reNameFunc(func, name);
    }
    // 原型保护方法
    yqvm.toolsFunc.safeProto = function safeProto(obj, name) {
        yqvm.toolsFunc.setNative(obj, name);
        yqvm.toolsFunc.reNameObj(obj, name);
    }
    // 抛错函数
    yqvm.toolsFunc.throwError = function throwError(name, message) {
        let e = new Error();
        e.name = name;
        e.message = message;
        e.stack = `${name}: ${message}\n    at snippet://`;
        throw e;
    }
    // base64编码解码
    yqvm.toolsFunc.base64 = {};
    yqvm.toolsFunc.base64.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    yqvm.toolsFunc.base64.base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    yqvm.toolsFunc.base64.base64encode = function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(c1 >> 2);
                out += yqvm.toolsFunc.base64.base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(c1 >> 2);
                out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += yqvm.toolsFunc.base64.base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(c1 >> 2);
            out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += yqvm.toolsFunc.base64.base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
    yqvm.toolsFunc.base64.base64decode = function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = yqvm.toolsFunc.base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            /* c2 */
            do {
                c2 = yqvm.toolsFunc.base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = yqvm.toolsFunc.base64.base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = yqvm.toolsFunc.base64.base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }

}();
// 浏览器接口具体的实现
!function () {
    yqvm.envFunc.Document_createExpression = function Document_createExpression() {
        let result={}
        result=yqvm.toolsFunc.createProxyObj(result,XPathExpression,'Document_createExpression_XPathExpression')
        return result
    }
    yqvm.envFunc.Document_visibilityState_get = function Document_visibilityState_get() {
        return 'hidden';
    }
    yqvm.envFunc.location_replace = function location_replace() {
        return;
    }
    yqvm.envFunc.Document_body_set = function Document_body_set(obj) {
        yqvm.toolsFunc.setProtoArr.call(this, "body", obj);
    }
    yqvm.envFunc.Node_firstChild_get = function Node_firstChild_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "firstChild");
    }
    yqvm.envFunc.HTMLElement_onmouseenter_get = function HTMLElement_onmouseenter_get() {
        return null;
    }
    yqvm.envFunc.window_clientInformation_get = function window_clientInformation_get() {
        return navigator;
    }
    yqvm.envFunc.window_openDatabase = function window_openDatabase() {
        return {};
    }
    yqvm.envFunc.Element_tagName_get = function Element_tagName_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "tagName");
    }
    yqvm.envFunc.Crypto_getRandomValues = function Crypto_getRandomValues(array32, ...args) {
        return array32;
    }
    yqvm.envFunc.Node_parentElement_get = function Node_parentElement_get() {
        return {
            'removeChild': () => { }
        };
    }
    yqvm.envFunc.window_crypto_get = function window_crypto_get() {
        let window_crypto = {}
        yqvm.toolsFunc.createProxyObj(window_crypto, Crypto, 'window_crypto')
        return window_crypto
    }
    yqvm.envFunc.WebGLRenderingContext_getShaderPrecisionFormat = function WebGLRenderingContext_getShaderPrecisionFormat(value1, value2) {
        let result = null
        if (yqvm.memory.webgl_WebGLShaderPrecisionFormat[`${value1}_${value2}`]) {
            result = yqvm.memory.webgl_WebGLShaderPrecisionFormat[`${value1}_${value2}`]
        }
        return result
    }
    yqvm.envFunc.WebGLRenderingContext_getExtension = function WebGLRenderingContext_getExtension() {
        return {} //弄个假的,有进一步检测再说
    }
    yqvm.envFunc.WebGLRenderingContext_getSupportedExtensions = function WebGLRenderingContext_getSupportedExtensions() {
        return [
            "ANGLE_instanced_arrays",
            "EXT_blend_minmax",
            "EXT_color_buffer_half_float",
            "EXT_disjoint_timer_query",
            "EXT_float_blend",
            "EXT_frag_depth",
            "EXT_shader_texture_lod",
            "EXT_texture_compression_rgtc",
            "EXT_texture_filter_anisotropic",
            "EXT_sRGB",
            "KHR_parallel_shader_compile",
            "OES_element_index_uint",
            "OES_fbo_render_mipmap",
            "OES_standard_derivatives",
            "OES_texture_float",
            "OES_texture_float_linear",
            "OES_texture_half_float",
            "OES_texture_half_float_linear",
            "OES_vertex_array_object",
            "WEBGL_color_buffer_float",
            "WEBGL_compressed_texture_s3tc",
            "WEBGL_compressed_texture_s3tc_srgb",
            "WEBGL_debug_renderer_info",
            "WEBGL_debug_shaders",
            "WEBGL_depth_texture",
            "WEBGL_draw_buffers",
            "WEBGL_lose_context",
            "WEBGL_multi_draw"
        ]
    }
    yqvm.envFunc.WebGLRenderingContext_drawArrays = function WebGLRenderingContext_drawArrays() {
    }
    yqvm.envFunc.WebGLRenderingContext_uniform2f = function WebGLRenderingContext_uniform2f() {
    }
    yqvm.envFunc.WebGLRenderingContext_vertexAttribPointer = function WebGLRenderingContext_vertexAttribPointer() {
    }
    yqvm.envFunc.WebGLRenderingContext_enableVertexAttribArray = function WebGLRenderingContext_enableVertexAttribArray() {
    }
    yqvm.envFunc.WebGLRenderingContext_getUniformLocation = function WebGLRenderingContext_getUniformLocation() {
        let webGLUniformLocation = {}
        yqvm.toolsFunc.createProxyObj(webGLUniformLocation, WebGLUniformLocation, 'webGLUniformLocation')
        return webGLUniformLocation
    }
    yqvm.envFunc.WebGLRenderingContext_getAttribLocation = function WebGLRenderingContext_getAttribLocation() {
        return 0
    }
    yqvm.envFunc.WebGLRenderingContext_useProgram = function WebGLRenderingContext_useProgram() {
    }
    yqvm.envFunc.WebGLRenderingContext_linkProgram = function WebGLRenderingContext_linkProgram() {
    }
    yqvm.envFunc.WebGLRenderingContext_attachShader = function WebGLRenderingContext_attachShader() {
    }
    yqvm.envFunc.WebGLRenderingContext_compileShader = function WebGLRenderingContext_compileShader() {
    }
    yqvm.envFunc.WebGLRenderingContext_shaderSource = function WebGLRenderingContext_shaderSource() {
    }
    yqvm.envFunc.WebGLRenderingContext_bufferData = function WebGLRenderingContext_bufferData() {
    }
    yqvm.envFunc.WebGLRenderingContext_bindBuffer = function WebGLRenderingContext_bindBuffer() {
    }
    yqvm.envFunc.CanvasRenderingContext2D_fillText = function CanvasRenderingContext2D_fillText() {
    }
    yqvm.envFunc.CanvasRenderingContext2D_fillRect = function CanvasRenderingContext2D_fillRect() {
    }
    yqvm.envFunc.CanvasRenderingContext2D_fillStyle_get = function CanvasRenderingContext2D_fillStyle_get() {
        yqvm.toolsFunc.getProtoArr.call(this, "fillStyle");
    }
    yqvm.envFunc.CanvasRenderingContext2D_fillStyle_set = function CanvasRenderingContext2D_fillStyle_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "fillStyle", value);
    }
    yqvm.envFunc.CanvasRenderingContext2D_font_get = function CanvasRenderingContext2D_font_get() {
        yqvm.toolsFunc.getProtoArr.call(this, "font");
    }
    yqvm.envFunc.CanvasRenderingContext2D_font_set = function CanvasRenderingContext2D_font_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "font", value);
    }
    yqvm.envFunc.CanvasRenderingContext2D_textBaseline_get = function CanvasRenderingContext2D_textBaseline_get() {
        yqvm.toolsFunc.getProtoArr.call(this, "textBaseline");
    }
    yqvm.envFunc.CanvasRenderingContext2D_textBaseline_set = function CanvasRenderingContext2D_textBaseline_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "textBaseline", value);
    }
    yqvm.envFunc.Document_onselectionchange_get = function Document_onselectionchange_get() {
        return null
    }
    yqvm.envFunc.Document_onmousemove_get = function Document_onmousemove_get() {
        return null
    }
    yqvm.envFunc.Navigator_webkitPersistentStorage_get = function Navigator_webkitPersistentStorage_get() {
        let NavWebkitPersistentStorage = {}
        yqvm.toolsFunc.createProxyObj(NavWebkitPersistentStorage, Object, 'NavWebkitPersistentStorage')
        return NavWebkitPersistentStorage
    }
    yqvm.envFunc.HTMLElement_onresize_get = function HTMLElement_onresize_get() {
        return null
    }
    yqvm.envFunc.Navigator_connection_get = function Navigator_connection_get() {
        let NavConnection = {}
        yqvm.toolsFunc.createProxyObj(NavConnection, NetworkInformation, 'NavConnection')
        return NavConnection
    }
    yqvm.envFunc.Element_getAttribute = function Element_getAttribute() {
        let result=yqvm.toolsFunc.getProtoArr.call(this, arguments[0]) || null
        return result

    }
    yqvm.envFunc.Document_scrollingElement_get = function Document_scrollingElement_get() {
        let html = {}
        yqvm.toolsFunc.createProxyObj(html, HTMLHtmlElement, 'Document_scrollingElement')
        return html
    }
    yqvm.envFunc.Document_hidden_get = function Document_hidden_get() {
        return false
    }
    yqvm.envFunc.IDBOpenDBRequest_onupgradeneeded_set = function IDBRequest_onupgradeneeded_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "onupgradeneeded", value);
    }
    yqvm.envFunc.IDBOpenDBRequest_onupgradeneeded_get = function IDBOpenDBRequest_onupgradeneeded_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "onupgradeneeded");
    }
    yqvm.envFunc.IDBRequest_onerror_set = function IDBRequest_onerror_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "onerror", value);
    }
    yqvm.envFunc.IDBRequest_onerror_get = function IDBRequest_onerror_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "onerror");
    }
    yqvm.envFunc.IDBRequest_onsuccess_set = function IDBRequest_onsuccess_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "onsuccess", value);
    }
    yqvm.envFunc.IDBRequest_onsuccess_get = function IDBRequest_onsuccess_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "onsuccess");
    }
    yqvm.envFunc.Document_documentElement_get = function Document_documentElement_get() {
        let html = {}
        yqvm.toolsFunc.createProxyObj(html, HTMLHtmlElement, 'html')
        return html
    }
    yqvm.envFunc.IDBFactory_open = function IDBFactory_open() {
        let iDBFactory = {}
        yqvm.toolsFunc.createProxyObj(iDBFactory, IDBOpenDBRequest, 'iDBFactory')
        return IDBFactory
    }
    yqvm.envFunc.window_indexedDB_get = function window_indexedDB_get() {
        let indexDB = {}
        yqvm.toolsFunc.createProxyObj(indexDB, IDBFactory, 'indexDB')
        return indexDB
    }
    yqvm.envFunc.Navigator_languages_get = function Navigator_languages_get() {
        return ['zh-CN']
    }
    yqvm.envFunc.Document_characterSet_get = function Document_characterSet_get() {
        return 'UTF-8'
    }
    yqvm.envFunc.Element_innerHTML_get = function Element_innerHTML_get() {
        return yqvm.toolsFunc.getProtoArr(this, 'innerHTML')
    }
    yqvm.envFunc.Element_getElementsByTagName = function Element_getElementsByTagName() {
        let tagName = arguments[0].toLowerCase()
        let collection = []
        switch (tagName) {
            case 'i':
                collection = yqvm.toolsFunc.getCollection('[object HTMLElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Element_getElementsByTagName_${tagName}`)
                break
            default:
                console.log(`Document_getElementsByTagName_${tagName}未实现`)
                break
        }
        return collection
    }
    yqvm.envFunc.window_DOMParser = function window_DOMParser() {
        let DOMParser = function () {
        }
        yqvm.toolsFunc.safeFunc(DOMParser, 'DOMParser')
        return DOMParser
    }
    yqvm.envFunc.window_setInterval = function window_setInterval() {
        let func = arguments[0];
        let delay = arguments[1] || 0;
        let length = arguments.length;
        let args = [];
        for (let i = 2; i < length; i++) {
            args.push(arguments[i]);
        }
        let type = 1;
        if (typeof func !== "function") {
            type = 0;
        }
        yqvm.memory.globalVar.timeoutID += 1;
        let event = {
            "callback": func,
            "delay": delay,
            "args": args,
            "type": type, // 1代表函数，0代表是字符串代码,eval(code);
            "timeoutID": yqvm.memory.globalVar.timeoutID,
            'outer_type': 'setInterval',
            'seq': yqvm.memory.globalVar.asyncSeq++
        }
        if (yqvm.memory.asyncTask.setInterval === undefined) {
            yqvm.memory.asyncTask.setInterval = [];
        }
        yqvm.memory.asyncTask.setInterval.push(event);
        console.log(`setInterval(${func.name},${delay}) 正在注册`)
        return yqvm.memory.globalVar.timeoutID;
    }
    yqvm.envFunc.Document_scripts_get = function Document_scripts_get() {
        let script = {}
        yqvm.toolsFunc.createProxyObj(script, HTMLScriptElement, 'script')
        return script
    }
    yqvm.envFunc.Event_timeStamp_get = function Event_timeStamp_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'timeStamp')
    }
    yqvm.envFunc.MouseEvent_clientY_get = function MouseEvent_clientY_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'clientY')
    }
    yqvm.envFunc.MouseEvent_clientX_get = function MouseEvent_clientX_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'clientX')
    }
    yqvm.envFunc.EventTarget_addEventListener = function EventTarget_addEventListener() {
        let default_delay = 20000
        let type = arguments[0];
        if (type === 'load') { default_delay = 0 }
        let listener = arguments[1];
        let options = arguments[2];
        let event = {
            "self": this,
            "listener": listener,
            "options": options,
            'outer_type': 'addEventListener',
            'inner_type': type,
            'delay': default_delay,
            'seq': yqvm.memory.globalVar.asyncSeq++
        }
        if (yqvm.memory.asyncTask.listener === undefined) {
            yqvm.memory.asyncTask.listener = {};
        }
        if (yqvm.memory.asyncTask.listener[type] === undefined) {
            yqvm.memory.asyncTask.listener[type] = [];
        }
        console.log(`${this}.addEventListener(${type}|${listener.name}) > 正在注册`)
        yqvm.memory.asyncTask.listener[type].push(event);
    }
    yqvm.envFunc.BatteryManager_level_get = function BatteryManager_level_get() {
        return 1;
    }
    yqvm.envFunc.BatteryManager_chargingTime_get = function BatteryManager_chargingTime_get() {
        return 0;
    }
    yqvm.envFunc.BatteryManager_charging_get = function BatteryManager_charging_get() {
        return true;
    }
    yqvm.envFunc.Navigator_getBattery = function Navigator_getBattery() {
        let batteryManager = {};
        batteryManager = yqvm.toolsFunc.createProxyObj(batteryManager, BatteryManager, "batteryManager");
        let obj = {
            "then": function (callBack) {
                let _callBack = callBack;
                callBack = function () {
                    return _callBack(batteryManager);
                }
                if (yqvm.memory.asyncTask.promise === undefined) {
                    yqvm.memory.asyncTask.promise = [];
                }
                yqvm.memory.asyncTask.promise.push(callBack);
            }
        } //是这个含有.then属性的对象当前期约对象返回
        return obj;
    }
    yqvm.envFunc.window_clearTimeout = function window_clearTimeout() {
        let timeoutID = arguments[0];
        for (let i = 0; i < yqvm.memory.asyncTask.setTimeout.length; i++) {
            let event = yqvm.memory.asyncTask.setTimeout[i];
            if (event.timeoutID === timeoutID) {
                delete yqvm.memory.asyncTask.setTimeout[i];
            }
        }
    }
    yqvm.envFunc.window_setTimeout = function window_setTimeout() {
        let func = arguments[0];
        let delay = arguments[1] || 0;
        let length = arguments.length;
        let args = [];
        for (let i = 2; i < length; i++) {
            args.push(arguments[i]);
        }
        let type = 1;
        if (typeof func !== "function") {
            type = 0;
        }
        yqvm.memory.globalVar.timeoutID += 1;
        let event = {
            "callback": func,
            "delay": delay,
            "args": args,
            "type": type, // 1代表函数，0代表是字符串代码,eval(code);
            "timeoutID": yqvm.memory.globalVar.timeoutID,
            'outer_type': 'setTimeout',
            'seq': yqvm.memory.globalVar.asyncSeq++
        }
        if (yqvm.memory.asyncTask.setTimeout === undefined) {
            yqvm.memory.asyncTask.setTimeout = [];
        }
        yqvm.memory.asyncTask.setTimeout.push(event);
        console.log(`setTimeout(${func.name},${delay}) 正在注册`)
        return yqvm.memory.globalVar.timeoutID;
    }
    yqvm.envFunc.XMLHttpRequest_open = function XMLHttpRequest_open() {
        // 浏览器接口
        let method = arguments[0];
        let url = arguments[1];
        console.log(`xmlrequest_open正在调用, url: ${url}`)
        return url;
    }
    yqvm.envFunc.HTMLElement_offsetHeight_get = function HTMLElement_offsetHeight_get() {
        let fontFamily = this.style.fontFamily;
        if (yqvm.memory.globalVar.fontList.indexOf(fontFamily) !== -1) {// 能够识别的字体
            return 99;
        } else { // 无法识别的字体
            return 131;
        }
    }
    yqvm.envFunc.HTMLElement_offsetWidth_get = function HTMLElement_offsetWidth_get() {
        let fontFamily = this.style.fontFamily;
        if (yqvm.memory.globalVar.fontList.indexOf(fontFamily) !== -1) {// 能够识别的字体
            return 999;
        } else { // 无法识别的字体
            return 1134;
        }
    }
    yqvm.envFunc.Element_children_get = function Element_children_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "children");
    }
    yqvm.envFunc.Node_appendChild = function Node_appendChild() {
        let tag = arguments[0];
        let collection = [];
        collection.push(tag);
        collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, "collection");
        yqvm.toolsFunc.setProtoArr.call(this, "children", collection);
        return tag;
    }
    yqvm.envFunc.Document_body_get = function Document_body_get() {
        // document.body对象,不考虑set
        let body = yqvm.memory.tag.find((ele) => { return Object.prototype.toString.call(ele) === '[object HTMLBodyElement]' }) || yqvm.envFunc.Document_createElement('body')
        return body
    }
    yqvm.envFunc.Element_innerHTML_set = function Element_innerHTML_set(value) {
        let html2obj = dom_parse(value)
        let label = html2obj[0]['name'] //标签类型
        if (!label) { //如果是非标签则不解析
            yqvm.toolsFunc.setProtoArr.call(this, "innerHTML", value)
            return value
        }
        let style = yqvm.toolsFunc.createProxyObj({}, CSSStyleDeclaration, "style"); //style对象
        let raw_style = html2obj[0]['attribs'].style
        let innerText = html2obj[0]['children'][0]['data']
        //解析并设置style
        raw_style = raw_style && raw_style.split(';')
        for (let i = 0; i < raw_style.length; i++) {
            k_v = raw_style[i].split(':')
            style[yqvm.toolsFunc.toCamelCase(k_v[0])] = k_v[1] //fontFamiy是style自身上的属性,需要注意转小驼峰
        }
        let span = {
            label: label,
            style: style,
            innerText: innerText,
        }
        span = yqvm.toolsFunc.createProxyObj(span, HTMLSpanElement, "span");
        yqvm.toolsFunc.setProtoArr.call(this, "innerHTML", value)
        yqvm.toolsFunc.setProtoArr.call(this, "children", [span])
        return value
    }
    yqvm.envFunc.Navigator_plugins_get = function Navigator_plugins_get() {
        return yqvm.memory.globalVar.pluginArray
    }
    yqvm.envFunc.WebGLRenderingContext_canvas_get = function WebGLRenderingContext_canvas_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "canvas")
    }
    yqvm.envFunc.WebGLRenderingContext_createBuffer = function WebGLRenderingContext_createBuffer() {
        let buffer = {}
        buffer = yqvm.toolsFunc.createProxyObj(buffer, WebGLBuffer, 'buffer')
        return buffer
    }
    yqvm.envFunc.WebGLRenderingContext_createShader = function WebGLRenderingContext_createShader() {
        let shader = {}
        shader = yqvm.toolsFunc.createProxyObj(shader, WebGLShader, 'shader')
        return shader
    }
    yqvm.envFunc.WebGLRenderingContext_createProgram = function WebGLRenderingContext_createProgram() {
        let program = {}
        program = yqvm.toolsFunc.createProxyObj(program, WebGLProgram, 'program')
        return program
    }
    yqvm.envFunc.MimeTypeArray_namedItem = function MimeTypeArray_namedItem(name) {
        return this[name]
    }
    yqvm.envFunc.MimeTypeArray_item = function MimeTypeArray_item(index) {
        return this[index]
    }
    yqvm.envFunc.Plugin_namedItem = function Plugin_namedItem(name) {
        return this[name]
    }
    yqvm.envFunc.Plugin_item = function Plugin_item(index) {
        return this[index]
    }
    yqvm.envFunc.PluginArray_namedItem = function PluginArray_namedItem(name) {
        return this[name]
    }
    yqvm.envFunc.PluginArray_item = function PluginArray_item(index) {
        return this[index]
    }
    yqvm.envFunc.Plugin_description_get = function Plugin_description_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'description')
    }
    yqvm.envFunc.Plugin_filename_get = function Plugin_filename_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'filename')
    }
    yqvm.envFunc.Plugin_length_get = function Plugin_length_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'length')
    }
    yqvm.envFunc.MimeType_suffixes_get = function MimeType_suffixes_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'suffixes')
    }
    yqvm.envFunc.MimeType_enabledPlugin_get = function MimeType_enabledPlugin_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'enabledPlugin')
    }
    yqvm.envFunc.MimeType_description_get = function MimeType_description_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'description')
    }
    yqvm.envFunc.Navigator_mimeTypes_get = function Navigator_mimeTypes_get() {
        return yqvm.memory.globalVar.mimeTypeArray
    }
    yqvm.envFunc.PluginArray_length_get = function PluginArray_length_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'length')
    }
    yqvm.envFunc.Plugin_name_get = function Plugin_name_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'name')
    }
    yqvm.envFunc.MimeType_type_get = function MimeType_type_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'type')
    }
    yqvm.envFunc.MimeTypeArray_length_get = function MimeTypeArray_length_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, 'length')
    }
    yqvm.envFunc.location_hostname_get = function location_hostname_get() {
        hostname = yqvm.toolsFunc.getProtoArr.call(this, "hostname")
        if (!hostname) {
            throw new Error
        }
        return hostname
    }
    yqvm.envFunc.location_hostname_set = function location_hostname_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "hostname", value);
    }
    yqvm.envFunc.location_protocol_get = function location_protocol_get() {
        protocol = yqvm.toolsFunc.getProtoArr.call(this, "protocol")
        if (!protocol) {
            throw new Error
        }
        return protocol
    }
    yqvm.envFunc.location_protocol_set = function location_protocol_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "protocol", value);
    }
    yqvm.envFunc.HTMLCanvasElement_width_set = function HTMLCanvasElement_width_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "width", value);
    }
    yqvm.envFunc.HTMLCanvasElement_toDataURL = function HTMLCanvasElement_toDataURL() {
        let type = yqvm.toolsFunc.getProtoArr.call(this, "type");
        if (type === "2d") {
            if (yqvm.memory.globalVar.canvas_2d) {
                return yqvm.memory.globalVar.canvas_2d
            }
            else {
                console.log('yqvm.memory.globalVar.canvas_2d 未补充')
            };
        } else if (type === "webgl") {
            if (yqvm.memory.globalVar.canvas_webgl) {
                return yqvm.memory.globalVar.canvas_webgl;
            }
            else {
                console.log('yqvm.memory.globalVar.canvas_webgl 未补充')
            }
        }
    }
    yqvm.envFunc.HTMLCanvasElement_getContext = function HTMLCanvasElement_getContext() {
        let type = arguments[0];
        let context = {};
        switch (type) {
            case "2d":
                context = yqvm.toolsFunc.createProxyObj(context, CanvasRenderingContext2D, "context_2d");
                yqvm.toolsFunc.setProtoArr.call(context, "canvas", this);
                yqvm.toolsFunc.setProtoArr.call(this, "type", type);
                break;
            case "webgl":
                context = yqvm.toolsFunc.createProxyObj(context, WebGLRenderingContext, "context_webgl");
                yqvm.toolsFunc.setProtoArr.call(context, "canvas", this);
                yqvm.toolsFunc.setProtoArr.call(this, "type", type);
                break;
            default:
                console.log(`HTMLCanvasElement_getContext_${type}未实现`);
                break;
        }
        return context;
    }
    yqvm.envFunc.HTMLElement_style_get = function HTMLElement_style_get() {
        let style = yqvm.toolsFunc.getProtoArr.call(this, "style");
        if (style === undefined) {
            style = yqvm.toolsFunc.createProxyObj({}, CSSStyleDeclaration, "style");
        }
        return style;
    }
    yqvm.envFunc.HTMLElement_style_set = function HTMLElement_style_set(obj) {
        yqvm.toolsFunc.setProtoArr.call(this, "style", obj);
    }
    yqvm.envFunc.HTMLCanvasElement_height_set = function HTMLCanvasElement_height_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "height", value);
    }
    yqvm.envFunc.HTMLAnchorElement_host_get = function HTMLAnchorElement_host_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "host");
    }
    yqvm.envFunc.HTMLAnchorElement_pathname_get = function HTMLAnchorElement_pathname_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "pathname");
    }
    yqvm.envFunc.HTMLAnchorElement_port_get = function HTMLAnchorElement_port_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "port");
    }
    yqvm.envFunc.HTMLAnchorElement_hash_get = function HTMLAnchorElement_hash_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "hash");
    }
    yqvm.envFunc.HTMLAnchorElement_origin_get = function HTMLAnchorElement_origin_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "origin");
    }
    yqvm.envFunc.HTMLAnchorElement_search_get = function HTMLAnchorElement_search_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "search");
    }
    yqvm.envFunc.HTMLAnchorElement_hostname_get = function HTMLAnchorElement_hostname_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "hostname");
    }
    yqvm.envFunc.HTMLAnchorElement_protocol_get = function HTMLAnchorElement_protocol_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "protocol");
    }
    yqvm.envFunc.HTMLAnchorElement_href_get = function HTMLAnchorElement_href_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "href");
    }
    yqvm.envFunc.HTMLAnchorElement_href_set = function HTMLAnchorElement_href_set() {
        let url = arguments[0].replace(/(\.\/)/g, '\/');
        if (url.indexOf("http") === -1) {
            url = location.protocol + "//" + location.hostname + url;
        }
        let jsonUrl = yqvm.toolsFunc.parseUrl(url);
        yqvm.toolsFunc.setProtoArr.call(this, "origin", jsonUrl["origin"]);
        yqvm.toolsFunc.setProtoArr.call(this, "protocol", jsonUrl["protocol"]);
        yqvm.toolsFunc.setProtoArr.call(this, "host", jsonUrl["host"]);
        yqvm.toolsFunc.setProtoArr.call(this, "hostname", jsonUrl["hostname"]);
        yqvm.toolsFunc.setProtoArr.call(this, "port", jsonUrl["port"]);
        yqvm.toolsFunc.setProtoArr.call(this, "pathname", jsonUrl["pathname"]);
        yqvm.toolsFunc.setProtoArr.call(this, "search", jsonUrl["search"]);
        yqvm.toolsFunc.setProtoArr.call(this, "hash", jsonUrl["hash"]);
        yqvm.toolsFunc.setProtoArr.call(this, "href", jsonUrl["href"]);
    }
    yqvm.envFunc.HTMLInputElement_value_get = function HTMLInputElement_value_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "value");
    }
    yqvm.envFunc.HTMLInputElement_value_set = function HTMLInputElement_value_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "value", value);
    }
    yqvm.envFunc.HTMLInputElement_name_get = function HTMLInputElement_name_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "name");
    }
    yqvm.envFunc.HTMLInputElement_name_set = function HTMLInputElement_name_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "name", value);
    }
    yqvm.envFunc.Element_id_get = function Element_id_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "id");
    }
    yqvm.envFunc.Element_id_set = function Element_id_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "id", value);
    }
    yqvm.envFunc.HTMLInputElement_type_get = function HTMLInputElement_type_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "type");
    }
    yqvm.envFunc.HTMLInputElement_type_set = function HTMLInputElement_type_set() {
        let value = arguments[0];
        yqvm.toolsFunc.setProtoArr.call(this, "type", value);
    }
    yqvm.envFunc.Node_removeChild = function Node_removeChild() {
        let tag = arguments[0]
        for (let i = 0; i < yqvm.memory.tag.length; i++) {
            if (tag === yqvm.memory.tag[i]) {
                delete yqvm.memory.tag[i]
            }
        }
    }
    yqvm.envFunc.Node_parentNode_get = function Node_parentNode_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "parentNode");
    }
    yqvm.envFunc.Node_parentNode_set = function Node_parentNode_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "parentNode", value);
    }
    yqvm.envFunc.HTMLMetaElement_content_get = function HTMLMetaElement_content_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "content");
    }
    yqvm.envFunc.HTMLMetaElement_content_set = function HTMLMetaElement_content_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "content", value);
    }
    yqvm.envFunc.HTMLDivElement_align_get = function HTMLDivElement_align_get() {
        return yqvm.toolsFunc.getProtoArr.call(this, "align");
    }
    yqvm.envFunc.HTMLDivElement_align_set = function HTMLDivElement_align_set() {
        let value = arguments[0];
        return yqvm.toolsFunc.setProtoArr.call(this, "align", value);
    }
    yqvm.envFunc.Document_createElement = function Document_createElement() {
        let tagName = arguments[0].toLowerCase();
        let options = arguments[1];
        let tag={};
        switch (tagName) {
            case 'div':
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLDivElement, `Document_createElement_${tagName}`)
                break
            case 'meta':
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLMetaElement, `Document_createElement_${tagName}`)
                break
            case 'head':
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLHeadElement, `Document_createElement_${tagName}`)
                break
            case "input":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLInputElement, `Document_createElement_${tagName}`);
                break;
            case "a":
                console.log('Document_createElement 正在创建[a]标签')
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLAnchorElement, `Document_createElement_${tagName}`);
                break;
            case "canvas":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLCanvasElement, `Document_createElement_${tagName}`);
                break;
            case "span":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLSpanElement, `Document_createElement_${tagName}`);
                break;
            case "body":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLBodyElement, `Document_createElement_${tagName}`);
                break;
            case "i":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLElement, `Document_createElement_${tagName}`);
                break;
            case "form":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLElement, `Document_createElement_${tagName}`);
                break;
            case "script":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLScriptElement, `Document_createElement_${tagName}`);
                break;
            default:
                console.log(`Document_createElement_${tagName}未实现`)
                break
        }
        if (Object.hasOwnProperty.call(tag, yqvm.memory.symbolProxy)) {
            yqvm.toolsFunc.setProtoArr.call(tag, "tagName",tagName.toUpperCase())
            yqvm.memory.tag.push(tag)
        }
        return tag
    }
    yqvm.envFunc.Document_write = function Document_write() {
        let tagStr = arguments[0];
        // 解析标签字符串
        // '<input type="hidden" id="test" name="inputTag" value="666">'
        let tagJson = yqvm.toolsFunc.getTagJson(tagStr);
        let tag = document.createElement(tagJson.type);
        for (const key in tagJson.prop) {
            tag[key] = tagJson.prop[key];
            if (tag[key] === undefined) {
                yqvm.toolsFunc.setProtoArr.call(tag, key, tagJson.prop[key]); //也就是说这个属性属于原型对象属性
            }
        }
    }
    yqvm.envFunc.Document_cookie_get = function Document_cookie_get() {
        let jsonCookie = yqvm.memory.globalVar.jsonCookie;
        let tempCookie = "";
        for (const key in jsonCookie) {
            if (key === "") {
                tempCookie += `${jsonCookie[key]}; `;
            } else {
                tempCookie += `${key}=${jsonCookie[key]}; `;
            }
        }
        return tempCookie;
    }
    yqvm.envFunc.Document_cookie_set = function Document_cookie_set() {
        let cookieValue = arguments[0];
        let index = cookieValue.indexOf(";");
        if (index !== -1) {
            cookieValue = cookieValue.substring(0, index);
        }
        if (cookieValue.indexOf("=") === -1) {
            yqvm.memory.globalVar.jsonCookie[""] = cookieValue.trim();
        } else {
            let item = cookieValue.split("=");
            let k = item[0].trim();
            let v = item[1].trim();
            yqvm.memory.globalVar.cookieJson[k] = v;
        }
        console.log(`Document_cookie_set: [value:${arguments[0]}, length:${arguments[0].length}]`)
        return cookieValue
    }
    yqvm.envFunc.Document_cookie_get = function Document_cookie_get() {
        let cookieJson = yqvm.memory.globalVar.cookieJson
        let cookieStr = ''
        for (let key in cookieJson) {
            cookieStr += `${key}=${cookieJson[key]}; `
        }
        return cookieStr
    }
    yqvm.envFunc.Document_getElementById = function Document_getElementById() {
        let id = arguments[0];
        let tags = yqvm.memory.tag;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i]) {
                if (tags[i].id === id) {
                    return tags[i];
                }
            }
        }
        return null;
    }
    yqvm.envFunc.Document_getElementsByTagName = function Document_getElementsByTagName() {
        let tagName = arguments[0].toLowerCase()
        let collection = []
        switch (tagName) {
            case 'meta':
                collection = yqvm.toolsFunc.getCollection('[object HTMLMetaElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            case 'i':
                collection = yqvm.toolsFunc.getCollection('[object HTMLElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            case 'script':
                collection = yqvm.toolsFunc.getCollection('[object HTMLScriptElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            case 'base':
                collection = yqvm.toolsFunc.getCollection('[object HTMLBaseElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            default:
                console.log(`Document_getElementsByTagName_${tagName}未实现`)
                break
        }
        return collection
    }
    yqvm.envFunc.Storage_key = function Storage_key() {
        let index = arguments[0]
        let i = 0
        for (const key in this) {
            if (i === index) {
                return key
            }
            i++
        }
        return null
    }
    yqvm.envFunc.Storage_clear = function Storage_clear() {
        let props = Object.getOwnPropertyDescriptors(this)
        for (let key in props) {
            delete this[key]
        }
    }
    yqvm.envFunc.Storage_removeItem = function Storage_removeItem() {
        let key = arguments[0]
        delete this[key]
    }
    yqvm.envFunc.Storage_length_get = function Storage_length_get() {
        let i = 0
        for (const key in Object.getOwnPropertyDescriptors(this)) {
            i++;
        }
        return i
    }
    yqvm.envFunc.Storage_setItem = function Storage_setItem() {
        let key = arguments[0]
        let value = arguments[1]
        this[key] = value
    }
    yqvm.envFunc.Storage_getItem = function Storage_getItem() {
        let key = arguments[0];
        if (key in this) {
            return this[key];
        }
        return null;
    }
    yqvm.envFunc.document_location_get = function document_location_get() {
        return location;
    }
    yqvm.envFunc.window_self_get = function window_self_get() {
        return window;
    }
    yqvm.envFunc.window_top_get = function window_top_get() {
        return window;
    }
    yqvm.envFunc.window_parent_get = function window_parent_get() {
        return window;
    }
}();

// env相关代码// EventTarget对象
EventTarget = function EventTarget(){}
yqvm.toolsFunc.safeProto(EventTarget, "EventTarget");
yqvm.toolsFunc.defineProperty(EventTarget.prototype, "addEventListener", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, EventTarget.prototype, "EventTarget", "addEventListener", arguments)}});
yqvm.toolsFunc.defineProperty(EventTarget.prototype, "dispatchEvent", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, EventTarget.prototype, "EventTarget", "dispatchEvent", arguments)}});
yqvm.toolsFunc.defineProperty(EventTarget.prototype, "removeEventListener", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, EventTarget.prototype, "EventTarget", "removeEventListener", arguments)}});

// XPathExpression对象
XPathExpression = function XPathExpression(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(XPathExpression, "XPathExpression");
yqvm.toolsFunc.defineProperty(XPathExpression.prototype, "evaluate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XPathExpression.prototype, "XPathExpression", "evaluate", arguments)}});

// Request对象
Request = function Request(){return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'Request': 1 argument required, but only 0 present.")}
yqvm.toolsFunc.safeProto(Request, "Request");
yqvm.toolsFunc.defineProperty(Request.prototype, "method", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "method_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "url", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "url_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "headers", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "headers_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "destination", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "destination_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "referrer", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "referrer_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "referrerPolicy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "referrerPolicy_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "mode", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "mode_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "credentials", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "credentials_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "cache", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "cache_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "redirect", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "redirect_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "integrity", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "integrity_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "keepalive", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "keepalive_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "signal", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "signal_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "isHistoryNavigation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "isHistoryNavigation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "bodyUsed", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "bodyUsed_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Request.prototype, "arrayBuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "arrayBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(Request.prototype, "blob", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "blob", arguments)}});
yqvm.toolsFunc.defineProperty(Request.prototype, "clone", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "clone", arguments)}});
yqvm.toolsFunc.defineProperty(Request.prototype, "formData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "formData", arguments)}});
yqvm.toolsFunc.defineProperty(Request.prototype, "json", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "json", arguments)}});
yqvm.toolsFunc.defineProperty(Request.prototype, "text", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "text", arguments)}});
yqvm.toolsFunc.defineProperty(Request.prototype, "body", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Request.prototype, "Request", "body_get", arguments)}, set:undefined});

// TextTrackList对象
TextTrackList = function TextTrackList(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(TextTrackList, "TextTrackList");
Object.setPrototypeOf(TextTrackList.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(TextTrackList.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(TextTrackList.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "onchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "onchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(TextTrackList.prototype, "onaddtrack", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "onaddtrack_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "onaddtrack_set", arguments)}});
yqvm.toolsFunc.defineProperty(TextTrackList.prototype, "onremovetrack", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "onremovetrack_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "onremovetrack_set", arguments)}});
yqvm.toolsFunc.defineProperty(TextTrackList.prototype, "getTrackById", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, TextTrackList.prototype, "TextTrackList", "getTrackById", arguments)}});

// SpeechSynthesisUtterance对象
SpeechSynthesisUtterance = function SpeechSynthesisUtterance(){}
yqvm.toolsFunc.safeProto(SpeechSynthesisUtterance, "SpeechSynthesisUtterance");
Object.setPrototypeOf(SpeechSynthesisUtterance.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "text", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "text_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "text_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "lang", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "lang_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "lang_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "voice", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "voice_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "voice_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "volume", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "volume_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "volume_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "rate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "rate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "rate_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "pitch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "pitch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "pitch_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onend_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onpause", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onpause_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onpause_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onresume", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onresume_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onresume_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onmark", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onmark_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onmark_set", arguments)}});
yqvm.toolsFunc.defineProperty(SpeechSynthesisUtterance.prototype, "onboundary", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onboundary_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SpeechSynthesisUtterance.prototype, "SpeechSynthesisUtterance", "onboundary_set", arguments)}});

// SourceBuffer对象
SourceBuffer = function SourceBuffer(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(SourceBuffer, "SourceBuffer");
Object.setPrototypeOf(SourceBuffer.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "mode", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "mode_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "mode_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "updating", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "updating_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "buffered", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "buffered_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "timestampOffset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "timestampOffset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "timestampOffset_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "appendWindowStart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "appendWindowStart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "appendWindowStart_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "appendWindowEnd", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "appendWindowEnd_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "appendWindowEnd_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "onupdatestart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onupdatestart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onupdatestart_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "onupdate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onupdate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onupdate_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "onupdateend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onupdateend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onupdateend_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "onabort", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onabort_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "onabort_set", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "abort", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "abort", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "appendBuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "appendBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "changeType", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "changeType", arguments)}});
yqvm.toolsFunc.defineProperty(SourceBuffer.prototype, "remove", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, SourceBuffer.prototype, "SourceBuffer", "remove", arguments)}});

// ScreenOrientation对象
ScreenOrientation = function ScreenOrientation(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(ScreenOrientation, "ScreenOrientation");
Object.setPrototypeOf(ScreenOrientation.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(ScreenOrientation.prototype, "angle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, ScreenOrientation.prototype, "ScreenOrientation", "angle_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(ScreenOrientation.prototype, "type", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, ScreenOrientation.prototype, "ScreenOrientation", "type_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(ScreenOrientation.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, ScreenOrientation.prototype, "ScreenOrientation", "onchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, ScreenOrientation.prototype, "ScreenOrientation", "onchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(ScreenOrientation.prototype, "lock", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, ScreenOrientation.prototype, "ScreenOrientation", "lock", arguments)}});
yqvm.toolsFunc.defineProperty(ScreenOrientation.prototype, "unlock", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, ScreenOrientation.prototype, "ScreenOrientation", "unlock", arguments)}});

// PerformanceEntry对象
PerformanceEntry = function PerformanceEntry(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(PerformanceEntry, "PerformanceEntry");
yqvm.toolsFunc.defineProperty(PerformanceEntry.prototype, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, PerformanceEntry.prototype, "PerformanceEntry", "name_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(PerformanceEntry.prototype, "entryType", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, PerformanceEntry.prototype, "PerformanceEntry", "entryType_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(PerformanceEntry.prototype, "startTime", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, PerformanceEntry.prototype, "PerformanceEntry", "startTime_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(PerformanceEntry.prototype, "duration", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, PerformanceEntry.prototype, "PerformanceEntry", "duration_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(PerformanceEntry.prototype, "toJSON", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, PerformanceEntry.prototype, "PerformanceEntry", "toJSON", arguments)}});

// PerformancePaintTiming对象
PerformancePaintTiming = function PerformancePaintTiming(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(PerformancePaintTiming, "PerformancePaintTiming");
Object.setPrototypeOf(PerformancePaintTiming.prototype, PerformanceEntry.prototype);

// Path2D对象
Path2D = function Path2D(){}
yqvm.toolsFunc.safeProto(Path2D, "Path2D");
yqvm.toolsFunc.defineProperty(Path2D.prototype, "addPath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "addPath", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "roundRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "roundRect", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "arc", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "arc", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "arcTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "arcTo", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "bezierCurveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "bezierCurveTo", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "closePath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "closePath", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "ellipse", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "ellipse", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "lineTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "lineTo", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "moveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "moveTo", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "quadraticCurveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "quadraticCurveTo", arguments)}});
yqvm.toolsFunc.defineProperty(Path2D.prototype, "rect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Path2D.prototype, "Path2D", "rect", arguments)}});

// OffscreenCanvasRenderingContext2D对象
OffscreenCanvasRenderingContext2D = function OffscreenCanvasRenderingContext2D(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(OffscreenCanvasRenderingContext2D, "OffscreenCanvasRenderingContext2D");
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "canvas", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "canvas_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "globalAlpha", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "globalAlpha_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "globalAlpha_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "globalCompositeOperation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "globalCompositeOperation_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "globalCompositeOperation_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "filter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "filter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "filter_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "imageSmoothingEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "imageSmoothingEnabled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "imageSmoothingEnabled_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "imageSmoothingQuality", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "imageSmoothingQuality_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "imageSmoothingQuality_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "strokeStyle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "strokeStyle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "strokeStyle_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fillStyle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fillStyle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fillStyle_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "shadowOffsetX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowOffsetX_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowOffsetX_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "shadowOffsetY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowOffsetY_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowOffsetY_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "shadowBlur", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowBlur_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowBlur_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "shadowColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "shadowColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "lineWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineWidth_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineWidth_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "lineCap", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineCap_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineCap_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "lineJoin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineJoin_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineJoin_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "miterLimit", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "miterLimit_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "miterLimit_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "lineDashOffset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineDashOffset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineDashOffset_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "font", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "font_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "font_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "textAlign", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "textAlign_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "textAlign_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "textBaseline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "textBaseline_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "textBaseline_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "direction", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "direction_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "direction_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fontKerning", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fontKerning_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fontKerning_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fontStretch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fontStretch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fontStretch_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fontVariantCaps", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fontVariantCaps_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fontVariantCaps_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "letterSpacing", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "letterSpacing_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "letterSpacing_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "textRendering", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "textRendering_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "textRendering_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "wordSpacing", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "wordSpacing_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "wordSpacing_set", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "clip", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "clip", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "createConicGradient", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "createConicGradient", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "createImageData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "createImageData", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "createLinearGradient", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "createLinearGradient", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "createPattern", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "createPattern", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "createRadialGradient", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "createRadialGradient", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "drawImage", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "drawImage", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fill", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fill", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fillText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fillText", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "getImageData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "getImageData", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "getLineDash", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "getLineDash", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "getTransform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "getTransform", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "isContextLost", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "isContextLost", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "isPointInPath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "isPointInPath", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "isPointInStroke", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "isPointInStroke", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "measureText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "measureText", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "putImageData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "putImageData", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "reset", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "reset", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "roundRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "roundRect", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "save", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "save", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "scale", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "scale", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "setLineDash", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "setLineDash", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "setTransform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "setTransform", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "stroke", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "stroke", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "strokeText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "strokeText", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "transform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "transform", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "translate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "translate", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "arc", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "arc", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "arcTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "arcTo", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "beginPath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "beginPath", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "bezierCurveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "bezierCurveTo", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "clearRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "clearRect", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "closePath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "closePath", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "ellipse", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "ellipse", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "fillRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "fillRect", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "lineTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "lineTo", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "moveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "moveTo", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "quadraticCurveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "quadraticCurveTo", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "rect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "rect", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "resetTransform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "resetTransform", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "restore", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "restore", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "rotate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "rotate", arguments)}});
yqvm.toolsFunc.defineProperty(OffscreenCanvasRenderingContext2D.prototype, "strokeRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, OffscreenCanvasRenderingContext2D.prototype, "OffscreenCanvasRenderingContext2D", "strokeRect", arguments)}});

// Notification对象
Notification = function Notification(){return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'Notification': 1 argument required, but only 0 present.")}
yqvm.toolsFunc.safeProto(Notification, "Notification");
Object.setPrototypeOf(Notification.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(Notification, "permission", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification, "Notification", "permission_get", arguments, 'default')}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification, "maxActions", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification, "Notification", "maxActions_get", arguments, 2)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification, "requestPermission", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Notification, "Notification", "requestPermission", arguments)}});
yqvm.toolsFunc.defineProperty(Notification.prototype, "onclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(Notification.prototype, "onshow", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onshow_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onshow_set", arguments)}});
yqvm.toolsFunc.defineProperty(Notification.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Notification.prototype, "onclose", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onclose_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "onclose_set", arguments)}});
yqvm.toolsFunc.defineProperty(Notification.prototype, "title", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "title_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "dir", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "dir_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "lang", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "lang_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "body", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "body_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "tag", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "tag_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "icon", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "icon_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "badge", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "badge_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "vibrate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "vibrate_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "timestamp", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "timestamp_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "renotify", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "renotify_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "silent", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "silent_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "requireInteraction", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "requireInteraction_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "data", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "data_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "actions", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "actions_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Notification.prototype, "close", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Notification.prototype, "Notification", "close", arguments)}});

// WindowProperties对象
WindowProperties = function WindowProperties(){

}
// 保护原型
yqvm.toolsFunc.safeProto(WindowProperties, "WindowProperties");
// 删除构造方法
delete WindowProperties.prototype.constructor;
Object.setPrototypeOf(WindowProperties.prototype, EventTarget.prototype);


// Window对象
Window = function Window(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Window, "Window");
Object.setPrototypeOf(Window.prototype, WindowProperties.prototype);
yqvm.toolsFunc.defineProperty(Window, "TEMPORARY", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(Window, "PERSISTENT", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Window.prototype, "TEMPORARY", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(Window.prototype, "PERSISTENT", {configurable:false, enumerable:true, writable:false, value:1});

// Storage对象
Storage = function Storage() {
    return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")
}
yqvm.toolsFunc.safeProto(Storage, "Storage");
yqvm.toolsFunc.defineProperty(Storage.prototype, "length", {
    configurable: true, enumerable: true, get: function () {
        return yqvm.toolsFunc.dispatch(this, Storage.prototype, "Storage", "length_get", arguments)
    }, set: undefined
});
yqvm.toolsFunc.defineProperty(Storage.prototype, "clear", {
    configurable: true, enumerable: true, writable: true, value: function () {
        return yqvm.toolsFunc.dispatch(this, Storage.prototype, "Storage", "clear", arguments)
    }
});
yqvm.toolsFunc.defineProperty(Storage.prototype, "getItem", {
    configurable: true, enumerable: true, writable: true, value: function () {
        return yqvm.toolsFunc.dispatch(this, Storage.prototype, "Storage", "getItem", arguments)
    }
});
yqvm.toolsFunc.defineProperty(Storage.prototype, "key", {
    configurable: true, enumerable: true, writable: true, value: function () {
        return yqvm.toolsFunc.dispatch(this, Storage.prototype, "Storage", "key", arguments)
    }
});
yqvm.toolsFunc.defineProperty(Storage.prototype, "removeItem", {
    configurable: true, enumerable: true, writable: true, value: function () {
        return yqvm.toolsFunc.dispatch(this, Storage.prototype, "Storage", "removeItem", arguments)
    }
});
yqvm.toolsFunc.defineProperty(Storage.prototype, "setItem", {
    configurable: true, enumerable: true, writable: true, value: function () {
        return yqvm.toolsFunc.dispatch(this, Storage.prototype, "Storage", "setItem", arguments)
    }
});
// localStorage对象
localStorage = {}
Object.setPrototypeOf(localStorage, Storage.prototype);
// sessionStorage对象
sessionStorage = {}
Object.setPrototypeOf(sessionStorage, Storage.prototype);



// Node对象
Node = function Node(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Node, "Node");
Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(Node, "ELEMENT_NODE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Node, "ATTRIBUTE_NODE", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(Node, "TEXT_NODE", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(Node, "CDATA_SECTION_NODE", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(Node, "ENTITY_REFERENCE_NODE", {configurable:false, enumerable:true, writable:false, value:5});
yqvm.toolsFunc.defineProperty(Node, "ENTITY_NODE", {configurable:false, enumerable:true, writable:false, value:6});
yqvm.toolsFunc.defineProperty(Node, "PROCESSING_INSTRUCTION_NODE", {configurable:false, enumerable:true, writable:false, value:7});
yqvm.toolsFunc.defineProperty(Node, "COMMENT_NODE", {configurable:false, enumerable:true, writable:false, value:8});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_NODE", {configurable:false, enumerable:true, writable:false, value:9});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_TYPE_NODE", {configurable:false, enumerable:true, writable:false, value:10});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_FRAGMENT_NODE", {configurable:false, enumerable:true, writable:false, value:11});
yqvm.toolsFunc.defineProperty(Node, "NOTATION_NODE", {configurable:false, enumerable:true, writable:false, value:12});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_DISCONNECTED", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_PRECEDING", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_FOLLOWING", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_CONTAINS", {configurable:false, enumerable:true, writable:false, value:8});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_CONTAINED_BY", {configurable:false, enumerable:true, writable:false, value:16});
yqvm.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", {configurable:false, enumerable:true, writable:false, value:32});
yqvm.toolsFunc.defineProperty(Node.prototype, "nodeType", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeType_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "nodeName", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeName_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "baseURI", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "baseURI_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "isConnected", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "isConnected_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "ownerDocument", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "ownerDocument_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "parentNode", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "parentNode_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "parentElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "parentElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "childNodes", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "childNodes_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "firstChild", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "firstChild_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "lastChild", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "lastChild_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "previousSibling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "previousSibling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "nextSibling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "nextSibling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Node.prototype, "nodeValue", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeValue_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeValue_set", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "textContent", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "textContent_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "textContent_set", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "ELEMENT_NODE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Node.prototype, "ATTRIBUTE_NODE", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(Node.prototype, "TEXT_NODE", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(Node.prototype, "CDATA_SECTION_NODE", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(Node.prototype, "ENTITY_REFERENCE_NODE", {configurable:false, enumerable:true, writable:false, value:5});
yqvm.toolsFunc.defineProperty(Node.prototype, "ENTITY_NODE", {configurable:false, enumerable:true, writable:false, value:6});
yqvm.toolsFunc.defineProperty(Node.prototype, "PROCESSING_INSTRUCTION_NODE", {configurable:false, enumerable:true, writable:false, value:7});
yqvm.toolsFunc.defineProperty(Node.prototype, "COMMENT_NODE", {configurable:false, enumerable:true, writable:false, value:8});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_NODE", {configurable:false, enumerable:true, writable:false, value:9});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_TYPE_NODE", {configurable:false, enumerable:true, writable:false, value:10});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_FRAGMENT_NODE", {configurable:false, enumerable:true, writable:false, value:11});
yqvm.toolsFunc.defineProperty(Node.prototype, "NOTATION_NODE", {configurable:false, enumerable:true, writable:false, value:12});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_DISCONNECTED", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_PRECEDING", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_FOLLOWING", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_CONTAINS", {configurable:false, enumerable:true, writable:false, value:8});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_CONTAINED_BY", {configurable:false, enumerable:true, writable:false, value:16});
yqvm.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", {configurable:false, enumerable:true, writable:false, value:32});
yqvm.toolsFunc.defineProperty(Node.prototype, "appendChild", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "appendChild", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "cloneNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "cloneNode", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "compareDocumentPosition", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "compareDocumentPosition", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "contains", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "contains", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "getRootNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "getRootNode", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "hasChildNodes", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "hasChildNodes", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "insertBefore", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "insertBefore", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "isDefaultNamespace", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "isDefaultNamespace", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "isEqualNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "isEqualNode", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "isSameNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "isSameNode", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "lookupNamespaceURI", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "lookupNamespaceURI", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "lookupPrefix", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "lookupPrefix", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "normalize", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "normalize", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "removeChild", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "removeChild", arguments)}});
yqvm.toolsFunc.defineProperty(Node.prototype, "replaceChild", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Node.prototype, "Node", "replaceChild", arguments)}});

// CharacterData对象
CharacterData = function CharacterData(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(CharacterData, "CharacterData");
Object.setPrototypeOf(CharacterData.prototype, Node.prototype);
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "data", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "data_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "data_set", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "previousElementSibling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "previousElementSibling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "nextElementSibling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "nextElementSibling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "after", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "after", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "appendData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "appendData", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "before", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "before", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "deleteData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "deleteData", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "insertData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "insertData", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "remove", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "remove", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "replaceData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "replaceData", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "replaceWith", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "replaceWith", arguments)}});
yqvm.toolsFunc.defineProperty(CharacterData.prototype, "substringData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CharacterData.prototype, "CharacterData", "substringData", arguments)}});

// Text对象
Text = function Text(){}
yqvm.toolsFunc.safeProto(Text, "Text");
Object.setPrototypeOf(Text.prototype, CharacterData.prototype);
yqvm.toolsFunc.defineProperty(Text.prototype, "wholeText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Text.prototype, "Text", "wholeText_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Text.prototype, "assignedSlot", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Text.prototype, "Text", "assignedSlot_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Text.prototype, "splitText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Text.prototype, "Text", "splitText", arguments)}});

// CDATASection对象
CDATASection = function CDATASection(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(CDATASection, "CDATASection");
Object.setPrototypeOf(CDATASection.prototype, Text.prototype);

// Element对象
Element = function Element(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Element, "Element");
Object.setPrototypeOf(Element.prototype, Node.prototype);
yqvm.toolsFunc.defineProperty(Element.prototype, "namespaceURI", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "namespaceURI_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "prefix", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "prefix_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "localName", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "localName_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "tagName", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "tagName_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "id", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "id_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "id_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "className", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "className_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "className_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "classList", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "classList_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "classList_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "slot", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "slot_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "slot_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "attributes", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "attributes_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "shadowRoot", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "shadowRoot_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "part", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "part_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "part_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "assignedSlot", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "assignedSlot_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "innerHTML", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "innerHTML_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "innerHTML_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "outerHTML", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "outerHTML_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "outerHTML_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollTop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollTop_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollTop_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollLeft", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollLeft_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollLeft_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollWidth_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollHeight", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollHeight_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "clientTop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "clientTop_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "clientLeft", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "clientLeft_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "clientWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "clientWidth_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "clientHeight", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "clientHeight_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "onbeforecopy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecopy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecopy_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onbeforecut", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecut_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecut_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onbeforepaste", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforepaste_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforepaste_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onsearch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onsearch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onsearch_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "elementTiming", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "elementTiming_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "elementTiming_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onfullscreenchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onfullscreenerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onwebkitfullscreenchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "onwebkitfullscreenerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "role", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "role_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "role_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaAtomic", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAtomic_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAtomic_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaAutoComplete", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAutoComplete_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAutoComplete_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaBusy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBusy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBusy_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaBrailleLabel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleLabel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleLabel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaBrailleRoleDescription", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleRoleDescription_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleRoleDescription_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaChecked", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaChecked_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaChecked_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaColCount", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColCount_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColCount_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaColIndex", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColIndex_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColIndex_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaColSpan", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColSpan_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColSpan_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaCurrent", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaCurrent_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaCurrent_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaDescription", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDescription_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDescription_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaDisabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDisabled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDisabled_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaExpanded", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaExpanded_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaExpanded_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaHasPopup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHasPopup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHasPopup_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaHidden", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHidden_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHidden_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaInvalid", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaInvalid_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaInvalid_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaKeyShortcuts", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaKeyShortcuts_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaKeyShortcuts_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaLabel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLabel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLabel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaLevel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLevel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLevel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaLive", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLive_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLive_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaModal", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaModal_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaModal_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaMultiLine", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiLine_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiLine_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaMultiSelectable", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiSelectable_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiSelectable_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaOrientation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaOrientation_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaOrientation_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaPlaceholder", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPlaceholder_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPlaceholder_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaPosInSet", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPosInSet_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPosInSet_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaPressed", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPressed_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPressed_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaReadOnly", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaReadOnly_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaReadOnly_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaRelevant", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRelevant_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRelevant_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaRequired", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRequired_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRequired_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaRoleDescription", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRoleDescription_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRoleDescription_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaRowCount", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowCount_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowCount_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaRowIndex", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowIndex_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowIndex_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaRowSpan", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowSpan_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowSpan_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaSelected", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSelected_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSelected_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaSetSize", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSetSize_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSetSize_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaSort", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSort_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSort_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaValueMax", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMax_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMax_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaValueMin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMin_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMin_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaValueNow", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueNow_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueNow_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "ariaValueText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueText_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueText_set", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "children", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "children_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "firstElementChild", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "firstElementChild_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "lastElementChild", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "lastElementChild_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "childElementCount", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "childElementCount_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "previousElementSibling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "previousElementSibling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "nextElementSibling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "nextElementSibling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Element.prototype, "after", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "after", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "animate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "animate", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "append", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "append", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "attachShadow", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "attachShadow", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "before", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "before", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "closest", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "closest", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "computedStyleMap", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "computedStyleMap", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttribute", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getAttributeNames", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNames", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getAttributeNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNode", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getAttributeNodeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNodeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getBoundingClientRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getBoundingClientRect", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getClientRects", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getClientRects", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getElementsByClassName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getElementsByClassName", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getElementsByTagName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getElementsByTagName", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getElementsByTagNameNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getElementsByTagNameNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getInnerHTML", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getInnerHTML", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "hasAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "hasAttribute", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "hasAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "hasAttributeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "hasAttributes", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "hasAttributes", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "hasPointerCapture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "hasPointerCapture", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "insertAdjacentElement", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "insertAdjacentElement", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "insertAdjacentHTML", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "insertAdjacentHTML", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "insertAdjacentText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "insertAdjacentText", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "matches", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "matches", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "prepend", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "prepend", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "querySelector", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "querySelector", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "querySelectorAll", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "querySelectorAll", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "releasePointerCapture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "releasePointerCapture", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "remove", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "remove", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "removeAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "removeAttribute", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "removeAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "removeAttributeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "removeAttributeNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "removeAttributeNode", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "replaceChildren", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "replaceChildren", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "replaceWith", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "replaceWith", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "requestFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "requestFullscreen", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "requestPointerLock", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "requestPointerLock", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scroll", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scroll", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollBy", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollBy", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollIntoView", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollIntoView", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollIntoViewIfNeeded", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollIntoViewIfNeeded", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "scrollTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollTo", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "setAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttribute", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "setAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttributeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "setAttributeNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttributeNode", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "setAttributeNodeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttributeNodeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "setPointerCapture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "setPointerCapture", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "toggleAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "toggleAttribute", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "webkitMatchesSelector", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "webkitMatchesSelector", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "webkitRequestFullScreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "webkitRequestFullScreen", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "webkitRequestFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "webkitRequestFullscreen", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "checkVisibility", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "checkVisibility", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "getAnimations", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "getAnimations", arguments)}});
yqvm.toolsFunc.defineProperty(Element.prototype, "setHTML", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Element.prototype, "Element", "setHTML", arguments)}});

// HTMLElement对象
HTMLElement = function HTMLElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLElement, "HTMLElement");
Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "title", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "title_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "title_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "lang", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "lang_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "lang_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "translate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "translate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "translate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "dir", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "dir_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "dir_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "hidden", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "hidden_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "hidden_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "accessKey", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "accessKey_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "accessKey_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "draggable", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "draggable_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "draggable_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "spellcheck", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "spellcheck_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "spellcheck_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "autocapitalize", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autocapitalize_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autocapitalize_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "contentEditable", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "contentEditable_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "contentEditable_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "enterKeyHint", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "enterKeyHint_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "enterKeyHint_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "isContentEditable", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "isContentEditable_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "inputMode", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inputMode_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inputMode_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "virtualKeyboardPolicy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "virtualKeyboardPolicy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "virtualKeyboardPolicy_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "offsetParent", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetParent_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "offsetTop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetTop_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "offsetLeft", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetLeft_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "offsetWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetWidth_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "offsetHeight", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetHeight_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "innerText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "innerText_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "innerText_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "outerText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "outerText_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "outerText_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforexrselect", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforexrselect_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforexrselect_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onabort", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onabort_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onabort_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforeinput", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforeinput_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforeinput_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onblur", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onblur_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onblur_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncancel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncancel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncancel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncanplay", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplay_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplay_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncanplaythrough", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplaythrough_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplaythrough_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onclose", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclose_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclose_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncontextlost", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextlost_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextlost_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncontextmenu", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextmenu_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextmenu_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncontextrestored", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextrestored_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextrestored_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncuechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncuechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncuechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondblclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondblclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondblclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondrag", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrag_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrag_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondragend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondragenter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragenter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragenter_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondragleave", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragleave_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragleave_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondragover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragover_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondragstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondrop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrop_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrop_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ondurationchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondurationchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondurationchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onemptied", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onemptied_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onemptied_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onended", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onended_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onended_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onfocus", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onfocus_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onfocus_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onformdata", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onformdata_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onformdata_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oninput", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninput_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninput_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oninvalid", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninvalid_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninvalid_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onkeydown", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeydown_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeydown_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onkeypress", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeypress_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeypress_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onkeyup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeyup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeyup_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onload_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onloadeddata", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadeddata_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadeddata_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onloadedmetadata", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadedmetadata_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadedmetadata_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onloadstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmousedown", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousedown_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousedown_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseenter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseenter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseenter_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseleave", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseleave_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseleave_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmousemove", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousemove_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousemove_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseout", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseout_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseout_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseover_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseup_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onmousewheel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousewheel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousewheel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpause", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpause_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpause_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onplay", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplay_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplay_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onplaying", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplaying_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplaying_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onprogress", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onprogress_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onprogress_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onratechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onratechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onratechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onreset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onreset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onreset_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onresize", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onresize_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onresize_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onscroll", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onscroll_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onscroll_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onsecuritypolicyviolation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsecuritypolicyviolation_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsecuritypolicyviolation_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onseeked", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeked_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeked_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onseeking", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeking_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeking_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onselect", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselect_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselect_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onslotchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onslotchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onslotchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onstalled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onstalled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onstalled_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onsubmit", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsubmit_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsubmit_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onsuspend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsuspend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsuspend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ontimeupdate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontimeupdate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontimeupdate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ontoggle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontoggle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontoggle_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onvolumechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onvolumechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onvolumechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onwaiting", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwaiting_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwaiting_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkitanimationend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkitanimationiteration", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationiteration_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationiteration_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkitanimationstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkittransitionend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkittransitionend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkittransitionend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onwheel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwheel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwheel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onauxclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onauxclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onauxclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ongotpointercapture", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ongotpointercapture_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ongotpointercapture_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onlostpointercapture", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onlostpointercapture_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onlostpointercapture_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerdown", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerdown_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerdown_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointermove", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointermove_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointermove_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerrawupdate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerrawupdate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerrawupdate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerup_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointercancel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointercancel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointercancel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerover_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerout", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerout_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerout_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerenter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerenter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerenter_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerleave", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerleave_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerleave_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onselectstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onselectionchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectionchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectionchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onanimationend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onanimationiteration", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationiteration_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationiteration_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onanimationstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitionrun", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionrun_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionrun_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitionstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitionend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitioncancel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitioncancel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitioncancel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncopy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncopy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncopy_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncut", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncut_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncut_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onpaste", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpaste_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpaste_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "dataset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "dataset_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "nonce", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "nonce_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "nonce_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "autofocus", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autofocus_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autofocus_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "tabIndex", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "tabIndex_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "tabIndex_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "style", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "style_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "style_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "attributeStyleMap", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "attributeStyleMap_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "attachInternals", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "attachInternals", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "blur", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "blur", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "click", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "click", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "focus", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "focus", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "inert", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inert_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inert_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "oncontentvisibilityautostatechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontentvisibilityautostatechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontentvisibilityautostatechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onscrollend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onscrollend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onscrollend_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "popover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "popover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "popover_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforetoggle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforetoggle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforetoggle_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforematch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforematch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforematch_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "hidePopover", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "hidePopover", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "showPopover", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "showPopover", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLElement.prototype, "togglePopover", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "togglePopover", arguments)}});

// Document对象
Document = function Document(){}
yqvm.toolsFunc.safeProto(Document, "Document");
Object.setPrototypeOf(Document.prototype, Node.prototype);
yqvm.toolsFunc.defineProperty(Document.prototype, "implementation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "implementation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "URL", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "URL_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "documentURI", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "documentURI_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "compatMode", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "compatMode_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "characterSet", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "characterSet_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "charset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "charset_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "inputEncoding", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "inputEncoding_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "contentType", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "contentType_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "doctype", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "doctype_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "documentElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "documentElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "xmlEncoding", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlEncoding_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "xmlVersion", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlVersion_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlVersion_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "xmlStandalone", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlStandalone_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlStandalone_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "domain", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "domain_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "domain_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "referrer", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "referrer_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "cookie", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "cookie_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "cookie_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "lastModified", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "lastModified_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "readyState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "readyState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "title", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "title_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "title_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "dir", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "dir_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "dir_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "body", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "body_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "body_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "head", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "head_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "images", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "images_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "embeds", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "embeds_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "plugins", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "plugins_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "links", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "links_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "forms", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "forms_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "scripts", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "scripts_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "currentScript", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "currentScript_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "defaultView", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "defaultView_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "designMode", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "designMode_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "designMode_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onreadystatechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onreadystatechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onreadystatechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "anchors", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "anchors_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "applets", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "applets_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "fgColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fgColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fgColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "linkColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "linkColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "linkColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "vlinkColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "vlinkColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "vlinkColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "alinkColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "alinkColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "alinkColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "bgColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "bgColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "bgColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "all", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "all_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "scrollingElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "scrollingElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerlockchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerlockerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "hidden", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "hidden_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "visibilityState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "visibilityState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "wasDiscarded", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "wasDiscarded_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "prerendering", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "prerendering_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "featurePolicy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "featurePolicy_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitVisibilityState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitVisibilityState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitHidden", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitHidden_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforecopy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecopy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecopy_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforecut", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecut_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecut_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforepaste", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforepaste_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforepaste_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onfreeze", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfreeze_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfreeze_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onprerenderingchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onprerenderingchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onprerenderingchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onresume", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onresume_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onresume_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onsearch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsearch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsearch_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onvisibilitychange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onvisibilitychange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onvisibilitychange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "fullscreenEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenEnabled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenEnabled_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "fullscreen", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreen_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreen_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onfullscreenchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onfullscreenerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitIsFullScreen", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitIsFullScreen_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitCurrentFullScreenElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitCurrentFullScreenElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitFullscreenEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitFullscreenEnabled_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitFullscreenElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitFullscreenElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwebkitfullscreenchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwebkitfullscreenerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "rootElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "rootElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "pictureInPictureEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "pictureInPictureEnabled_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "pictureInPictureElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "pictureInPictureElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforexrselect", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforexrselect_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforexrselect_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onabort", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onabort_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onabort_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforeinput", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforeinput_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforeinput_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onblur", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onblur_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onblur_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncancel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncancel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncancel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncanplay", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplay_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplay_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncanplaythrough", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplaythrough_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplaythrough_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onclose", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onclose_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onclose_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncontextlost", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextlost_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextlost_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncontextmenu", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextmenu_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextmenu_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncontextrestored", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextrestored_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextrestored_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncuechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncuechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncuechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondblclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondblclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondblclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondrag", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrag_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrag_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondragend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondragenter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragenter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragenter_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondragleave", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragleave_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragleave_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondragover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragover_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondragstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondrop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrop_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrop_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ondurationchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondurationchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ondurationchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onemptied", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onemptied_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onemptied_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onended", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onended_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onended_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onfocus", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfocus_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onfocus_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onformdata", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onformdata_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onformdata_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oninput", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oninput_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oninput_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oninvalid", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oninvalid_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oninvalid_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onkeydown", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeydown_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeydown_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onkeypress", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeypress_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeypress_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onkeyup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeyup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeyup_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onload_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onloadeddata", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadeddata_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadeddata_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onloadedmetadata", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadedmetadata_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadedmetadata_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onloadstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmousedown", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousedown_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousedown_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmouseenter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseenter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseenter_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmouseleave", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseleave_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseleave_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmousemove", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousemove_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousemove_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmouseout", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseout_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseout_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmouseover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseover_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmouseup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseup_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onmousewheel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousewheel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousewheel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpause", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpause_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpause_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onplay", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onplay_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onplay_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onplaying", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onplaying_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onplaying_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onprogress", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onprogress_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onprogress_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onratechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onratechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onratechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onreset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onreset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onreset_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onresize", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onresize_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onresize_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onscroll", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onscroll_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onscroll_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onsecuritypolicyviolation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsecuritypolicyviolation_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsecuritypolicyviolation_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onseeked", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeked_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeked_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onseeking", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeking_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeking_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onselect", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onselect_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onselect_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onslotchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onslotchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onslotchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onstalled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onstalled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onstalled_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onsubmit", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsubmit_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsubmit_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onsuspend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsuspend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onsuspend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ontimeupdate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontimeupdate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontimeupdate_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ontoggle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontoggle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontoggle_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onvolumechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onvolumechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onvolumechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwaiting", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwaiting_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwaiting_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwebkitanimationend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwebkitanimationiteration", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationiteration_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationiteration_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwebkitanimationstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwebkittransitionend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkittransitionend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkittransitionend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onwheel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwheel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onwheel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onauxclick", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onauxclick_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onauxclick_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ongotpointercapture", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ongotpointercapture_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ongotpointercapture_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onlostpointercapture", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onlostpointercapture_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onlostpointercapture_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerdown", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerdown_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerdown_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointermove", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointermove_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointermove_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerrawupdate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerrawupdate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerrawupdate_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerup", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerup_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerup_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointercancel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointercancel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointercancel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerover", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerover_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerover_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerout", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerout_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerout_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerenter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerenter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerenter_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpointerleave", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerleave_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerleave_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onselectstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onselectionchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectionchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectionchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onanimationend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onanimationiteration", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationiteration_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationiteration_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onanimationstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ontransitionrun", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionrun_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionrun_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ontransitionstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ontransitionend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "ontransitioncancel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitioncancel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitioncancel_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncopy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncopy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncopy_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncut", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncut_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncut_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onpaste", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpaste_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onpaste_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "children", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "children_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "firstElementChild", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "firstElementChild_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "lastElementChild", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "lastElementChild_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "childElementCount", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "childElementCount_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "activeElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "activeElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "styleSheets", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "styleSheets_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "pointerLockElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "pointerLockElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "fullscreenElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenElement_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenElement_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "adoptedStyleSheets", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "adoptedStyleSheets_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "adoptedStyleSheets_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "fonts", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fonts_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "adoptNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "adoptNode", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "append", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "append", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "captureEvents", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "captureEvents", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "caretRangeFromPoint", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "caretRangeFromPoint", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "clear", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "clear", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "close", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "close", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createAttribute", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createAttributeNS", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createCDATASection", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createCDATASection", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createComment", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createComment", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createDocumentFragment", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createDocumentFragment", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createElement", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createElement", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createElementNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createElementNS", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createEvent", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createEvent", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createExpression", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createExpression", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createNSResolver", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createNSResolver", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createNodeIterator", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createNodeIterator", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createProcessingInstruction", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createProcessingInstruction", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createRange", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createRange", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createTextNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createTextNode", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "createTreeWalker", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "createTreeWalker", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "elementFromPoint", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "elementFromPoint", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "elementsFromPoint", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "elementsFromPoint", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "evaluate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "evaluate", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "execCommand", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "execCommand", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "exitFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "exitFullscreen", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "exitPictureInPicture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "exitPictureInPicture", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "exitPointerLock", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "exitPointerLock", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getElementById", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementById", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getElementsByClassName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByClassName", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getElementsByName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByName", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getElementsByTagName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByTagName", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getElementsByTagNameNS", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByTagNameNS", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getSelection", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getSelection", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "hasFocus", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "hasFocus", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "importNode", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "importNode", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "open", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "open", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "prepend", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "prepend", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "queryCommandEnabled", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandEnabled", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "queryCommandIndeterm", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandIndeterm", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "queryCommandState", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandState", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "queryCommandSupported", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandSupported", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "queryCommandValue", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandValue", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "querySelector", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "querySelector", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "querySelectorAll", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "querySelectorAll", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "releaseEvents", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "releaseEvents", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "replaceChildren", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "replaceChildren", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitCancelFullScreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitCancelFullScreen", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "webkitExitFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitExitFullscreen", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "write", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "write", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "writeln", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "writeln", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "fragmentDirective", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "fragmentDirective_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforematch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforematch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforematch_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onbeforetoggle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforetoggle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforetoggle_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "timeline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "timeline_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Document.prototype, "oncontentvisibilityautostatechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontentvisibilityautostatechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontentvisibilityautostatechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "onscrollend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onscrollend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "onscrollend_set", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "getAnimations", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "getAnimations", arguments)}});
yqvm.toolsFunc.defineProperty(Document.prototype, "startViewTransition", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Document.prototype, "Document", "startViewTransition", arguments)}});

// HTMLDocument对象
HTMLDocument = function HTMLDocument(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLDocument, "HTMLDocument");
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);

// document对象
document = {}
Object.setPrototypeOf(document, HTMLDocument.prototype);
yqvm.toolsFunc.defineProperty(document, "location", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, document, "document", "location_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, document, "document", "location_set", arguments)}});


// HTMLAnchorElement对象
HTMLAnchorElement = function HTMLAnchorElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLAnchorElement, "HTMLAnchorElement");
Object.setPrototypeOf(HTMLAnchorElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "target", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "target_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "target_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "download", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "download_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "download_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "ping", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "ping_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "ping_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "rel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "relList", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "relList_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "relList_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hreflang", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hreflang_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hreflang_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "type", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "type_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "type_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "referrerPolicy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "referrerPolicy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "referrerPolicy_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "text", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "text_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "text_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "coords", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "coords_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "coords_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "charset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "charset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "charset_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "name_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "name_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "rev", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rev_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rev_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "shape", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "shape_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "shape_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "origin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "origin_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "protocol", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "protocol_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "protocol_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "username", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "username_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "username_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "password", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "password_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "password_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "host", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "host_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "host_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hostname", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hostname_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hostname_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "port", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "port_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "port_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "pathname", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "pathname_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "pathname_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "search", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "search_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "search_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hash", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hash_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hash_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "href", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "href_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "href_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "toString", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "toString", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hrefTranslate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hrefTranslate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hrefTranslate_set", arguments)}});

// HTMLBaseElement对象
HTMLBaseElement = function HTMLBaseElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLBaseElement, "HTMLBaseElement");
Object.setPrototypeOf(HTMLBaseElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLBaseElement.prototype, "href", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBaseElement.prototype, "HTMLBaseElement", "href_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBaseElement.prototype, "HTMLBaseElement", "href_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBaseElement.prototype, "target", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBaseElement.prototype, "HTMLBaseElement", "target_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBaseElement.prototype, "HTMLBaseElement", "target_set", arguments)}});

// HTMLBodyElement对象
HTMLBodyElement = function HTMLBodyElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLBodyElement, "HTMLBodyElement");
Object.setPrototypeOf(HTMLBodyElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "text", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "text_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "text_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "link", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "link_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "link_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "vLink", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "vLink_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "vLink_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "aLink", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "aLink_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "aLink_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "bgColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "bgColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "bgColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "background", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "background_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "background_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onblur", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onblur_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onblur_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onfocus", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onfocus_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onfocus_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onload_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onresize", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onresize_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onresize_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onscroll", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onscroll_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onscroll_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onafterprint", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onafterprint_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onafterprint_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onbeforeprint", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onbeforeprint_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onbeforeprint_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onbeforeunload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onbeforeunload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onbeforeunload_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onhashchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onhashchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onhashchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onlanguagechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onlanguagechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onlanguagechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onmessage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onmessage_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onmessage_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onmessageerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onmessageerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onmessageerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onoffline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onoffline_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onoffline_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "ononline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "ononline_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "ononline_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onpagehide", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onpagehide_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onpagehide_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onpageshow", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onpageshow_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onpageshow_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onpopstate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onpopstate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onpopstate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onrejectionhandled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onrejectionhandled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onrejectionhandled_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onstorage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onstorage_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onstorage_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onunhandledrejection", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onunhandledrejection_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onunhandledrejection_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLBodyElement.prototype, "onunload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onunload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLBodyElement.prototype, "HTMLBodyElement", "onunload_set", arguments)}});



// HTMLCanvasElement对象
HTMLCanvasElement = function HTMLCanvasElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLCanvasElement, "HTMLCanvasElement");
Object.setPrototypeOf(HTMLCanvasElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "width", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "width_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "width_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "height", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "height_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "height_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "captureStream", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "captureStream", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "getContext", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "getContext", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "toBlob", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "toBlob", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "toDataURL", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCanvasElement.prototype, "transferControlToOffscreen", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCanvasElement.prototype, "HTMLCanvasElement", "transferControlToOffscreen", arguments)}});

// HTMLDivElement对象
HTMLDivElement = function HTMLDivElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLDivElement, "HTMLDivElement");
Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLDivElement.prototype, "align", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLDivElement.prototype, "HTMLDivElement", "align_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLDivElement.prototype, "HTMLDivElement", "align_set", arguments)}});

// HTMLFormElement对象
HTMLFormElement = function HTMLFormElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLFormElement, "HTMLFormElement");
Object.setPrototypeOf(HTMLFormElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "acceptCharset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "acceptCharset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "acceptCharset_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "action", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "action_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "action_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "autocomplete", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "autocomplete_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "autocomplete_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "enctype", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "enctype_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "enctype_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "encoding", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "encoding_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "encoding_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "method", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "method_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "method_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "name_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "name_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "noValidate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "noValidate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "noValidate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "target", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "target_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "target_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "elements", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "elements_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "checkValidity", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "checkValidity", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "reportValidity", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "reportValidity", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "requestSubmit", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "requestSubmit", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "reset", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "reset", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "submit", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "submit", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "rel", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "rel_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "rel_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFormElement.prototype, "relList", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "relList_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFormElement.prototype, "HTMLFormElement", "relList_set", arguments)}});

// HTMLFrameSetElement对象
HTMLFrameSetElement = function HTMLFrameSetElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLFrameSetElement, "HTMLFrameSetElement");
Object.setPrototypeOf(HTMLFrameSetElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "cols", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "cols_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "cols_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "rows", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "rows_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "rows_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onblur", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onblur_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onblur_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onfocus", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onfocus_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onfocus_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onload_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onresize", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onresize_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onresize_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onscroll", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onscroll_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onscroll_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onafterprint", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onafterprint_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onafterprint_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onbeforeprint", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onbeforeprint_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onbeforeprint_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onbeforeunload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onbeforeunload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onbeforeunload_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onhashchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onhashchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onhashchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onlanguagechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onlanguagechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onlanguagechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onmessage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onmessage_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onmessage_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onmessageerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onmessageerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onmessageerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onoffline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onoffline_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onoffline_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "ononline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "ononline_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "ononline_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onpagehide", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onpagehide_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onpagehide_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onpageshow", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onpageshow_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onpageshow_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onpopstate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onpopstate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onpopstate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onrejectionhandled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onrejectionhandled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onrejectionhandled_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onstorage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onstorage_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onstorage_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onunhandledrejection", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onunhandledrejection_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onunhandledrejection_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLFrameSetElement.prototype, "onunload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onunload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLFrameSetElement.prototype, "HTMLFrameSetElement", "onunload_set", arguments)}});

// HTMLHeadElement对象
HTMLHeadElement = function HTMLHeadElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLHeadElement, "HTMLHeadElement");
Object.setPrototypeOf(HTMLHeadElement.prototype, HTMLElement.prototype);

// HTMLHtmlElement对象
HTMLHtmlElement = function HTMLHtmlElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLHtmlElement, "HTMLHtmlElement");
Object.setPrototypeOf(HTMLHtmlElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLHtmlElement.prototype, "version", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLHtmlElement.prototype, "HTMLHtmlElement", "version_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLHtmlElement.prototype, "HTMLHtmlElement", "version_set", arguments)}});

// HTMLInputElement对象
HTMLInputElement = function HTMLInputElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLInputElement, "HTMLInputElement");
Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "accept", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "accept_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "accept_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "alt", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "alt_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "alt_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "autocomplete", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "autocomplete_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "autocomplete_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "defaultChecked", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultChecked_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultChecked_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "checked", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "checked_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "checked_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "dirName", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "dirName_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "dirName_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "disabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "disabled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "disabled_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "form", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "form_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "files", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "files_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "files_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "formAction", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formAction_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formAction_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "formEnctype", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formEnctype_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formEnctype_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "formMethod", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formMethod_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formMethod_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "formNoValidate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formNoValidate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formNoValidate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "formTarget", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formTarget_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formTarget_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "height", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "height_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "height_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "indeterminate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "indeterminate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "indeterminate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "list", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "list_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "max", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "max_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "max_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "maxLength", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "maxLength_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "maxLength_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "min", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "min_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "min_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "minLength", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "minLength_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "minLength_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "multiple", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "multiple_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "multiple_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "name_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "name_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "pattern", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "pattern_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "pattern_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "placeholder", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "placeholder_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "placeholder_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "readOnly", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "readOnly_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "readOnly_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "required", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "required_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "required_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "size", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "size_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "size_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "src", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "src_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "src_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "step", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "step_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "step_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "type", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "type_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "type_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "defaultValue", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultValue_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultValue_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "value", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "value_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "value_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "valueAsDate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsDate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsDate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "valueAsNumber", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsNumber_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsNumber_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "width", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "width_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "width_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "willValidate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "willValidate_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "validity", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "validity_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "validationMessage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "validationMessage_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "labels", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "labels_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "selectionStart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionStart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionStart_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "selectionEnd", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionEnd_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionEnd_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "selectionDirection", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionDirection_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionDirection_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "align", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "align_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "align_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "useMap", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "useMap_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "useMap_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "webkitdirectory", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "webkitdirectory_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "webkitdirectory_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "incremental", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "incremental_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "incremental_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "checkValidity", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "checkValidity", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "reportValidity", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "reportValidity", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "select", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "select", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "setCustomValidity", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "setCustomValidity", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "setRangeText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "setRangeText", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "setSelectionRange", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "setSelectionRange", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "showPicker", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "showPicker", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "stepDown", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "stepDown", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "stepUp", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "stepUp", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "webkitEntries", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "webkitEntries_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "popoverTargetElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "popoverTargetElement_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "popoverTargetElement_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLInputElement.prototype, "popoverTargetAction", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "popoverTargetAction_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "popoverTargetAction_set", arguments)}});

// HTMLMediaElement对象
HTMLMediaElement = function HTMLMediaElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLMediaElement, "HTMLMediaElement");
Object.setPrototypeOf(HTMLMediaElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "NETWORK_EMPTY", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "NETWORK_IDLE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "NETWORK_LOADING", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "NETWORK_NO_SOURCE", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "HAVE_NOTHING", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "HAVE_METADATA", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "HAVE_CURRENT_DATA", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "HAVE_FUTURE_DATA", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(HTMLMediaElement, "HAVE_ENOUGH_DATA", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "error", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "error_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "src", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "src_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "src_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "currentSrc", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "currentSrc_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "crossOrigin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "crossOrigin_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "crossOrigin_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "networkState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "networkState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "preload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "preload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "preload_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "buffered", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "buffered_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "readyState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "readyState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "seeking", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "seeking_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "currentTime", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "currentTime_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "currentTime_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "duration", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "duration_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "paused", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "paused_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "defaultPlaybackRate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "defaultPlaybackRate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "defaultPlaybackRate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "playbackRate", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "playbackRate_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "playbackRate_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "played", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "played_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "seekable", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "seekable_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "ended", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "ended_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "autoplay", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "autoplay_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "autoplay_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "loop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "loop_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "loop_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "preservesPitch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "preservesPitch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "preservesPitch_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "controls", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "controls_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "controls_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "controlsList", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "controlsList_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "controlsList_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "volume", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "volume_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "volume_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "muted", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "muted_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "muted_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "defaultMuted", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "defaultMuted_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "defaultMuted_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "textTracks", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "textTracks_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "webkitAudioDecodedByteCount", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "webkitAudioDecodedByteCount_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "webkitVideoDecodedByteCount", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "webkitVideoDecodedByteCount_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "onencrypted", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "onencrypted_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "onencrypted_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "onwaitingforkey", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "onwaitingforkey_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "onwaitingforkey_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "srcObject", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "srcObject_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "srcObject_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "NETWORK_EMPTY", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "NETWORK_IDLE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "NETWORK_LOADING", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "NETWORK_NO_SOURCE", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "HAVE_NOTHING", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "HAVE_METADATA", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "HAVE_CURRENT_DATA", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "HAVE_FUTURE_DATA", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "HAVE_ENOUGH_DATA", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "addTextTrack", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "addTextTrack", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "canPlayType", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "canPlayType", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "captureStream", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "captureStream", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "load", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "load", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "pause", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "pause", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "play", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "play", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "sinkId", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "sinkId_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "remote", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "remote_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "disableRemotePlayback", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "disableRemotePlayback_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "disableRemotePlayback_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMediaElement.prototype, "setSinkId", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLMediaElement.prototype, "HTMLMediaElement", "setSinkId", arguments)}});

// HTMLMetaElement对象
HTMLMetaElement = function HTMLMetaElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLMetaElement, "HTMLMetaElement");
Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLMetaElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "name_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "name_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMetaElement.prototype, "httpEquiv", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "httpEquiv_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "httpEquiv_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMetaElement.prototype, "content", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "content_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "content_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMetaElement.prototype, "media", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "media_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "media_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLMetaElement.prototype, "scheme", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "scheme_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "scheme_set", arguments)}});

// HTMLScriptElement对象
HTMLScriptElement = function HTMLScriptElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLScriptElement, "HTMLScriptElement");
Object.setPrototypeOf(HTMLScriptElement.prototype, HTMLElement.prototype);
yqvm.toolsFunc.defineProperty(HTMLScriptElement, "supports", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement, "HTMLScriptElement", "supports", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "src", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "src_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "src_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "type", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "type_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "type_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "noModule", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "noModule_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "noModule_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "charset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "charset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "charset_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "async", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "async_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "async_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "defer", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "defer_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "defer_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "crossOrigin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "crossOrigin_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "crossOrigin_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "text", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "text_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "text_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "referrerPolicy", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "referrerPolicy_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "referrerPolicy_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "event", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "event_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "event_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "htmlFor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "htmlFor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "htmlFor_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "integrity", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "integrity_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "integrity_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "fetchPriority", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "fetchPriority_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "fetchPriority_set", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLScriptElement.prototype, "blocking", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "blocking_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, HTMLScriptElement.prototype, "HTMLScriptElement", "blocking_set", arguments)}});

// HTMLSpanElement对象
HTMLSpanElement = function HTMLSpanElement(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLSpanElement, "HTMLSpanElement");
Object.setPrototypeOf(HTMLSpanElement.prototype, HTMLElement.prototype);

// Audio对象
Audio = function Audio(){}
yqvm.toolsFunc.safeProto(Audio, "Audio");
Object.setPrototypeOf(Audio.prototype, HTMLMediaElement.prototype);

// Navigator对象
Navigator = function Navigator(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Navigator, "Navigator");
yqvm.toolsFunc.defineProperty(Navigator.prototype, "vendorSub", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vendorSub_get", arguments, '')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "productSub", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "productSub_get", arguments, '20030107')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "vendor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vendor_get", arguments, 'Google Inc.')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "maxTouchPoints", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "maxTouchPoints_get", arguments, 0)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "scheduling", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "scheduling_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "userActivation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userActivation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "doNotTrack", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "doNotTrack_get", arguments, null)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "geolocation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "geolocation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "connection", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "connection_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "plugins", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "plugins_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "mimeTypes", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mimeTypes_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "pdfViewerEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "pdfViewerEnabled_get", arguments, true)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "webkitTemporaryStorage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitTemporaryStorage_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "webkitPersistentStorage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitPersistentStorage_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "hardwareConcurrency", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "hardwareConcurrency_get", arguments, 8)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "cookieEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "cookieEnabled_get", arguments, true)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "appCodeName", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appCodeName_get", arguments, 'Mozilla')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "appName", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appName_get", arguments, 'Netscape')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "appVersion", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appVersion_get", arguments, '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "platform", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "platform_get", arguments, 'MacIntel')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "product", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "product_get", arguments, 'Gecko')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "userAgent", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userAgent_get", arguments, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "language", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "language_get", arguments, 'zh-CN')}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "languages", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "languages_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "onLine", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "onLine_get", arguments, true)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "webdriver", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webdriver_get", arguments, false)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "getGamepads", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getGamepads", arguments)}});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "javaEnabled", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "javaEnabled", arguments)}});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "sendBeacon", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "sendBeacon", arguments)}});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "vibrate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vibrate", arguments)}});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "ink", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "ink_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "mediaCapabilities", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaCapabilities_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "mediaSession", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaSession_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "permissions", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "permissions_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Navigator.prototype, "windowControlsOverlay", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "windowControlsOverlay_get", arguments)}, set:undefined});

// navigator对象
navigator = {}
Object.setPrototypeOf(navigator, Navigator.prototype);

// Location对象
Location = function Location(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Location, "Location");

// location对象
location = {}
Object.setPrototypeOf(location, Location.prototype);
yqvm.toolsFunc.defineProperty(location, "valueOf", {configurable:false, enumerable:false, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "valueOf", arguments)}});
yqvm.toolsFunc.defineProperty(location, "ancestorOrigins", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "ancestorOrigins_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(location, "href", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "href_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "href_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "origin", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "origin_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(location, "protocol", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "host", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "host_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "host_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "hostname", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "port", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "port_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "port_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "pathname", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "search", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "search_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "search_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "hash", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hash_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hash_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "assign", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "assign", arguments)}});
yqvm.toolsFunc.defineProperty(location, "reload", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "reload", arguments)}});
yqvm.toolsFunc.defineProperty(location, "replace", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "replace", arguments)}});
yqvm.toolsFunc.defineProperty(location, "toString", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "toString", arguments)}});



// HTMLCollection对象
HTMLCollection = function HTMLCollection(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(HTMLCollection, "HTMLCollection");
yqvm.toolsFunc.defineProperty(HTMLCollection.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, HTMLCollection.prototype, "HTMLCollection", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(HTMLCollection.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCollection.prototype, "HTMLCollection", "item", arguments)}});
yqvm.toolsFunc.defineProperty(HTMLCollection.prototype, "namedItem", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, HTMLCollection.prototype, "HTMLCollection", "namedItem", arguments)}});

// Plugin对象
Plugin = function Plugin(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Plugin, "Plugin");
yqvm.toolsFunc.defineProperty(Plugin.prototype, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Plugin.prototype, "Plugin", "name_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Plugin.prototype, "filename", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Plugin.prototype, "Plugin", "filename_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Plugin.prototype, "description", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Plugin.prototype, "Plugin", "description_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Plugin.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Plugin.prototype, "Plugin", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Plugin.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Plugin.prototype, "Plugin", "item", arguments)}});
yqvm.toolsFunc.defineProperty(Plugin.prototype, "namedItem", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Plugin.prototype, "Plugin", "namedItem", arguments)}});

// PluginArray对象
PluginArray = function PluginArray(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(PluginArray, "PluginArray");
yqvm.toolsFunc.defineProperty(PluginArray.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(PluginArray.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "item", arguments)}});
yqvm.toolsFunc.defineProperty(PluginArray.prototype, "namedItem", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "namedItem", arguments)}});
yqvm.toolsFunc.defineProperty(PluginArray.prototype, "refresh", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "refresh", arguments)}});

// MimeType对象
MimeType = function MimeType(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(MimeType, "MimeType");
yqvm.toolsFunc.defineProperty(MimeType.prototype, "type", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MimeType.prototype, "MimeType", "type_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MimeType.prototype, "suffixes", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MimeType.prototype, "MimeType", "suffixes_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MimeType.prototype, "description", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MimeType.prototype, "MimeType", "description_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MimeType.prototype, "enabledPlugin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MimeType.prototype, "MimeType", "enabledPlugin_get", arguments)}, set:undefined});

// MimeTypeArray对象
MimeTypeArray = function MimeTypeArray(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(MimeTypeArray, "MimeTypeArray");
yqvm.toolsFunc.defineProperty(MimeTypeArray.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MimeTypeArray.prototype, "MimeTypeArray", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MimeTypeArray.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, MimeTypeArray.prototype, "MimeTypeArray", "item", arguments)}});
yqvm.toolsFunc.defineProperty(MimeTypeArray.prototype, "namedItem", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, MimeTypeArray.prototype, "MimeTypeArray", "namedItem", arguments)}});

// CSSStyleDeclaration对象
CSSStyleDeclaration = function CSSStyleDeclaration(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(CSSStyleDeclaration, "CSSStyleDeclaration");
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "cssText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "cssText_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "cssText_set", arguments)}});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "length", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "length_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "parentRule", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "parentRule_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "cssFloat", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "cssFloat_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "cssFloat_set", arguments)}});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "getPropertyPriority", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "getPropertyPriority", arguments)}});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "getPropertyValue", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "getPropertyValue", arguments)}});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "item", arguments)}});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "removeProperty", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "removeProperty", arguments)}});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "setProperty", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CSSStyleDeclaration.prototype, "CSSStyleDeclaration", "setProperty", arguments)}});

// style对象初始化,本来是对象属性,但body和scrollingElement也用到了,那么就写到原型里吧
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "accentColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "additiveSymbols", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "alignContent", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "alignItems", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "alignSelf", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "alignmentBaseline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "all", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationComposition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationDelay", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationDirection", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationDuration", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationFillMode", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationIterationCount", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationName", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationPlayState", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationRange", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationRangeEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationRangeStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationTimeline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "animationTimingFunction", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "appRegion", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "appearance", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "ascentOverride", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "aspectRatio", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backdropFilter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backfaceVisibility", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "background", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundAttachment", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundBlendMode", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundClip", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundImage", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundPositionX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundPositionY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundRepeat", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundRepeatX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundRepeatY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "backgroundSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "basePalette", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "baselineShift", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "baselineSource", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "blockSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "border", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockEndColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockEndStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockEndWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockStartColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockStartStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockStartWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBlockWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBottom", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBottomColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBottomLeftRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBottomRightRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBottomStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderBottomWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderCollapse", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderEndEndRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderEndStartRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderImage", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderImageOutset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderImageRepeat", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderImageSlice", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderImageSource", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderImageWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineEndColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineEndStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineEndWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineStartColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineStartStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineStartWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderInlineWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderLeft", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderLeftColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderLeftStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderLeftWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderRight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderRightColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderRightStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderRightWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderSpacing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderStartEndRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderStartStartRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderTop", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderTopColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderTopLeftRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderTopRightRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderTopStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderTopWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "borderWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "bottom", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "boxShadow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "boxSizing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "breakAfter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "breakBefore", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "breakInside", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "bufferedRendering", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "captionSide", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "caretColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "clear", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "clip", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "clipPath", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "clipRule", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "color", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "colorInterpolation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "colorInterpolationFilters", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "colorRendering", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "colorScheme", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnCount", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnFill", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnGap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnRule", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnRuleColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnRuleStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnRuleWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnSpan", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columnWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "columns", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "contain", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containIntrinsicBlockSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containIntrinsicHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containIntrinsicInlineSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containIntrinsicSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containIntrinsicWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "container", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containerName", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "containerType", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "content", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "contentVisibility", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "counterIncrement", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "counterReset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "counterSet", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "cursor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "cx", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "cy", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "d", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "descentOverride", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "direction", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "display", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "dominantBaseline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "emptyCells", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fallback", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fill", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fillOpacity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fillRule", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "filter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flex", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flexBasis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flexDirection", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flexFlow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flexGrow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flexShrink", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "flexWrap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "float", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "floodColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "floodOpacity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "font", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontDisplay", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontFamily", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontFeatureSettings", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontKerning", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontOpticalSizing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontPalette", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontStretch", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontSynthesis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontSynthesisSmallCaps", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontSynthesisStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontSynthesisWeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariant", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariantAlternates", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariantCaps", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariantEastAsian", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariantLigatures", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariantNumeric", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariantPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontVariationSettings", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "fontWeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "forcedColorAdjust", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "grid", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridArea", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridAutoColumns", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridAutoFlow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridAutoRows", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridColumn", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridColumnEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridColumnGap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridColumnStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridGap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridRow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridRowEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridRowGap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridRowStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridTemplate", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridTemplateAreas", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridTemplateColumns", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "gridTemplateRows", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "height", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "hyphenateCharacter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "hyphenateLimitChars", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "hyphens", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "imageOrientation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "imageRendering", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "inherits", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "initialLetter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "initialValue", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "inlineSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "inset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "insetBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "insetBlockEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "insetBlockStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "insetInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "insetInlineEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "insetInlineStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "isolation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "justifyContent", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "justifyItems", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "justifySelf", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "left", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "letterSpacing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "lightingColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "lineBreak", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "lineGapOverride", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "lineHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "listStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "listStyleImage", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "listStylePosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "listStyleType", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "margin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginBlockEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginBlockStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginBottom", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginInlineEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginInlineStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginLeft", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginRight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marginTop", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "marker", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "markerEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "markerMid", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "markerStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "mask", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "maskType", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "mathDepth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "mathShift", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "mathStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "maxBlockSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "maxHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "maxInlineSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "maxWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "minBlockSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "minHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "minInlineSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "minWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "mixBlendMode", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "negative", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "objectFit", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "objectPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "objectViewBox", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "offset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "offsetAnchor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "offsetDistance", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "offsetPath", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "offsetPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "offsetRotate", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "opacity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "order", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "orphans", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "outline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "outlineColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "outlineOffset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "outlineStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "outlineWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overflow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overflowAnchor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overflowClipMargin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overflowWrap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overflowX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overflowY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overlay", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overrideColors", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overscrollBehavior", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overscrollBehaviorBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overscrollBehaviorInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overscrollBehaviorX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "overscrollBehaviorY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "pad", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "padding", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingBlockEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingBlockStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingBottom", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingInlineEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingInlineStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingLeft", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingRight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paddingTop", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "page", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "pageBreakAfter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "pageBreakBefore", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "pageBreakInside", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "pageOrientation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "paintOrder", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "perspective", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "perspectiveOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "placeContent", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "placeItems", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "placeSelf", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "pointerEvents", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "position", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "prefix", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "quotes", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "r", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "range", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "resize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "right", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "rotate", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "rowGap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "rubyPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "rx", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "ry", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scale", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollBehavior", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMargin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginBlockEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginBlockStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginBottom", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginInlineEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginInlineStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginLeft", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginRight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollMarginTop", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPadding", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingBlock", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingBlockEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingBlockStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingBottom", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingInline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingInlineEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingInlineStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingLeft", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingRight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollPaddingTop", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollSnapAlign", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollSnapStop", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollSnapType", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollTimeline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollTimelineAxis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollTimelineName", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "scrollbarGutter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "shapeImageThreshold", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "shapeMargin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "shapeOutside", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "shapeRendering", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "size", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "sizeAdjust", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "speak", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "speakAs", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "src", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "stopColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "stopOpacity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "stroke", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeDasharray", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeDashoffset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeLinecap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeLinejoin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeMiterlimit", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeOpacity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "strokeWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "suffix", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "symbols", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "syntax", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "system", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "tabSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "tableLayout", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textAlign", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textAlignLast", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textAnchor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textCombineUpright", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textDecoration", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textDecorationColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textDecorationLine", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textDecorationSkipInk", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textDecorationStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textDecorationThickness", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textEmphasis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textEmphasisColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textEmphasisPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textEmphasisStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textIndent", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textOrientation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textOverflow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textRendering", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textShadow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textSizeAdjust", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textTransform", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textUnderlineOffset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textUnderlinePosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "textWrap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "timelineScope", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "top", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "touchAction", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transform", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transformBox", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transformOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transformStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transitionBehavior", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transitionDelay", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transitionDuration", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transitionProperty", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "transitionTimingFunction", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "translate", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "unicodeBidi", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "unicodeRange", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "userSelect", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "vectorEffect", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "verticalAlign", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "viewTimeline", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "viewTimelineAxis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "viewTimelineInset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "viewTimelineName", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "viewTransitionName", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "visibility", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAlignContent", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAlignItems", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAlignSelf", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationDelay", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationDirection", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationDuration", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationFillMode", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationIterationCount", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationName", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationPlayState", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAnimationTimingFunction", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAppRegion", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitAppearance", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBackfaceVisibility", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBackgroundClip", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBackgroundOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBackgroundSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderAfter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderAfterColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderAfterStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderAfterWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderBefore", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderBeforeColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderBeforeStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderBeforeWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderBottomLeftRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderBottomRightRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderEndColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderEndStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderEndWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderHorizontalSpacing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderImage", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderStartColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderStartStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderStartWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderTopLeftRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderTopRightRadius", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBorderVerticalSpacing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxAlign", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxDecorationBreak", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxDirection", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxFlex", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxOrdinalGroup", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxOrient", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxPack", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxReflect", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxShadow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitBoxSizing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitClipPath", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnBreakAfter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnBreakBefore", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnBreakInside", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnCount", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnGap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnRule", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnRuleColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnRuleStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnRuleWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnSpan", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumnWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitColumns", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFilter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlex", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlexBasis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlexDirection", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlexFlow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlexGrow", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlexShrink", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFlexWrap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFontFeatureSettings", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitFontSmoothing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitHyphenateCharacter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitJustifyContent", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitLineBreak", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitLineClamp", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitLocale", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitLogicalHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitLogicalWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMarginAfter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMarginBefore", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMarginEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMarginStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMask", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskBoxImage", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskBoxImageOutset", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskBoxImageRepeat", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskBoxImageSlice", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskBoxImageSource", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskBoxImageWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskClip", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskComposite", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskImage", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskPositionX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskPositionY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskRepeat", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskRepeatX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskRepeatY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaskSize", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaxLogicalHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMaxLogicalWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMinLogicalHeight", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitMinLogicalWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitOpacity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitOrder", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPaddingAfter", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPaddingBefore", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPaddingEnd", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPaddingStart", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPerspective", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPerspectiveOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPerspectiveOriginX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPerspectiveOriginY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitPrintColorAdjust", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitRtlOrdering", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitRubyPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitShapeImageThreshold", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitShapeMargin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitShapeOutside", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTapHighlightColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextCombine", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextDecorationsInEffect", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextEmphasis", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextEmphasisColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextEmphasisPosition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextEmphasisStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextFillColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextOrientation", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextSecurity", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextSizeAdjust", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextStroke", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextStrokeColor", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTextStrokeWidth", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransform", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransformOrigin", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransformOriginX", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransformOriginY", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransformOriginZ", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransformStyle", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransition", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransitionDelay", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransitionDuration", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransitionProperty", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitTransitionTimingFunction", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitUserDrag", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitUserModify", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitUserSelect", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "webkitWritingMode", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "whiteSpace", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "whiteSpaceCollapse", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "widows", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "width", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "willChange", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "wordBreak", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "wordSpacing", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "wordWrap", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "writingMode", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "x", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "y", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "zIndex", {configurable:true, enumerable:true, writable:true, value:""});
yqvm.toolsFunc.defineProperty(CSSStyleDeclaration.prototype, "zoom", {configurable:true, enumerable:true, writable:true, value:""});
// CanvasRenderingContext2D对象
CanvasRenderingContext2D = function CanvasRenderingContext2D(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(CanvasRenderingContext2D, "CanvasRenderingContext2D");
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "canvas", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "canvas_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "globalAlpha", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "globalAlpha_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "globalAlpha_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "globalCompositeOperation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "globalCompositeOperation_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "globalCompositeOperation_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "filter", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "filter_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "filter_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "imageSmoothingEnabled", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "imageSmoothingEnabled_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "imageSmoothingEnabled_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "imageSmoothingQuality", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "imageSmoothingQuality_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "imageSmoothingQuality_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "strokeStyle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "strokeStyle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "strokeStyle_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fillStyle", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fillStyle_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fillStyle_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "shadowOffsetX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowOffsetX_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowOffsetX_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "shadowOffsetY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowOffsetY_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowOffsetY_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "shadowBlur", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowBlur_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowBlur_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "shadowColor", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowColor_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "shadowColor_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "lineWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineWidth_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineWidth_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "lineCap", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineCap_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineCap_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "lineJoin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineJoin_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineJoin_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "miterLimit", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "miterLimit_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "miterLimit_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "lineDashOffset", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineDashOffset_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineDashOffset_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "font", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "font_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "font_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "textAlign", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "textAlign_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "textAlign_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "textBaseline", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "textBaseline_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "textBaseline_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "direction", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "direction_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "direction_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fontKerning", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fontKerning_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fontKerning_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fontStretch", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fontStretch_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fontStretch_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fontVariantCaps", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fontVariantCaps_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fontVariantCaps_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "letterSpacing", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "letterSpacing_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "letterSpacing_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "textRendering", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "textRendering_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "textRendering_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "wordSpacing", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "wordSpacing_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "wordSpacing_set", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "clip", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "clip", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "createConicGradient", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "createConicGradient", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "createImageData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "createImageData", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "createLinearGradient", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "createLinearGradient", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "createPattern", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "createPattern", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "createRadialGradient", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "createRadialGradient", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "drawFocusIfNeeded", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "drawFocusIfNeeded", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "drawImage", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "drawImage", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fill", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fill", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fillText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fillText", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "getContextAttributes", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "getContextAttributes", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "getImageData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "getImageData", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "getLineDash", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "getLineDash", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "getTransform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "getTransform", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "isContextLost", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "isContextLost", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "isPointInPath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "isPointInPath", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "isPointInStroke", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "isPointInStroke", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "measureText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "measureText", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "putImageData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "putImageData", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "reset", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "reset", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "roundRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "roundRect", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "save", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "save", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "scale", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "scale", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "setLineDash", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "setLineDash", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "setTransform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "setTransform", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "stroke", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "stroke", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "strokeText", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "strokeText", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "transform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "transform", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "translate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "translate", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "arc", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "arc", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "arcTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "arcTo", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "beginPath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "beginPath", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "bezierCurveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "bezierCurveTo", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "clearRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "clearRect", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "closePath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "closePath", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "ellipse", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "ellipse", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "fillRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "fillRect", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "lineTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "lineTo", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "moveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "moveTo", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "quadraticCurveTo", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "quadraticCurveTo", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "rect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "rect", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "resetTransform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "resetTransform", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "restore", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "restore", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "rotate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "rotate", arguments)}});
yqvm.toolsFunc.defineProperty(CanvasRenderingContext2D.prototype, "strokeRect", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, CanvasRenderingContext2D.prototype, "CanvasRenderingContext2D", "strokeRect", arguments)}});

// WebGLRenderingContext对象
WebGLRenderingContext = function WebGLRenderingContext(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(WebGLRenderingContext, "WebGLRenderingContext");
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_BUFFER_BIT", {configurable:false, enumerable:true, writable:false, value:256});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BUFFER_BIT", {configurable:false, enumerable:true, writable:false, value:1024});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "COLOR_BUFFER_BIT", {configurable:false, enumerable:true, writable:false, value:16384});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "POINTS", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINES", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINE_LOOP", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINE_STRIP", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TRIANGLES", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TRIANGLE_STRIP", {configurable:false, enumerable:true, writable:false, value:5});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TRIANGLE_FAN", {configurable:false, enumerable:true, writable:false, value:6});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ZERO", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SRC_COLOR", {configurable:false, enumerable:true, writable:false, value:768});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE_MINUS_SRC_COLOR", {configurable:false, enumerable:true, writable:false, value:769});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SRC_ALPHA", {configurable:false, enumerable:true, writable:false, value:770});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE_MINUS_SRC_ALPHA", {configurable:false, enumerable:true, writable:false, value:771});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DST_ALPHA", {configurable:false, enumerable:true, writable:false, value:772});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE_MINUS_DST_ALPHA", {configurable:false, enumerable:true, writable:false, value:773});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DST_COLOR", {configurable:false, enumerable:true, writable:false, value:774});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE_MINUS_DST_COLOR", {configurable:false, enumerable:true, writable:false, value:775});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SRC_ALPHA_SATURATE", {configurable:false, enumerable:true, writable:false, value:776});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FUNC_ADD", {configurable:false, enumerable:true, writable:false, value:32774});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_EQUATION", {configurable:false, enumerable:true, writable:false, value:32777});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_EQUATION_RGB", {configurable:false, enumerable:true, writable:false, value:32777});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_EQUATION_ALPHA", {configurable:false, enumerable:true, writable:false, value:34877});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FUNC_SUBTRACT", {configurable:false, enumerable:true, writable:false, value:32778});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FUNC_REVERSE_SUBTRACT", {configurable:false, enumerable:true, writable:false, value:32779});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_DST_RGB", {configurable:false, enumerable:true, writable:false, value:32968});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_SRC_RGB", {configurable:false, enumerable:true, writable:false, value:32969});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_DST_ALPHA", {configurable:false, enumerable:true, writable:false, value:32970});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_SRC_ALPHA", {configurable:false, enumerable:true, writable:false, value:32971});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CONSTANT_COLOR", {configurable:false, enumerable:true, writable:false, value:32769});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE_MINUS_CONSTANT_COLOR", {configurable:false, enumerable:true, writable:false, value:32770});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CONSTANT_ALPHA", {configurable:false, enumerable:true, writable:false, value:32771});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ONE_MINUS_CONSTANT_ALPHA", {configurable:false, enumerable:true, writable:false, value:32772});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND_COLOR", {configurable:false, enumerable:true, writable:false, value:32773});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ARRAY_BUFFER", {configurable:false, enumerable:true, writable:false, value:34962});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ELEMENT_ARRAY_BUFFER", {configurable:false, enumerable:true, writable:false, value:34963});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ARRAY_BUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:34964});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ELEMENT_ARRAY_BUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:34965});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STREAM_DRAW", {configurable:false, enumerable:true, writable:false, value:35040});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STATIC_DRAW", {configurable:false, enumerable:true, writable:false, value:35044});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DYNAMIC_DRAW", {configurable:false, enumerable:true, writable:false, value:35048});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BUFFER_SIZE", {configurable:false, enumerable:true, writable:false, value:34660});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BUFFER_USAGE", {configurable:false, enumerable:true, writable:false, value:34661});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CURRENT_VERTEX_ATTRIB", {configurable:false, enumerable:true, writable:false, value:34342});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRONT", {configurable:false, enumerable:true, writable:false, value:1028});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BACK", {configurable:false, enumerable:true, writable:false, value:1029});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRONT_AND_BACK", {configurable:false, enumerable:true, writable:false, value:1032});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_2D", {configurable:false, enumerable:true, writable:false, value:3553});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CULL_FACE", {configurable:false, enumerable:true, writable:false, value:2884});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLEND", {configurable:false, enumerable:true, writable:false, value:3042});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DITHER", {configurable:false, enumerable:true, writable:false, value:3024});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_TEST", {configurable:false, enumerable:true, writable:false, value:2960});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_TEST", {configurable:false, enumerable:true, writable:false, value:2929});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SCISSOR_TEST", {configurable:false, enumerable:true, writable:false, value:3089});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "POLYGON_OFFSET_FILL", {configurable:false, enumerable:true, writable:false, value:32823});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLE_ALPHA_TO_COVERAGE", {configurable:false, enumerable:true, writable:false, value:32926});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLE_COVERAGE", {configurable:false, enumerable:true, writable:false, value:32928});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NO_ERROR", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INVALID_ENUM", {configurable:false, enumerable:true, writable:false, value:1280});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INVALID_VALUE", {configurable:false, enumerable:true, writable:false, value:1281});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INVALID_OPERATION", {configurable:false, enumerable:true, writable:false, value:1282});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "OUT_OF_MEMORY", {configurable:false, enumerable:true, writable:false, value:1285});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CW", {configurable:false, enumerable:true, writable:false, value:2304});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CCW", {configurable:false, enumerable:true, writable:false, value:2305});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINE_WIDTH", {configurable:false, enumerable:true, writable:false, value:2849});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ALIASED_POINT_SIZE_RANGE", {configurable:false, enumerable:true, writable:false, value:33901});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ALIASED_LINE_WIDTH_RANGE", {configurable:false, enumerable:true, writable:false, value:33902});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CULL_FACE_MODE", {configurable:false, enumerable:true, writable:false, value:2885});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRONT_FACE", {configurable:false, enumerable:true, writable:false, value:2886});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_RANGE", {configurable:false, enumerable:true, writable:false, value:2928});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:2930});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_CLEAR_VALUE", {configurable:false, enumerable:true, writable:false, value:2931});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_FUNC", {configurable:false, enumerable:true, writable:false, value:2932});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_CLEAR_VALUE", {configurable:false, enumerable:true, writable:false, value:2961});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_FUNC", {configurable:false, enumerable:true, writable:false, value:2962});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_FAIL", {configurable:false, enumerable:true, writable:false, value:2964});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_PASS_DEPTH_FAIL", {configurable:false, enumerable:true, writable:false, value:2965});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_PASS_DEPTH_PASS", {configurable:false, enumerable:true, writable:false, value:2966});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_REF", {configurable:false, enumerable:true, writable:false, value:2967});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_VALUE_MASK", {configurable:false, enumerable:true, writable:false, value:2963});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:2968});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_FUNC", {configurable:false, enumerable:true, writable:false, value:34816});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_FAIL", {configurable:false, enumerable:true, writable:false, value:34817});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_PASS_DEPTH_FAIL", {configurable:false, enumerable:true, writable:false, value:34818});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_PASS_DEPTH_PASS", {configurable:false, enumerable:true, writable:false, value:34819});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_REF", {configurable:false, enumerable:true, writable:false, value:36003});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_VALUE_MASK", {configurable:false, enumerable:true, writable:false, value:36004});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BACK_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:36005});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VIEWPORT", {configurable:false, enumerable:true, writable:false, value:2978});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SCISSOR_BOX", {configurable:false, enumerable:true, writable:false, value:3088});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "COLOR_CLEAR_VALUE", {configurable:false, enumerable:true, writable:false, value:3106});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "COLOR_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:3107});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNPACK_ALIGNMENT", {configurable:false, enumerable:true, writable:false, value:3317});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "PACK_ALIGNMENT", {configurable:false, enumerable:true, writable:false, value:3333});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_TEXTURE_SIZE", {configurable:false, enumerable:true, writable:false, value:3379});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_VIEWPORT_DIMS", {configurable:false, enumerable:true, writable:false, value:3386});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SUBPIXEL_BITS", {configurable:false, enumerable:true, writable:false, value:3408});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RED_BITS", {configurable:false, enumerable:true, writable:false, value:3410});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "GREEN_BITS", {configurable:false, enumerable:true, writable:false, value:3411});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BLUE_BITS", {configurable:false, enumerable:true, writable:false, value:3412});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ALPHA_BITS", {configurable:false, enumerable:true, writable:false, value:3413});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_BITS", {configurable:false, enumerable:true, writable:false, value:3414});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_BITS", {configurable:false, enumerable:true, writable:false, value:3415});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "POLYGON_OFFSET_UNITS", {configurable:false, enumerable:true, writable:false, value:10752});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "POLYGON_OFFSET_FACTOR", {configurable:false, enumerable:true, writable:false, value:32824});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_BINDING_2D", {configurable:false, enumerable:true, writable:false, value:32873});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLE_BUFFERS", {configurable:false, enumerable:true, writable:false, value:32936});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLES", {configurable:false, enumerable:true, writable:false, value:32937});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLE_COVERAGE_VALUE", {configurable:false, enumerable:true, writable:false, value:32938});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLE_COVERAGE_INVERT", {configurable:false, enumerable:true, writable:false, value:32939});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "COMPRESSED_TEXTURE_FORMATS", {configurable:false, enumerable:true, writable:false, value:34467});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DONT_CARE", {configurable:false, enumerable:true, writable:false, value:4352});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FASTEST", {configurable:false, enumerable:true, writable:false, value:4353});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NICEST", {configurable:false, enumerable:true, writable:false, value:4354});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "GENERATE_MIPMAP_HINT", {configurable:false, enumerable:true, writable:false, value:33170});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BYTE", {configurable:false, enumerable:true, writable:false, value:5120});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNSIGNED_BYTE", {configurable:false, enumerable:true, writable:false, value:5121});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SHORT", {configurable:false, enumerable:true, writable:false, value:5122});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNSIGNED_SHORT", {configurable:false, enumerable:true, writable:false, value:5123});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INT", {configurable:false, enumerable:true, writable:false, value:5124});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNSIGNED_INT", {configurable:false, enumerable:true, writable:false, value:5125});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT", {configurable:false, enumerable:true, writable:false, value:5126});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_COMPONENT", {configurable:false, enumerable:true, writable:false, value:6402});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ALPHA", {configurable:false, enumerable:true, writable:false, value:6406});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RGB", {configurable:false, enumerable:true, writable:false, value:6407});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RGBA", {configurable:false, enumerable:true, writable:false, value:6408});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LUMINANCE", {configurable:false, enumerable:true, writable:false, value:6409});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LUMINANCE_ALPHA", {configurable:false, enumerable:true, writable:false, value:6410});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNSIGNED_SHORT_4_4_4_4", {configurable:false, enumerable:true, writable:false, value:32819});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNSIGNED_SHORT_5_5_5_1", {configurable:false, enumerable:true, writable:false, value:32820});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNSIGNED_SHORT_5_6_5", {configurable:false, enumerable:true, writable:false, value:33635});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAGMENT_SHADER", {configurable:false, enumerable:true, writable:false, value:35632});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_SHADER", {configurable:false, enumerable:true, writable:false, value:35633});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_VERTEX_ATTRIBS", {configurable:false, enumerable:true, writable:false, value:34921});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_VERTEX_UNIFORM_VECTORS", {configurable:false, enumerable:true, writable:false, value:36347});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_VARYING_VECTORS", {configurable:false, enumerable:true, writable:false, value:36348});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_COMBINED_TEXTURE_IMAGE_UNITS", {configurable:false, enumerable:true, writable:false, value:35661});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_VERTEX_TEXTURE_IMAGE_UNITS", {configurable:false, enumerable:true, writable:false, value:35660});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_TEXTURE_IMAGE_UNITS", {configurable:false, enumerable:true, writable:false, value:34930});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_FRAGMENT_UNIFORM_VECTORS", {configurable:false, enumerable:true, writable:false, value:36349});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SHADER_TYPE", {configurable:false, enumerable:true, writable:false, value:35663});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DELETE_STATUS", {configurable:false, enumerable:true, writable:false, value:35712});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINK_STATUS", {configurable:false, enumerable:true, writable:false, value:35714});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VALIDATE_STATUS", {configurable:false, enumerable:true, writable:false, value:35715});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ATTACHED_SHADERS", {configurable:false, enumerable:true, writable:false, value:35717});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ACTIVE_UNIFORMS", {configurable:false, enumerable:true, writable:false, value:35718});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ACTIVE_ATTRIBUTES", {configurable:false, enumerable:true, writable:false, value:35721});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SHADING_LANGUAGE_VERSION", {configurable:false, enumerable:true, writable:false, value:35724});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CURRENT_PROGRAM", {configurable:false, enumerable:true, writable:false, value:35725});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NEVER", {configurable:false, enumerable:true, writable:false, value:512});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LESS", {configurable:false, enumerable:true, writable:false, value:513});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "EQUAL", {configurable:false, enumerable:true, writable:false, value:514});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LEQUAL", {configurable:false, enumerable:true, writable:false, value:515});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "GREATER", {configurable:false, enumerable:true, writable:false, value:516});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NOTEQUAL", {configurable:false, enumerable:true, writable:false, value:517});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "GEQUAL", {configurable:false, enumerable:true, writable:false, value:518});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ALWAYS", {configurable:false, enumerable:true, writable:false, value:519});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "KEEP", {configurable:false, enumerable:true, writable:false, value:7680});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "REPLACE", {configurable:false, enumerable:true, writable:false, value:7681});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INCR", {configurable:false, enumerable:true, writable:false, value:7682});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DECR", {configurable:false, enumerable:true, writable:false, value:7683});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INVERT", {configurable:false, enumerable:true, writable:false, value:5386});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INCR_WRAP", {configurable:false, enumerable:true, writable:false, value:34055});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DECR_WRAP", {configurable:false, enumerable:true, writable:false, value:34056});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VENDOR", {configurable:false, enumerable:true, writable:false, value:7936});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERER", {configurable:false, enumerable:true, writable:false, value:7937});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERSION", {configurable:false, enumerable:true, writable:false, value:7938});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NEAREST", {configurable:false, enumerable:true, writable:false, value:9728});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINEAR", {configurable:false, enumerable:true, writable:false, value:9729});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NEAREST_MIPMAP_NEAREST", {configurable:false, enumerable:true, writable:false, value:9984});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINEAR_MIPMAP_NEAREST", {configurable:false, enumerable:true, writable:false, value:9985});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NEAREST_MIPMAP_LINEAR", {configurable:false, enumerable:true, writable:false, value:9986});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LINEAR_MIPMAP_LINEAR", {configurable:false, enumerable:true, writable:false, value:9987});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_MAG_FILTER", {configurable:false, enumerable:true, writable:false, value:10240});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_MIN_FILTER", {configurable:false, enumerable:true, writable:false, value:10241});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_WRAP_S", {configurable:false, enumerable:true, writable:false, value:10242});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_WRAP_T", {configurable:false, enumerable:true, writable:false, value:10243});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE", {configurable:false, enumerable:true, writable:false, value:5890});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP", {configurable:false, enumerable:true, writable:false, value:34067});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_BINDING_CUBE_MAP", {configurable:false, enumerable:true, writable:false, value:34068});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_X", {configurable:false, enumerable:true, writable:false, value:34069});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_X", {configurable:false, enumerable:true, writable:false, value:34070});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_Y", {configurable:false, enumerable:true, writable:false, value:34071});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_Y", {configurable:false, enumerable:true, writable:false, value:34072});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_Z", {configurable:false, enumerable:true, writable:false, value:34073});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_Z", {configurable:false, enumerable:true, writable:false, value:34074});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_CUBE_MAP_TEXTURE_SIZE", {configurable:false, enumerable:true, writable:false, value:34076});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE0", {configurable:false, enumerable:true, writable:false, value:33984});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE1", {configurable:false, enumerable:true, writable:false, value:33985});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE2", {configurable:false, enumerable:true, writable:false, value:33986});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE3", {configurable:false, enumerable:true, writable:false, value:33987});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE4", {configurable:false, enumerable:true, writable:false, value:33988});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE5", {configurable:false, enumerable:true, writable:false, value:33989});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE6", {configurable:false, enumerable:true, writable:false, value:33990});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE7", {configurable:false, enumerable:true, writable:false, value:33991});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE8", {configurable:false, enumerable:true, writable:false, value:33992});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE9", {configurable:false, enumerable:true, writable:false, value:33993});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE10", {configurable:false, enumerable:true, writable:false, value:33994});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE11", {configurable:false, enumerable:true, writable:false, value:33995});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE12", {configurable:false, enumerable:true, writable:false, value:33996});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE13", {configurable:false, enumerable:true, writable:false, value:33997});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE14", {configurable:false, enumerable:true, writable:false, value:33998});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE15", {configurable:false, enumerable:true, writable:false, value:33999});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE16", {configurable:false, enumerable:true, writable:false, value:34000});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE17", {configurable:false, enumerable:true, writable:false, value:34001});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE18", {configurable:false, enumerable:true, writable:false, value:34002});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE19", {configurable:false, enumerable:true, writable:false, value:34003});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE20", {configurable:false, enumerable:true, writable:false, value:34004});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE21", {configurable:false, enumerable:true, writable:false, value:34005});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE22", {configurable:false, enumerable:true, writable:false, value:34006});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE23", {configurable:false, enumerable:true, writable:false, value:34007});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE24", {configurable:false, enumerable:true, writable:false, value:34008});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE25", {configurable:false, enumerable:true, writable:false, value:34009});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE26", {configurable:false, enumerable:true, writable:false, value:34010});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE27", {configurable:false, enumerable:true, writable:false, value:34011});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE28", {configurable:false, enumerable:true, writable:false, value:34012});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE29", {configurable:false, enumerable:true, writable:false, value:34013});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE30", {configurable:false, enumerable:true, writable:false, value:34014});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "TEXTURE31", {configurable:false, enumerable:true, writable:false, value:34015});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "ACTIVE_TEXTURE", {configurable:false, enumerable:true, writable:false, value:34016});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "REPEAT", {configurable:false, enumerable:true, writable:false, value:10497});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CLAMP_TO_EDGE", {configurable:false, enumerable:true, writable:false, value:33071});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MIRRORED_REPEAT", {configurable:false, enumerable:true, writable:false, value:33648});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT_VEC2", {configurable:false, enumerable:true, writable:false, value:35664});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT_VEC3", {configurable:false, enumerable:true, writable:false, value:35665});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT_VEC4", {configurable:false, enumerable:true, writable:false, value:35666});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INT_VEC2", {configurable:false, enumerable:true, writable:false, value:35667});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INT_VEC3", {configurable:false, enumerable:true, writable:false, value:35668});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INT_VEC4", {configurable:false, enumerable:true, writable:false, value:35669});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BOOL", {configurable:false, enumerable:true, writable:false, value:35670});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BOOL_VEC2", {configurable:false, enumerable:true, writable:false, value:35671});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BOOL_VEC3", {configurable:false, enumerable:true, writable:false, value:35672});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BOOL_VEC4", {configurable:false, enumerable:true, writable:false, value:35673});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT_MAT2", {configurable:false, enumerable:true, writable:false, value:35674});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT_MAT3", {configurable:false, enumerable:true, writable:false, value:35675});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FLOAT_MAT4", {configurable:false, enumerable:true, writable:false, value:35676});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLER_2D", {configurable:false, enumerable:true, writable:false, value:35678});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "SAMPLER_CUBE", {configurable:false, enumerable:true, writable:false, value:35680});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_ENABLED", {configurable:false, enumerable:true, writable:false, value:34338});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_SIZE", {configurable:false, enumerable:true, writable:false, value:34339});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_STRIDE", {configurable:false, enumerable:true, writable:false, value:34340});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_TYPE", {configurable:false, enumerable:true, writable:false, value:34341});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_NORMALIZED", {configurable:false, enumerable:true, writable:false, value:34922});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_POINTER", {configurable:false, enumerable:true, writable:false, value:34373});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:34975});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "IMPLEMENTATION_COLOR_READ_TYPE", {configurable:false, enumerable:true, writable:false, value:35738});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "IMPLEMENTATION_COLOR_READ_FORMAT", {configurable:false, enumerable:true, writable:false, value:35739});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "COMPILE_STATUS", {configurable:false, enumerable:true, writable:false, value:35713});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LOW_FLOAT", {configurable:false, enumerable:true, writable:false, value:36336});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MEDIUM_FLOAT", {configurable:false, enumerable:true, writable:false, value:36337});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "HIGH_FLOAT", {configurable:false, enumerable:true, writable:false, value:36338});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "LOW_INT", {configurable:false, enumerable:true, writable:false, value:36339});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MEDIUM_INT", {configurable:false, enumerable:true, writable:false, value:36340});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "HIGH_INT", {configurable:false, enumerable:true, writable:false, value:36341});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER", {configurable:false, enumerable:true, writable:false, value:36160});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER", {configurable:false, enumerable:true, writable:false, value:36161});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RGBA4", {configurable:false, enumerable:true, writable:false, value:32854});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RGB5_A1", {configurable:false, enumerable:true, writable:false, value:32855});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RGB565", {configurable:false, enumerable:true, writable:false, value:36194});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_COMPONENT16", {configurable:false, enumerable:true, writable:false, value:33189});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_INDEX8", {configurable:false, enumerable:true, writable:false, value:36168});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_STENCIL", {configurable:false, enumerable:true, writable:false, value:34041});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_WIDTH", {configurable:false, enumerable:true, writable:false, value:36162});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_HEIGHT", {configurable:false, enumerable:true, writable:false, value:36163});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_INTERNAL_FORMAT", {configurable:false, enumerable:true, writable:false, value:36164});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_RED_SIZE", {configurable:false, enumerable:true, writable:false, value:36176});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_GREEN_SIZE", {configurable:false, enumerable:true, writable:false, value:36177});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_BLUE_SIZE", {configurable:false, enumerable:true, writable:false, value:36178});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_ALPHA_SIZE", {configurable:false, enumerable:true, writable:false, value:36179});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_DEPTH_SIZE", {configurable:false, enumerable:true, writable:false, value:36180});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_STENCIL_SIZE", {configurable:false, enumerable:true, writable:false, value:36181});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", {configurable:false, enumerable:true, writable:false, value:36048});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", {configurable:false, enumerable:true, writable:false, value:36049});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", {configurable:false, enumerable:true, writable:false, value:36050});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", {configurable:false, enumerable:true, writable:false, value:36051});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "COLOR_ATTACHMENT0", {configurable:false, enumerable:true, writable:false, value:36064});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36096});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "STENCIL_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36128});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "DEPTH_STENCIL_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:33306});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "NONE", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_COMPLETE", {configurable:false, enumerable:true, writable:false, value:36053});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36054});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36055});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", {configurable:false, enumerable:true, writable:false, value:36057});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_UNSUPPORTED", {configurable:false, enumerable:true, writable:false, value:36061});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "FRAMEBUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:36006});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "RENDERBUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:36007});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "MAX_RENDERBUFFER_SIZE", {configurable:false, enumerable:true, writable:false, value:34024});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "INVALID_FRAMEBUFFER_OPERATION", {configurable:false, enumerable:true, writable:false, value:1286});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNPACK_FLIP_Y_WEBGL", {configurable:false, enumerable:true, writable:false, value:37440});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNPACK_PREMULTIPLY_ALPHA_WEBGL", {configurable:false, enumerable:true, writable:false, value:37441});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "CONTEXT_LOST_WEBGL", {configurable:false, enumerable:true, writable:false, value:37442});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "UNPACK_COLORSPACE_CONVERSION_WEBGL", {configurable:false, enumerable:true, writable:false, value:37443});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext, "BROWSER_DEFAULT_WEBGL", {configurable:false, enumerable:true, writable:false, value:37444});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "canvas", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "canvas_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "drawingBufferWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "drawingBufferWidth_get", arguments, 300)}, set:undefined});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "drawingBufferHeight", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "drawingBufferHeight_get", arguments, 150)}, set:undefined});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "drawingBufferColorSpace", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "drawingBufferColorSpace_get", arguments, 'srgb')}, set:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "drawingBufferColorSpace_set", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "unpackColorSpace", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "unpackColorSpace_get", arguments, 'srgb')}, set:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "unpackColorSpace_set", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_BUFFER_BIT", {configurable:false, enumerable:true, writable:false, value:256});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BUFFER_BIT", {configurable:false, enumerable:true, writable:false, value:1024});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "COLOR_BUFFER_BIT", {configurable:false, enumerable:true, writable:false, value:16384});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "POINTS", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINES", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINE_LOOP", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINE_STRIP", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TRIANGLES", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TRIANGLE_STRIP", {configurable:false, enumerable:true, writable:false, value:5});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TRIANGLE_FAN", {configurable:false, enumerable:true, writable:false, value:6});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ZERO", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SRC_COLOR", {configurable:false, enumerable:true, writable:false, value:768});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE_MINUS_SRC_COLOR", {configurable:false, enumerable:true, writable:false, value:769});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SRC_ALPHA", {configurable:false, enumerable:true, writable:false, value:770});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE_MINUS_SRC_ALPHA", {configurable:false, enumerable:true, writable:false, value:771});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DST_ALPHA", {configurable:false, enumerable:true, writable:false, value:772});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE_MINUS_DST_ALPHA", {configurable:false, enumerable:true, writable:false, value:773});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DST_COLOR", {configurable:false, enumerable:true, writable:false, value:774});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE_MINUS_DST_COLOR", {configurable:false, enumerable:true, writable:false, value:775});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SRC_ALPHA_SATURATE", {configurable:false, enumerable:true, writable:false, value:776});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FUNC_ADD", {configurable:false, enumerable:true, writable:false, value:32774});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_EQUATION", {configurable:false, enumerable:true, writable:false, value:32777});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_EQUATION_RGB", {configurable:false, enumerable:true, writable:false, value:32777});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_EQUATION_ALPHA", {configurable:false, enumerable:true, writable:false, value:34877});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FUNC_SUBTRACT", {configurable:false, enumerable:true, writable:false, value:32778});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FUNC_REVERSE_SUBTRACT", {configurable:false, enumerable:true, writable:false, value:32779});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_DST_RGB", {configurable:false, enumerable:true, writable:false, value:32968});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_SRC_RGB", {configurable:false, enumerable:true, writable:false, value:32969});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_DST_ALPHA", {configurable:false, enumerable:true, writable:false, value:32970});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_SRC_ALPHA", {configurable:false, enumerable:true, writable:false, value:32971});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CONSTANT_COLOR", {configurable:false, enumerable:true, writable:false, value:32769});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE_MINUS_CONSTANT_COLOR", {configurable:false, enumerable:true, writable:false, value:32770});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CONSTANT_ALPHA", {configurable:false, enumerable:true, writable:false, value:32771});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ONE_MINUS_CONSTANT_ALPHA", {configurable:false, enumerable:true, writable:false, value:32772});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND_COLOR", {configurable:false, enumerable:true, writable:false, value:32773});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ARRAY_BUFFER", {configurable:false, enumerable:true, writable:false, value:34962});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ELEMENT_ARRAY_BUFFER", {configurable:false, enumerable:true, writable:false, value:34963});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ARRAY_BUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:34964});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ELEMENT_ARRAY_BUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:34965});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STREAM_DRAW", {configurable:false, enumerable:true, writable:false, value:35040});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STATIC_DRAW", {configurable:false, enumerable:true, writable:false, value:35044});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DYNAMIC_DRAW", {configurable:false, enumerable:true, writable:false, value:35048});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BUFFER_SIZE", {configurable:false, enumerable:true, writable:false, value:34660});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BUFFER_USAGE", {configurable:false, enumerable:true, writable:false, value:34661});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CURRENT_VERTEX_ATTRIB", {configurable:false, enumerable:true, writable:false, value:34342});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRONT", {configurable:false, enumerable:true, writable:false, value:1028});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BACK", {configurable:false, enumerable:true, writable:false, value:1029});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRONT_AND_BACK", {configurable:false, enumerable:true, writable:false, value:1032});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_2D", {configurable:false, enumerable:true, writable:false, value:3553});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CULL_FACE", {configurable:false, enumerable:true, writable:false, value:2884});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLEND", {configurable:false, enumerable:true, writable:false, value:3042});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DITHER", {configurable:false, enumerable:true, writable:false, value:3024});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_TEST", {configurable:false, enumerable:true, writable:false, value:2960});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_TEST", {configurable:false, enumerable:true, writable:false, value:2929});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SCISSOR_TEST", {configurable:false, enumerable:true, writable:false, value:3089});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "POLYGON_OFFSET_FILL", {configurable:false, enumerable:true, writable:false, value:32823});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLE_ALPHA_TO_COVERAGE", {configurable:false, enumerable:true, writable:false, value:32926});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLE_COVERAGE", {configurable:false, enumerable:true, writable:false, value:32928});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NO_ERROR", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INVALID_ENUM", {configurable:false, enumerable:true, writable:false, value:1280});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INVALID_VALUE", {configurable:false, enumerable:true, writable:false, value:1281});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INVALID_OPERATION", {configurable:false, enumerable:true, writable:false, value:1282});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "OUT_OF_MEMORY", {configurable:false, enumerable:true, writable:false, value:1285});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CW", {configurable:false, enumerable:true, writable:false, value:2304});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CCW", {configurable:false, enumerable:true, writable:false, value:2305});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINE_WIDTH", {configurable:false, enumerable:true, writable:false, value:2849});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ALIASED_POINT_SIZE_RANGE", {configurable:false, enumerable:true, writable:false, value:33901});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ALIASED_LINE_WIDTH_RANGE", {configurable:false, enumerable:true, writable:false, value:33902});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CULL_FACE_MODE", {configurable:false, enumerable:true, writable:false, value:2885});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRONT_FACE", {configurable:false, enumerable:true, writable:false, value:2886});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_RANGE", {configurable:false, enumerable:true, writable:false, value:2928});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:2930});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_CLEAR_VALUE", {configurable:false, enumerable:true, writable:false, value:2931});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_FUNC", {configurable:false, enumerable:true, writable:false, value:2932});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_CLEAR_VALUE", {configurable:false, enumerable:true, writable:false, value:2961});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_FUNC", {configurable:false, enumerable:true, writable:false, value:2962});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_FAIL", {configurable:false, enumerable:true, writable:false, value:2964});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_PASS_DEPTH_FAIL", {configurable:false, enumerable:true, writable:false, value:2965});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_PASS_DEPTH_PASS", {configurable:false, enumerable:true, writable:false, value:2966});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_REF", {configurable:false, enumerable:true, writable:false, value:2967});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_VALUE_MASK", {configurable:false, enumerable:true, writable:false, value:2963});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:2968});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_FUNC", {configurable:false, enumerable:true, writable:false, value:34816});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_FAIL", {configurable:false, enumerable:true, writable:false, value:34817});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_PASS_DEPTH_FAIL", {configurable:false, enumerable:true, writable:false, value:34818});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_PASS_DEPTH_PASS", {configurable:false, enumerable:true, writable:false, value:34819});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_REF", {configurable:false, enumerable:true, writable:false, value:36003});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_VALUE_MASK", {configurable:false, enumerable:true, writable:false, value:36004});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BACK_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:36005});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VIEWPORT", {configurable:false, enumerable:true, writable:false, value:2978});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SCISSOR_BOX", {configurable:false, enumerable:true, writable:false, value:3088});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "COLOR_CLEAR_VALUE", {configurable:false, enumerable:true, writable:false, value:3106});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "COLOR_WRITEMASK", {configurable:false, enumerable:true, writable:false, value:3107});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNPACK_ALIGNMENT", {configurable:false, enumerable:true, writable:false, value:3317});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "PACK_ALIGNMENT", {configurable:false, enumerable:true, writable:false, value:3333});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_TEXTURE_SIZE", {configurable:false, enumerable:true, writable:false, value:3379});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_VIEWPORT_DIMS", {configurable:false, enumerable:true, writable:false, value:3386});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SUBPIXEL_BITS", {configurable:false, enumerable:true, writable:false, value:3408});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RED_BITS", {configurable:false, enumerable:true, writable:false, value:3410});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "GREEN_BITS", {configurable:false, enumerable:true, writable:false, value:3411});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BLUE_BITS", {configurable:false, enumerable:true, writable:false, value:3412});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ALPHA_BITS", {configurable:false, enumerable:true, writable:false, value:3413});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_BITS", {configurable:false, enumerable:true, writable:false, value:3414});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_BITS", {configurable:false, enumerable:true, writable:false, value:3415});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "POLYGON_OFFSET_UNITS", {configurable:false, enumerable:true, writable:false, value:10752});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "POLYGON_OFFSET_FACTOR", {configurable:false, enumerable:true, writable:false, value:32824});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_BINDING_2D", {configurable:false, enumerable:true, writable:false, value:32873});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLE_BUFFERS", {configurable:false, enumerable:true, writable:false, value:32936});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLES", {configurable:false, enumerable:true, writable:false, value:32937});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLE_COVERAGE_VALUE", {configurable:false, enumerable:true, writable:false, value:32938});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLE_COVERAGE_INVERT", {configurable:false, enumerable:true, writable:false, value:32939});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "COMPRESSED_TEXTURE_FORMATS", {configurable:false, enumerable:true, writable:false, value:34467});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DONT_CARE", {configurable:false, enumerable:true, writable:false, value:4352});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FASTEST", {configurable:false, enumerable:true, writable:false, value:4353});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NICEST", {configurable:false, enumerable:true, writable:false, value:4354});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "GENERATE_MIPMAP_HINT", {configurable:false, enumerable:true, writable:false, value:33170});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BYTE", {configurable:false, enumerable:true, writable:false, value:5120});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNSIGNED_BYTE", {configurable:false, enumerable:true, writable:false, value:5121});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SHORT", {configurable:false, enumerable:true, writable:false, value:5122});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNSIGNED_SHORT", {configurable:false, enumerable:true, writable:false, value:5123});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INT", {configurable:false, enumerable:true, writable:false, value:5124});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNSIGNED_INT", {configurable:false, enumerable:true, writable:false, value:5125});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT", {configurable:false, enumerable:true, writable:false, value:5126});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_COMPONENT", {configurable:false, enumerable:true, writable:false, value:6402});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ALPHA", {configurable:false, enumerable:true, writable:false, value:6406});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RGB", {configurable:false, enumerable:true, writable:false, value:6407});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RGBA", {configurable:false, enumerable:true, writable:false, value:6408});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LUMINANCE", {configurable:false, enumerable:true, writable:false, value:6409});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LUMINANCE_ALPHA", {configurable:false, enumerable:true, writable:false, value:6410});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNSIGNED_SHORT_4_4_4_4", {configurable:false, enumerable:true, writable:false, value:32819});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNSIGNED_SHORT_5_5_5_1", {configurable:false, enumerable:true, writable:false, value:32820});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNSIGNED_SHORT_5_6_5", {configurable:false, enumerable:true, writable:false, value:33635});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAGMENT_SHADER", {configurable:false, enumerable:true, writable:false, value:35632});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_SHADER", {configurable:false, enumerable:true, writable:false, value:35633});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_VERTEX_ATTRIBS", {configurable:false, enumerable:true, writable:false, value:34921});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_VERTEX_UNIFORM_VECTORS", {configurable:false, enumerable:true, writable:false, value:36347});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_VARYING_VECTORS", {configurable:false, enumerable:true, writable:false, value:36348});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_COMBINED_TEXTURE_IMAGE_UNITS", {configurable:false, enumerable:true, writable:false, value:35661});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_VERTEX_TEXTURE_IMAGE_UNITS", {configurable:false, enumerable:true, writable:false, value:35660});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_TEXTURE_IMAGE_UNITS", {configurable:false, enumerable:true, writable:false, value:34930});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_FRAGMENT_UNIFORM_VECTORS", {configurable:false, enumerable:true, writable:false, value:36349});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SHADER_TYPE", {configurable:false, enumerable:true, writable:false, value:35663});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DELETE_STATUS", {configurable:false, enumerable:true, writable:false, value:35712});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINK_STATUS", {configurable:false, enumerable:true, writable:false, value:35714});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VALIDATE_STATUS", {configurable:false, enumerable:true, writable:false, value:35715});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ATTACHED_SHADERS", {configurable:false, enumerable:true, writable:false, value:35717});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ACTIVE_UNIFORMS", {configurable:false, enumerable:true, writable:false, value:35718});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ACTIVE_ATTRIBUTES", {configurable:false, enumerable:true, writable:false, value:35721});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SHADING_LANGUAGE_VERSION", {configurable:false, enumerable:true, writable:false, value:35724});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CURRENT_PROGRAM", {configurable:false, enumerable:true, writable:false, value:35725});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NEVER", {configurable:false, enumerable:true, writable:false, value:512});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LESS", {configurable:false, enumerable:true, writable:false, value:513});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "EQUAL", {configurable:false, enumerable:true, writable:false, value:514});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LEQUAL", {configurable:false, enumerable:true, writable:false, value:515});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "GREATER", {configurable:false, enumerable:true, writable:false, value:516});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NOTEQUAL", {configurable:false, enumerable:true, writable:false, value:517});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "GEQUAL", {configurable:false, enumerable:true, writable:false, value:518});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ALWAYS", {configurable:false, enumerable:true, writable:false, value:519});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "KEEP", {configurable:false, enumerable:true, writable:false, value:7680});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "REPLACE", {configurable:false, enumerable:true, writable:false, value:7681});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INCR", {configurable:false, enumerable:true, writable:false, value:7682});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DECR", {configurable:false, enumerable:true, writable:false, value:7683});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INVERT", {configurable:false, enumerable:true, writable:false, value:5386});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INCR_WRAP", {configurable:false, enumerable:true, writable:false, value:34055});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DECR_WRAP", {configurable:false, enumerable:true, writable:false, value:34056});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VENDOR", {configurable:false, enumerable:true, writable:false, value:7936});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERER", {configurable:false, enumerable:true, writable:false, value:7937});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERSION", {configurable:false, enumerable:true, writable:false, value:7938});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NEAREST", {configurable:false, enumerable:true, writable:false, value:9728});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINEAR", {configurable:false, enumerable:true, writable:false, value:9729});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NEAREST_MIPMAP_NEAREST", {configurable:false, enumerable:true, writable:false, value:9984});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINEAR_MIPMAP_NEAREST", {configurable:false, enumerable:true, writable:false, value:9985});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NEAREST_MIPMAP_LINEAR", {configurable:false, enumerable:true, writable:false, value:9986});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LINEAR_MIPMAP_LINEAR", {configurable:false, enumerable:true, writable:false, value:9987});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_MAG_FILTER", {configurable:false, enumerable:true, writable:false, value:10240});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_MIN_FILTER", {configurable:false, enumerable:true, writable:false, value:10241});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_WRAP_S", {configurable:false, enumerable:true, writable:false, value:10242});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_WRAP_T", {configurable:false, enumerable:true, writable:false, value:10243});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE", {configurable:false, enumerable:true, writable:false, value:5890});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP", {configurable:false, enumerable:true, writable:false, value:34067});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_BINDING_CUBE_MAP", {configurable:false, enumerable:true, writable:false, value:34068});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_X", {configurable:false, enumerable:true, writable:false, value:34069});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_X", {configurable:false, enumerable:true, writable:false, value:34070});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_Y", {configurable:false, enumerable:true, writable:false, value:34071});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_Y", {configurable:false, enumerable:true, writable:false, value:34072});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_Z", {configurable:false, enumerable:true, writable:false, value:34073});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_Z", {configurable:false, enumerable:true, writable:false, value:34074});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_CUBE_MAP_TEXTURE_SIZE", {configurable:false, enumerable:true, writable:false, value:34076});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE0", {configurable:false, enumerable:true, writable:false, value:33984});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE1", {configurable:false, enumerable:true, writable:false, value:33985});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE2", {configurable:false, enumerable:true, writable:false, value:33986});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE3", {configurable:false, enumerable:true, writable:false, value:33987});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE4", {configurable:false, enumerable:true, writable:false, value:33988});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE5", {configurable:false, enumerable:true, writable:false, value:33989});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE6", {configurable:false, enumerable:true, writable:false, value:33990});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE7", {configurable:false, enumerable:true, writable:false, value:33991});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE8", {configurable:false, enumerable:true, writable:false, value:33992});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE9", {configurable:false, enumerable:true, writable:false, value:33993});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE10", {configurable:false, enumerable:true, writable:false, value:33994});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE11", {configurable:false, enumerable:true, writable:false, value:33995});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE12", {configurable:false, enumerable:true, writable:false, value:33996});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE13", {configurable:false, enumerable:true, writable:false, value:33997});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE14", {configurable:false, enumerable:true, writable:false, value:33998});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE15", {configurable:false, enumerable:true, writable:false, value:33999});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE16", {configurable:false, enumerable:true, writable:false, value:34000});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE17", {configurable:false, enumerable:true, writable:false, value:34001});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE18", {configurable:false, enumerable:true, writable:false, value:34002});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE19", {configurable:false, enumerable:true, writable:false, value:34003});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE20", {configurable:false, enumerable:true, writable:false, value:34004});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE21", {configurable:false, enumerable:true, writable:false, value:34005});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE22", {configurable:false, enumerable:true, writable:false, value:34006});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE23", {configurable:false, enumerable:true, writable:false, value:34007});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE24", {configurable:false, enumerable:true, writable:false, value:34008});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE25", {configurable:false, enumerable:true, writable:false, value:34009});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE26", {configurable:false, enumerable:true, writable:false, value:34010});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE27", {configurable:false, enumerable:true, writable:false, value:34011});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE28", {configurable:false, enumerable:true, writable:false, value:34012});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE29", {configurable:false, enumerable:true, writable:false, value:34013});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE30", {configurable:false, enumerable:true, writable:false, value:34014});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "TEXTURE31", {configurable:false, enumerable:true, writable:false, value:34015});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "ACTIVE_TEXTURE", {configurable:false, enumerable:true, writable:false, value:34016});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "REPEAT", {configurable:false, enumerable:true, writable:false, value:10497});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CLAMP_TO_EDGE", {configurable:false, enumerable:true, writable:false, value:33071});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MIRRORED_REPEAT", {configurable:false, enumerable:true, writable:false, value:33648});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT_VEC2", {configurable:false, enumerable:true, writable:false, value:35664});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT_VEC3", {configurable:false, enumerable:true, writable:false, value:35665});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT_VEC4", {configurable:false, enumerable:true, writable:false, value:35666});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INT_VEC2", {configurable:false, enumerable:true, writable:false, value:35667});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INT_VEC3", {configurable:false, enumerable:true, writable:false, value:35668});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INT_VEC4", {configurable:false, enumerable:true, writable:false, value:35669});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BOOL", {configurable:false, enumerable:true, writable:false, value:35670});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BOOL_VEC2", {configurable:false, enumerable:true, writable:false, value:35671});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BOOL_VEC3", {configurable:false, enumerable:true, writable:false, value:35672});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BOOL_VEC4", {configurable:false, enumerable:true, writable:false, value:35673});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT_MAT2", {configurable:false, enumerable:true, writable:false, value:35674});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT_MAT3", {configurable:false, enumerable:true, writable:false, value:35675});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FLOAT_MAT4", {configurable:false, enumerable:true, writable:false, value:35676});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLER_2D", {configurable:false, enumerable:true, writable:false, value:35678});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "SAMPLER_CUBE", {configurable:false, enumerable:true, writable:false, value:35680});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_ENABLED", {configurable:false, enumerable:true, writable:false, value:34338});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_SIZE", {configurable:false, enumerable:true, writable:false, value:34339});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_STRIDE", {configurable:false, enumerable:true, writable:false, value:34340});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_TYPE", {configurable:false, enumerable:true, writable:false, value:34341});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_NORMALIZED", {configurable:false, enumerable:true, writable:false, value:34922});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_POINTER", {configurable:false, enumerable:true, writable:false, value:34373});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:34975});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "IMPLEMENTATION_COLOR_READ_TYPE", {configurable:false, enumerable:true, writable:false, value:35738});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "IMPLEMENTATION_COLOR_READ_FORMAT", {configurable:false, enumerable:true, writable:false, value:35739});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "COMPILE_STATUS", {configurable:false, enumerable:true, writable:false, value:35713});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LOW_FLOAT", {configurable:false, enumerable:true, writable:false, value:36336});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MEDIUM_FLOAT", {configurable:false, enumerable:true, writable:false, value:36337});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "HIGH_FLOAT", {configurable:false, enumerable:true, writable:false, value:36338});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "LOW_INT", {configurable:false, enumerable:true, writable:false, value:36339});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MEDIUM_INT", {configurable:false, enumerable:true, writable:false, value:36340});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "HIGH_INT", {configurable:false, enumerable:true, writable:false, value:36341});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER", {configurable:false, enumerable:true, writable:false, value:36160});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER", {configurable:false, enumerable:true, writable:false, value:36161});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RGBA4", {configurable:false, enumerable:true, writable:false, value:32854});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RGB5_A1", {configurable:false, enumerable:true, writable:false, value:32855});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RGB565", {configurable:false, enumerable:true, writable:false, value:36194});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_COMPONENT16", {configurable:false, enumerable:true, writable:false, value:33189});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_INDEX8", {configurable:false, enumerable:true, writable:false, value:36168});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_STENCIL", {configurable:false, enumerable:true, writable:false, value:34041});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_WIDTH", {configurable:false, enumerable:true, writable:false, value:36162});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_HEIGHT", {configurable:false, enumerable:true, writable:false, value:36163});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_INTERNAL_FORMAT", {configurable:false, enumerable:true, writable:false, value:36164});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_RED_SIZE", {configurable:false, enumerable:true, writable:false, value:36176});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_GREEN_SIZE", {configurable:false, enumerable:true, writable:false, value:36177});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_BLUE_SIZE", {configurable:false, enumerable:true, writable:false, value:36178});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_ALPHA_SIZE", {configurable:false, enumerable:true, writable:false, value:36179});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_DEPTH_SIZE", {configurable:false, enumerable:true, writable:false, value:36180});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_STENCIL_SIZE", {configurable:false, enumerable:true, writable:false, value:36181});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", {configurable:false, enumerable:true, writable:false, value:36048});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", {configurable:false, enumerable:true, writable:false, value:36049});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", {configurable:false, enumerable:true, writable:false, value:36050});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", {configurable:false, enumerable:true, writable:false, value:36051});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "COLOR_ATTACHMENT0", {configurable:false, enumerable:true, writable:false, value:36064});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36096});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "STENCIL_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36128});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "DEPTH_STENCIL_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:33306});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "NONE", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_COMPLETE", {configurable:false, enumerable:true, writable:false, value:36053});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36054});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", {configurable:false, enumerable:true, writable:false, value:36055});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", {configurable:false, enumerable:true, writable:false, value:36057});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_UNSUPPORTED", {configurable:false, enumerable:true, writable:false, value:36061});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "FRAMEBUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:36006});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "RENDERBUFFER_BINDING", {configurable:false, enumerable:true, writable:false, value:36007});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "MAX_RENDERBUFFER_SIZE", {configurable:false, enumerable:true, writable:false, value:34024});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "INVALID_FRAMEBUFFER_OPERATION", {configurable:false, enumerable:true, writable:false, value:1286});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNPACK_FLIP_Y_WEBGL", {configurable:false, enumerable:true, writable:false, value:37440});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNPACK_PREMULTIPLY_ALPHA_WEBGL", {configurable:false, enumerable:true, writable:false, value:37441});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "CONTEXT_LOST_WEBGL", {configurable:false, enumerable:true, writable:false, value:37442});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "UNPACK_COLORSPACE_CONVERSION_WEBGL", {configurable:false, enumerable:true, writable:false, value:37443});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "BROWSER_DEFAULT_WEBGL", {configurable:false, enumerable:true, writable:false, value:37444});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "activeTexture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "activeTexture", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "attachShader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "attachShader", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bindAttribLocation", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bindAttribLocation", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bindRenderbuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bindRenderbuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "blendColor", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "blendColor", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "blendEquation", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "blendEquation", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "blendEquationSeparate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "blendEquationSeparate", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "blendFunc", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "blendFunc", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "blendFuncSeparate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "blendFuncSeparate", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bufferData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bufferData", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bufferSubData", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bufferSubData", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "checkFramebufferStatus", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "checkFramebufferStatus", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "compileShader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "compileShader", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "compressedTexImage2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "compressedTexImage2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "compressedTexSubImage2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "compressedTexSubImage2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "copyTexImage2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "copyTexImage2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "copyTexSubImage2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "copyTexSubImage2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "createBuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "createBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "createFramebuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "createFramebuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "createProgram", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "createProgram", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "createRenderbuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "createRenderbuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "createShader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "createShader", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "createTexture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "createTexture", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "cullFace", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "cullFace", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "deleteBuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "deleteBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "deleteFramebuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "deleteFramebuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "deleteProgram", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "deleteProgram", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "deleteRenderbuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "deleteRenderbuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "deleteShader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "deleteShader", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "deleteTexture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "deleteTexture", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "depthFunc", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "depthFunc", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "depthMask", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "depthMask", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "depthRange", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "depthRange", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "detachShader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "detachShader", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "disable", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "disable", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "enable", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "enable", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "finish", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "finish", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "flush", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "flush", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "framebufferRenderbuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "framebufferRenderbuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "framebufferTexture2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "framebufferTexture2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "frontFace", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "frontFace", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "generateMipmap", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "generateMipmap", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getActiveAttrib", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getActiveAttrib", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getActiveUniform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getActiveUniform", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getAttachedShaders", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getAttachedShaders", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getAttribLocation", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getAttribLocation", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getBufferParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getBufferParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getContextAttributes", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getContextAttributes", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getError", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getError", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getExtension", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getExtension", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getFramebufferAttachmentParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getFramebufferAttachmentParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getProgramInfoLog", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getProgramInfoLog", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getProgramParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getProgramParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getRenderbufferParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getRenderbufferParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getShaderInfoLog", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getShaderInfoLog", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getShaderParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getShaderParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getShaderPrecisionFormat", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getShaderPrecisionFormat", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getShaderSource", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getShaderSource", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getSupportedExtensions", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getSupportedExtensions", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getTexParameter", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getTexParameter", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getUniform", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getUniform", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getUniformLocation", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getUniformLocation", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getVertexAttrib", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getVertexAttrib", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "getVertexAttribOffset", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "getVertexAttribOffset", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "hint", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "hint", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isBuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isContextLost", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isContextLost", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isEnabled", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isEnabled", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isFramebuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isFramebuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isProgram", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isProgram", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isRenderbuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isRenderbuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isShader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isShader", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "isTexture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "isTexture", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "lineWidth", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "lineWidth", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "linkProgram", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "linkProgram", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "pixelStorei", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "pixelStorei", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "polygonOffset", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "polygonOffset", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "readPixels", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "readPixels", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "renderbufferStorage", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "renderbufferStorage", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "sampleCoverage", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "sampleCoverage", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "shaderSource", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "shaderSource", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "stencilFunc", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "stencilFunc", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "stencilFuncSeparate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "stencilFuncSeparate", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "stencilMask", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "stencilMask", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "stencilMaskSeparate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "stencilMaskSeparate", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "stencilOp", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "stencilOp", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "stencilOpSeparate", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "stencilOpSeparate", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "texImage2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "texImage2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "texParameterf", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "texParameterf", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "texParameteri", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "texParameteri", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "texSubImage2D", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "texSubImage2D", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "useProgram", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "useProgram", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "validateProgram", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "validateProgram", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bindBuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bindBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bindFramebuffer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bindFramebuffer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "bindTexture", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "bindTexture", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "clear", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "clear", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "clearColor", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "clearColor", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "clearDepth", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "clearDepth", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "clearStencil", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "clearStencil", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "colorMask", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "colorMask", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "disableVertexAttribArray", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "disableVertexAttribArray", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "drawArrays", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "drawArrays", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "drawElements", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "drawElements", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "enableVertexAttribArray", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "enableVertexAttribArray", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "scissor", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "scissor", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform1f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform1f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform1fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform1fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform1i", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform1i", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform1iv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform1iv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform2f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform2f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform2fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform2fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform2i", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform2i", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform2iv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform2iv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform3f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform3f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform3fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform3fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform3i", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform3i", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform3iv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform3iv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform4f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform4f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform4fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform4fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform4i", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform4i", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniform4iv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniform4iv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniformMatrix2fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniformMatrix2fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniformMatrix3fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniformMatrix3fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "uniformMatrix4fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "uniformMatrix4fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib1f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib1f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib1fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib1fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib2f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib2f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib2fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib2fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib3f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib3f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib3fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib3fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib4f", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib4f", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttrib4fv", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttrib4fv", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "vertexAttribPointer", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "vertexAttribPointer", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "viewport", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "viewport", arguments)}});
yqvm.toolsFunc.defineProperty(WebGLRenderingContext.prototype, "makeXRCompatible", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, WebGLRenderingContext.prototype, "WebGLRenderingContext", "makeXRCompatible", arguments)}});

// WebGLBuffer对象
WebGLBuffer = function WebGLBuffer() {
    return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")
}
yqvm.toolsFunc.safeProto(WebGLBuffer, "WebGLBuffer");

// WebGLProgram对象
WebGLProgram = function WebGLProgram(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(WebGLProgram, "WebGLProgram");

// WebGLShader对象
WebGLShader = function WebGLShader(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(WebGLShader, "WebGLShader");

// XMLHttpRequestEventTarget对象
XMLHttpRequestEventTarget = function XMLHttpRequestEventTarget(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(XMLHttpRequestEventTarget, "XMLHttpRequestEventTarget");
Object.setPrototypeOf(XMLHttpRequestEventTarget.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "onloadstart", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onloadstart_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onloadstart_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "onprogress", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onprogress_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onprogress_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "onabort", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onabort_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onabort_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "onload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onload_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onload_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "ontimeout", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "ontimeout_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "ontimeout_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequestEventTarget.prototype, "onloadend", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onloadend_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequestEventTarget.prototype, "XMLHttpRequestEventTarget", "onloadend_set", arguments)}});

// XMLHttpRequest对象
XMLHttpRequest = function XMLHttpRequest(){}
yqvm.toolsFunc.safeProto(XMLHttpRequest, "XMLHttpRequest");
Object.setPrototypeOf(XMLHttpRequest.prototype, XMLHttpRequestEventTarget.prototype);
yqvm.toolsFunc.defineProperty(XMLHttpRequest, "UNSENT", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(XMLHttpRequest, "OPENED", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(XMLHttpRequest, "HEADERS_RECEIVED", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(XMLHttpRequest, "LOADING", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(XMLHttpRequest, "DONE", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "onreadystatechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "onreadystatechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "readyState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "readyState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "timeout", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "timeout_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "timeout_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "withCredentials", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "withCredentials_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "withCredentials_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "upload", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "upload_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "responseURL", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "responseURL_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "status", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "status_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "statusText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "statusText_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "responseType", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "responseType_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "responseType_set", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "response", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "response_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "responseText", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "responseText_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "responseXML", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "responseXML_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "UNSENT", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "OPENED", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "HEADERS_RECEIVED", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "LOADING", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "DONE", {configurable:false, enumerable:true, writable:false, value:4});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "abort", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "abort", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "getAllResponseHeaders", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "getAllResponseHeaders", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "getResponseHeader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "getResponseHeader", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "open", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "open", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "overrideMimeType", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "overrideMimeType", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "send", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "send", arguments)}});
yqvm.toolsFunc.defineProperty(XMLHttpRequest.prototype, "setRequestHeader", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, XMLHttpRequest.prototype, "XMLHttpRequest", "setRequestHeader", arguments)}});

// BatteryManager对象
BatteryManager = function BatteryManager(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(BatteryManager, "BatteryManager");
Object.setPrototypeOf(BatteryManager.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "charging", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "charging_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "chargingTime", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "chargingTime_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "dischargingTime", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "dischargingTime_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "level", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "level_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "onchargingchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "onchargingchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "onchargingchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "onchargingtimechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "onchargingtimechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "onchargingtimechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "ondischargingtimechange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "ondischargingtimechange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "ondischargingtimechange_set", arguments)}});
yqvm.toolsFunc.defineProperty(BatteryManager.prototype, "onlevelchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "onlevelchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, BatteryManager.prototype, "BatteryManager", "onlevelchange_set", arguments)}});

// Event对象
Event = function Event(){return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'Event': 1 argument required, but only 0 present.")}
yqvm.toolsFunc.safeProto(Event, "Event");
yqvm.toolsFunc.defineProperty(Event, "NONE", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(Event, "CAPTURING_PHASE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Event, "AT_TARGET", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(Event, "BUBBLING_PHASE", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(Event.prototype, "type", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "type_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "target", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "target_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "currentTarget", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "currentTarget_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "eventPhase", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "eventPhase_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "bubbles", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "bubbles_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "cancelable", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "cancelable_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "defaultPrevented", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "defaultPrevented_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "composed", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "composed_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "timeStamp", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "timeStamp_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "srcElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "srcElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Event.prototype, "returnValue", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "returnValue_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "returnValue_set", arguments)}});
yqvm.toolsFunc.defineProperty(Event.prototype, "cancelBubble", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "cancelBubble_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "cancelBubble_set", arguments)}});
yqvm.toolsFunc.defineProperty(Event.prototype, "NONE", {configurable:false, enumerable:true, writable:false, value:0});
yqvm.toolsFunc.defineProperty(Event.prototype, "CAPTURING_PHASE", {configurable:false, enumerable:true, writable:false, value:1});
yqvm.toolsFunc.defineProperty(Event.prototype, "AT_TARGET", {configurable:false, enumerable:true, writable:false, value:2});
yqvm.toolsFunc.defineProperty(Event.prototype, "BUBBLING_PHASE", {configurable:false, enumerable:true, writable:false, value:3});
yqvm.toolsFunc.defineProperty(Event.prototype, "composedPath", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "composedPath", arguments)}});
yqvm.toolsFunc.defineProperty(Event.prototype, "initEvent", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "initEvent", arguments)}});
yqvm.toolsFunc.defineProperty(Event.prototype, "preventDefault", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "preventDefault", arguments)}});
yqvm.toolsFunc.defineProperty(Event.prototype, "stopImmediatePropagation", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "stopImmediatePropagation", arguments)}});
yqvm.toolsFunc.defineProperty(Event.prototype, "stopPropagation", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Event.prototype, "Event", "stopPropagation", arguments)}});

// MediaEncryptedEvent对象
MediaEncryptedEvent = function MediaEncryptedEvent(){return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'MediaEncryptedEvent': 1 argument required, but only 0 present.")}
yqvm.toolsFunc.safeProto(MediaEncryptedEvent, "MediaEncryptedEvent");
Object.setPrototypeOf(MediaEncryptedEvent.prototype, Event.prototype);
yqvm.toolsFunc.defineProperty(MediaEncryptedEvent.prototype, "initDataType", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MediaEncryptedEvent.prototype, "MediaEncryptedEvent", "initDataType_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MediaEncryptedEvent.prototype, "initData", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MediaEncryptedEvent.prototype, "MediaEncryptedEvent", "initData_get", arguments)}, set:undefined});

// UIEvent对象
UIEvent = function UIEvent(){return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'UIEvent': 1 argument required, but only 0 present.")}
yqvm.toolsFunc.safeProto(UIEvent, "UIEvent");
Object.setPrototypeOf(UIEvent.prototype, Event.prototype);
yqvm.toolsFunc.defineProperty(UIEvent.prototype, "view", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "view_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(UIEvent.prototype, "detail", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "detail_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(UIEvent.prototype, "sourceCapabilities", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "sourceCapabilities_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(UIEvent.prototype, "which", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "which_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(UIEvent.prototype, "initUIEvent", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "initUIEvent", arguments)}});

// MouseEvent对象
MouseEvent = function MouseEvent(){return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'MouseEvent': 1 argument required, but only 0 present.")}
yqvm.toolsFunc.safeProto(MouseEvent, "MouseEvent");
Object.setPrototypeOf(MouseEvent.prototype, UIEvent.prototype);
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "screenX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "screenX_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "screenY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "screenY_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "clientX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "clientX_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "clientY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "clientY_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "ctrlKey", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "ctrlKey_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "shiftKey", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "shiftKey_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "altKey", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "altKey_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "metaKey", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "metaKey_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "button", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "button_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "buttons", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "buttons_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "relatedTarget", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "relatedTarget_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "pageX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "pageX_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "pageY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "pageY_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "x", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "x_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "y", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "y_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "offsetX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "offsetX_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "offsetY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "offsetY_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "movementX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "movementX_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "movementY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "movementY_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "fromElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "fromElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "toElement", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "toElement_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "layerX", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "layerX_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "layerY", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "layerY_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "getModifierState", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "getModifierState", arguments)}});
yqvm.toolsFunc.defineProperty(MouseEvent.prototype, "initMouseEvent", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, MouseEvent.prototype, "MouseEvent", "initMouseEvent", arguments)}});

// Screen对象
Screen = function Screen(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Screen, "Screen"); //防止toString检测和name检测
Object.setPrototypeOf(Screen.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(Screen.prototype, "availWidth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "availWidth_get", arguments, 1440)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "availHeight", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "availHeight_get", arguments, 900)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "width", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "width_get", arguments, 1440)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "height", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "height_get", arguments, 900)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "colorDepth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "colorDepth_get", arguments, 30)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "pixelDepth", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "pixelDepth_get", arguments, 30)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "availLeft", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "availLeft_get", arguments, 0)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "availTop", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "availTop_get", arguments, 0)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "orientation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "orientation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Screen.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "onchange_get", arguments, null)}, set:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "onchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(Screen.prototype, "isExtended", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Screen.prototype, "Screen", "isExtended_get", arguments, false)}, set:undefined});

// screen对象
screen = {}
Object.setPrototypeOf(screen, Screen.prototype);

// IDBFactory对象
IDBFactory = function IDBFactory(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(IDBFactory, "IDBFactory");
yqvm.toolsFunc.defineProperty(IDBFactory.prototype, "cmp", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, IDBFactory.prototype, "IDBFactory", "cmp", arguments)}});
yqvm.toolsFunc.defineProperty(IDBFactory.prototype, "databases", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, IDBFactory.prototype, "IDBFactory", "databases", arguments)}});
yqvm.toolsFunc.defineProperty(IDBFactory.prototype, "deleteDatabase", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, IDBFactory.prototype, "IDBFactory", "deleteDatabase", arguments)}});
yqvm.toolsFunc.defineProperty(IDBFactory.prototype, "open", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, IDBFactory.prototype, "IDBFactory", "open", arguments)}});

// IDBRequest对象
IDBRequest = function IDBRequest(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(IDBRequest, "IDBRequest");
Object.setPrototypeOf(IDBRequest.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "result", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "result_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "error", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "error_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "source", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "source_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "transaction", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "transaction_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "readyState", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "readyState_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "onsuccess", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "onsuccess_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "onsuccess_set", arguments)}});
yqvm.toolsFunc.defineProperty(IDBRequest.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "onerror_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, IDBRequest.prototype, "IDBRequest", "onerror_set", arguments)}});

// IDBOpenDBRequest对象
IDBOpenDBRequest = function IDBOpenDBRequest(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(IDBOpenDBRequest, "IDBOpenDBRequest");
Object.setPrototypeOf(IDBOpenDBRequest.prototype, IDBRequest.prototype);
yqvm.toolsFunc.defineProperty(IDBOpenDBRequest.prototype, "onblocked", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBOpenDBRequest.prototype, "IDBOpenDBRequest", "onblocked_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, IDBOpenDBRequest.prototype, "IDBOpenDBRequest", "onblocked_set", arguments)}});
yqvm.toolsFunc.defineProperty(IDBOpenDBRequest.prototype, "onupgradeneeded", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, IDBOpenDBRequest.prototype, "IDBOpenDBRequest", "onupgradeneeded_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, IDBOpenDBRequest.prototype, "IDBOpenDBRequest", "onupgradeneeded_set", arguments)}});

// NetworkInformation对象
NetworkInformation = function NetworkInformation(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(NetworkInformation, "NetworkInformation");
Object.setPrototypeOf(NetworkInformation.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(NetworkInformation.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, NetworkInformation.prototype, "NetworkInformation", "onchange_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, NetworkInformation.prototype, "NetworkInformation", "onchange_set", arguments)}});
yqvm.toolsFunc.defineProperty(NetworkInformation.prototype, "effectiveType", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, NetworkInformation.prototype, "NetworkInformation", "effectiveType_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(NetworkInformation.prototype, "rtt", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, NetworkInformation.prototype, "NetworkInformation", "rtt_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(NetworkInformation.prototype, "downlink", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, NetworkInformation.prototype, "NetworkInformation", "downlink_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(NetworkInformation.prototype, "saveData", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, NetworkInformation.prototype, "NetworkInformation", "saveData_get", arguments)}, set:undefined});

// WebGLUniformLocation对象
WebGLUniformLocation = function WebGLUniformLocation(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(WebGLUniformLocation, "WebGLUniformLocation");
// Performance对象
Performance = function Performance(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Performance, "Performance");
Object.setPrototypeOf(Performance.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(Performance.prototype, "timeOrigin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "timeOrigin_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "onresourcetimingbufferfull", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "onresourcetimingbufferfull_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "onresourcetimingbufferfull_set", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "clearMarks", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "clearMarks", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "clearMeasures", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "clearMeasures", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "clearResourceTimings", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "clearResourceTimings", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "getEntries", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "getEntries", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "getEntriesByName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "getEntriesByName", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "getEntriesByType", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "getEntriesByType", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "mark", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "mark", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "measure", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "measure", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "now", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "now", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "setResourceTimingBufferSize", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "setResourceTimingBufferSize", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "toJSON", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "toJSON", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "timing", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "timing_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "navigation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "navigation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "memory", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "memory_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "eventCounts", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "eventCounts_get", arguments)}, set:undefined});

// performance对象
performance = {}
Object.setPrototypeOf(performance, Performance.prototype);

// Crypto对象
Crypto = function Crypto(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Crypto, "Crypto");
yqvm.toolsFunc.defineProperty(Crypto.prototype, "getRandomValues", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Crypto.prototype, "Crypto", "getRandomValues", arguments)}});

// Performance对象
Performance = function Performance(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(Performance, "Performance");
Object.setPrototypeOf(Performance.prototype, EventTarget.prototype);
yqvm.toolsFunc.defineProperty(Performance.prototype, "timeOrigin", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "timeOrigin_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "onresourcetimingbufferfull", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "onresourcetimingbufferfull_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "onresourcetimingbufferfull_set", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "clearMarks", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "clearMarks", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "clearMeasures", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "clearMeasures", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "clearResourceTimings", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "clearResourceTimings", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "getEntries", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "getEntries", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "getEntriesByName", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "getEntriesByName", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "getEntriesByType", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "getEntriesByType", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "mark", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "mark", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "measure", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "measure", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "now", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "now", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "setResourceTimingBufferSize", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "setResourceTimingBufferSize", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "toJSON", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "toJSON", arguments)}});
yqvm.toolsFunc.defineProperty(Performance.prototype, "timing", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "timing_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "navigation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "navigation_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "memory", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "memory_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(Performance.prototype, "eventCounts", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, Performance.prototype, "Performance", "eventCounts_get", arguments)}, set:undefined});

// performance对象
performance = {}
Object.setPrototypeOf(performance, Performance.prototype);

// RunningState对象
let RunningState = {}
yqvm.toolsFunc.defineProperty(RunningState, "CANNOT_RUN", {configurable:true, enumerable:true, writable:true, value:"cannot_run"});
yqvm.toolsFunc.defineProperty(RunningState, "READY_TO_RUN", {configurable:true, enumerable:true, writable:true, value:"ready_to_run"});
yqvm.toolsFunc.defineProperty(RunningState, "RUNNING", {configurable:true, enumerable:true, writable:true, value:"running"});


// InstallState对象
let InstallState = {}
yqvm.toolsFunc.defineProperty(InstallState, "DISABLED", {configurable:true, enumerable:true, writable:true, value:"disabled"});
yqvm.toolsFunc.defineProperty(InstallState, "INSTALLED", {configurable:true, enumerable:true, writable:true, value:"installed"});
yqvm.toolsFunc.defineProperty(InstallState, "NOT_INSTALLED", {configurable:true, enumerable:true, writable:true, value:"not_installed"});


// app对象
let app = {}
yqvm.toolsFunc.defineProperty(app, "isInstalled", {configurable:true, enumerable:true, writable:true, value:false});
yqvm.toolsFunc.defineProperty(app, "getDetails", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, app, "app", "getDetails", arguments)}});
yqvm.toolsFunc.defineProperty(app, "getIsInstalled", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, app, "app", "getIsInstalled", arguments)}});
yqvm.toolsFunc.defineProperty(app, "installState", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, app, "app", "installState", arguments)}});
yqvm.toolsFunc.defineProperty(app, "runningState", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, app, "app", "runningState", arguments)}});
yqvm.toolsFunc.defineProperty(app, "InstallState", {configurable:true, enumerable:true, writable:true, value:InstallState});
yqvm.toolsFunc.defineProperty(app, "RunningState", {configurable:true, enumerable:true, writable:true, value:RunningState});

// chrome对象
chrome = {}
yqvm.toolsFunc.defineProperty(chrome, "loadTimes", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, chrome, "chrome", "loadTimes", arguments)}});
yqvm.toolsFunc.defineProperty(chrome, "csi", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, chrome, "chrome", "csi", arguments)}});
yqvm.toolsFunc.defineProperty(chrome, "app", {configurable:true, enumerable:true, writable:true, value:app});



// External对象
External = function External(){return yqvm.toolsFunc.throwError("TypeError", "Illegal constructor")}
yqvm.toolsFunc.safeProto(External, "External");
yqvm.toolsFunc.defineProperty(External.prototype, "AddSearchProvider", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, External.prototype, "External", "AddSearchProvider", arguments)}});
yqvm.toolsFunc.defineProperty(External.prototype, "IsSearchProviderInstalled", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, External.prototype, "External", "IsSearchProviderInstalled", arguments)}});



// external对象
external = {}
Object.setPrototypeOf(external, External.prototype);

// window对象
// 删除浏览器中不存在的对象
delete global;
delete Buffer;
//delete process; 非必要不开,除非浏览器必检测,这在execjs中需要用到,或者express中用到
delete GLOBAL;
delete root;
delete VMError;
delete globalThis[Symbol.toStringTag];
delete WindowProperties;
window = globalThis;
Object.setPrototypeOf(window, Window.prototype);



yqvm.toolsFunc.defineProperty(window, "atob", {configurable:true, enumerable:true, writable:true,
    value:function atob(str){
        return yqvm.toolsFunc.base64.base64decode(str);
    }
});
yqvm.toolsFunc.defineProperty(window, "btoa", {
    configurable:true,
    enumerable:true,
    writable:true,
    value:function btoa(str){
        return yqvm.toolsFunc.base64.base64encode(str);
    }
});
yqvm.toolsFunc.defineProperty(window, "name", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "name_get", arguments, '')}, set:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "name_set", arguments)}});
yqvm.toolsFunc.defineProperty(window, "location", {configurable:false});
yqvm.toolsFunc.defineProperty(window, "self", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "self_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "self_set", arguments)}});
yqvm.toolsFunc.defineProperty(window, "top", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "top_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(window, "parent", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "parent_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "parent_set", arguments)}});
yqvm.toolsFunc.defineProperty(window, "setTimeout", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "setTimeout", arguments)}});
yqvm.toolsFunc.defineProperty(window, "clearTimeout", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "clearTimeout", arguments)}});
yqvm.toolsFunc.defineProperty(window, "setInterval", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "setInterval", arguments)}});
yqvm.toolsFunc.defineProperty(window, "DOMParser", {configurable:true, enumerable:false, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "DOMParser", arguments)}});
yqvm.toolsFunc.defineProperty(window, "AudioBuffer", {configurable:true, enumerable:false, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "AudioBuffer", arguments)}});
yqvm.toolsFunc.defineProperty(window, "indexedDB", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "indexedDB_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(window, "crypto", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "crypto_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(window, "openDatabase", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "openDatabase", arguments)}});
yqvm.toolsFunc.defineProperty(window, "clientInformation", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "clientInformation_get", arguments)}, set:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "clientInformation_set", arguments)}});
yqvm.toolsFunc.defineProperty(window, "fetch", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "fetch", arguments)}});
yqvm.toolsFunc.defineProperty(window, "webkitRequestFileSystem", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "webkitRequestFileSystem", arguments)}});
yqvm.toolsFunc.defineProperty(window, "onerror", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "onerror_get", arguments, null)}, set:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "onerror_set", arguments)}});
yqvm.toolsFunc.defineProperty(window, "onmessage", {configurable:true, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "onmessage_get", arguments, null)}, set:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "onmessage_set", arguments)}});
yqvm.toolsFunc.defineProperty(window, "open", {configurable:true, enumerable:true, writable:true, value:function (){return yqvm.toolsFunc.dispatch(this, window, "window", "open", arguments)}});

// 全局变量初始化
!function (){
    //hooke console.log
    let onEnter = function (obj){
        try{
            yqvm.toolsFunc.printLog(obj.args);
        }catch (e){}
    }
    console.log = yqvm.toolsFunc.hook(
        console.log,
        undefined,
        false,
        onEnter,
        function (){},
        yqvm.config.print
    );

    //初始化插件环境
    yqvm.toolsFunc.createPlugin({
            "description": "Portable Document Format",
            "filename":"internal-pdf-viewer",
            "name":"PDF Viewer",
            "mimeTypes": [{
                "type":'application/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            },{
                "type":'text/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            }]
        });
    yqvm.toolsFunc.createPlugin({
            "description": "Portable Document Format",
            "filename":"internal-pdf-viewer",
            "name":"Chrome PDF Viewer",
            "mimeTypes": [{
                "type":'application/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            },{
                "type":'text/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            }]
        });
    yqvm.toolsFunc.createPlugin({
            "description": "Portable Document Format",
            "filename":"internal-pdf-viewer",
            "name":"Chromium PDF Viewer",
            "mimeTypes": [{
                "type":'application/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            },{
                "type":'text/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            }]
        });
    yqvm.toolsFunc.createPlugin({
            "description": "Portable Document Format",
            "filename":"internal-pdf-viewer",
            "name":"Microsoft Edge PDF Viewer",
            "mimeTypes": [{
                "type":'application/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            },{
                "type":'text/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            }]
        });
    yqvm.toolsFunc.createPlugin({
            "description": "Portable Document Format",
            "filename":"internal-pdf-viewer",
            "name":"WebKit built-in PDF",
            "mimeTypes": [{
                "type":'application/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            },{
                "type":'text/pdf',
                "suffixes": 'pdf',
                "description": 'Portable Document Format'
            }]
        });
}();

//不代理的属性
yqvm.memory.filterProxyProp=yqvm.memory.filterProxyProp.concat(['$_ts'])

//用户location重写
// location对象
location = {}
Object.setPrototypeOf(location, Location.prototype);
yqvm.toolsFunc.defineProperty(location, "valueOf", { configurable: false, enumerable: false, writable: false, value: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "valueOf", arguments) } });
yqvm.toolsFunc.defineProperty(location, "ancestorOrigins", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "ancestorOrigins_get", arguments) }, set: undefined });
yqvm.toolsFunc.defineProperty(location, "href", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "href_get", arguments, 'http://www.fangdi.com.cn/index.html') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "href_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "origin", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "origin_get", arguments, 'http://www.fangdi.com.cn') }, set: undefined });
yqvm.toolsFunc.defineProperty(location, "protocol", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_get", arguments, 'http:') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "host", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "host_get", arguments, 'www.fangdi.com.cn') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "host_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "hostname", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_get", arguments, 'www.fangdi.com.cn') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "port", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "port_get", arguments, '') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "port_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "pathname", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_get", arguments, '/index.html') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "search", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "search_get", arguments, '') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "search_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "hash", { configurable: false, enumerable: true, get: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "hash_get", arguments, '') }, set: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "hash_set", arguments) } });
yqvm.toolsFunc.defineProperty(location, "assign", { configurable: false, enumerable: true, writable: false, value: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "assign", arguments) } });
yqvm.toolsFunc.defineProperty(location, "reload", { configurable: false, enumerable: true, writable: false, value: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "reload", arguments) } });
yqvm.toolsFunc.defineProperty(location, "replace", { configurable: false, enumerable: true, writable: false, value: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "replace", arguments) } });
yqvm.toolsFunc.defineProperty(location, "toString", { configurable: false, enumerable: true, writable: false, value: function () { return yqvm.toolsFunc.dispatch(this, location, "location", "toString", arguments) } });


function hook_random() {
    let onLeave = function (obj) {
        obj.result = 1666666666666;
    }
    let onLeave2 = function (obj) {
        obj.result = 0.5;
    }
    let onLeave3 = function (obj) {
        obj.result = 51523;
    }
    Date.now = yqvm.toolsFunc.hook(Date.now, undefined, false, function () {
    }, onLeave);
    Date.parse = yqvm.toolsFunc.hook(Date.parse, undefined, false, function () {
    }, onLeave);
    Date.prototype.getTime = yqvm.toolsFunc.hook(Date.prototype.getTime, undefined, false, function () {
    }, onLeave);
    Date.prototype.valueOf = yqvm.toolsFunc.hook(Date.prototype.valueOf, undefined, false, function () {
    }, onLeave);
    Performance.prototype.now = yqvm.toolsFunc.hook(Performance.prototype.now, undefined, false, function () {
    }, onLeave3);
    Math.random = yqvm.toolsFunc.hook(Math.random, undefined, false, function () {
    }, onLeave2);
}
hook_random()


let meta = document.createElement('meta');
let content='{qr0l3650VwAzlHVa5AkYJH0E_AcxkqYKY5GhCOR3DAhzOmDyXy4jJ1692587936405t1074790496hatoFV2_dnQkm26649Ddfe167 0wR7HvJ6IsUC410DntKRngA;QyqA82EGtIB6ePNEeYo9NG;iEm6gdSTTpYiqU10OlvsnG;yMG8gk5okQ97gP4eb.IadA;T8F36FaS9AtR4sXBkRr0iG;RTlM3IYjAzboXbIiNSIFRA;t7_svh3Kc3.VU9jOjAJgdq;.8D9Zx78FrKF.Zn4xbfmIG;IMhCM7gXESIqShs5TNMo9A;pvBPF7OtrK6trS5vZYizwa;9qxqLXuEeDQeAlNfAL_l.A;VNeyFcNDtQZhV2sfCxyHqA;kT4JL2WRSOhvUIEcOjSrva;LpFhLGWYI8eFx_X999MLEq;NqssQaVItFB0TevtNxJrkG;AI3RN3R7lP0BBnYsoCO5KG;xrYRhwM6FYW7zCsPL.iecq;0kOXzZzt1eXLrlPo.QQ4xG;ApKNqLIRoybF5rIxSnabBG;hfgZrtz_KscdFC6a3f1wKA;q|gq8lTXCFJsgeg9VXDR_WaXm_cYtSc76PO1N9CbK1QUjSYSm1a8gJ0vD4oQRzvfV5pQxezXb1OKEfOPP54KMJVjYYLs1eLp6YlskrEHVY0Y2REUbw8AmyJUbSHYVfVI2pzhl2YQOWO30pn3l97AowM80etY2ASImJ73oe9VbLvpYTCMCrBVKpUVvz.RlwzUled8fyp86zoVCmYR9NI3TzaYVfn1mTnUONg1aQTpTlqhDyK1l2jJVxg8VzxR2YA8OwTYqyEJuW1JSV7Q90kApetlKLHAAprIba9YGY_lQDyI1ARxX5nd6xiSBdsU4hAkIgqqqqqqqqqqqqqqq}!cqg0RCRdIKALRUmPM1gjIDmSMoJbJ1fSMcAjpYw0RvrvIDSrYu0Lsb2WMpZjplrSsoYlsYQ1iYN5AmSNYTSwoVe7AofiKbZ8KAx1p6gmWKSlrm9mF2ROs2NiHqS8sUzw39SmY9znpfQ58lqEHazNwbgn3ORWtbA98pzhIm72pf2fH627tk2NHo00JUrvobLCKnmPH2ZVHpemk00dUPylcUlFtbqqr4r0r1.cUjaDMa6Xmj86vYiSC.d_qiNZe2RAYzB6kL8EooURQ9hdAqxZT2u0ithybKsACo4FA6k162l4096{trfa0xOEXHmeu8CeHRfWZmOlRp0wnsorkUbf9AbJtQGpvK6RqI006mkAwHlJ2ACJUFrTSUKxrMGc80QhT7FFSR9oDL3FrTjo2GFVSzMomWF|[x2YI39AlpqQwEpl4wkfK3lQ1oCyBcS011nYphDxRpYxzVYEnmflAir0hmnEso2mMVYNyYbZhYAJH10ZVYpyH1DxJwPJ1WKNWQSZsqC7copfIDCSDMkxIJou7Q8Rd_mMUsQYYamtdFX2v706_p5rq42oOs5zWyTojowRTabsAMdZUaVoBpJGpCpC7wdza4bIIpHxjnCdeowROT0.1sZTpblKt3JT76DD1mXgEuVkHmy0pbAOoYRYcGKkEMWzffSMTcJrq0r8ql3EE02Kcsi0YG9HDpiNCurChYENGNrcLFEZse2M5QMyuLrinVLThLS0qKwbd7Ojso0Lo3stUso_bOoqiINftj95zstNH.Gqqqqqqqqqqqqqqq!x7z,aac,amr,asm,avi,bak,bat,bmp,bin,c,cab,css,csv,com,cpp,dat,dll,doc,dot,docx,exe,eot,fla,flc,fon,fot,font,gdb,gif,gz,gho,hlp,hpp,htc,ico,ini,inf,ins,iso,js,jar,jpg,jpeg,json,java,lib,log,mid,mp4,mpa,m4a,mp3,mpg,mkv,mod,mov,mim,mpp,msi,mpeg,obj,ocx,ogg,olb,ole,otf,py,pyc,pas,pgm,ppm,pps,ppt,pdf,pptx,png,pic,pli,psd,qif,qtx,ra,rm,ram,rmvb,reg,res,rtf,rar,so,sbl,sfx,swa,swf,svg,sys,tar,taz,tif,tiff,torrent,txt,ttf,vsd,vss,vsw,vxd,woff,woff2,wmv,wma,wav,wps,xbm,xpm,xls,xlsx,xsl,xml,z,zip,apk,plist,ipaq'

yqvm.toolsFunc.setProtoArr.call(meta, "content", content)
yqvm.toolsFunc.setProtoArr.call(meta, "parentNode", {removeChild:()=>{}})

let script = document.createElement('script');
yqvm.toolsFunc.setProtoArr.call(script, "parentNode", {removeChild:()=>{}})



//外链js
$_ts = window['$_ts'];
if (!$_ts)
    $_ts = {};
$_ts.scj = [];
$_ts['dfe1675'] = 'þþ+þöþ÷þ-þÿ£©=ÿ[ÿ(ÿ,ÿ.ÿ;ÿÿ);ÿ){ÿ){var ÿ[6]](ÿ[8]].ÿ===ÿ<ÿ=0;ÿ;}function ÿ;var ÿ);}function ÿ=this.ÿ);if(ÿ){this.ÿ]=ÿ++ ){ÿ){if(ÿ&&ÿ();ÿvar ÿ=new ÿ)ÿ].ÿ.length;for(var ÿ++ ]=ÿ.push(ÿ=0,ÿ);var ÿ;this.ÿ(){var ÿ||ÿ);}}function ÿ+ÿ;if(ÿ);}ÿ();return ÿ==ÿ.length;ÿ;}}function ÿ);return ÿ!==ÿ];ÿ)this.ÿ){return ÿ();var ÿ!=ÿ);this.ÿ++ ){var ÿ+=ÿ[1]](ÿ[4]](ÿ()[ÿ){}ÿ(){return ÿreturn ÿ=[],ÿ=1;ÿ;return ÿ);}else if(ÿ(258,ÿ(){ÿ)){ÿ;}ÿ=[ÿ instanceof ÿ)return ÿ=(ÿ(236,ÿtry{ÿ;function ÿ?ÿ][ÿif( !ÿ),ÿ];if(ÿ,true);ÿ>0){ÿ-ÿ(136,ÿ(this.ÿfor(ÿ){if( !ÿ);}return ÿ();if(ÿ);}if(ÿ[2]]==ÿ(),ÿ));ÿ.prototype[ÿ();switch(ÿ;}else{ÿ=[];ÿ>=ÿ[29]](ÿ[0],ÿ)&&ÿ()-ÿ);}else{ÿ){if( typeof ÿ;}return ÿ[12]](ÿ=0;var ÿ);}}ÿ);}var ÿ(250,ÿ++ ]=(ÿ++ ;ÿ){if(this.ÿ](ÿ= !ÿ;}var ÿ.length,ÿ.body[ÿ(\"{\");var ÿ=[];this.ÿ[15]](ÿ)){var ÿ;}else if(ÿ);}catch(ÿ;}if(ÿ,false);ÿ&&(ÿ++ ){if(ÿ();return new ÿ[55]](ÿ);for(var ÿ in ÿ.length;if(ÿ]===ÿ){case 61:ÿ:ÿ[92]](ÿ[3]]=ÿ; ++ÿ(\",\");ÿ|| !ÿ;}}else if(ÿ^ÿ);if( !ÿ(\";\");}function ÿ[1],ÿ[0].ÿ));}function ÿ(\"(\");this.ÿ&& !ÿ,0,ÿ(){if(ÿ={},ÿ++ );ÿ[42]](ÿ===2||ÿ[5],ÿ);function ÿ,1);ÿ];}function ÿ)===ÿ[94]](ÿ)){if(ÿ[0]],ÿ],ÿ){return;}ÿ.style[ÿ();}function ÿ(\"}\");}function ÿ=true;ÿ))return ÿ:case ÿ[11]](ÿ,0);ÿ.length; ++ÿ.push(new ÿ.Math[ÿ(new ÿ){}function ÿ;for(ÿ={};this.ÿ={};ÿ=1;var ÿ.join(\'\');}function ÿ=[];for(var ÿ*ÿ[61]]=ÿ();}ÿ=\'\';var ÿ){for(var ÿ||(ÿ[1];ÿ[34]](ÿ;}catch(ÿ++ ];ÿ);}this.ÿ+\"=\"+ÿ[56]](ÿ(\")\");ÿ===0){ÿ[3],ÿ[7])ÿ[50]](ÿ[89],ÿ(){}function ÿ)+ÿ&ÿ===\'+=\')ÿ[38]]);if(ÿ[0];ÿ]);}if(ÿ[1][ÿ[21]](ÿ[24]](ÿ+=2;ÿ);}if(this.ÿ);while(ÿ=((ÿtry{if(ÿ);}}return ÿ(\")\");this.ÿ.length;var ÿ=false;ÿ=2;ÿ):ÿ[87];ÿ ++ÿ;for(var ÿ[79]){ÿ[0]]=ÿ[9]](ÿ[47]](ÿ)return;ÿ+=1;ÿ=0;for(var ÿ];}if(ÿ;while(ÿ.navigator[ÿ[28],ÿ[26]](ÿ;}else{return ÿ[(ÿ[8]]=new ÿ();}return ÿ){}}function ÿ[54]]=ÿ<256;ÿ[3];ÿ));}else if(ÿ);return new ÿ.length>1){ÿ(\"(\");var ÿ);}}}function ÿ=[];var ÿ(2,ÿ=0;if(ÿ++ )],ÿ[2]])===ÿ;){ÿ[72]](ÿ+1;ÿ=null;var ÿ]|ÿ[78]](ÿ<=ÿ)){return ÿ){try{var ÿ.length>0){ÿ();}}function ÿ]);ÿ){return(ÿ[58]&&ÿ){try{if(ÿ){return;}var ÿ&255]^ÿ[0]);ÿ[2]]===ÿ);}}catch(ÿ>0;ÿ[93]](ÿ[92]](\'div\');ÿ){try{ÿ,0);}function ÿ[97]]=ÿ[3];var ÿ[75]](ÿ[2]]&&ÿ=[];while(ÿreturn;ÿ[83],ÿ)*(ÿ[20],ÿ];}else if(ÿ,1);if(ÿ;}}ÿ+1)%ÿ;}for(ÿ<=8){ÿ.abs(ÿ());}function ÿ.documentElement[ÿ.get(ÿ.length===4){ÿ+\'=\'+ÿ();}else{ÿ=0;while(ÿ>>>24]^ÿ)||(ÿ===2){ÿ)|0;ÿ[0];var ÿ[90])];ÿ){}}}function ÿ>=3){ÿ);}}}ÿ+\":\"+ÿ=null;this.ÿ>ÿ[1];var ÿ.length-ÿ;this[ÿ.length-1;ÿ(553,ÿ[615]]=ÿ+=5;ÿ[6]](this,ÿ[70]](ÿ[29]](this.ÿ[2];ÿ),[this.ÿ===1){ÿ,1,ÿ[12]](null,ÿ[19]],ÿ))ÿ>>8&255]^ÿ++ )ÿ>>16&255]^ÿ(){this.ÿ[266],ÿ()){if(ÿ];}}function ÿ];if( !ÿ(\'\"\'+this.ÿ,1);}return ÿ.length;while(ÿ[4],ÿ[0][ÿ[39]]=ÿ[65],ÿ.set(ÿ++ );if(ÿ()){ÿ());ÿ]);if(ÿ(\"}\");ÿ[59]]=ÿ+=3;ÿ=false,ÿ(656,ÿ&=ÿ<4;ÿ++ )];return ÿ[492]]=ÿ():ÿ[505],ÿ()+ÿ[30],ÿ>=40&&ÿ());}ÿ<127){ÿ[67]]===ÿ[574]](ÿ):\'\';}else if(ÿ>=92)ÿ++ );while(ÿ[10],ÿ[67]]+\"//\"+ÿ[1]+ÿ=true,ÿ(0))ÿ);}else{return ÿreturn[ÿ.external[ÿ|=ÿ].y-ÿ>=2){ÿ[((ÿ[77],ÿ-- ;var ÿ());var ÿ<8){}else{var ÿ[18]){if(ÿ[38]])===ÿ.y);ÿ===10)ÿ.target[ÿ[32]]===1){return ÿ>=127)ÿ(this);}}function ÿ[66]){ÿ);for(ÿ,true);}return ÿ.y*ÿ=100;var ÿ=5,ÿ[7]){return ÿtry{return ÿ[84],ÿ.x)+(ÿ();}if(ÿ.x*ÿ+1];ÿ;}}if(ÿ[27]){ÿ;if(this.ÿ){this[ÿ+=9;ÿ(\")\");}function ÿ.length===16){ÿ,\'rel\', -1);var ÿ(){return this.ÿ<arguments.length;ÿ:if(ÿ>8;ÿ[53]]){ÿ(10,ÿ]=(ÿ;(ÿ]!==ÿ(\'<\'+ÿ+=4;ÿ[18]);ÿ=2,ÿ.push(arguments[ÿ];}return ÿ)&&(ÿ.length-1,ÿ,false,ÿ);}else if((ÿ.length)===ÿ);return;}var ÿ=false;}function ÿ];}ÿ[37]]&&ÿ]^=ÿ){while(ÿ;}}catch(ÿ*86+ÿ){}return false;}function ÿ[665],ÿ(175);ÿ(77);var ÿ[62]]=ÿ=false;else ÿ();if( !ÿ.sqrt((ÿ;if( !ÿ;};function ÿ===null||ÿ)%ÿ[0]);}else if(ÿ[83]]=ÿ+=7;ÿ);}if( !ÿ[3]){var ÿ(4)+ÿ;if( typeof ÿ%ÿ[129]+ÿ[65]){var ÿ[85]](ÿ[37]]){}else{ÿ,this.ÿ[34]]((ÿ[3]);ÿ));if(ÿ[262],ÿ.length>0)ÿ=\'?\'+ÿ<92){ÿ;}else{var ÿ-- ;if(ÿ(114,ÿ[40],ÿ!==84){if(ÿ[597]](ÿ(\":\");this.ÿ();function ÿ){switch(ÿ>0||ÿ]=\"\";ÿ[3]],ÿ[3]];ÿ>0&&ÿ.parentNode[ÿ];var ÿ);}return;}else if(ÿ,true);}function ÿ[96]);ÿ[5]]=ÿ]+ÿ);}}else if(ÿ.max(ÿ&& typeof ÿ(0xFFFFFFFF),ÿ(\"try\");ÿ]);}}ÿ)/2);if(ÿ.src=ÿ+=(ÿ);}}}catch(ÿ)||ÿ[310]]!==ÿ[697]&&ÿ<<1^(ÿ));}if(ÿ[39]){return new ÿ-1+ÿ)){for(var ÿ,\',\');ÿ(\"]\");}function ÿ>>24)&0xFF;ÿ[95]){return ÿ.originalTarget[ÿ()*ÿ[169]];ÿ;}}}}if(ÿ[91]){ÿ)>>1);ÿ.MediaStreamTrack[ÿ[482],ÿ[51],ÿ[495])){ÿ-52;}else if(ÿ[147]){ÿ[0]]);if((ÿ(128),ÿ[660]];var ÿ(85);ÿ++ )];if(ÿ[457]]([ÿ[666],ÿ[186]](ÿ[522]](ÿ.z;ÿ[686]](ÿ==\'x\'?ÿ[97]]);ÿ(4,ÿ++ ;}function ÿ,\"&\"+ÿ+(ÿ[81]]==ÿ<5;ÿ)return false;return ÿ[722],ÿ[17]](ÿ[381]]===ÿ=3;if( typeof ÿ[3])||(ÿ;default:if(ÿ)return;if( typeof ÿ[568]][ÿ-1);var ÿ[61]]){ÿ[4];for(ÿ[249])){if(ÿ.join(\',\')+\')\')(ÿ[9]](0,4);ÿ[19]]){ÿ=1;}}}if(ÿ=null;if(ÿ>=97&&ÿ===92){ ++ÿ[674]&&ÿ[136]](ÿ=[new ÿ.ctl;if(ÿ)return new ÿ[314]](ÿ=this[ÿ[65]]&&ÿ(7);ÿ|=2;}ÿ];}else{ÿ[1]&&ÿ[84]);ÿ++ );}ÿ++ ;}else{ÿ[703]]===ÿ[575]](ÿ===\'a\'&&ÿ[23]],ÿ)]=ÿ+=\"?\"+ÿ+1;}else if(ÿ=0;function ÿ[679]]=ÿ>>>24)&0xFF;ÿ[0]]){ÿ)][ÿ<<2,( ++ÿ[18])&&(ÿ+\" <\"+ÿ[56]||ÿ());}catch(ÿ===\'src\'){ÿ[531]);ÿ(){return(ÿ/ÿ[24]]=ÿ[36]]=ÿ,\'?\')!== -1){ÿ>>8)&0xFF;ÿ[2];var ÿ.x+ÿ!== -1){if(ÿ[79]);if(this.ÿ=6,ÿ];return new ÿ+\'=\');if(ÿ]);}}}function ÿ.length>10;ÿ(5)-ÿ[233])in ÿ);}}}return ÿ[416]](ÿ|| typeof ÿ>=3){return;}ÿ);else ÿ(85);return new ÿ,arguments[2]);}}else if(ÿ.head[ÿ]!=ÿ.x,ÿ,0);return ÿ>>>16)&0xFF;ÿ[16]]==ÿ].x-ÿ-1;else if(ÿ===8&&ÿ,\'as\', -1);var ÿ[5]||ÿ[2]],ÿ<<24^ÿ|=2;ÿ[217]](ÿ.y;ÿ(){return[ÿ>>8&255]<<8^ÿ;}else{if(ÿ[56],ÿ(\"if\");ÿ=1;if(ÿ[57]]&&(ÿ[90])];if(ÿ=5;ÿ(1,1);ÿ<=8&&ÿ[ --ÿ+=19;ÿ(4);return ÿ)=== -1;ÿ.x-ÿ[203]](ÿ[278]]||ÿ===\'a\'){var ÿ[0]^ÿ){return false;}}function ÿ-- ){ÿ[605]]=ÿ[98]]===ÿ[239]];ÿ>1)ÿ[428],ÿ|=1048576;ÿ(){if( !ÿ-((ÿ[3]],\'#\')[1];var ÿ[7])){return ÿ=== -1){ÿ<<4^((ÿ; --ÿ[349]]&& !ÿ();}}else if(ÿ=4,ÿ)?1:0,ÿ>>>24]<<24^ÿ(11,ÿ;}if(this.ÿ[45]]();}}ÿ&0xFF;}return ÿ]();case 1:return ÿ[344]](ÿ(\"for\");ÿ[2]]=ÿ[0]instanceof ÿ>0){for(var ÿ[237],ÿ=true;var ÿ(685,ÿ,\'();\',ÿ(\"new\");this.ÿ!==null&&ÿ(256),ÿ);if((ÿ[46]]===ÿ>>>8)&0xFF;ÿ)*2+ÿ,\'?\')[1];if(ÿ[496],ÿ[212]);ÿ[52]],ÿ>>16)&0xFF;ÿ){try{return ÿ[7];ÿ+\']\';}return new ÿ=true;}function ÿ[66])ÿ[7]){arguments[0]=ÿ=3;ÿ,arguments[2],arguments[3]);}else if(ÿ[257]);ÿ[59]]=null;ÿ((ÿ++ );if( !ÿ+\'\"\');return new ÿ[90])];var ÿ=null,ÿ!==\'\'){ÿ[74]||ÿ>>2];ÿ[13];ÿ[586],ÿ[628]](ÿ+\')\'+ÿ.length);ÿ(1,ÿ;}break;case ÿ===3){ÿ){return[ÿ[187]])){ÿ);}else{this.ÿ(\"var\");var ÿ));}}else if(ÿ[681]][ÿ===\'\';ÿ[290]){return ÿ[18])){ÿ[63]);var ÿ-1;}else if(ÿ[32]]&&ÿ];while(ÿ);}}}else if(ÿ=5;return ÿ[98])){if(ÿ++ ;}if(ÿ(16)+ÿ=[\'a\',ÿ[5]);ÿ[447]];ÿ[5]){ÿ[264],ÿ[2]);if(ÿ()));ÿ[1]);}function ÿ+=\'?\';}var ÿ[457]](ÿ[0]]&&ÿ[58],ÿ[1]);ÿ[449]);ÿ[550]]==ÿ[31]];var ÿ[0]+\'=\'+ÿ.length===16){if( !ÿ=== -1)return[ÿ(82);ÿ(25));ÿ[17]]=ÿ===85||ÿ)[1];ÿ>=65&&ÿ[90])].userAgent[ÿ].y,ÿ(81);var ÿ.mediaDevices[ÿ()&&ÿ[272]];}if( !ÿ[62]]);}}else if(ÿ=1,ÿ[98],ÿ.x);ÿ[74],ÿ+=15;ÿ(\":\");var ÿ[306]](ÿ[73]],ÿ)&0xFF,ÿ[82]);ÿ,0);var ÿ[2],ÿ];function ÿ[81]];if((ÿ.length===4;ÿ[2]^ÿ=3,ÿ].x*ÿ.length>=ÿ[255]](ÿ));}ÿ.length-1){ÿ+=\'&\';}else{ÿ=true;}}}function ÿ[23]]===ÿ[0]);if(ÿ<2)return 1;return ÿ;}}}else if(ÿ]]=ÿ(\";\");if(this.ÿ);}}if(ÿ);return;}if(ÿ.objectStoreNames[ÿ[589]],ÿ[0]);}if(ÿ+=14;ÿ[19]]=ÿ[62]]);}}else{ÿ)/ÿ[448]](ÿ(78);var ÿ,arguments[2]);}else if(ÿ[6]]&&ÿ[0]===ÿ]);}}function ÿ]]===ÿ[212],ÿ.document[ÿ={};if(ÿ[2]]){case ÿ[92]](\'a\');ÿ()||ÿ[452],ÿ.push(\'; \');ÿ+\'>\';ÿ===\'src\'&&ÿ!=null){ÿ,true),ÿ[571]){return ÿ!==\'\'||ÿ+=13;ÿ=0;}function ÿ=false;this.ÿ=0;this.ÿ.y-ÿ);try{ÿ>=93&&ÿ===\'#\')&&ÿ[76]]){ÿ(this);}function ÿ]);}else if(ÿ);};function ÿ[453]]);if(ÿ.chrome[ÿ[98]){if(ÿ){if((ÿ)>=0;}function ÿ(112);ÿ,1);}catch(ÿ[60]](ÿ;}}var ÿ+\"&\"+ÿ=10,ÿfor(var ÿ[68]],\'`\');var ÿ(78,ÿ(555,ÿ[280]](0)!==ÿ[414],ÿ[2];if( typeof ÿ[540]](ÿ[75]]((ÿ= typeof ÿ=2;}else{ÿ++ ;}else if(ÿ[49]];var ÿ[4]](\'r\')===\'m\'){ÿ[711]].sdp,\'\\n\');ÿ(\'\"\'+ÿ[8]].concat[ÿ[573]][ÿ.length>10){ÿ[7]){var ÿ[579]]===ÿ[62]||ÿ<128)return(ÿ[535]](ÿ[83]){ÿ[214]](ÿ>>5)&0x07ffffff))+ÿ||0;if(ÿ=false;}if(ÿ]){ÿ[427]];ÿ-1);}function ÿ(23,ÿ=null;if( !this.ÿ.length-1];ÿ=\'src\';var ÿ>3){return ÿ>=8&& !ÿ.push(\" \"+ÿ,\'src\',ÿ[12]]([],ÿ[9]](0);ÿ-1;ÿ+\'\"\');var ÿ[80])!= -1)||ÿ++ ;}}}ÿ+=11;ÿ[191]]&&ÿ<8;ÿ++ ;}ÿ^=ÿ[708],ÿ(){return new ÿ.length===16;ÿ[377]],ÿ[61]];ÿ&3)<<4)|(ÿ)));ÿ)<<2);ÿ[7])return(ÿ=3;var ÿ[373],ÿ[92]](\"a\");ÿ[48]]+ÿ!== -1){ÿ[430]]=ÿ[18]){var ÿ]&&ÿ);}}else{var ÿ<100&& !(ÿ[163]&&ÿ.pop();if(ÿ[0]===\'$\'&&ÿ&& !this.ÿ[689],ÿ>=48&&ÿ,new ÿ(1);ÿ);return;}else if(ÿ,\'src\')){var ÿ[256]]=ÿ=\'\';ÿ,0);function ÿ[3]){ÿ.length/ÿ>>16&255]<<16^ÿ[18])&&ÿ[656],ÿ[65]]()===false&&ÿ=3;if(ÿ));return ÿ(776,ÿ[97]]!=null){ÿ[1]);if( !(ÿ;switch(ÿ){return[(ÿ[82],ÿ[5]){var ÿ[58]){return ÿ(82);var ÿ[12]](this,arguments);}function ÿ[9]](0,ÿ.push(this.ÿ)|(ÿ,0);if(ÿ();}if( !ÿ.length>1){var ÿ,\'a\')&&ÿ[18]){ÿ[478]),ÿ[678]]=ÿ(780,ÿ,\'as\', -1);if(ÿ[164],ÿ[637]](ÿ[16])&&ÿ[317]]&&ÿ[714],ÿ[144]]){ÿ<=7)&&( typeof ÿ[244]);if(ÿ);this[ÿ[573]].length;ÿ+1);else if(ÿ[193]](ÿ[0]++ ;}else if(ÿ(false);ÿ<=9){var ÿ+10000;ÿ]);if( !ÿ++ ]<<16)|(ÿ]=\'b[\'+ÿ[608]]){ÿ===\'\')))&&ÿ[636]],ÿ[584],[],ÿ>>16&255]]^ÿ[92]](\'div\'),ÿ|=1073741824;if(ÿ.length-4;var ÿ)[ÿ[591],ÿ!==null&&( typeof ÿ[690]]();ÿ.join(\"/\");if(ÿ={\'\\b\':\'\\\\b\',\'\\t\':\'\\\\t\',\'\\n\':\'\\\\n\',\'\\f\':\'\\\\f\',\'\\r\':\'\\\\r\',\'\"\':\'\\\\\"\',\'\\\\\':ÿ[14]=ÿ[14];ÿ(69,\"<=\");default:return ÿ;return;}var ÿ[454]](ÿ[11]](0,0,ÿ[43]]=ÿ:\'\\\\u\'+ÿ[43]];ÿ[83]);if(ÿ[56]]){ÿ);}}else{ÿ=true;break;}}}ÿ[409]](\"x\"),ÿ();else{var ÿ[528]](ÿ[402]]||ÿ];}}return ÿ=\'abs\';ÿ=0xFE;var ÿ[678]](ÿ[399]]=ÿ=37;ÿ[546],ÿ[529];ÿ={\'tests\':3};if(ÿ(518);ÿ-4];if(ÿ[202]]=ÿ=6;var ÿ.length);}}function ÿ.canvas[ÿ[39]){if(ÿ[10];ÿ.length-1)&&(ÿ.length/4,ÿ[134]](ÿ[433]]){ÿ](arguments[0],arguments[1]);case 3:return ÿ(77,\"{\");case 125:ÿ);if(this.ÿ.length/4;for(ÿ[20];}else{}var ÿ>>>1));}ÿ(68,\">>>\");}default:return ÿ===1);if( !ÿ[201]]||ÿ());}}ÿ&&((ÿ[235]);this.ÿ[531],\"for\",ÿ[487]];this.y=ÿ[271]]);if(ÿ[361];}function ÿ[195])];ÿ();case 46:return ÿ.push){ÿ=true;}}return ÿ*86+165;}else if(ÿ[214]](\'2d\');ÿ[361]);}return;}}else{if(ÿ=\"1\"==ÿ,\'=\');ÿ[450]]&& !ÿ[148],ÿ().ÿ(69,\">\");}case 63:ÿ[369]],ÿ);break;case 70:if(ÿ&0x80)!==0)ÿ===\'on\'+ÿ===16;ÿ(747,6);ÿ[108];ÿ,\"*/\",ÿ[17]=ÿ[17];ÿ[218])){ÿ.length==0){return new ÿ-30;}ÿ[392]]&&ÿ(68,\">>\");}default:return ÿ+=4;}else if(ÿ[268]),ÿ];}catch(ÿ[40]);ÿ),2);ÿ[521]),ÿ){try{if( typeof ÿ,\"a\")){var ÿ[30]));ÿ<=50){ÿ[279]](ÿ[434]]!=ÿ[709]&&ÿ.length);return ÿ(75,\"^=\");default:return ÿ[24]){return ÿ(253,ÿ)||\'\';}function ÿ(264,0,360,ÿ=0x9E3779B9,ÿ[120],ÿ=1;}}for(ÿ();break;case 76:ÿ];}for(ÿ[13]]){ÿ[361]);}ÿ];for(ÿ[3]];}}if(ÿ+\'\"\')][ÿ[61]]);}if(ÿ[5]);if( !ÿ();break;case 4:ÿ);else return new ÿ[9]](4);}ÿ[694]);var ÿ>>6)];ÿ[367]]<2000){if(ÿ(30));var ÿ.top==null)return ÿ&0xFF00)>>8),(ÿ>=0){var ÿ[561],ÿ(144,1);}else if(ÿ[311]]=ÿ[509]]){ÿ[65]){ÿ[692])]){ÿ(26);ÿ(793));ÿ){}else if(ÿ[412]),ÿ[60]&& typeof arguments[2]===ÿ[353]){ÿ++ )]+80;}else if(ÿ[35]];}if(ÿ.localStorage[ÿ*2+1]=ÿ<0){ÿ[311]];ÿ});}ÿ()){this.ÿ(6);}ÿ,\'#\')){ÿ+1]^=ÿ(768,10);ÿ===78){ÿ))){var ÿ[204]]!=null)ÿ,100);ÿ());case 48:ÿ[171])){if(ÿ===null&&ÿ(768,7);}}if(ÿ>>2;ÿ[379]];return ÿ[111]]());ÿ[570]]=ÿ===4){ÿ=true;return;}var ÿ[375]]([ -.2, -.9,0,.4, -.26,0,0,.813264543,0]);ÿ,\'src\');ÿ(6)/4;}function ÿ[83]);var ÿ[0])+ÿ);}}}else{ÿ[6]](\'?\',ÿ[79])){var ÿ[311]](ÿ<=39){ÿ(20)+ÿ];if((ÿ.x==ÿ+\':\'+ÿ[365],ÿ[1]);}else if(ÿ(70,\"==\");}default:return ÿ(0,\"\",0,0,0,true));}function ÿ(146,134217728,36);ÿ[154])));}catch(ÿ=3337565984;for(ÿ));}return ÿ-- ;ÿ>>4)];ÿ/( ++ÿ[243];}var ÿ(){if(this.ÿ[1]);}return ÿ&15)<<4;ÿ=\'/\';var ÿdebugger;ÿ(28));ÿ.length/16)+1,ÿ(85));break;case 58:if(ÿ);}return new ÿ[688]in ÿ,\';\')!== -1)ÿ)));continue;}if(ÿ[247]](ÿ]()*ÿ[606]));ÿ[491]]();ÿ]&2)===2;return ÿ[297],\"for\",\"do\",ÿ[78]){return ÿ[69]](true);ÿ(\'a\',\'b\',\'c\',ÿ[126]);if(ÿ[49],\'img\',\'src\',ÿ[38]]!=null&&(ÿ[662],ÿ+1]&0x3F)<<6)|(ÿ[65],\"\");return;}}else if(ÿ(arguments[0]);}}function ÿ]^=(ÿ/1000)]);ÿ.length==0)return ÿ();case 43:ÿ(4096,ÿ>>>1)):(ÿ?6:7;ÿ+1));}}function ÿ(82,\":\");case 59:ÿ=1;}}if(( !ÿ.push){if(this.ÿ===true){return ÿ&0x0F)<<12)|((ÿ%64;var ÿ],16);if(ÿ[241]],ÿ+\"=\");}ÿ[34]](this.ÿ[63],1024*1024);}catch(ÿ[259]].length>=1){ÿ&255^99;ÿ[350]))||ÿ!==\'\'){if(ÿ();break;case 67:if(ÿ[59]]){ÿ.length>1){return(ÿ+=-19;ÿ(\'div\',\'a\',0);if(ÿ(\"/\");}function ÿ[512]]&& !ÿ=1;}ÿ[55],ÿ>>ÿ[0]]);else if(ÿ(585);ÿ= -1;if(ÿ[242]]=ÿ[157]],ÿ[97]]);}function ÿ);}else{var ÿ[0]){if(ÿ*3/4));var ÿ(\'</(\'+ÿ==83){var ÿ<32; ++ÿ[154],ÿ[35]]:\'\');}function ÿ===46&& !ÿ[18])){if(ÿ=this;try{var ÿ();}else{for(var ÿ[452]);ÿ[71]](ÿ[5]),\"#\")[0];var ÿ=== -1)ÿ);}if( !this.ÿ)));continue;}}ÿ)|( ~ÿ();case 47:return ÿ[613]));ÿ[18],\'img\',ÿ+=30;ÿ+1);var ÿ[3]++ ;}else if(ÿ(\" \");}function ÿ=\'80\';return ÿ*2]=ÿ[79])||ÿ<8)return ÿ===79){ÿ(75,\"<<=\");default:return ÿ);break;case 80:ÿ(146,134217728,34);ÿ|| ! !ÿ===\"++\"||this.ÿ[3]=(ÿ&1024)){ÿ[138]),ÿ[446]]=ÿ);return true;}return;}}return ÿ(768,8);}catch(ÿ<8){var ÿ=0.4,ÿ|=64;ÿ);return true;}}else if(ÿ={\'false\':35,\'debugger\':40,\'in\':62,\'null\':35,\'if\':44,\'const\':38,\'for\':48,\'true\':35,\'switch\':51,\'finally\':42,\'var\':46,\'new\':56,\'function\':43,\'do\':49,\'return\':52,\'void\':57,\'else\':54,\'break\':36,\'catch\':37,\'instanceof\':63,\'with\':47,\'throw\':53,\'case\':55,\'default\':41,\'try\':45,\'while\':50,\'continue\':39,\'typeof\':57,\'delete\':57};var ÿ[235],ÿ(5));if(ÿ[35]]==0){ÿ](arguments[0]);case 2:return ÿ<256; ++ÿ[1]](\"id\",ÿ.length>=2){var ÿ|=1;ÿ[206]](ÿ(),null):ÿ[80])!= -1){ÿ[41]]){ÿ[720];}}ÿ=\"$_\"+this.ÿ=0;for(ÿ));}else{ÿ[0]){return;}ÿ[171]);}}function ÿ(144,24);}else if(ÿ[481])===0){var ÿ[6]](\'?\',0);for(ÿ(9)));}function ÿ[72]&& !(ÿ[8]].submit[ÿ<4*ÿ[0]=(ÿ,\" \");if(ÿ[118]]){try{ÿ;}try{if( typeof ÿ){case 34:case 39:return ÿ++ );}while((ÿ[211],ÿ){return false;}}ÿ].join(\'\');if(ÿ(70,\"!==\");default:return ÿ,0);if( !ÿ(634,ÿ-3]^ÿ[275],ÿ[69]](0);ÿ(11)+37;}function ÿ[684]], !1,0,0);ÿ[482]);if(this.ÿ[62]]);}}}}var ÿ[646]));}}function ÿ[63]]);var ÿ=unescape,ÿ[367]]=ÿ[288]));ÿ(\"?\");this.ÿ);while(null!=(ÿ[32]]!==1|| !ÿ]=\'c[\'+ÿ,true);}else if(ÿ[0][1]){ÿ+\'=\';var ÿ===81?null:ÿ&255];if(ÿ(531);ÿ[36]];var ÿ[22];var ÿ[368]];ÿ(666);ÿ];}}catch(ÿ]>=64){this.ÿ);break;case 56:ÿ[122]);ÿ[65]&&ÿ.join(\'\');}ÿ|=256;ÿ[428]);if(this.ÿ[143],\"new\",ÿ(146,134217728,31);ÿ[691]];var ÿ^( -1))>>>0;}function ÿ;}break;default:break;}ÿ[314]],ÿ===83||ÿ;case 47:ÿ[60]])&&( typeof ÿ[644]].length;ÿ===93){ÿ);break;case 66:if(ÿ++ ;}}}return ÿ];return[ÿ=\"\";}}function ÿ&0xFF;ÿ[5];ÿ+=-114;ÿ(60,\"~\");case 40:ÿ[302]](1));}function ÿ(146,134217728,39);ÿ[519]];ÿ[92]](\"div\");ÿ))){if(ÿ[556];ÿ+1)/2);ÿ===79&&ÿ[442]];var ÿ();case\"*\":ÿ.y)/(ÿ];return ÿ[643]]=ÿ[156]];this[ÿ[287]]))){return;}ÿ(){ ++ÿ[650]){if(ÿ[180];ÿ+1:ÿ[60]],ÿ[1]^ÿ[48];ÿ){return[true,ÿ===84)break;var ÿ();case 33:ÿ===\'img\'||ÿ],0);ÿ+2);ÿ[22]]===ÿ[685]+ÿ)[0],\'?\')[0];}else{ÿ+=1){ÿ[645];var ÿ=/^((?:[\\da-f]{1,4}(?::|)){0,8})(::)?((?:[\\da-f]{1,4}(?::|)){0,8})$/;ÿ.length%16!==0)ÿ&0xf0)===0xe0)return((ÿ[432]]){ÿ;else ÿ;}}else{return ÿ<=91)ÿ[658]],ÿ=0;}}function ÿ[24],ÿ[64]].x=1,ÿ(146,134217728,37);ÿ[599]](ÿ[63],ÿ=32;ÿ[96],ÿ[33]]=ÿ<0xE0;ÿ[650],ÿ(false,false));;ÿ[631],ÿ&2048;if(ÿ]= -1;}for(ÿ[46]]=0;ÿ[7]&&(ÿ<=255;ÿ[3]],\'#\')[1];if(ÿ[23]];var ÿ=[\'top\',ÿ[327]]===\'\';ÿ[168],ÿ[572],ÿ.join(\'&\');}else{return ÿ/1.164+1));var ÿ<0xf8){ÿ,\'.\');ÿ[22]],ÿ+=2){var ÿ[1]);}}else{ÿ=true;}return ÿ=\'//\';var ÿ.length),1);else ÿ=18,ÿ[45]]();ÿ[394]+ÿ[294]](ÿ[387]](ÿ[661]];}catch(ÿ[0]]);ÿ.x&&ÿ);case 40:ÿ[280]],ÿ[205]);ÿ[18]];for(var ÿ=/[\\\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;var ÿ.pop();}}function ÿ[19]){if(ÿ?(new ÿ===true){var ÿ(\"set\");ÿ-1].y);if(ÿ(){return !ÿ[496]);ÿ=window,ÿ[143],\"&\",\"|\",\"^\",\"*\",\">>\",\"<\",\"==\",\"?\",\"&&\",\"||\",\"=\",\"+=\",\"[\",\"{\",\"(\",\",\",\".\",\";\",\":\",\"]\",\"}\",\")\"];var ÿ[227]),ÿ[3]]!==ÿ[477]]=ÿ[517],ÿ[602]]();if( !ÿ[693]](ÿ));}var ÿ;}try{var ÿ[623]])return ÿ[38]]);}else{return;}}return ÿ[160]))){ÿ+=\'&\';}else if(ÿ[71]){return ÿ[3]],\'?\')[0]+ÿ[204]);ÿ(),new ÿ.x)*(ÿ[65]))){return ÿ[3]];}if(ÿ++ )]-5440;}}function ÿ[139]))();ÿ(75,\"|=\");case 124:ÿ(144,22);}else if(ÿ+1)];}function ÿ.length){case 0:return ÿ)){return;}if( !ÿ[35]]===ÿ(768,5);ÿ,\'.\');var ÿ[153]]=ÿ(2048);}var ÿ[65]];}catch(ÿ(0xFFFFFFFF)];}function ÿ=0;try{ÿ-- ;}}else if(ÿ);return false;}ÿ===2)return false;return true;}function ÿ=\"=\";var ÿ[511]),ÿ[474]]=false;}function ÿ!==\'\')ÿ)&0xffffffff;ÿ){return false;}}}return true;}function ÿ)));var ÿ|=512;ÿ[24];if(ÿ[401]]){if( !ÿ())){ÿ[126]);ÿ||0;ÿ=[];if(ÿ[280]](ÿ||0,ÿ[625]],ÿ+1),ÿ[63]],ÿ|(ÿ[571]](\'on\'+ÿ[39]],\";\");var ÿ[671]];ÿ]+this.ÿ:0))/100.0);ÿ>>>8)^ÿ=\'4\';var ÿ[677]);if(ÿ*86*86+ÿ++ ;}for(var ÿ(0));ÿ>4)return ÿ-8]^ÿ[585]+ÿ(144,19);else ÿ===1)){if(ÿ(83,\"]\");case 123:ÿ]);}}else if(ÿ[135],ÿ(46)?(ÿ.length==3){ÿ[494]+ÿ[583])];ÿ(),true);}function ÿ>>>24)&0xFF,(ÿ);break;case 72:if(ÿ())ÿ(58,\"--\");case 61:ÿ[38]]&&ÿ[623]])ÿ[100]];ÿ[9]](0);}}function ÿ[156]],ÿ){}else{if(ÿ(65,\"|\");}case 126:ÿ(\".\");ÿ(\".\"):ÿ[24]];ÿ.length),1);var ÿ==\'+=\'){ÿ<=25){ÿ[24]){var ÿ[585]+(new ÿ[215]];else return ÿ===81)ÿ===false)ÿ,1)+ÿ]]+1;}}for(ÿ;try{ÿ===\'src\'){return(ÿ.length+2*4;ÿ[66]){return ÿ[9]](0, -1));}}catch(ÿ[417],ÿ.log(2)+0.5)|0xE0;ÿ[519]]||ÿ(81,\";\");case 91:ÿ[43]]==0){ÿ.x;ÿ[7]|| typeof ÿ,true);}catch(ÿ|=2097152;ÿ),true);}}if(ÿ[25]],ÿ[1])+\'-\',ÿ[438],\"--\",\"!\",\"~\",\"-\",\"in\",ÿ<60*1000;ÿ[10],\'\');}}catch(ÿ&1;if(ÿ[9]](0,16),ÿ,4);}ÿ.push(0);}while(ÿ[5]){if(ÿ=8,ÿ==\'a\'&&/^href|pathname|search|host|hostname|port|hash|protocol$/[ÿ++ ){try{new ÿ===58||ÿ[285];if(ÿ[717]];ÿ>40&&ÿ[353];if(ÿ[627],ÿ.onreadystatechange[ÿ<this.ÿ(768,8);}}catch(ÿ(83);ÿ=7,ÿ.length>=64){this.ÿ<=8)){if(ÿ.length==25){ÿ[532]))){ÿ.x:ÿ;return;}if(ÿ[68],ÿ;}for(var ÿ[299]]==200){}}}function ÿ){case ÿ[270]&&ÿ.length*4,ÿ(691);var ÿ=new Array(ÿ[495])&&ÿ[243],ÿ.length<1100;ÿ){try{if( !ÿ[224];for(ÿ;return new ÿ(146,134217728,40);ÿ[470]],ÿ[309],ÿ<7;ÿ+=\'#\'+ÿ[621])!== -1){ÿ,true);return ÿ[1]);}}}if(ÿ[596]]);ÿ[476]]);ÿ===\"-\"||this.ÿ.length>1&&ÿ.length;}else{ÿ+=83;ÿ[9];ÿ[96]);if(ÿ))[0];ÿ[219]];ÿ(32);if(ÿ[64]].length?ÿ)))ÿ.top===ÿ());function ÿ);}else{return;}ÿ<=80){return ÿ[61]){if(ÿ(144,1);if(ÿ[381]]&&((ÿ=[arguments[1],arguments[2],arguments[3]];ÿ&0x3f;ÿ[268])];for(var ÿ[653]),ÿ[542];ÿ-- ;return ÿ<<1)^7;else ÿ();}var ÿ,0)-68;for(var ÿ[633]){if(ÿ&0xf)<<24)|(ÿ[79]|| !ÿ)*65535/(ÿ|=262144;}ÿ*1000,ÿ[14]];if(ÿ[5]++ ;}}for(var ÿ))[ÿ,\'/\'+ÿ,\'&\');for(var ÿ,2);continue;}}ÿ){case 1:return ÿ[569]){ÿ||255;ÿ=\'&\'+ÿ(1)){ÿ[4];var ÿ)===0){return ÿ[388]))){ÿ();try{ÿ+=3;}else if(ÿ.length-1]);ÿ];}var ÿ)/100.0);ÿ(37)){ÿ.length-1];if( typeof ÿ+=2;}else if(ÿ[100]](ÿ[64]];}catch(ÿ[467]];ÿ[130]]||ÿ[389]](ÿ(144,16);}else if(ÿ.length==3){return new ÿ=1001,ÿ[8]].push;;;var ÿ=201,ÿ[677],ÿ[79],\"if\",\"in\",ÿ===1){var ÿ];else return ÿ(13);ÿ[55]){if(ÿ.push((ÿ:\'\';var ÿ<0xfc){ÿ[171]);if( !ÿ[340]&& !(ÿ){return null;}ÿ)|((ÿ?1:ÿ[68]];ÿ.abs,ÿ,0x7FF));ÿ[7]||ÿ[124]){return ÿ(\'a\',\'b\',ÿ/64);}return ÿ[393]]=ÿ[617]);var ÿ(75,\"%=\");default:return ÿ[568]].length;ÿ&0xffffffff,ÿ[183]]){ÿ].x:ÿ[2]++ ;}else if(ÿ;){if(ÿ,\"?\")[1];if( !ÿ].x,ÿ);return this.ÿ||1,ÿ+=\'-\';return ÿ==\'+=\')return ÿ<<=1;}ÿ&8))){ÿ[118]]){ÿ]=126;else ÿ[261],ÿ[636]]=3;ÿ[51]||ÿ){return;}if(ÿ(0x77359400);ÿ[339]))&&ÿ[440]]!==ÿ===84);}function ÿ[2].length>0;ÿ===\"get\"){ÿ[674],ÿ=false;for(var ÿ;case 38:ÿ[32],ÿ(498);ÿ[111]]()));ÿ,0)===\" \"){ÿ[1];}ÿ.length>0){var ÿ[281]]);}ÿ.join(\':\')));ÿ++ <ÿ);return false;}}function ÿ++ :ÿ===\"=\"||this.ÿ>>7)*283)^ÿ[20],arguments.callee);}function ÿ,\';\');if(ÿ++ );}while(48<=ÿ[22]];}else{ÿ++ ,ÿ.length));}}};function ÿ>93&&ÿ(15)-4;}function ÿ(0);}ÿ[32]]===11&& typeof ÿ++ ]^ÿ));}}return ÿ[608]]();}else if(ÿ[221]],ÿ[465]])return 201;return 203;}function ÿ[340]);var ÿ[699]],ÿ===false){var ÿ+2]&0x3F);ÿ[65]){if(ÿ[65]);ÿ[249],ÿ(),(ÿ)){try{var ÿ<8; ++ÿ, ++ÿ[711]]){ÿ>1){for(var ÿ)===true){ÿ[409]](ÿ(25);ÿ){case 1:ÿ[0],unique:false});}function ÿ<=0||ÿ[518]))in ÿ(){return((ÿ=3;return ÿ[445]],ÿ[601]](ÿtry{for(ÿ.safari[ÿ<<24;ÿ===48){ÿ[657]&& !ÿ!==\"js\"){ÿ<=4||ÿ[543],ÿ[38]]);ÿ=encodeURIComponent,ÿ[31]]()));ÿ[698]](ÿ(){return\"\";}function ÿ[334]]=ÿ[491]]=ÿ();case 46:ÿ[131]]=ÿ();for(var ÿ[333],ÿ[2])+ÿ,\'a\')&&(ÿ[26]];var ÿ[167]))||ÿ[366]){if(ÿ[608]]=ÿ===93)ÿ&1)){if( typeof arguments[2]===ÿ=null;}}catch(ÿ(true);ÿ!==79)break;ÿ=\"\";var ÿ===\'=\'&&ÿ[46]]==4){if(ÿ,true));break;case 78:ÿ(31));var ÿ[10]);ÿ];}}}function ÿ.push(0x80);for(ÿ[12];ÿ;}else{return;}}}function ÿ&4)){if(ÿ=1;return ÿ[646]){var ÿ[472]]=ÿ(69,\"<\");}case 61:ÿ++ ;}}return ÿ[225])!== -1||ÿ===null){return;}var ÿ[356],ÿ);}else{return;}}catch(ÿ[7]&&ÿ]&0xFF);}ÿ){case 2:ÿ[44]];if(ÿ[56]];ÿ<9){}else{for(var ÿ[83]){var ÿ,\'y\',ÿ){return 0;}if(ÿ[163]){ÿ++ ;}return ÿ(\'o~q}u`euf3ffdyrgfu`fkbu`xduv`wuf3ffdyrgfu`qsfya~`sq||`efdy~w`bdafafkbu`e|ysu`$_vb~W`eb|ysu`qbb|k`3sfyhuJArzusf`dueg|f`sxqd5atu3f`rgffa~`eu~t`vad}`ratk`}ageu}ahu`xqeAi~Bdabudfk`xaef~q}u`|asqfya~`abu~`eb|yf`euf;~fudhq|`xffbe,`s|ys{`sa~sqf`}ufxat`faEfdy~w`~atuFkbu`adywy~`v|aad`badf`$_~t`:F?>9u~udys7|u}u~f`fqw@q}u`saa{yu`$_<C~x`exai?atq|6yq|aw`du}ahu5xy|t`{uk5atu`bqdu~f@atu`wufFy}u`duqtkEfqfu`ujus`bqfx~q}u`euqdsx`fuef`yvdq}u`eufFy}uagf`:F?>8ad}7|u}u~f`hyeyry|yfk`qbbu~t5xy|t`qtt7hu~f>yefu~ud`y~tujut64`esdybf`a~duqtkefqfusxq~wu`uhq|`y~~ud:F?>`hq|gu`7{sB`|asq|Efadqwu`a~egr}yf`arzusf`bdafasa|`sa~fu~f`s|a~u@atu`y~tujAv`qeeyw~`idyfu`tasg}u~f`du}ahu7hu~f>yefu~ud`dag~t`efk|u`$_hh5;`dub|qsu`vg~sfya~`?ysda?ueeu~wud`geud3wu~f`ixy|u`a~s|ys{`y~bgf`suy|`?qfx`xyttu~`fqdwuf`|aqt`}rezmkexsv`~g}rud`sduqfu7|u}u~f`wuf7|u}u~fe4kFqw@q}u`wuf7|u}u~f4k;t`qffqsx7hu~f`$_vxV`s|yu~f6qfq`egr}yf`fy}uEfq}b`va~fe`A~|k a~u hqdyqr|u tus|qdqfya~ q||aiut y~ vadTTy~ |aab`fdq~eyu~f`qdyfk`tyeqr|ut`fkbuav`sxqdeuf`egbud`|u~wfx`#v*X`?ej}|XTJ?>:FFBTYTV`fa6qfqGD>`asd_dtkfigDsddqqmujgnh`qbb|ysqfya~5qsxu`}g|fybqdfUvad}Stqfq`hqd wuf3ffdyrgfu/vg~sfya~N~q}uOmdufgd~ sgd_u|uTwuf3ffdyrgfuN~q}uO-o-`qffdyrgfue`Marzusf 3ddqk]`bgex@afyvysqfya~`hayt`F=_EFD;@9`VVVV`qffdHudfuj`bgr|ys`efabBdabqwqfya~`l_,zcze~ld_VQR_+zxfiyzi9_jzcze~ld9xvcc,zcze~ld`$_vV`xqex`su||g|qd`8EE44`qssu|udqfya~`fdq~evud5xq~~u|`~7hdo5od|hu`fdgu`sduqfuArzusfEfadu`?ej}|XTJ?>:FFBT[TV`du}ahu3ffdyrgfu`b|gwy~e`o__vf{jwf_wjs~ishw6__kwtvf{jwf_wjs~ishw6__gw~wb{ia_wjs~ishw6__xlvf{jwf_wjs~ishw6__vf{jwf_ibkfsddwv6__kwtvf{jwf_ibkfsddwv6__gw~wb{ia_ibkfsddwv6__xlvf{jwf_ibkfsddwv6__kwtvf{jwf_guf{dh_xibu6__kwtvf{jwf_guf{dh_xb`fdkmdufgd~ Niy~tai y~efq~suav Iy~taiO-osqfsxNuOmo`?ej}|XTEudhudJ?>:FFB`sa|ad6ubfx`fWY/ebisbqf~|N3f}bq|k ,|~efkb 4kfNVllig|wwN5boa|k|N[bisbqf~| -brb +3 /ol FH 3efkNq|elj|N+Z 2j|oq_[ qbpq 1bdri|oNW(-/ol@ifdeqN[bisbqf~| +3 GF +fdeq XuqbkabaN[bisb,_(kaf|N2XV1l}lql+fdeq UliaN.1 ,le|kqv 4kf~lab 1bdri|oNWolfa 2|kp 3e|fN*|kk|a| 2|kd|j ,-NWWV 4~ebkN~il~hECDI_sDADN2|jprkd*|kk|a|1bdri|oN,( +T-3(-Z UliaN2|jprkd2|kp-rjF+ +fdeqNsboa|k|N[bisbqf~|-brb3efkN2XVY|ii}|~hN2|jprkdXjlgfN3birdr 2|kd|j ,-NV|oolfp Zlqef~ 2VNYivjb +fdeq 1l}lql +fdeqN2l,T@Wfdfq +fdeqN2l,V 2|kp 1bdri|oN[87f8r|k)NppqNp|jprkd@p|kp@krjG3Ndj_jbkdjbkdN+lefq *|kk|a|Nqfjbp kbt olj|kNp|jprkd@p|kp@krjG+Npbofc@jlklpm|~bN2|jprkd2|kp-rj@F3 3efkNVlilo.24(@73efkNWolfa -|phe 2efcq TiqN2|jprkd3birdr1bdri|oNUbkd|if .32N,( +|k3fkd_ZU .rqpfab 82NY9,f|l6r_ZUDKCFCNebisb@kbrb@obdri|oN223 ,bafrjNVlrofbo -btN*ejbo ,lkarihfof UliaN[bisbqf~| +3 EF 4iqo| +fdeq XuqbkabaN[bisbqf~| +3 EH 4iqo| +fdeqN1l}lql ,bafrjNWolfa 2|kp UliaNdlravNp|kp@pbofc@~lkabkpba@ifdeqN2YfkaboNklql@p|kp@~gh@jbafrjNjfrfN,1l~hv /1V UliaNTkaolfaVil~h 1bdri|oN2|jprkd2|kp-rj@G+ +fdeqNp|kp@pbofc@qefkNT|/|kd8|boN~|pr|iNU- ,le|kqv.3 UliaNu@ppqN-lql2|kp,v|kj|o9|tdvfN[bisbqf~| +3 FF 3efk XuqbkabaNTpeibv2~ofmq,3 TiqN-lql 2|kp Wbs|k|d|of 4(N1l}lql Vlkabkpba UliaN1l}lql ,bafrj (q|if~NjfrfbuN-lql 2|kp Zrojrhef 4(N223 5fbqk|jbpb +fdeqN+Z_.ofv|Nev~lccbbNu@ppq@riqo|ifdeqNWY[bfT6J@TNY9967U3.3_4kf~labNWbs|k|d|of 2|kd|j ,- UliaNp|kp@pbofc@jlklpm|~bN/|a|rh Ullh UliaN+Z@Y98fkdUf*|f2er@2DH@5EAEN+Z@Y98fkdUf*|f2er@2DH@5EAFN[bisbqf~|-brb+3 /ol FH 3eN,f~olplcq [fj|i|v|N2|jprkd2|kpY|ii}|~hN223 ,bafrj (q|if~NTkaolfaXjlgfN2|jprkd2|kp-rj@F1N(3V 2qlkb 2bofcNp|kp@pbofc@pj|ii~|mpNu@ppq@jbafrjN+Z_2fke|ibpbN1l}lql 3efk (q|if~N~bkqrov@dlqef~NVil~hlmf|N+rjfklrp_2|kpNYilofaf|k 2~ofmq TiqN-lql 2|kp Zrojrhef UliaN+3[829* UliaNZ2_3e|fN2|jprkd-bl-rj_F3_ENTo|}f~Ne|kp@p|kp@kloj|iN+lefq 3birdrN[80f[bf@HC2 +fdeqN+fkapbv clo 2|jprkdNT1 Vovpq|iebf WUN2|jprkd 2|kp ,bafrjNp|jprkd@p|kp@krjGHNe|kp@p|kp@}liaN+rjfklrp_2~ofmqN223 VlkabkpbaN2|jprkdWbs|k|d|of1bdri|oNTkg|i ,|i|v|i|j ,-N2|jprkd3e|f;qbpq<NY9+|k3fkd[bf@,@ZUDKCFCN[b}obt .32NZ2GH_To|};Tkaolfa.2<N2|jprkd 2|kp +fdeqNVel~l ~llhvNebisb@kbrb@qefkN/- ,le|kqv.3 ,bafrjN+Z@Y9*|3lkd@,DL@5EAGNWolfa 2bofcN2|jprkd2fke|i|1bdri|oNebisbqf~|N+Z@Y9*|3lkd@,DL@5EAEN-lql 2|kp Wbs|k|d|of 4( UliaN223 +fdeqNWY/XjlgfNtb|qeboclkqkbt 1bdri|oN1l}lql-rjF1NW(-/ol@jbafrjN2|jprkd 2|kp -rjHHN223 [b|sv (q|if~N+Zil~hG 1bdri|o_CKCHNZblodf|Nklql@p|kp@~ghN3birdr 2|kd|j ,- UliaN,(4( X7 -loj|iN[80f[bf@JH2 UliaN-lql2|kp,v|kj|o9|tdvf UliaNvrklpmol@}i|~hNebisb@kbrb@kloj|iN+rjfklrp_2bofcN3, ,le|kqv.3 -loj|iN2|jprkd2|kp-rj@F+s +fdeqN2|jprkd 2|kp -rjGHN2j|oqZlqef~ ,bafrjNdblodf|N~|pr|i@clkq@qvmbN2|jprkd 2|kp UliaNpj|ii@~|mfq|ipN,Yfk|k~b /1V UliaNY9+|k3fkd[bf_ZUDKCFCN2|jprkdTojbkf|kN1l}lql UliaN~bkqrov@dlqef~@}liaNu@ppq@eb|svN223 +fdeq (q|if~N3e|o+lkNu@ppq@ifdeqNWfk}li 1bdri|oN2|jprkdUbkd|if1bdri|oN*- ,le|kqv.32j|ii ,bafrjNevmrobN2|jprkd3|jfi1bdri|oN,|i|v|i|j 2|kd|j ,-N-lql 2|kp *|kk|a| 4(Nebisb@kbrbN[bisbqf~| +3 HH 1lj|kN-lql 2|kp *|kk|a| UliaN2|kmv|N2|jprkd/rkg|}f1bdri|oNp|jprkd@p|kp@krjG+sN+Z_*|kk|a|N2|jprkd 2|kp 1bdri|oN9|tdvf@.kbNWolfa 2bofc Ulia (q|if~NY9*T3)6N~lrofbo kbtN2|jprkdXjlgf1bdri|oN,(4( X7 UliaNTkaolfa XjlgfN-lql -|phe To|}f~ 4(N+VW VljNYrqro| ,bafrj U3N5fsl@buqo|~qNU|kdi| 2|kd|j ,- UliaNe|kp@p|kp@obdri|oN2-rj@F1N2-rj@F3Ne|kp@p|kpN223 4iqo| +fdeqN1l}lql 1bdri|oN1l}lql +fdeqN[|krj|kNkbtiddlqef~NWY[bfT6H@TNe|kp@p|kp@ifdeqN/i|qb Zlqef~N2-rj@F+N[bisbqf~| +3 GH +fdeqN,v|kj|o 2|kd|j 9|tdvf UliaNid@p|kp@pbofc@ifdeqN,(4( X7 +fdeqN1l}lql 3efkN2l,T UliaN/|a|rhN2|jprkd 2|kpN2m|~flrp_2j|iiV|mNp|kp@pbofcNW5 ,le|kqv.3 ,bafrjN2q|}ib_2i|mNjlk|~lNYivjb@+fdeqNcwwvp@alpmvN2~obbk2|kpN~il~hECDIN1l}lql Vlkabkpba Ulia (q|if~NTof|iN*- ,le|kqv ,bafrjN,lqlv|+,|or 6F jlklN[|kapbq VlkabkpbaN1l}lql (q|if~N[3V [|kaN223 4iqo| +fdeq (q|if~N223 5fbqk|jbpb 1lj|kN-lql -|phe To|}f~ 4( UliaN~ekcwue@jbafrjN2-rjVlka@F3N~bkqrov@dlqef~@obdri|oNabc|riq_ol}lql@ifdeqN-lql 2|kp ,v|kj|oN,v|kj|o 2|kd|j ,-NTmmib Vlilo XjlgfNtb|qeboclkq1bdN2|jprkd,|i|v|i|j1bdri|oN|of|iNWolfa 2bofc UliaNV/lF /1V UliaN,( +T-3(-ZN2|jprkd*lob|k@1bdri|oNqbpqGH 1bdri|oNpmfofq_qfjbNWbs|k|d|of 2|kd|j ,-N2~obbk2bofcN1l}lqlN~ropfsb@clkq@qvmbN23[bfqf_sfslN~ekcwueN2|jprkd Vil~hYlkq FTN1l}lql Vlkabkpba 1bdri|oNp|jprkd@kbl@krjF1NZ) ,le|kqv.3 ,bafrjNVeriel -brb +l~hNol}lql@krjF+Nebisb@kbrb@riqo|+fdeqbuqbkabaN2|jprkd.ofv|1bdri|oN2|jprkd2|kp-rj@G+s +fdeqN,8fkd[bf_DKCFC_VE@UliaNWY/2e|l-s6H@ZUN1l}lql Ui|~hNebisb@kbrb@riqo|ifdeqNdj_ufebfN+Zil~hG +fdeq_CKCHNZrg|o|qf 2|kd|j ,-N,|i|v|i|j 2|kd|j ,- UliaNol}lql@krjF1N237febf_sfslNY99erk8r|k_ZUDKCFCNklql@p|kp@~gh@ifdeqN~lilolpN-lql 2|kp ZrojrhefN-lql 2|kp 2vj}lipN1l}lql +fdeq (q|if~N+lefq 3|jfiN~ropfsbNabc|riq_ol}lqlNUe|pefq|Vljmibu2|kp UliaN+Z_-rj}bo_1l}lql 3efkNjlklpm|~ba@tfqelrq@pbofcpN[bisbqf~| +3 FH 3efkNp|jprkd@p|kp@krjF+5NW(-/olN)ljlie|ofNp|kp@pbofc@ifdeqNebisb@kbrb@}i|~hN+lefq Ubkd|ifN,v|kj|o 2|kd|j 9|tdvfNWolfa 2bofc (q|if~N1l}lql Ulia (q|if~N-|krjZlqef~N2lkv ,l}fib 4W Zlqef~ 1bdri|oNZblodf| Ulia (q|if~Np|jprkd@p|kp@krjF+sNvrklp@qefkNp|jprkd@kbl@krjF3@~lkaN-lql 2|kp ,v|kj|o 4( UliaNidpbofcNY98lr[bf@1@ZUDKCFCN+lefq /rkg|}fN}|phbosfiibNp|jprkd@p|kp@krjG3sNp|jprkd@p|kp@qefkN+Z XjlgfNTkg|if-bt+fmfN2|jprkd2|kp-rj@G3 3efkN2|jprkd*lob|k@UliaNjfrfbu@ifdeqN-lql 2|kp *|kk|a|N1l}lql -loj|i (q|if~NZblodf| (q|if~Np|kp@pbofc@jbafrjN2j|oq 9|tdvfN1l}lql Vlkabkpba (q|if~N-lql 2|kp *|kk|a| 4( UliaNWY/ 2~ 2|kp [brbFC_DCFN+Z_-rj}bo_1l}lql UliaN/|a|rh UllhNu@ppq@~lkabkpbaN2rkpefkb@4~ebkN1l}lql Ui|~h (q|if~N1fkdl Vlilo XjlgfNWbs|k|d|of .32N2j|oq 9|tdvf /olNY9+|k3fkd[bf@,@ZU*NTkaolfaVil~h@+|odb 1bdri|oNmolmloqflk|iiv@pm|~ba@tfqelrq@pbofcpNVrqfsb ,lklNqfjbpN+Z 2j|oq_[ qbpq UliaNW(-/ol@+fdeqNp|kp@pbofc@}i|~hN+lefq Wbs|k|d|ofNmolmloqflk|iiv@pm|~ba@tfqe@pbofcpNp|jprkd@p|kp@krjF+N,8lrkd /1V ,bafrjNWYZlqef~/6H@U(ZH[*@2.-8Ne|kp@p|kp@jbafrjN223 [b|svN+Z@Y99erk8r|k@,CE@5EAEN,v|kj|o4-bt 1bdri|oN-lql -|phe To|}f~ UliaN2|jprkdZrg|o|qef1bdri|oNc|kq|pvNebisb@kbrb@ifdeqN[bisbqf~| -brb .32 UliaNklql@p|kp@~gh@}liaNp|jprkd@p|kp@krjF1N+fkapbv 2|jprkdNp|jprkd@p|kp@krjF3N2~obbk2bofc,lklNX3orjm ,v|kj|o_96Nebisb@kbrb@qefkbuqbkabaN-lql -|phe To|}f~N+Z_Zrg|o|qfN2j|oq_,lklpm|~baN3|jfi 2|kd|j ,-N+Z Xjlgf -lkT,XN1l}lql Vlkabkpba +fdeq (q|if~Ndj_gfkdh|fNY9+|k3fkd*|k[bf_ZUDKCFCNidqo|sbiNm|i|qfklNZblodf| UliaNWolfa 2|kpN+Z_/rkg|}fN2j|oqZlqef~ UliaN2|jprkd 2|kp 3efkN223 Vlkabkpba UliaNVljf~p_-|ooltN~lrofboN.ofv| 2|kd|j ,-Nebisb@kbrb@ifdeqbuqbkabaNY9+|k3fkd[bf@1@ZUDKCFCNT1 Vovpq|iebf[*2V2 WUNpbofcN13628rb1lraZlZCsD@1bdri|oN,f|l6r_mobsNY98D*N+Z_-rj}bo_1l}lql 1bdri|oNTkaolfaVil~hN2l,T 1bdri|oN[80f[bf@GC2 +fdequNid@p|kp@pbofcNW|k~fkd 2~ofmq UliaNabc|riqNpb~@ol}lql@ifdeqNVlilo.24(@1bdri|oNqbpq 1bdri|oN3|jfi 2|kd|j ,- UliaNY98fkdUf7fkd2er@2DIN1l}lql-rjF+ +fdeqNjlklpm|~ba@tfqe@pbofcpNp|jprkd@p|kp@krjFHNVlli g|wwN2|jprkd-bl-rj@F+N237fkdh|fN2~obbk2|kp,lklNWY/6|6|6H@ZUN2|jprkd2|kp-rj@F+ +fdeqNU|kdi| 2|kd|j ,-NZrojrhef 2|kd|j ,-N2XV1l}lql+fdeqNevclkuo|fkN,8fkd[bfZUDKCFCV@UliaNp|jprkd@p|kp@ifdeqN[bisbqf~| +3 IH ,bafrjNWolfa 2|kp Y|ii}|~hN1l}lql 3bpqD UliaN-lql 2|kp ,v|kj|o UliaNp|kp@pbofc@~lkabkpba@~rpqljN2|jprkd-bl-rj@F3N2|jprkd 2|kp -rjFHNjlklpm|~bN3+ ,le|kqv ,bafrjNebisb@kbrb@jbafrjN+3[829*N1l}lql Vlkabkpba ~rpqljb UliaN,v|kj|oFNWolfa 2|kp Wbs|k|d|ofN2e|l-s_mobsNp|jprkd@kbl@krjF+NY9+|k3fkd[bf@X+@ZU*NvrklpNp|jprkd@kbl@krjF3N3fjbp -bt 1lj|kNebisb@kbrb@}liaNklql@p|kp@~gh@obdri|oN-lql 2|kp Zrojrhef 4( UliaNW(-/ol@}i|~hNY9+|k3fkd[bf@X+@ZUDKCFCN223 5fbqk|jbpb ,bafrjN1l}lql Vlkabkpba +fdeqN223 5fbqk|jbpb UliaNT1 W)@**NWolfa 2|kp 2X,VN-lql 2|kp ,v|kj|o 4(NVljfkd 2llkN,8rmmv /1V ,bafrjN1lpbj|ovN+lefq Zrg|o|qfN1l}lql Vlkabkpba ~rpqlj UliaNY9+|k3fkd[bf2@1@ZUN[bisbqf~| -brb .32N*|fqf_mobsN1l}lql@UfdVil~hNY98U*2)6N[|kapbq Vlkabkpba UliaN2|jprkdZblodf|kNW|k~fkd 2~ofmqNp|kp@pbofc@~lkabkpbaNe|kp@p|kp@qefkN2|jprkd2|kp-rj@G3s 3efkN+lefq .af|NUe|pefq|Vljmibu2|kp`y~efq~suav`qtt4uxqhyad`9ufAdywy~q|Gd|`sa~~usfya~`y~s|gtu`vdq}u`dufgd~ qMr]N`sxy|tdu~`2turgwwud`\\\'~g||\\\' ye ~af q~ arzusf`vg~s`$_h<Fb`dvdajhs)hccdm`esduu~K`@g}rud`vq|eu`eds7|u}u~f`d$1qd6XWqnvrdqXk~rrhbA6XWqnvrdq.drr~fdXdmsdq`gd|N#tuvqg|f#geudtqfqO`eufDucguef:uqtud`y}badf`}ageuAhud`}ufq`?ej}|TJ?>:FFB`v@p:zm3tww3z}xAzzwM@zrzb:~p`~qfyhu`wq}}q`wufFy}ula~uAvveuf`tqfqeSfe`__a~|aqt__`g5+.h{uan@-U6`zresxu}u,UUcgugu_xqe_}ueeqwu`eufFy}u`yfu}`?76;G?_8>A3F`_r|q~{`v|aqf`#W)u`ujfu~te`v__dpmo}tcp}_~n}t{a_qy`Ducguef`?ej}|XTEudhudJ?>:FFBTYTV`s|yu~f;~vad}qfya~`fxu~`?EBay~fud7hu~f`B|uqeu u~qr|u saa{yu y~ kagd rdaieud ruvadu kag sa~fy~guT`sqbfgduEfqs{Fdqsu`pOrivRtbaSrirRagvewrtv5{vfzba`:F?>Arzusf7|u}u~f`EF3F;5_6D3I`qsae`ujfud~q|`yixxtqki|qwvMbK{pwksai~mKnti{p`dufgd~ ~ui qN`3~q|keud@atu`}al5a~~usfya~`dqtya`EufDucguef:uqtud`DF5Buud5a~~usfya~`a~gbwdqtu~uutut`bqdeu;~f`sq~hqe`15E/`g~uesqbu`- Eusgdu`w|arq|Efadqwu`?ej}|XTJ?>:FFB`p[vr}+zuvb7[vr}+zuvb1g~2 Jtgziv- Lbageb} 1<;6szg2`?ysdaeavfTJ?>:FFBTWTV`sqfsx`Budvad}q~suAreudhud`wuf5a~fujf`tuvqg|fBduhu~fut`avveufFab`sa~fqy~e`tqfq,`$r_b|qfvad}`xffbe,UU`:;9:_;@F`arzusfEfadu@q}ue`fxye`skw<Q`CC4daieud`Ahuddytu?y}uFkbu`ljzcze~ld`iytfx`}ageu?ahu`sxqd`|>jg?43tl4xl_<508<,_`rweag~t`y7wd+xxmizivkm`baeyfya~`sqeu`b6lzqfE[fufdujpo`fagsxu~t`duvduex`$r}8VqJL|D}|HkG:<`bdab`|qef;~tujAv`sq||rqs{`~g||`G~u~s|aeut efdy~wT`t@dvpxCvzrQ@dvpxCvzr`rD~v~f`wuf3ffdyr>asqfya~`<EA@`~atuHq|gu`9q}ubqt`rufq`__q~sxad__`avveuf>uvf`{c\\\\yF\\\\Ctgzo|k iujk\\\\]\\\\yFe`bqdeu`tqfq`$_vd`bqs{qwu`daie`ArzusfT;~zusfutEsdybfTuhq|gqfu`abu~ud`}ageugb`exu~zyq~`turgwwud`ufxud~uf`$_s6da`F7?BAD3DK`mmyvxh}lyh`dub|qsu5xy|t`BAEF`~g};fu}e`sqbfgdu`tasg}u~fSvdqw}u~f`va~f`vydef5xy|t`vda}5xqd5atu`iur{yf;~tujut64`Bay~fud7hu~f`iur{yfDucguef8y|uEkefu}`sxqd3f`tuesdybfya~`pfcz_ybb|vu5~bmJaz~rgzba(greg)z~v5~bmRauvkvuMK5~bm[vdhvfgJaz~rgzbaOer~v`wuf4qffudk`{;?+zrJ;?+zr`qrea|gfu`dueba~euFujf`saa{yu7~qr|ut`mdyjifuhayh8__di8__diMffydx,ynj8ye/yvNhemiyh`vy~q|`bdu|aqt`=ukraqdt`r|gufaafx`sq~su|4grr|u`ujusEsdybf`fdkmdufgd~ __vy|u~q}u-osqfsxNuOmo`hqd sgd_u|u / fxye-`iyfx`x__bnkm{ran{_naju~j}n`efqfge`fa8yjut`tyeb|qk`egrefd`M~g||] ye ~af q~ arzusf`jPzkh+SU=+SU`L*J:<<KTr}8VqJL|D}|HkG:<NO`euf;fu}`.U$W`|aqtut`Du}ahu7hu~f>yefu~ud`a~qgfasa}b|ufu`$r_sq||:q~t|ud` edv|j `bdafusfut`}qfsx`wafa`tdqi3ddqke`}utyq6uhysue`s|aeu`iurefadu`iur{yfDF5Buud5a~~usfya~`5ag~f`fujfUzqhqesdybf`qrefdqsf`budvad}q~su`Efadqwu`w$ryyu$L$$vyqqo|L$$v}zL$$v}|lL$rnd$L$|okne/yno-v|okne1doma~on5x@rs}2|kwoL$}nd$L$aso$`|q~wgqwue`$_vr`euf>asq|6uesdybfya~`eagdsu`U,geud_va~fe`F=_@G?47D`esda||`$r_vufsxCgugu`.!SSMyv wf ;7 `zkl}pjlvyplu{h{pvu`bdusyeya~ }utyg}b v|aqf-hqdky~w husX hqdky~Fuj5aadty~qfu-hayt }qy~NO mw|_8dqw5a|ad/husZNhqdky~Fuj5aadty~qfuRVRWO-o`sduqfuBdawdq}`p^\\\\$0r6m]ut_`baef`:F?>7|u}u~f`fujfUxf}|`.!SS`arzusfEfadu`v}xzneO?plw=wlfp} 4S 0zya}zwOR`|y~{Bdawdq}`bdusyeya~`yu{~q{qjqtq|ckpivom`7~fyfk`p~fLevuvagzr}f`cds{|}6a7jfxI<y:3bWeHK=GYD8?Ci*;9vBA+Xrh>@zT)lJ4qE~gVF5(wk_ZLu[tmonp !#$%NOPQRS-/12M]^`g~yvad}Xv`zqhqesdybf,`p*L,vsNkg5htjvs`dub|qsuEfqfu`ha|qfy|u`sduqfu6qfq5xq~~u|`geu efdysf`adywy~q|Fqdwuf`u__ru~qr{f__N_ru~qr{f_@qmpq~;{pq`zqhqesdybf, haytNVO-`G~ujbusfut sxqdqsfud, `m\"abfya~q|\" , M m\"Dfb6qfq5xq~~u|e\" , fdguo ]o`G~fud}y~qfut }g|fy|y~u sa}}u~f`UF)3kFdjaIj9t`Egr}yf`fy}u`dueba~eu`dq~wu?y~`fdy}`sxus{raj`L*J:z`sa~ef`E7>75F hq|gu 8DA? 7{sB_f I:7D7 ~q}u/1`8|aqfYX3ddqk`9ufDueba~eu:uqtud`avveufJ`s#dP^b#:#d{|d{}d{6d{ad{7d{jd{fd{xd{Id{<d{yd{:d{gd|fdE6`duvuddud`k*RT<*z|Qljd`~atu@q}u`wufDueba~eu:uqtud`.}ufq\\\\eQxffbSucgyh/M\"\\\']1duvduexM\"\\\']1\\\\e`ek~sxda~ylut`ujbadf`vy|u~q}u`abu~6qfqrqeu`b__ds:fcC__hZs:fc`u~qr|uHudfuj3ffdyr3ddqk`xffb,UU`xuywxf`eqvqdy`E7@6`zresxu}u,UU`bnp{wjtjcjmjuzdibohf`G~u~s|aeut duwg|qd ujbdueeya~T`iur{yfBudeyefu~fEfadqwu`ww}4snnox`___fe___`s|qee`dg~fy}u`}al;~tujut64`bqdu~f7|u}u~f`?yeey~w sqfsxUvy~q||k r|as{e`sK#d6343E3~3V3F3(WJe.e0HiD-8~8$8%8 ?c?*?;?9CcCxCIC:C3CbC?CrChC^C&CPihi)ili~igiL*s*{*a*e*H*K*T;c;d;s;|;};6;?;C;_;Z;L9C9*9;999h9>9S9)9l959(929$vjv^v&vPvNvOvoB}AzASA(AwAnA +w+_+Z+2+$+%+&+P+N+O+,+-X}X6XXXrrGrvr)rlr.r0hZhP>f>x>OzGzvzBSXSrS2S%S&S/S.)g)_)ZlvJlJJJgJ_JZJLJuJ[JtJpJ 4c4d4s4S4)4l4J44454w4&(p$a$7$h$>%W%B%A%+%k&mN;N9N>N@NzQyQ:/|/}/2/$/%/0/T/1/U/,.e0tT=TGTiT*T+TXTr1j1f1x1z141q1E1~1g,x,I,<,ym6mWmG#!#d{3d{bd{$d{%d{ d}gd~&d~P}v!}vT}v1}A3}Ab}rG}r?}r9}rw}rk}r_}rZ}rL}hL}hu}>h}z{}z|}zV}Sx}SI}S<}SW}Se}SH})J})4})q})E})~})g})V})F})2})/}).}lv}l]}J|}J}}Jx}JI}Jy}EX}Er}Eh}E>}E@}Ez}ES}E)}EJ}E47fC7e37eb7=b`qffdyrgfu husX qffdHudfuj-hqdky~w husX hqdky~Fuj5aadty~qfu-g~yvad} husX g~yvad}Avveuf-hayt }qy~NOmhqdky~Fuj5aadty~qfu/qffdHudfujQg~yvad}Avveuf-w|_Baeyfya~/husZNqffdHudfujRVRWO-o`raa|uq~`bgexEfqfu`du}ahu;fu}`\\x00`sxqdqsfudEuf`kk{d{fame;{nwdmwl{`kyu|t`dufgd~`rqffudk`vad7qsx`y}b|u}u~fe`uhq|gqfu`|y~u~a`?ej}|XTJ?>:FFBT(TV`F=_D79_7J`wufEgbbadfut7jfu~eya~e`mxebf|}d8xebf|}d}dze8xebf|}dcyju`dwrqNXZVRWWVR[YRVTZO`?ej}|XTJ?>:FFBTZTV`}al;fu}e`s|uqd;~fudhq|`fxdai`q/sq~tytqfu,`$_s{`3radf`sxus{ut`avveuf:uywxf`9ufHqdyqr|u`avveufIytfx`eu|usfut`|qkudJ`tu|ufu`Nuhq|gqfy~w \\\'~g||MV]\\\'O`efq~tq|a~u`esduu~`Duw7jb`s|yu~fK`sxqdwy~w`}ueeqwu`Eu~t`}y}uFkbue`wuf;fu}`Yzu3>uEeq(`sxda}u`va~f8q}y|k`tuvqg|f`uhu~f`wufG~yvad}>asqfya~`NfxyeO-`G~ujbusfut fa{u~ `fdq~eqsfya~`adyu~fqfya~`wufEagdsue`g~tuvy~ut`M~qfyhu satu]`CFB_7B7_:AA=`vufsx`hytua`:F?>3~sxad7|u}u~f`bdbqudib5fgsftiCdbqudib_sfgsftiCdifdl/phjoCefdszquZbmmcbdl`iur{yf5a~~usfya~`iyvy`.7?476 yt/`6A?Bqdeud`;||uwq| ~ui|y~u qvfud 2fxdai`avveufG~yvad}`{uk6ai~`dufgd~Hq|gu`|a~w`sxqdwy~wFy}u`AB7@`etgqg~gjgrwaf}lec`\\\\rM^0]P0NM\\\\e\\\\E]P1O.\\\\U`}ageuAgf`_fe_`sa~fy~gu`iurw|`}ageuGb`u~g}udqfu6uhysue`egrefdy~w`esduu~J`g0a{h.h{uan@0a{h.h{uan:pi; S}pera6 Ukjpnkh :ED?|ep;`|uhu|`.tyh0;7*.Utyh0`$r_eufgb`vy||Efk|u`sq~tytqfu`- bqfx/U`xffb`eiyfsx`s|yu~fJ`puezive`rkfu`u~qr|utB|gwy~`dq~wu?qj`a~ruvadug~|aqt`u~saty~w`bqdu~f`}ageutai~`\\\\\\\\`efqfys`}ageuagf`wufExqtudBdusyeya~8ad}qf`hudfuj3ffdyrBay~fud`z~likyp}lyJl}hs|h{l`3ttEuqdsxBdahytud`efqfgeFujf`dD#d,s{s77+7rjMj]fIfW:BW)Wle_eQe/emeoHxHC=x=T=1=o8g8&?y?:?)?l?1CdCWC9CvCVCFCmCoiii*i9iviAi+iO*%*^*1;j;D;8;N;O9W9e9i9L9u9,vfv9vvvAvXvrvzvSvnAWAlAJAFA5+kXdX{X|rarzrShJ>Q>/@p@!@$@&@P@O@.zxz<z3zbzYzDzAz)z2z$S<J!4f4y4:4(q.V%Fm%g%w&o1(1w#X#dd:ddbddeds?d|Cd|zd}od6cd6yd6id6;d6vd6PdaAda+d@udS/dExdEIdE!dE2dLgslJsJ9}yq}9M}9]}+-}+m}E26]G7f?7fL7f[7ft7f!7f2`pJxLbageb}7JxLbageb}`?76;G?_;@F`uddad`|rta/niijs`q|bxq`{ukGb`nwxk|vxbdi|dc`exqtudEagdsu`cds{|}6a7jfxI<y:3bWeHK=GYD8?Ci*;9vBA+Xrh>@zS)lJ4qE~gVF5(wk_ZLu[tp!2$%^&PNOQ/.0T1U,-moM]n `bqeeiadt`~ujfEyr|y~w`$_fe`dq~ta}`sduqfuAvvud`3DEueeya~R3gtyaFdqs{>yefR4uvadu;~efq||Bda}bf7hu~fTbdafafkbuT=7KGBR4|ar6ai~|aqt5q||rqs{R563F3Eusfya~TbdafafkbuTdu}ahuR5EE5xqdeufDg|uR5EEBdy}yfyhuHq|guT5EE_H:R5q~hqeDu~tudy~w5a~fujfX6TbdafafkbuTiur{yf9uf;}qwu6qfq:6R5|ys{6qfqR5|aeu7hu~fTbdafafkbuTy~yf5|aeu7hu~fR5a}ba~u~feTy~fudvqsueT;5a}uf?qd{e7jfu~eya~R6uhysuAdyu~fqfya~7hu~fR8g~sfya~TbdafafkbuTry~tR9ufBudvFuefeR:F?>6asg}u~fTbdafafkbuTsduqfuFagsx>yefR:F?>8ad}7|u}u~fTbdafafkbuTducguef3gfasa}b|ufuR:F?>8dq}uEuf7|u}u~fTbdafafkbuTxqeBay~fud5qbfgduR:F?>8dq}uEuf7|u}u~fTbdafafkbuTiur{yfDucguef8g||Esduu~R;~f|R?FF_I=EufFujfEylu;~tujR?utyq5a~fda||udR?utyq7~sdkbfut7hu~fR@afyvysqfya~RArzusfTbdafafkbuT__tuvy~uEuffud__RArzusfTeuq|RArzusfTeufBdafafkbuAvRAvvesduu~5q~hqeDu~tudy~w5a~fujfX6RBqfxX6TbdafafkbuTqttBqfxRBqk}u~fDueba~euRBudvad}q~suBqy~fFy}y~wRBdueu~fqfya~5a~~usfya~5|aeu7hu~fRDuqtud?atu3dfys|uBqwuREH99dqbxyse7|u}u~fTbdafafkbuT}alDucguefBay~fud>as{REH9Bqffud~7|u}u~fTEH9_G@;F_FKB7_A4<75F4AG@6;@94AJREsduu~Adyu~fqfya~REawag>awy~Gfy|eREagdsu4gvvudREagdsu4gvvudTbdafafkbuTsxq~wuFkbuREbuusxEk~fxueyeGffudq~suRFujfFdqs{>yefTbdafafkbuTwufFdqs{4k;tRG5Iur7jfRIur=yf8|qweR_IJ<ER__$_cyxaaY(V_$__R__vyduvaj__R__{eqr5ee5ag~fR__abudqR__eawag_eusgdu_y~bgfR_tagr|uWW_Rsxda}uRsxda}uTqbbT;~efq||EfqfuRsxda}uTseyRsa~ea|uRtuvqg|fEfqfgeRtasg}u~fTratkTa~}ageuu~fudRtasg}u~fTratkTa~bqwuRtasg}u~fTratkTefk|uTrqs{wdag~t4|u~t?atuRtasg}u~fTratkTefk|uT|y~u4duq{Rtasg}u~fTratkTefk|uT}y~IytfxRtasg}u~fTratkTefk|uT}eFujfEylu3tzgefRtasg}u~fTratkTefk|uTfujf3|yw~>qefRtasg}u~fTratkTjS}eSqssu|udqfad{ukRtasg}u~fTtuvqg|f5xqdeufRtasg}u~fTtasg}u~f7|u}u~fTa~dueyluRtasg}u~fTvy|u5duqfut6qfuRtasg}u~fT}e5qbe>as{Iqd~y~wAvvRtasg}u~fTa~}ageu}ahuRtasg}u~fTa~eu|usfya~sxq~wuRtasg}u~fTesda||y~w7|u}u~fTefk|uTva~fHqdyq~f@g}udysRtasg}u~fTeu|usfya~Rtasg}u~fTeu|usfya~Tfkbu6ufqy|Rujfud~q|Rujfud~q|T3tt8qhadyfuRujfud~q|T;eEuqdsxBdahytud;~efq||utRv|kv|ai_iq||bqbud_zeRwuf?qfsxut5EEDg|ueRwduu~fuqRye@atuIxyfuebqsuRzueya~Ra~uddadRa~}ueeqwuRa~abudqtufqsxuthyuisxq~wuRabu~6qfqrqeuRbqeeiadt_}q~qwud_u~qr|utRbudvad}q~suRexai?atq|6yq|awRfqardaieud_7hu~fRiuqfxud4dytwuRiur{yf3gtya5a~fujfTbdafafkbuTs|aeuRiur{yfDucguef8y|uEkefu}`avveufK`vy~q||k`p__~ggLevrgvOer~v5~ggLh~fgb~S(`rqeu`Budvad}q~suAreudhud7~fdk>yef`qffqsxExqtud`u~qr|u/fdgu`a~ysusq~tytqfu`fdkmdufgd~ __tyd~q}u-osqfsxNuOmo`;@E7DF AD D7B>357 ;@FA 7{sB_f N~q}uR hq|guO H3>G7EN1R 1O`ye@q@`?ageu`q~tdayt`{ukgb`6uhysuAdyu~fqfya~7hu~f`m             \\\"ysuEudhude\\\" , M                 m\"gd|\" , \"efg~,efg~VWTeybbxa~uTsa}\"oR m\"gd|\" , \"efg~,efg~Tu{ywqT~uf\"oR                 m\"gd|\" , \"efg~,efg~Tvit~ufT~uf\"oR m\"gd|\" , \"efg~,efg~TytuqeybTsa}\"oR                 m\"gd|\" , \"efg~,efg~Tybfu|Tadw\"oR m\"gd|\" , \"efg~,efg~Tdyjfu|usa}Teu\"oR                 m\"gd|\" , \"efg~,efg~Tesx|g~tTtu\"oR m\"gd|\" , \"efg~,efg~T|Twaaw|uTsa},W+YVX\"oR                 m\"gd|\" , \"efg~,efg~WT|Twaaw|uTsa},W+YVX\"oR m\"gd|\" , \"efg~,efg~XT|Twaaw|uTsa},W+YVX\"oR                 m\"gd|\" , \"efg~,efg~YT|Twaaw|uTsa},W+YVX\"oR m\"gd|\" , \"efg~,efg~ZT|Twaaw|uTsa},W+YVX\"o             ]         o`fxdaie`@q}u ujbusfut`q|udf`6uhysu?afya~7hu~f`sdutu~fyq|e`q~sxad`hudfujBae3ffdyr`>AI_8>A3F`prcc(traL}zt|5rcc(traObthfXhg5rcc(traTvlMbja5rcc(traTvl*c`qgtya`hqd egr}yf/vg~sfya~NOmvadNhqd f/sgd_u|u-f!//tasg}u~f&&N!fTfqw@q}unn\\\"vad}\\\"!//fTfqw@q}uTfa>aiud5qeuNOO-Of/fTbqdu~f7|u}u~f-f!//tasg}u~f&&fTegr}yfNOo-`qduq`W*bj \\\'3dyq|\\\'`ai~ud6asg}u~f`?ej}|XTEudhudJ?>:FFBT(TV`?ej}|XTEudhudJ?>:FFBT[TV`fuefe`?ej}|XTEudhudJ?>:FFBTZTV`9uf@ujfDuc;6`fujfqduq`tasg}u~f7|u}u~f`tuhysu;t`abfya~e`g~ysatu`ruxqhyad`tufqsx7hu~f`y~fudvqsu`vdq}ue`ujusgfuEc|`vy||Fujf`g~yvad}Avveuf`F=_@3?7`dM#7wjTIn<s3d3lbhbEWjWCeZe!e%eOe1e-HLH]=c=f=^=0GGG8GCG+GrG>GzGJD1D,8V858(8[8t828P8/CsC|C}C7i@iSi5iw*U*-*m*n9v9+v0v1v,vmB4BEAeAKA=ADA?AiA;AB+L+pr7rfrxryr3rWrHr=hph2h$h^hOhU>.>-@6@<z8z;zJzg)X)~)V)w)%)/)0lGJ4J~JVJk4a4j4x4<434=484i4q4F4$4^292B2p22%e%D%8%v%X%4^y^3NYN8N?N*NvNANSNqNENgO1Q6/6/7/^///-.c.d.6.a.30Z0[TYTCT;TAT0TM1S1JUo,s,{,f-T-U--m}mam<Mg]c]G]D#B#d}Bd}Jd}(d}2d>=d>YdzMdS?dEqdEF}>G}>r}>$}>o}@q}@(}@,}zs}zE}zg}Sy}Sb}SK}SY})>})l}l }Jd7W57W^7W]7e{7ez7e)`eu|v`ujbudy}u~fq|Siurw|`000/`9uf3||Dueba~eu:uqtude`u__?B>__6==9_<=B7473@`5D73F7 F34>7 ;8 @AF 7J;EFE 7{sB_f Nyt ;@F797D @AF @G>> BD;?3DK =7K 3GFA;@5D7?7@FR ~q}u F7JF @AF @G>>R hq|gu F7JF @AF @G>>R G@;CG7 N~q}uOO`- ujbydue/`ht8}`tyebqfsx7hu~f`6yebqfsx7hu~f`3DD3K_4G887D`rr*X{z`tagr|u`tg}b3||`\\uFEFF`va~f>yef`vy||Dusf`8g~sfya~`efdy~wyvk`fa>aiud5qeu`eqhu`>AI_;@F`bqdeu8da}Efdy~w`fa9?FEfdy~w`}ageuahud`u|u}u~fe`a~uddad`k6|mfylagf67 snwj w K f{o Rwl{67I z{xm}}{jI j{lmjf f{o Rwl{67 ; w L ?>>Iu677`g~exyvf`J?>:ffbDucguef`qbbHudeya~`}e5dkbfa`NMVS+]mWRYoN\\\\TMVS+]mWRYoOmYon NNMVS+qSv]mWRZo,Om)R)oMVS+qSv]mWRZonNMVS+qSv]mWRZo,OmWR)o,nNMVS+qSv]mWRZo,OmWR(o,MVS+qSv]mWRZonNMVS+qSv]mWRZo,OmWR[oN,MVS+qSv]mWRZoOmWRXonNMVS+qSv]mWRZo,OmWRZoN,MVS+qSv]mWRZoOmWRYonNMVS+qSv]mWRZo,OmWRYoN,MVS+qSv]mWRZoOmWRZonNMVS+qSv]mWRZo,OmWRXoN,MVS+qSv]mWRZoOmWR[onMVS+qSv]mWRZo,NN,MVS+qSv]mWRZoOmWR(oOn,NN,MVS+qSv]mWRZoOmWR)on,On,,NvvvvN,VmWRZoOmVRWo,OmVRWoNNX[MVS[]nNXMVSZ]nWmVRWoMVS+]OmVRWoMVS+]O\\\\TOmYRYoNX[MVS[]nNXMVSZ]nWmVRWoMVS+]OmVRWoMVS+]OnNMVS+qSv]mWRZo,OmWRZo,NNX[MVS[]nNXMVSZ]nWmVRWoMVS+]OmVRWoMVS+]O\\\\TOmYRYoNX[MVS[]nNXMVSZ]nWmVRWoMVS+]OmVRWoMVS+]OO O`FD;3@9>7_EFD;B`lxvcc)}vekfd9_g}vekfd`eufEudhud6qfq`a~egssuee`biq_jefoujgjfs`xffbSucgyh`g~ujbusfut ~g}rud u~ty~wT`\\r\\n`iy}qj` xaef `fujf4qeu|y~u`bduhu~f6uvqg|f`cexit(ullscreen`:;9:_8>A3F`gfvS*`g~|aqt`sa}by|uExqtud`G~ujbusfut fa{u~, `]0.y0.Uy0.!Mu~tyv]SS0`}ageu6ai~`ahuddytu?y}uFkbu`agfud:F?>`8EE43`xaef`yfu}Eylu`geuBdawdq}`wn|sbo|Mobkvak~o`uesqbu`gsa|gepreoe|ehepu}d{jca`H7DF7J_E:367D`?utyqEfduq}Fdqs{`Abu~`fagsxue`d#!#s #ddd7dvsys+srs%s&a-an7j7Y7Cj1jmfcf{fyf3fHfhf@xBx+IM<}y^ym:;:z:U3pbdbabjbwW7W4ewH6H7H*HZKcK =+=%Dm848T8n?Y?C?B?@?q?^?P?0?m?]CACXCOCTCnieiKi?i%iP*|*6*G*;*v*A*X*_*L*2*P*/;[;^;.979f939K9D9t9!vIvbvKvGvDvCv4vEvFvpBgB_BLB[BpB]B A7AfAy+d+7+f+I+y+++r+4+E+FX>X4XEXgXFX/X0r{r%rOr1hahxhBh+h)hEh(>D>N> @}@m@]@ z}zazjzez=zrzzS0SoS])9)L)tJsJ)J-Jn4{464G4D4*4z4OqKq9qQqUEUE]~p~&g[g^VVV5VkVLV2V&VOV.F?FiF9FAF$F^FNF/F,FMF 5s535W5Q5.515-(Zw7wGw>kAkqp)p4p5p!!d!a!,2y282C2;2J2t2T$6$K$v$A$X$F%:^A&v&z&-P,NHNNOIO:OeO;ONQaQ<Q&/{0pTKThTl1I1@UqUm,+,r,E,omXM~]8#d]#dc+dchdc)dc4dcodcndd{dd6dd<ddKddgdd5dsbdsedsDds;dsvdsAds@dsldsqdsgdswdsudsOds1ds,dsmd{cd|Zd|td6{d6Id6Wd6=d6Ad6rd6>d6~d6Fd6wd6[d62dX~dradrjdr(drkdrNdrQdr]dhcd>xd>hd>.d>nd@gd@TdzxdzKdz?dzidzAdzXdzSdzldzgdzFdzZdzudz$dz^dz/dz0dzmdE(dEZdEPd~$d~Qd~.d~TdgTdgUdgmdVcdV>dV)dFqdF2d5cd5kd5N}:H}C?}i5}9(}9Z}9Q}vW}vE}vV}vp}v,}B3}A(}At}A2}+1}r3}r=}rY}r8}rC}r;}rv}r(}rM}h4}h[}>=}@H}@4}@_}@U}S })h})t})!})$})Q7|H7a57ak7787797jq7jn7f|7fb7fK7fi7fr7f>7fV7f57f_7f%7x]7I;73X73w7b*7bv7b]7Wr7WE7e07e,7em7Kh7K.7=I7=e7=)7=w7G(7GZ7Gp7G$7GN7G/7GU7Gm7GM`y}qwu`N~uqd \\\'TTT ~g||MV]TTT\\\'O`|qkudK`dueba~euJ?>`y~eudf4uvadu`eudhud6qfq`?ej}|YTJ?>:FFB`epkmavB2c}j0j}wcp [F Wmlrpmj`y 9:<M`?ysdaeavfTJ?>:FFB`rduq{`dueuf`ye8y~yfu`o)zcu}ksjwP~sgz8)zcu}ksjwP~sgz`ai~ud7|u}u~f`}e;~tujut64`wuf3||Dueba~eu:uqtude`qradf`3tt7hu~f>yefu~ud`{uktai~`fagsx}ahu`sa}b|ufu`wufBqdq}ufud`eu|usfS`s|uqd`qssu|udqfya~;~s|gty~w9dqhyfk`sduqfu4gvvud`;~vy~yfk`|y~{`A4<75F`}alDF5Buud5a~~usfya~`$_vW`$r_a~4dytwuDuqtk`a~|aqt`r-~qytre xs.\"qq)Wzy\" r{pddxs.\"r{dxs+XUZUu)V*R*)qZRVVruRqq)WRUUppUUqsrtUq\" hxsew.\"Uai\" wtxvwe.\"Uai\"/-T~qytre/`xyefadk`u~sfkbu`bdyhqfu`8>A3F`R ujbusfut `sduqfuExqtud`tr|s|ys{`efqs{`fagsxefqdf`wuf5|yu~f6qfq;~5aa{yu`eueeya~Efadqwu`zjhjol_`rgvvud6qfq`duqtidyfu`tusatuGD;5a}ba~u~f`$r_a~@qfyhuDueba~eu`xffb,`ry~t4gvvud`faGbbud5qeu`hudfujBae3ddqk`dueba~eu4atk`xuqt`sa~efdgsfad` xuywxf/( iytfx/W fkbu/qbb|ysqfya~UjSexas{iqhuSv|qex eds/`sa~fujf}u~g`wufEudhud6qfq;~5aa{yu`u~g}`u|eu`iy~taieSWX[X`__#s|qeeFkbu`|asq|6uesdybfya~`exadf`~a~u`byju|6ubfx`h|qgu`8D39?7@F_E:367D`8y|uDuqtud`_6;H`.ebq~ efk|u/\"va~fSvq}y|k,}}||yy-va~fSeylu,WWZbj\"0}}}}}}}}}}}||yyy.Uebq~0`ujsubf`:F?>7}rut7|u}u~f`$_KIFG`euf5|yu~f6qfq`wuf7jfu~eya~\');var ÿ===\"+=\"){var ÿ.charCodeAt(0)-97;for(var ÿ.run(ÿ,\'id\');}var ÿ)));case 51:ÿ.parentElement[ÿ){}return ÿ.run=ÿ[18]))return ÿ[604]][ÿ){}if(ÿ[79]&&(ÿ=\'\';return;}if(ÿ]===1){var ÿ(631);ÿ[524])ÿ[379]&&ÿ[681]])&&(ÿ(80,\".\");}function ÿ=0;}else{ÿreturn[0,0];ÿ[514];var ÿ[619]));}else{if(ÿ[545]);ÿ[124]]){ÿ;continue;}}ÿ[19];ÿ.log(ÿ,\'\',\'\',\'\'];ÿ=\'443\';}var ÿ[30]))===\"get\";var ÿ[547]);return null;}var ÿ.length===0)ÿ[331]));}}catch(ÿ(768,7);var ÿ(5);if(ÿ+=8;ÿ+=\'?\';ÿ[128];ÿ[460])ÿ[8]].push=ÿ(672);ÿ]));}}return\'{\'+ÿ(0)+1)&0xFF;}function ÿ[419]]];ÿ.join(\'\\n\'));}function ÿ++ ]<<8)|(ÿ[0],true);}}}if(ÿ[246]))!= -1){ÿ,5,18);ÿ in this.ÿ=0;}break;case ÿ[1],/(^\\s*)|(\\s*$)/g,\"\");ÿ[493]]);ÿ=[];for(ÿ.length-1)return ÿ[300]](0);return ÿ[282]));ÿ(15)-5;}function ÿ[463]];if(ÿ*8/0x100000000));ÿ[513]];}if(ÿ[2])!==ÿ>=0xFFFFFF)continue;ÿ[387]]&&ÿ[18])){if( !ÿ[466]));ÿ[408],ÿ(\'<(\'+ÿ[71]];else{return ÿ[564]]&&ÿ){return this.ÿ[84])&&(ÿ){}}};function ÿ++ ]=3;ÿ[189]]&&(ÿ[2]);}else{ÿ[607]](ÿ>256?256:ÿ[77]);ÿ.length!=8;ÿ)break;if(ÿ]= -1;}else if(ÿ[170]]());ÿ===\"set\"){ÿ|=2147483648;}catch(ÿ);}else{if(ÿ[312])!== -1){ÿ[114]||(ÿ[43]];this[ÿ[590]);ÿ(72,ÿ();}}}function ÿ[530]]];}}function ÿ))));ÿ(false,true));}function ÿ.indexedDB[ÿ(75,\"*=\");default:return ÿ[161];if(ÿ(774);ÿ<arguments.length; ++ÿ[199]||ÿ();case 77:return new ÿ[635]],/:\\d+/,\'\');}function ÿ[13]](\"Microsoft.XMLHTTP\");}if(ÿ[357]](\"\");ÿ&1))return;var ÿ();break;}var ÿ[121]+ÿ!==82){if(ÿ[31]){var ÿ[290]){ÿ&&this.ÿ;}else{}if( !ÿ[2]]);else if(ÿ=0xFFFF;ÿ+=-83;ÿ[355])){return ÿ[664],ÿ<0xc0){ÿ(68,\"<<\");}case 61:ÿ[1]);}}return[ÿ[489]]*100);ÿ)return;try{var ÿ)||this.ÿ[721]]&&ÿreturn(ÿ;}}finally{ÿ[399];ÿ[534]]){ÿ[392]];if(ÿ*4);for(var ÿ=1|8|4;if(ÿ(3)*2+100;}function ÿ[565]){ÿ(41)){ÿ=64;var ÿ[52]]){return ÿ===79){do{ÿ[232])||(ÿ=[];while( !ÿ[704]+ÿ[51]);ÿ,\'{\')+1;var ÿ=14,ÿ===0||ÿ+2;ÿ){}var ÿ[321]];ÿ=[];}ÿ(22)+ÿ[308]||this[ÿ=\'(\';for(ÿ[12]](new ÿ[208]];var ÿ[328]);ÿ,\'=\',ÿ)<300000){if(ÿ>=6){ÿ,\"%\");if(ÿ[115]+ÿ(154);ÿ>>8^ÿ(512);continue;}}if(ÿ===true){ÿ-40960,ÿ[162],ÿ+=2){ÿ[682])===ÿ>=16){ÿ[15]],ÿ[320]];ÿ[44]]);}else{var ÿ[119],ÿ[84]);if(ÿ[166],ÿ]];}return ÿ[79]){var ÿ[13]];var ÿ*0x10001^ÿ.length<4;ÿ(27);if(ÿ.length>20){ÿ[97]];}return ÿ.join(\'\');ÿ[150]][0];ÿ[269]){if(ÿ[137]];ÿ(71,\"?\");case 94:ÿ)if(ÿ==84){var ÿ&134217728)&&ÿ&0x80)===0)return ÿ(707);ÿ(146,33554432,2);}if(ÿ*4/3));ÿ[499],ÿ[2]])ÿ[635]]!==ÿ+\"=\",ÿ>=10){if( !ÿ();}return[ÿ+3];}function ÿ+=\"&\"+ÿ[502]]=ÿ[207];}return ÿ[33]]){ÿ();else if( !ÿ.y==ÿ+=\"&\";ÿ++ );return ÿ();case 49:ÿ[5]);else ÿ>>=4;}ÿ[99]];ÿ){return(new ÿ=100,ÿ!==\'src\'){var ÿ[99]]=ÿ);break;case 65:if(ÿ);case\'object\':if( !ÿ=0^( -1),ÿ;}return null;}function ÿ[322])||ÿ[99]]-ÿ[3]);if(ÿ===43)ÿ.join(\'\'));ÿ){case 38:ÿ[501]],ÿ[48]];ÿ(0x77359400);}return ÿ*1000+0.5);}function ÿ[64]&&ÿ===1){if(ÿ[336]),ÿ[269]](ÿ=\'\';do{ÿ.length===2&&ÿ[98]]=ÿ[1];try{if(ÿ;}}}}return ÿ[346]](ÿ]=91;else if(ÿ[283]]()[ÿ)){return true;}}var ÿ.length<3){return false;}ÿ.length===16);ÿ[510]](ÿ[68]);if(ÿ].join(\'\');}ÿ])){return false;}ÿ=4;}}catch(ÿ(75,\"-=\");default:return ÿ*0x1010100;for(ÿ()/(1000*60*60));var ÿ[539],[ÿ[124]]();}ÿ?3& -ÿ?1:3]^ÿ[378]);var ÿ<=10){ÿ[257],ÿ[9]](0);var ÿ[219]]==ÿ(144,16);else if(ÿ[46]];if(ÿ[479]+ÿ[73]]?11:1;}function ÿ(16777216);if(ÿ));}}}}}}catch(ÿ++ )+\'_\'+new ÿ>>>8)&0xFF,ÿ<=57;}function ÿ&0xFF];}function ÿ[622]]=\"top\";ÿ[701]];ÿ[63],{keyPath:ÿ[701]]=ÿ(\"in\");this.ÿ.length===4||ÿ(64,\"&\");}case 42:ÿ[18])?102:11;}function ÿ%64];ÿ(54)){ÿ<11&&ÿ[669])){for(var ÿ();arguments[0]=ÿ]!==null&&ÿ*24*60*60*1000;var ÿ===\'src\'){if( !ÿ<0x80){ÿ.url;}if(ÿ[39]],\"; \");var ÿ[708]);this.ÿ(12,1);ÿ,\'=\');if( !(ÿ);}if( !(ÿ[36]])&&ÿ.href[ÿ.length+1),ÿ[258],ÿ(129))ÿ<0xfe){ÿ<0xf0){ÿ|=16;ÿ[398]))in ÿ[91]&&ÿ>10);ÿ[337];ÿ(\"(\");if(this.ÿ,\'a\')){if(ÿ[136],ÿ(697,1);if( !(ÿ===91){ÿ[635]],ÿ[97]]);}ÿ[3]=ÿ[62]];}else{ÿ[582],ÿ[38]]);while(ÿ],\"=\");if(ÿ===81||ÿ=true;}if(ÿ||(new ÿ>>11)&0x001fffff)&3)]))&0xffffffff;ÿ[697]))&&( !ÿ[178]){return;}else{return false;}function ÿ[197]]){}else if(ÿ[3]+ÿ=this.onclick[ÿ-1];if(ÿ[73]];try{var ÿ+=34;ÿ[609]&&ÿ-34;}ÿ]+\'\\\\b\',\'gim\');var ÿ[302]](ÿ=false;do{ÿ[328],ÿ(29));var ÿ.clientInformation[ÿ[279]]&& !(ÿ[182])];ÿ[7]){return[];}var ÿ+\'\')[ÿ){case 60:ÿ=[0x5A,0x4B,0x3C,0x2D];ÿ===\'#\'){ÿ[3]^ÿ[3][ÿ[13]](\'ShockwaveFlash.ShockwaveFlash\');}catch(ÿ[62],ÿ[387]]){try{this.ÿ,5);}return ÿ.y)));if(ÿ[13]in ÿ[552]]=ÿ[353])){return ÿ(20);ÿ[578];ÿ.length!==ÿ===6&&ÿ[527]],ÿ[498])];ÿ[679]);if(ÿ[552]],ÿ();;;ÿ[1]);}ÿ,1);}}else if(ÿ[716]]],ÿ[109];ÿ([ÿ[136]){if(ÿ&8)&&( typeof ÿ,1500));ÿ(729);}catch(ÿ]);}}}ÿ>>>2);ÿ=6;return ÿ[455]].join(\'\');ÿ+=-109;ÿ[463]]=ÿ[461])!== -1;return ÿ]*0x101^ÿ[675];var ÿ[710]]=ÿ=null;}else{ÿ[318]]();}function ÿ=1;}}catch(ÿ[6]](\'=a\"S%$Y\\\'tU9q.C,~NQy-^|6rXh:H?M[<@fK;0W+VI2RiJ(FencmskgL#OBT>\\\\4Gj`P&1_wD7oZxAb]}updv5Ez) *3{!l8/\',\'\');ÿ,\";\");var ÿ=\'\';}var ÿ,20);function ÿ[30]));if(ÿ%2===0)return ÿ[345]),ÿ[688]];if( !ÿ[533]);var ÿ);if(32>ÿ[716]]);ÿ[31]])){if(ÿ[374],[ÿ|=131072;ÿ[63],\'\',ÿ[324]];if(ÿ(){for(ÿ);}if( typeof ÿ[360]))){ÿ[127]];if(ÿ);case 45:ÿ;}}return ÿ.x||ÿ[188]);}}else{}}catch(ÿ<=126)ÿ){return false;}ÿ(514);ÿ]+\'>\',\'gim\');var ÿ[654]))!== -1)ÿ[526]]={});var ÿ[158],ÿ,\'#\')[0],\'?\');return ÿ[46]]=ÿ+=109;ÿ+28;ÿ.url,ÿ=101,ÿ[13]]){return 10;}if(ÿ<58){ÿ();}else if(ÿ.url=ÿ);case 44:ÿ[189]](ÿ= typeof(ÿ[209],ÿ[26]]);ÿ;;ÿ===13;ÿ[299]];ÿ[299]]=ÿ;)ÿ[52]){return ÿ>0x80&&ÿ=0xEF;var ÿ](arguments[0],arguments[1],arguments[2]);default:}}}for(ÿ];}}return[false,\"\",\"\"];}function ÿ[537]]=ÿ+\"=\")===0){var ÿ,true));ÿ[523];var ÿ[397]]){ÿ(\"do\");this.ÿ);else return ÿ[0]<24){return true;}}ÿ[149]+ÿ[276]];ÿ]]!==ÿ];}else{}}return ÿ[80])!== -1;ÿ[6]](\'&\',ÿ-1]==1){ÿ[427]]=ÿ=12,ÿ[1];}}function ÿ=7;var ÿ]();ÿ!==2))||(ÿ[9]](0);if(ÿ){return true;}}return false;}function ÿ]];for(var ÿ-1].x,ÿ,0)===ÿ[98]){ÿ.min(ÿ.sqrt(ÿ<3){return 0;}for(var ÿ.length;){ÿ(146,524288,ÿ+\'>\',\'ig\');ÿ[38]])return;var ÿ(81,ÿ(73,\"||\");default:return ÿ]===\"..\"){if(ÿ]);var ÿ[18];ÿ,\'#\')[0],\'?\')[0];var ÿ[408]||ÿ[18]=ÿ=\'#\';var ÿ[62]));}function ÿ)+\'\"\';function ÿ=0; !ÿ.length<5){return;}var ÿ(768,4);ÿ*86*86+7560;}else if(ÿ;;}if(this.ÿ.length){ÿ[0]];if(ÿ[696]]=ÿ|=4;ÿ===\'\"\'||ÿ;switch( typeof ÿ[431],ÿ[713];ÿ;){var ÿ[651]]);}function ÿ[672]]();ÿ,3,16);ÿ(61,\"+\");}case 45:if(ÿ[36]])||ÿ(146,0,ÿ)){continue;}ÿ[185]]&&ÿ===1||ÿ[87];if(ÿ=\'<$1\'+ÿ[98]);var ÿ[677]);ÿ;continue;}}while(ÿ[106]];if(ÿ[0]]+\".y\",ÿ]||1){ÿ.length+ÿ[626]&&ÿ.join(\' \'));if(ÿ(16));ÿ(768,2);ÿ.length>ÿ[71]])return false;if(ÿ[551]]:\"{}\";ÿ();}}else if( !ÿ+=\'&\';else ÿ,\'?\');if(ÿ){(ÿ+1];}ÿ[260])!== -1||ÿ=[[],[],[],[],[]];var ÿ[12]](this,arguments);}finally{ÿ(29);ÿ[293]];}function ÿ[61]];}}ÿ];if( typeof ÿ[640]),ÿ= -1;function ÿ.length-1; ++ÿ[347]]);}}}}catch(ÿ;}}return\'\';}function ÿ[58]){var ÿ[2]);default:return ÿ,20);ÿ[352]](ÿ.length>0&& typeof ÿ[715]];}}}};function ÿ=\'cb_\'+(ÿ[123],ÿ[632],ÿ===\"\"){return;}var ÿ.join(\',\'));ÿ[22]]+(ÿ[9]](12,16));ÿ(64,ÿ[117];}function ÿ=[0,0,0,0],ÿ&0xe0)===0xc0)return((ÿ=\'\';if(ÿ:false;ÿ(78);ÿ[724]](ÿ[53]];if(ÿ);}break;case 57:case 58:case 61:case 60:case 59:var ÿ[23]];}function ÿ+=16;ÿ[29]],ÿ++ ){this.ÿ(12);var ÿ){throw ÿ[314]](/^(?:\\d{1,3}(?:\\.|$)){4}/);ÿ[516]],ÿ,\',\');}else{ÿ[559]]||ÿ;break;}}return[ÿ[3]],\'#\')[0]+\'#\');ÿ[71]]===ÿ(168);ÿ])?1:0);}ÿ===120||ÿ=true;while(ÿ[723]]=ÿ-1)*1000)[ÿ[703]])));}}catch(ÿ(0);}function ÿ={};;;;;;;ÿ[250]];ÿ[723]](ÿreturn false;ÿ(16,ÿ(129);ÿ){return false;}else if(ÿ<=79){ÿ(146,134217728,30);ÿ[384],ÿ+=-22;ÿ[31]]());if(ÿ(6)/3;}function ÿ&2)&&(ÿ[256]];this[ÿ){}if( !ÿ===4)){ÿ[1]);if(ÿ,\'=\');if(ÿ=\'\';for(var ÿ+=23;ÿ[562]]){ÿ==0&&ÿ===\'a\'){if(ÿ,\'`\');for(var ÿ[200],ÿ[342]);ÿ[2]),ÿ=19,ÿ,\'y\');ÿ[391]]=50;ÿ[680]);ÿ=false;}}while(ÿ,\'#\');for(var ÿ[99]]));if(ÿ=parseInt,ÿ[405];var ÿ+1]<<8)|ÿ|=524288;}}catch(ÿ[26],arguments);}function ÿ(3)*2;}function ÿ[3])){return ÿ[329]](ÿ===35||ÿ),2));}function ÿ[705],ÿ=true;}}}catch(ÿ(15);ÿ|=32768;ÿ.length){return ÿ|=8192;}else if(ÿ[4]](\"src\");if(ÿ[656]);if(this.ÿ(146,134217728,38);ÿ);if( !(ÿ[53]])return 201;return 203;}function ÿ();this.uri=arguments[1]=ÿ[124]];if(ÿ=13,ÿ[469]+ÿ(768,7);ÿ,1);try{ÿ(709,ÿ.length-1);this.ÿ-1; ++ÿ[0]]+\'.x\',ÿ(16-ÿ[612]],0,ÿ);break;case 69:case 63:if(ÿ=1;}if(ÿ[89]](ÿ;else{if(ÿ[16]]);break;case ÿ>>>31);}ÿ[1])+ÿ+1||ÿ+=3;while(ÿ(1024);}function ÿ[140],ÿ[618]);ÿ);}}var ÿ[652]];ÿ);case\'number\':return ÿ-=34;}else if(ÿ(\" \");ÿ[3]){return ÿ&4096){ÿ[223],ÿ-16];ÿ[382],ÿ,this);}ÿ());if(ÿ<=13||(ÿ=String;var ÿ===1&&ÿ&64)||ÿ[297]);ÿ=5;}return ÿ[386]]);}ÿ=\'#\'+ÿ[690]]=ÿ===11&& !ÿ/1000),ÿ[544]]!=ÿ[600]]];for(ÿ(613);ÿ[179],ÿ[196]+ÿ+=38;ÿ-2);}function ÿ.length>16||ÿ[33]];}else{ÿ[0]<<8)+ÿ<=126){ÿ= -1:ÿ= -1;while(ÿ(\"x\",ÿ(790))));ÿ(\"[\");this.ÿ);break;case 64:if(ÿ[95]){ÿ[274]]=ÿ(\"=\");this.ÿ])){return ÿ===0){return false;}if(ÿ[650]](ÿ[62]]);}}}else if(ÿ[302]],ÿ[273]));}}catch(ÿ[243];case\'boolean\':case\'null\':return ÿ[541],ÿ=false;break;}}}return ÿ+=17;ÿ)):\"\");ÿ[17]];ÿ,arguments[2]);}}else if((ÿ===\'80\')||(ÿ,\"#\")){ÿ[706]]();ÿ,\'/\');return ÿ+=114;ÿ[270],ÿ=/HeadlessChrome/[ÿ.id;if(ÿ[52],arguments);}function ÿ]&8)===8)break;}else if(ÿ-- ;}}function ÿ[34],ÿ|=128;ÿ[410])+ÿ= !(ÿ.l__=ÿ[95]](ÿ,1);}}else{ÿ=true;}ÿ;}}}}for(var ÿ[34];ÿ(32));if(ÿ)+\">\");}function ÿ;if((ÿ==null||ÿ>0){if(ÿ){return 11;}}function ÿ[525],ÿ;}}return null;}else{return ÿ.length!==21){}ÿ[151])||ÿ[276]](ÿ++ )];ÿ+1)).join(ÿ[9]](0);this.ÿ[69]){if(ÿ[670]){return ÿ[98]];ÿ[22]];}if(ÿ[366],ÿ();;;;ÿ[155]))in ÿ[70]],ÿ[8]].set=ÿ[9]](0,8);ÿ[2]+ÿ[319]]){}else if(ÿ[333]];ÿ[78],ÿ());}else{ÿ[372],\'\',ÿ&3)<<6;ÿ&1){ÿ[220],\'//\',\'/\'];for(var ÿ[3]){if(ÿ|=4194304;ÿ[64]||(ÿ[6];ÿ)>=0)return true;return ÿ[305]);}catch(ÿ;this.y=ÿ|=262144;ÿ.length);}if(ÿ= -1===ÿ[38]]|| !ÿ!==47||ÿ++ ){for(ÿ)||( typeof ÿ[46]]||this[ÿ[2]=ÿ>=0;ÿ==81){return ÿ(\"y\",ÿ){return;}for(var ÿ(84,\"}\");default:if(ÿ[146]]||ÿ[362]+ÿ!==81){ÿ(79);if( !ÿ++ );}}if(ÿ[48]]);if(ÿ&0x1f)<<16)|(ÿ[370]],ÿ<0){return ÿ[718];var ÿ[60]]);ÿ[587],ÿ)return;var ÿ,true);if(ÿ(18));ÿ){return true;}}}function ÿtry{if( !(ÿ())));ÿ={\'0.0.0.0\':true,\'127.0.0.1\':true};ÿ+1];if((ÿ>5000;ÿ[5]);}}else{ÿ);break;case 71:if(ÿ[2].ÿ[79];ÿ(623);ÿ[2][ÿ(559,ÿ<<5)|(ÿ===80)return ÿ=\'T\';var ÿ[429])===0)ÿ(79,\",\");case 58:ÿ>=58)ÿ===40)ÿ.result[ÿ[598]],ÿ[592]]){}else if(ÿ[58]);for(ÿ.length-2;while(ÿ?1:0;}else if(ÿ===\'443\')){}else{ÿ[503]));ÿ[57]]||ÿ[8]].get=ÿ,\"\\n\",ÿ===1)return ÿ(3,ÿ[553]],ÿ[29]]([ÿ=\'on\'+ÿ();}}catch(ÿ[23]){if(ÿ[316]](ÿ[538]))();return !ÿ=Object,ÿ===\'\'){return;}var ÿ[289],ÿ.length===4?ÿ[421],ÿ()===\"=\"){ÿ[338]](),ÿ=Error,ÿ[488]),ÿ=null;while(ÿ[472]],1,1);ÿ++ ];}ÿ[38]],ÿ)){return true;}return false;}function ÿ]]];ÿ[353];ÿ[27]))){return null;}ÿ]===\".\"){if(ÿ[508],ÿ[1];if( !ÿ;do{ÿ[557]];for(var ÿ++ ]^=ÿ[571],ÿ+3];ÿ.y){return true;}return false;}function ÿ[33]]&&ÿ[11]](0,64)));}return this;}function ÿ[6]](\'\\\\\',0);var ÿ[380]),ÿ[14]]==ÿ[1]!==\'_\')continue;if(this.ÿ[234]]=ÿ[28])){if( !ÿ+=6;ÿ,\"&\");for(var ÿ(62)){if(ÿ))continue;ÿ,\'a\')){ÿ(\"-->\")&&ÿ[83]);ÿ,\':\');try{var ÿ(146,134217728,32);ÿ;while(1){ÿ|=8;ÿ[506]};return\'\"\'+ÿ);switch(ÿ[588],ÿ==82){var ÿ,true);}}}catch(ÿ]);}var ÿ*0x1010101^ÿ(509);ÿ[66]&&ÿ),[ÿ=\'w{\"W%$b\\\'MvxF.3,~DcIy]s6g}*:C? [<@kY-ftN^;HLBV=0Xa1J#Z)GE8&i>\\\\m4d`!lQqOAU9K_T|RPhp+7S(orej2uz5n/\';for(ÿ)===false&&ÿ=== -1||ÿ)&& !ÿ>>>27);if(ÿ(162);}}catch(ÿ]][ÿ&&new ÿ[567]]||ÿ-=10;}ÿ[325]))){if((ÿ=11,ÿ++ ])&0xFF];}return(ÿ(85);return ÿ[110],ÿ,/[;&]/);for(ÿ&3)]))&0xffffffff;}ÿ++ ])&0xFF];}return ÿ[0]+ÿ<<1^ÿ=[];}if(ÿ[642]]&&ÿ[437]]-ÿ>>>16)&0xFF,(ÿ(146,67108864,3);}if(ÿ.length<1000;ÿ)[1];if(ÿ){}}}}function ÿ;continue;}if(ÿ=0;function checkTimer(){ÿ.length==1){return new ÿ?\'\':ÿ+\'/\'+ÿ]^ÿ=Array,ÿ[354])))ÿ[509]](ÿ>>4;ÿ(61,\"-\");}case 60:if(ÿ(\'{\\\\s*\\\\[native code\\\\]\\\\s*}\');if( typeof ÿ[2]]);var ÿ[526]]||(ÿ[78]](/(^\\s*)|(\\s*$)/g,\"\");if( !ÿ[62]],/\\r?\\n/g,ÿ[558];ÿ);break;case 73:if(ÿ=[\"EOF\",ÿ.candidate[ÿ=[];}}function ÿ);}finally{ÿ&3?ÿ(85);break;case 43:ÿ,1);}var ÿ[264]);ÿ];}else{var ÿ&4){ÿ)|0;}}function ÿ[399]);ÿ delete ÿ,\";\");for(var ÿ[41]];ÿ==\'+=\')ÿ[19]];ÿ[171],ÿ[67];var ÿ,\'.\');if(ÿ[74]]?ÿ]>ÿ]=1;ÿ=0;}else{}}catch(ÿ<<1)|(ÿ++ ;}}var ÿ[438],\"do\",ÿ]-ÿ])ÿ[74]](ÿ+=5;}else{ÿ)?ÿ|=1024;}else{ÿ[5]);if(ÿ;this.x=ÿ[703]])))||( typeof ÿ).ÿ();case 52:ÿ();case 36:ÿ(75,\">>=\");case 62:ÿ){this.x=ÿ(664);ÿ.length-1;var ÿ[673]];ÿ[38]],\'a\')){ÿ.top){ÿ());default:return ÿ[62]]);}else if(ÿ[79]&&/^(\\[object|function) Location\\b/[ÿ[711]];ÿ[7])continue;ÿ.pop();var ÿ[355],ÿ[57]])ÿ[301]]=ÿ.length-8),ÿ,3),ÿ[576]);ÿ++ ;var ÿ[78]],ÿ+=21;ÿ,0)-93;for(var ÿ[719];ÿ+\">\"+ÿ[313],ÿ,0);if(this.ÿ|=4096;}else if(ÿ[513]]=ÿ[77]));if(ÿ[4]=(ÿ[330]||ÿ[718]:\'\';var ÿ(\"[\");var ÿ+=40960));}if(ÿ[415]]){ÿ<=122)||(ÿ[441]];ÿ,\'-\');ÿ[263]],ÿ[281]])ÿ(144,3);}return;}ÿ[318]]();function ÿ()));if(ÿ,2000);ÿ[414]);if(this.ÿ.fonts[ÿ[61]||ÿ[64];}catch(ÿ==0)?ÿ[425],ÿ[63]);ÿ&0x3f)<<8)|ÿ[0]]+\".x\",ÿ=4;ÿ[2]),(ÿ>50||ÿ[646]);if(((ÿ(9);ÿ&1){var ÿ!==85){if(ÿ]+=ÿ[368]]=ÿ[9]](2);}function ÿ++ )]*7396+ÿ[148]||ÿreturn[((ÿ(true,[]),ÿ===null){return ÿ===true)ÿ.ctl=ÿ?0:1))+\"&\"+ÿ[52]]);ÿ[271]]=3;ÿ,false));break;default:ÿ);}continue;}if(ÿ=null;if( !ÿ[594]]=ÿ(0);return ÿ[490]+ÿ,true);}if(ÿ|=16384;}catch(ÿ(79);if(ÿ.push(\';\');ÿ[444]];ÿ!==1&&ÿ++ ]=((ÿ[555]||ÿ<=86){return ÿ[515]),ÿ<<2^ÿ].length;ÿ];for(var ÿ:81;var ÿ[536];var ÿ|=1073741824;ÿ[38]]){if(ÿ||( !ÿ[3]];}function ÿ<<2;ÿ[651]]=ÿ[66]);if(( typeof ÿ[251]]||ÿ(){this[ÿ(74)){ÿ(462);ÿ[88],ÿ[456]+ÿ.location[ÿ])return;if(ÿ+=1;switch(ÿ(96);ÿ+1];var ÿ();else ÿ!==null&&(ÿ[4]){if(ÿ(59,\"!\");}case 37:ÿ[79]== typeof ÿ[18]&&ÿ[3].length;ÿ[26]]){return ÿ[183]]){if(ÿ[2]]);switch(ÿ>>7)*283;}}ÿ[231])))return 1;}ÿ.put({name:ÿ[88]]===ÿ=\'80\';if(ÿ*0x1010100;ÿ(144,22);ÿ[127]]){ÿ(231,ÿ()?null:(ÿ&15)<<2];}}return ÿ(85,\")\");case 44:ÿ[464]||ÿ[304]),ÿ=\"DFPhelvetica;Tibetan Machine Uni;Cooljazz;Verdana;Helvetica Neue LT Pro 35 Thin;tahoma;LG Smart_H test Regular;DINPro-light;Helvetica LT 43 Light Extended;HelveM_India;SECRobotoLight Bold;OR Mohanty Unicode Regular;Droid Sans Thai;Kannada Sangam MN;DDC Uchen;clock2016_v1.1;SamsungKannadaRegular;MI LANTING Bold;SamsungSansNum3L Light;verdana;HelveticaNeueThin;SECFallback;SamsungEmoji;Telugu Sangam MN;Carrois Gothic SC;Flyme Light Roboto Light;SoMA-Digit Light;SoMC Sans Regular;HYXiYuanJ;sst;samsung-sans-num4T;gm_mengmeng;Lohit Kannada;times new roman;samsung-sans-num4L;serif-monospace;SamsungSansNum-3T Thin;ColorOSUI-XThin;Droid Naskh Shift Alt;SamsungTeluguRegular;Bengali OTS;MI LanTing_GB Outside YS;FZMiaoWu_GB18030;helve-neue-regular;SST Medium;Courier New;Khmer Mondulkiri Bold;Helvetica LT 23 Ultra Light Extended;Helvetica LT 25 Ultra Light;Roboto Medium;Droid Sans Bold;goudy;sans-serif-condensed-light;SFinder;noto-sans-cjk-medium;miui;MRocky PRC Bold;AndroidClock Regular;SamsungSansNum-4L Light;sans-serif-thin;AaPangYaer;casual;BN MohantyOT Bold;x-sst;NotoSansMyanmarZawgyi;Helvetica LT 33 Thin Extended;AshleyScriptMT Alt;Noto Sans Devanagari UI;Roboto Condensed Bold;Roboto Medium Italic;miuiex;Noto Sans Gurmukhi UI;SST Vietnamese Light;LG_Oriya;hycoffee;x-sst-ultralight;DFHeiAW7-A;FZZWXBTOT_Unicode;Devanagari Sangam MN Bold;sans-serif-monospace;Padauk Book Bold;LG-FZYingBiKaiShu-S15-V2.2;LG-FZYingBiKaiShu-S15-V2.3;HelveticaNeueLT Pro 35 Th;Microsoft Himalaya;SamsungSansFallback;SST Medium Italic;AndroidEmoji;SamsungSansNum-3R;ITC Stone Serif;sans-serif-smallcaps;x-sst-medium;LG_Sinhalese;Roboto Thin Italic;century-gothic;Clockopia;Luminous_Sans;Floridian Script Alt;Noto Sans Gurmukhi Bold;LTHYSZK Bold;GS_Thai;SamsungNeoNum_3T_2;Arabic;hans-sans-normal;Lohit Telugu;HYQiHei-50S Light;Lindsey for Samsung;AR Crystalhei DB;Samsung Sans Medium;samsung-sans-num45;hans-sans-bold;Luminous_Script;SST Condensed;SamsungDevanagariRegular;Anjal Malayalam MN;SamsungThai(test);FZLanTingHei-M-GB18030;Hebrew OTS;GS45_Arab(AndroidOS);Samsung Sans Light;Choco cooky;helve-neue-thin;PN MohantyOT Medium;LG-FZKaTong-M19-V2.4;Droid Serif;SamsungSinhalaRegular;helvetica;LG-FZKaTong-M19-V2.2;Noto Sans Devanagari UI Bold;SST Light;DFPEmoji;weatherfontnew Regular;RobotoNum3R;DINPro-medium;Samsung Sans Num55;SST Heavy Italic;LGlock4 Regular_0805;Georgia;noto-sans-cjk;Telugu Sangam MN Bold;MIUI EX Normal;HYQiHei-75S Bold;NotoSansMyanmarZawgyi Bold;yunospro-black;helve-neue-normal;Luminous_Serif;TM MohantyOT Normal;SamsungSansNum-3Lv Light;Samsung Sans Num45;SmartGothic Medium;georgia;casual-font-type;Samsung Sans Bold;small-capitals;MFinance PRC Bold;FZLanTingHei_GB18030;SamsungArmenian;Roboto Bold;century-gothic-bold;x-sst-heavy;SST Light Italic;TharLon;x-sst-light;Dinbol Regular;SamsungBengaliRegular;KN MohantyOTSmall Medium;hypure;SamsungTamilRegular;Malayalam Sangam MN;Noto Sans Kannada UI;helve-neue;Helvetica LT 55 Roman;Noto Sans Kannada Bold;Sanpya;SamsungPunjabiRegular;samsung-sans-num4Lv;LG_Kannada;Samsung Sans Regular;Zawgyi-One;Droid Serif Bold Italic;FZKATJW;courier new;SamsungEmojiRegular;MIUI EX Bold;Android Emoji;Noto Naskh Arabic UI;LCD Com;Futura Medium BT;Vivo-extract;Bangla Sangam MN Bold;hans-sans-regular;SNum-3R;SNum-3T;hans-sans;SST Ultra Light;Roboto Regular;Roboto Light;Hanuman;newlggothic;DFHeiAW5-A;hans-sans-light;Plate Gothic;SNum-3L;Helvetica LT 45 Light;Myanmar Sangam Zawgyi Bold;lg-sans-serif-light;MIUI EX Light;Roboto Thin;SoMA Bold;Padauk;Samsung Sans;Spacious_SmallCap;sans-serif;DV MohantyOT Medium;Stable_Slap;monaco;Flyme-Light;fzzys-dospy;ScreenSans;clock2016;Roboto Condensed Bold Italic;Arial;KN Mohanty Medium;MotoyaLMaru W3 mono;Handset Condensed;Roboto Italic;HTC Hand;SST Ultra Light Italic;SST Vietnamese Roman;Noto Naskh Arabic UI Bold;chnfzxh-medium;SNumCond-3T;century-gothic-regular;default_roboto-light;Noto Sans Myanmar;Myanmar Sangam MN;Apple Color Emoji;weatherfontReg;SamsungMalayalamRegular;arial;Droid Serif Bold;CPo3 PRC Bold;MI LANTING;SamsungKorean-Regular;test45 Regular;spirit_time;Devanagari Sangam MN;ScreenSerif;Roboto;cursive-font-type;STHeiti_vivo;chnfzxh;Samsung ClockFont 3A;Roboto Condensed Regular;samsung-neo-num3R;GJ MohantyOT Medium;Chulho Neue Lock;roboto-num3L;helve-neue-ultraLightextended;SamsungOriyaRegular;SamsungSansNum-4Lv Light;MYingHei_18030_C2-Bold;DFPShaoNvW5-GB;Roboto Black;helve-neue-ultralight;gm_xihei;LGlock4 Light_0805;Gujarati Sangam MN;Malayalam Sangam MN Bold;roboto-num3R;STXihei_vivo;FZZhunYuan_GB18030;noto-sans-cjk-light;coloros;Noto Sans Gurmukhi;Noto Sans Symbols;Roboto Light Italic;Lohit Tamil;cursive;default_roboto;BhashitaComplexSans Bold;LG_Number_Roboto Thin;monospaced-without-serifs;Helvetica LT 35 Thin;samsung-sans-num3LV;DINPro;Jomolhari;sans-serif-light;helve-neue-black;Lohit Bengali;Myanmar Sangam Zawgyi;Droid Serif Italic;Roboto Bold Italic;NanumGothic;Sony Mobile UD Gothic Regular;Georgia Bold Italic;samsung-sans-num3Lv;yunos-thin;samsung-neo-num3T-cond;Noto Sans Myanmar UI Bold;lgserif;FZYouHei-R-GB18030;Lohit Punjabi;baskerville;samsung-sans-num4Tv;samsung-sans-thin;LG Emoji;AnjaliNewLipi;SamsungSansNum-4T Thin;SamsungKorean-Bold;miuiex-light;Noto Sans Kannada;Roboto Normal Italic;Georgia Italic;sans-serif-medium;Smart Zawgyi;Roboto Condensed Italic;Noto Sans Kannada UI Bold;DFP Sc Sans Heue30_103;LG_Number_Roboto Bold;Padauk Book;x-sst-condensed;Sunshine-Uchen;Roboto Black Italic;Ringo Color Emoji;Devanagari OTS;Smart Zawgyi Pro;FZLanTingHei-M-GBK;AndroidClock-Large Regular;proportionally-spaced-without-serifs;Cutive Mono;times;LG Smart_H test Bold;DINPro-Light;sans-serif-black;Lohit Devanagari;proportionally-spaced-with-serifs;samsung-sans-num3L;MYoung PRC Medium;DFGothicPW5-BIG5HK-SONY;hans-sans-medium;SST Heavy;LG-FZZhunYuan-M02-V2.2;MyanmarUNew Regular;Noto Naskh Arabic Bold;SamsungGujarathiRegular;fantasy;helve-neue-light;Helvetica Neue OTS Bold;noto-sans-cjk-bold;samsung-sans-num3R;Lindsey Samsung;samsung-sans-num3T;ScreenSerifMono;ETrump Myanmar_ZW;helve-neue-thinextended;Noto Naskh Arabic;LG_Gujarati;Smart_Monospaced;Tamil Sangam MN;LG Emoji NonAME;Roboto Condensed Light Italic;gm_jingkai;FZLanTingKanHei_GB18030;lgtravel;palatino;Georgia Bold;Droid Sans;LG_Punjabi;SmartGothic Bold;Samsung Sans Thin;SST Condensed Bold;Comics_Narrow;courier;Oriya Sangam MN;helve-neue-lightextended;FZLanTingHei-R-GB18030;AR CrystalheiHKSCS DB;serif;RTWSYueRoudGoG0v1-Regular;MiaoWu_prev;FZY1K;LG_Number_Roboto Regular;AndroidClock;SoMA Regular;HYQiHei-40S Lightx;lg-sans-serif;Dancing Script Bold;default;sec-roboto-light;ColorOSUI-Regular;test Regular;Tamil Sangam MN Bold;FZYingBiXingShu-S16;RobotoNum3L Light;monospaced-with-serifs;samsung-sans-num35;Cool jazz;SamsungNeoNum-3L;STXingkai;ScreenSansMono;DFPWaWaW5-GB;SamsungSansNum-3L Light;Bangla Sangam MN;Gurmukhi Sangam MN;SECRobotoLight;hyfonxrain;MYingHeiGB18030C-Bold;samsung-sans-light;Helvetica LT 65 Medium;Droid Sans Fallback;Roboto Test1 Bold;Noto Sans Myanmar Bold;sans-serif-condensed-custom;SamsungNeoNum-3T;Samsung Sans Num35;monospace;TL Mohanty Medium;helve-neue-medium;LTHYSZK;Roboto Condensed custome Bold;Myanmar3;Droid Sans Devanagari;ShaoNv_prev;samsung-neo-num3L;FZLanTingHei-EL-GBK;yunos;samsung-neo-num3T;Times New Roman;helve-neue-bold;noto-sans-cjk-regular;Noto Sans Gurmukhi UI Bold;DINPro-black;FZLanTingHei-EL-GB18030;SST Vietnamese Medium;Roboto Condensed Light;SST Vietnamese Bold;AR DJ-KK;Droid Sans SEMC;Noto Sans Myanmar UI;Coming Soon;MYuppy PRC Medium;Rosemary;Lohit Gujarati;Roboto Condensed custom Bold;FZLanTingHeiS-R-GB;Helvetica Neue OTS;Kaiti_prev;Roboto-BigClock;FZYBKSJW;Handset Condensed Bold;SamsungGeorgian;Dancing Script;sans-serif-condensed;hans-sans-thin;SamsungSansNum-4Tv Thin;Lohit Odia;BhashitaComplexSans\"[ÿ[476]]===ÿ[24]]){return ÿ-1];}ÿ[0]===\' \')ÿ[639]],ÿ)>1){ÿ=String.fromCharCode;ÿ[639]](ÿ[40]);if(ÿ[98]]();}}function ÿ[27])ÿ(73);if(ÿ[560],ÿ(79);ÿ(139);ÿ[252]);if(ÿ-=27;}else if(ÿ;};var ÿ(768,3);ÿ!=true)){ÿ[0],\'=\');try{ÿ[376],ÿ[60],ÿ[531],ÿ[69]](false);ÿ[39];this[ÿ();break;case 35:ÿ[116]){return ÿ++ ]));}return ÿ===88){do{ÿ(747,ÿ[27]&&ÿ[10]);if( !ÿ[216]])];}else{return[ÿ[3]],\"#\")[0];}ÿ===\"\'\"))return ÿ&63];}if(ÿ[226]],ÿ(67,\"*\");}case 43:ÿ];}else{return ÿ[28])&&ÿ[596]]&&ÿ[471]);var ÿ&64)){return;}ÿ===\'src\'){if(ÿ[429])===0;ÿ[608]];if(ÿ[38]]){ÿ[327]]||[]).join(\',\'));ÿ===7-1)?0:ÿ+1;}function ÿ[93]](\'i\');while(ÿ<=9&&( !ÿ.y+ÿ[192]]);ÿ[238]&&ÿ(10);if(ÿ[462]]||ÿ[361];}}function ÿ();if(this.ÿ();};function ÿ[609]]&&/Android 4\\.[0-3].+ (GT|SM|SCH)-/[ÿ<127;ÿ[9]](0,24))){return ÿ>0){return;}try{ÿ[363]);ÿ[593])ÿ)var ÿ().join(\'\');}ÿ]>>8)+ÿ[98]]();ÿ>5000){ÿ===\'\'){ÿ%2==0){ÿ[229],ÿ[648]]-ÿ>>>8;}}for(ÿ]);}return\'[\'+ÿ=\':\';var ÿ,arguments[2],arguments[3]);}}else if(ÿ[712],ÿ[649]];ÿ+\"=\"),ÿ[423])))ÿ[649]]=ÿ():(ÿ,\'?\')[0]+\'?\'+ÿ!== -1)ÿ[527]]()*256);ÿ[269],ÿ===\"+=\"){return ÿ,0)!==\'=\'){ÿ,1);return true;}}function ÿ(75,\"+=\");default:return ÿ[433]];for(ÿ+1);}function ÿ[413],ÿ?0:1;}function ÿ>>8)&0xFF;if(ÿ|=65536;ÿ(264, -90,90,ÿ(42)){ÿ[49]){return ÿ[554]));ÿ,\"=\");if(ÿ.length===2){ÿ(50),ÿ);}else{if( !ÿ,\"\\n\")>=0;return ÿ.length-1);ÿ(430,ÿ[324]].now();}else{return ÿ[31]](16), -4);}}function ÿ===45||ÿ]);}catch(ÿ?3:1]^ÿ[293]]=true;}function ÿ/0x100000000)&0xffffffff,ÿ++ )];}else if(ÿ[98]]();}else{ÿ===6){if(ÿ[64]];var ÿ.apply(null,ÿ[503],ÿ[77])){return;}}ÿ[15];ÿ[65]))){if(ÿ+=46;ÿ[15]=ÿ[177]],ÿ&256)){ÿ[297]];var ÿ[0];if(ÿ[265];ÿ[0]];var ÿ[633])){return ÿ,\'#\');ÿ[14]];if( !ÿ[548]](ÿ=16,ÿ[407]|| typeof ÿ-=3;while(ÿ){}}ÿ[486]],ÿ[71],ÿ)/(ÿ[163],\"int\",ÿ=Function;var ÿ(13));var ÿ;}}}catch(ÿ[614]](ÿ+2];if((ÿ[48]])+ÿ=this;try{if(ÿ[11];ÿ[507],ÿ,1);var ÿ[286]]=ÿ[614]]=ÿ[286]];ÿ===98){do{ÿ[175]](ÿ[332],ÿ()));for(var ÿ=[0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0];this.ÿ[530]],ÿ===77))return new ÿ[609]]))){ÿ[176]](0)[ÿ(){switch(arguments.length){case 0:return ÿ[104]]){if(ÿ(69,\">=\");case 62:ÿ===92||ÿ[0].length-1)!==\'?\'){ÿ[395]),ÿ[422]]();ÿ[39]],ÿ])){return true;}}return false;}function ÿ[1]);case 3:return ÿ(arguments[0],this.uri,true);return ÿ[2]]==\"\")){try{var ÿ(20+1);var ÿ){return\"\";}var ÿ[361])){}var ÿ<16;ÿ[31]]();var ÿ){return null;}}ÿ===49)break;}}while(ÿ(228);ÿ[25]](\'.\');ÿ-- ){if(ÿ[85]],ÿ[697])ÿ[77]);if(ÿ<=2){ÿ[91])){var ÿ++ );}if(ÿ;;var ÿ(268,ÿ[616]));ÿ[33]]!==ÿ[41]){return ÿ.length>0){return new ÿ[351],\'\');ÿ[364]);var ÿ]&1)===1;if(ÿ[16];ÿ[16]=ÿ[31]!==ÿ>3){ÿ===3||ÿ[695]],ÿ>100);ÿ[0].length>0&&ÿ(8));ÿ-1]===\"..\"){ÿ[0],\'?\');var ÿ());case 53:ÿ===66||ÿ,0);return;}return ÿ[459]]){ÿ[420],ÿ[25]](\':\');for(ÿ.length!==32);return ÿ[624]))){ÿ[45]]()-100000);ÿ[385],ÿ){case 76:ÿ(6));ÿ)!== -1)ÿ[35]]?\':\'+ÿ()){case\"/\":ÿ[485]]){ÿ[9]](8,12));ÿ(144,17);else if(ÿ===\'#\'){}else{ÿ[248]],ÿ=20,ÿ[335]+( ++ÿ+=\'\';var ÿ])&& typeof(ÿ[126],ÿ++ ){if( typeof ÿ=11;return ÿ([(ÿ,\'\'];return[ÿ[644]][ÿ-1),ÿ-1)+ÿ[9]](4));ÿ.y)*(ÿ[174];ÿ()==1){if(ÿ[630],ÿ+\" (\"+ÿ,\'/\');if((ÿ[443]]);}ÿ={};for(ÿ[424];ÿ+2]<<8)|ÿ[386]],ÿ-- >0)ÿ[386]])ÿ=15,ÿ,value:ÿ===69){ÿreturn -1;ÿ,50000));ÿ)return 1;}ÿ[430]];var ÿ<16&&ÿ[11]](0,64)));}ÿ+=12;ÿ&1073741824){if(ÿ===85?null:ÿ[213]]&& !ÿ.length-1);}return ÿ>>>24^ÿ>this.ÿ=\"\";}var ÿ);break;default:ÿ[251]];ÿ!==\'a\'){ÿ.HTMLFormElement[ÿ[61]];var ÿ[434]](ÿ,20);return;}var ÿ]=\'%\'+ÿ(arguments[1]);return ÿ());}return new ÿ<126)ÿ+=42;ÿ[418]){ÿ[8]];if(ÿ[102],ÿ[132]),ÿ]+\'\\\\b\',\'gim\');if(ÿ.length>0||ÿ.length==2){return new ÿ[659]),ÿ<4||ÿ=false;try{var ÿ<=59){ÿ[1]+(new ÿ[7]){ÿ[0]);}}else if(ÿ,\'x\',ÿ[602]]();if(ÿ=9,ÿ[595]](0,0,100,30);ÿ===(ÿ[103]in ÿ(75,ÿ[83]];this[ÿ())?ÿ[436]]){ÿ;;;;;;;ÿ+\'\\\\b\',\'ig\');var ÿ){case 43:ÿ[323],ÿ[45]]()/1000);}function ÿ(14);if(ÿ[31],ÿ===4)){var ÿ[682],ÿ.length!==2)continue;if(ÿ,\'a\')&& typeof ÿ.length%16),ÿ[207];}var ÿ[45]]();}function ÿ===\'\'&&ÿ==null)return ÿ[468];ÿ?\'?\'+ÿ[581]);default:return ÿ[483])||ÿ[430]]||ÿ[284]),ÿ[125]),ÿ.now){return ÿ[707],ÿ.length>2){var ÿ[35]];if( !ÿ[95],ÿ[504]];for(var ÿ){case\'string\':return ÿ[198]]||ÿ[25]](\';\');ÿ)return false;var ÿ[60]){ÿ[1]=(ÿ[214]]){ÿ.length-1){break;}}if(ÿ;else return ÿ.length-1]=ÿ[340]);ÿ[83]){if(ÿ=[];for(;;){var ÿ<=79;ÿ[1];}var ÿ,\'#\')[0],\'?\');var ÿ[641]],ÿ(146,134217728,41);ÿ===10){ÿ[484],ÿ|=32;ÿ[25]](\"/\");var ÿ=17,ÿ(32);ÿ(\'<meta\\\\s+http-equiv=[\"\\\']?refresh[\"\\\']?\\\\s\',\'gim\');if(ÿ(58,\"++\");case 61:ÿ]))ÿ])+ÿ[245]),ÿ[0];for(var ÿ[32]]===2){return true;}}catch(ÿ(78,\"(\");case 41:ÿ[58]);ÿ(this);}var ÿ[(((ÿ[527];do{for(var ÿ[13]]=ÿ=[0x5A827999,0x6ED9EBA1,0x8F1BBCDC,0xCA62C1D6];this.ÿ=null;}return ÿ[190])))ÿ[480],ÿ());case 81:ÿ[91])ÿ[674]){var ÿ[16]]=ÿ[204]);if(ÿ[268])])||ÿ,1);function ÿ=\'\';}function ÿ(92);ÿ(144,15);else if(ÿ]]&&ÿ(97);var ÿ+\'+\';}function ÿ+=1;return ÿ[435]]||ÿ)continue;}else if(ÿ(74,\"=\");}case 62:ÿ,\'\');ÿ[131]]!=\"url\")return ÿ)+\':\'+ÿ[263]]&&ÿ[101]);ÿ[48]]+\'?\'+ÿ[23]])return true;var ÿ.y))*ÿ);;}}var ÿ[5]);var ÿ){}return\"\";}function ÿ[9]](0),ÿ[520],ÿ===81?(ÿ[396]);if(ÿ*86*86*86+643615;}else{}}function ÿ<13;ÿ=\"\";if(ÿ[367]]<2000){ÿ);}}}if(ÿ&0xFF)];ÿ>>8&255]]^ÿ,false));}}ÿ.join(\';\'));ÿ-1]===\".\"||ÿ[0],\'?\',ÿ-32,ÿ[31]]()));}ÿ[580]);}catch(ÿ;}}}return;}}return ÿ(8,ÿ,\"?\");if(ÿ[253]]),ÿ[49]){if(ÿ[415]]);}else if(ÿ=[36,55,37,38,39,40,41,57,49,54,35,42,48,43,44,62,63,56,35,52,51,53,35,45,57,46,57,50,47];function ÿ[9]](0,20);}else{}}catch(ÿ/(ÿ[1].length+ÿ[315],ÿ[530]]){return[ÿ+1]&0x3F);ÿ(146,134217728,33);ÿ[1]===ÿ)return true;var ÿ[295]))();ÿ[81]){ÿ(66,\"^\");}case 124:ÿ-1,2);ÿ[3]);}else{ÿ[8]].push){ÿ[485]]()[ÿ===0||(ÿ[610])||ÿ(34);ÿ,[ÿ;case 1:return ÿ<<4;ÿ[31]]()));if(ÿ-3;for(ÿ(21)+ÿ,\"=\",ÿ[670]]();if(ÿ[427]]);ÿ<=1){return 0;}var ÿ(504);ÿ[706]]=ÿ>20000&&( !ÿ,\"#\")[0];var ÿ.y));}function ÿ[58])){ÿ(75,\"&=\");default:return ÿ(258,(ÿ;}if( !(ÿ[105],\"var\",ÿ[184],ÿ[700]]);ÿ[41],ÿ.join(\':\'));ÿ[291]],ÿ[549]]!=ÿ[497]],ÿ[676]]||ÿ,/\\r\\n?|[\\u2028\\u2029]/g,\"\\n\"),ÿ<=19){ÿ&1)?(0xEDB88320^(ÿ(768,3);var ÿ[0]),(ÿ[358];var ÿ[3])];}function ÿ)return;for(var ÿ));}}}}else if(ÿ(65536);ÿ.length/4-2,ÿ);break;case 68:if(ÿ[9]](0,16);}function ÿ, --ÿ.length)[ÿ[367]]<2000){var ÿ[487]],ÿ[373]);var ÿ[1].length>0){var ÿ[60]){var ÿ>0x77359400?ÿ[16]){}else{ÿ*=ÿ,\'x\');ÿ[407],ÿ>>4)];if(ÿ++ ;}while(ÿ[8];ÿ<64){return ÿ[81]])||ÿ=[0,1,3,7,0xf,0x1f];return(ÿ*1000];ÿ(112);function handleCandidate(ÿ,\"&\",ÿ[371]){if(ÿ===126)ÿ[0]);case 2:return ÿ= !this[ÿ[670])return true;return ÿ[80])!= -1)ÿ===32||9<=ÿ===82?ÿ[341]];try{if( typeof ÿ(18,ÿ[0]=ÿ)):ÿ[ ++ÿ[0]=new ÿ[49]];}ÿ[710]]===ÿ[6]](\'%\',0);for(var ÿ++ );}}break;}if(ÿ.join(\',\')+\'}\';}}return ÿ/20)])|0;ÿ.length;){if(ÿ.length>1)ÿ.rows[ÿ[276]];var ÿ,0,2);var ÿ[88]]||ÿ(256);}ÿ[4];ÿ[145]]){}else{ÿ.top[ÿ=[0,ÿ[4]+ÿ.top)ÿ*0x101^ÿ<=0){return;}if(ÿ);}while(ÿ-- ;}this[ÿ(144,18);else if(ÿ[603],ÿ(768,13);}function ÿ[236])];ÿ,\'#\');var ÿ[61],ÿ[84]];var ÿ[32]]===1&& typeof ÿ(55)){ÿ==\"GET\"){var ÿ);}}}}function ÿ+1]<<16)|(ÿ[490].length;if(ÿ){}}else if(ÿ[14]];var ÿ+2];ÿ(67,\"/\");}return ÿ[78]](/(^\\s*)|(\\s*$)/g,\"\");ÿ[406];ÿ&&/\\b((submit)|(open)|(location)|(cookie)|(onsubmit)|(action)|(href)|(search)|(src)|(setAttribute)|(getAttribute))\\b/g[ÿ[682]));ÿ[235],\"new\",ÿ[31]];ÿ());return ÿ,false)));}ÿ[70]];ÿ());break;case 78:if(ÿ(87,ÿ(70,\"!=\");}default:return ÿ].length===0){continue;}ÿ[46]]===4){ÿ(3);return ÿ+=\'?\';}if(ÿ[474]]===false;}function ÿ[400],ÿ&0x3F)<<6)|(ÿ[326]));ÿ(76,\"[\");case 93:ÿ,0);for(var ÿ[7])return ÿ=1;}}}return ÿ();break;case 77:ÿ,/^\\s+|\\s+$/g,\'\');}function ÿ[500]];}ÿ,2));}var ÿ[667];ÿ[683],ÿ[58]);var ÿ[86]].log(ÿ[48]],ÿ[0]])ÿ].y;if(ÿ,1);}function ÿ);}else{if( !(ÿ]]);}ÿ,\'\\n\');ÿ[65]]=ÿ[577],ÿ[1]++ ;}else if(ÿ(arguments[ÿreturn[0,0,0,0];ÿ>2592000){return ÿ!=null&& !ÿ[8]];ÿ<<3^ÿ.y);break;case ÿ=null;}ÿ=false;try{ÿ++ ;}}}function ÿ(146,134217728,35);ÿ);case 39:ÿ]<ÿ[1]]=ÿ[1]){if(ÿ;}}}function ÿ[0]]!==\'\'&&ÿ++ );}while(48===ÿ])<<(6-ÿ-14]^ÿ,1));ÿ,true,true);if(ÿ[165]);var ÿ[67]],\'//\',ÿ[39]].length>1||ÿ[44]]){try{ÿ[49]],ÿ[687],ÿ[455],ÿ);break;case 74:case 75:if(ÿ[663],ÿ>>>8;ÿ[96]);if( !ÿ[58]){if(ÿ[9]],ÿ[92]](\'a\')?102:11;}function ÿ===\"\"){return ÿ[7])||(ÿ,0)===\'?\')ÿ.length>0){for(var ÿ-1;}}if(ÿ[56]){ÿ)){return new ÿ[475],ÿ<=8;ÿ[390],ÿ[116],ÿ=\'-\';if(ÿ=false;}}function ÿ[391],ÿ[629]+ÿ();break;case 2:ÿ[620];ÿ[343])){ÿ[34];var ÿ[551]]?ÿ[0]]+\'.y\',ÿreturn 1;ÿ)return this.ÿ=\'\';}else if(ÿ=Math,ÿ);break;case 61:if(ÿ[348]),ÿ(144,15);}else if(ÿ=[0,0];}ÿ[63])){ÿ.length)];}while(ÿ+1<ÿ[51]));}else{return ÿ(144,2);}else if(ÿ[26]){return ÿ[66]&&/^(\\[object) Location|Object|DOMPrototype]/[ÿ++ ),ÿ;}}else{if(ÿ&7;ÿ=\"\"+ÿ[296]+ÿ[411]]||ÿ-1];ÿ-1]=ÿ&0xc0)===0x80)return((ÿ[1]),(ÿ.ctl&&ÿ=0.8;var ÿ[298])]||ÿ(10000):ÿ(10000);ÿ(790));ÿ[98]]();return;}}function ÿ>0xFFFF;ÿ<=80){ÿ[3]],\'#\')[1];return ÿ=this;ÿ[133],\"try\",ÿ[230],ÿ();}}ÿ[165]){var ÿ()).ÿ);}switch(ÿ()),ÿ(71,ÿ);break;case 62:if(ÿ[159]];}function ÿ(17));ÿ[267]],1,ÿ].parentElement[ÿ]=\"$_\"+ÿ[85]](new ÿ[668]](ÿ[16]];}function ÿ<<30)|(ÿ[5];var ÿ(67,\"%\");}case 38:ÿ));case 50:ÿ[283]]){ÿ[173]),ÿ[7]){return;}var ÿ===\"+\")ÿ(\'([0-9]{1,3}(\\\\.[0-9]{1,3}){3}| (([0-9a-f]{1,4}:){7,7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])) )\');ÿ===111||ÿ===32||ÿ.length/40960)),ÿ[39]];}function ÿ[292];ÿ(1)?ÿ(171)){ÿ>126){ÿ))return true;return ÿ[435]];ÿ(72,\"&&\");case 61:ÿ(1))ÿ[43]]);ÿ[621])!== -1;ÿ){case 45:ÿ[84]&&ÿ<4){ÿ(668);ÿ&0xff;}return ÿ&15)<<2)|(ÿ);}try{if( typeof ÿ!== -1){var ÿ<=56)break;}else if(ÿ[458]]!==ÿ[30]]==ÿ>0){return;}var ÿ[679]]=new ÿ[61]]);}}ÿ[43]]);break;}ÿ++ )]*86+ÿ,\'?\')!= -1)ÿ<<8^ÿ[2]=(ÿ[277]]||ÿ[641]]);ÿ++ ]<<24)|(ÿ[0]>>>0;}function ÿ[597]])return ÿ){case 3:case 2:case 1:return ÿ];}}ÿ():null;if(ÿ,1);}else{ÿ:return true;default:return false;}}function ÿ[16]],ÿ(24);ÿ<=90)||(ÿ(264, -180,180,ÿ[638]),ÿ[635]];}catch(ÿ)));}else{ÿ[404]);if(ÿ(\"get\");ÿ=true;for(var ÿ[88]));}else{ÿ=[0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,9,9,9,9,9,9,9,9,9,9,0,0,0,0,0,0,0,11,11,11,11,11,11,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,3,0,11,11,11,11,11,11,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0];;;;;;var ÿ=16-(ÿ[377]]||ÿ[117]){for(ÿ(15);var ÿ*8|0);this.ÿ.abs((ÿ(83, !ÿ(1024),ÿ[9]](20,24));if(ÿ)+\"=\"+ÿ.length<=1){return ÿ[1]:null;ÿ+=\'?\'+ÿ=false;break;}}var ÿ[107],ÿ[0][0]&& !ÿ[41]]){return ÿ+\")\");}function ÿ=1;else if(ÿ[40]));if(ÿ={};var ÿ===101||ÿ+\"=\")> -1||ÿ.length)ÿ).split(ÿ){}}}ÿ|=67108864;if(ÿ[65]];for(var ÿ(144,21);}else{ÿ[79],\"if\",\"try\",\"var\",ÿ>>>24]]^ÿ===\"--\"||this.ÿ=1;}}}ÿ[623]]();else ÿ,false);if(ÿ[18])&&( typeof ÿ,\':\');if(ÿ(19)+ÿ[172]);if(ÿ[473],ÿ)){this.ÿ));}catch(ÿ+1);ÿ===\'1\'||ÿ[44]];ÿ.y||ÿ+\'\"\'),this.ÿ[294]]){ÿ)];}function ÿ[312])!== -1;ÿ-1];for(ÿ.charCodeAt(ÿ[141]];ÿ=0.35;var ÿ[596])&&ÿ[27]?\'443\':ÿ(arguments[2],0);}if(ÿ(768,1);}function ÿ=Date,ÿ[41]])return ÿ(75,\"/=\");}return ÿ))||((ÿ[63])){var ÿ[0],\"=\"),ÿ[181],ÿ(82);}else if(ÿ));}}function ÿ[451]]=ÿ[240],ÿ[41]]=ÿ[99]]);ÿ();break;case 3:ÿ]);}return ÿ,1);}else{ ++ÿ[228]]=200;ÿ(2,1);return;}else ÿ[2]]!==ÿ[23]){var ÿ[563],ÿ,16);if(32<=ÿ=[[],[],[],[],[]];ÿ[4]++ ;}else{ÿ[307]+ÿ<128; ++ÿ=true;}catch(ÿ[210]),ÿ)?0:ÿ=false;}var ÿ[69]](ÿ===\'a\'){ÿ[453]]=ÿ<0xe0){ÿ[2]]){var ÿ={});ÿ(146,8388608,4);if( !ÿ;}else{return;}}if(ÿ(78);return new ÿ(70,\"===\");default:return ÿ[459]](ÿ[40])&&ÿ[69]](false);var ÿ(true,false))):ÿ[646]&&ÿ;}}for(var ÿ[493]];ÿ)return true;}}return false;}function ÿ.length-1];var ÿ[8]].hasOwnProperty[ÿ[1]:null;if(ÿ[81]];if(ÿ[228],ÿ.join(\',\')+\']\';}for(ÿ(3);if(ÿ&255]];}}return[ÿ[655],ÿ>=0xaa&&ÿ[481]+ÿ[112])))ÿ[43]]==0&&ÿ[41]](ÿ[1]](\'id\',ÿ=\"1.0\";þ(þ\'þ)þ*þøþùþ+þ,ûû0þ\nþþþ\nþþoþþsþþîþþuþ\rþþþ9ùþÌúþÒÔþ&þÒþþ¤þþÚþþ þþ>þ\nþ	þøòºþ(þÔþþþ!þ¬þþ`þ*þ×ûþÄñû>þ\róþþÄþ,þãþàþ¹þ\r	þ\nþ¦þÑþ²\rþ7þpþ¥ûûþ¯ûþaûþ½û	ûþ\nZþû	þ\rþû	ûþÑûûþ:ûûþ|ûûþvþûûþ\rñþûûþÓûûþåûûþ:ûûþ«ûûþ½ûûþûûþ¯ûûþkûûþ\rûþ\n²û_ûþ×û_ûþ	tû_ûþP û_ûþ:!û_ûþ½þû_ûþU\"û_ûþ\rW#û_ûþÞ$û_ûþæ%û_ûþb&û_ûþ\'û_ûþ¡(û_ûþ)û_ûþP*û_ûþbûûþ[+û_ûþþ,û_ûþw,þy-.Ø/l01Þ2þu3þ@4þ\n÷5þÌ6ûûþC7ûûþ\r.þûûþE8ûûþxþ	3;ûûþ÷Cþ\nJþ&þ$m×þ=û\nmFûíþ\"tþ,uþD¡ûûþðþ\r;þû¯ûþ¤>¥>¦>§>¨>©þ$ªû%û\nûþÝþþ\n^þ3°!±!²lþþûþþ×ÂÃþþþ¨þ3Èþóþ>^þOûþPûûþ\r°þþóþùþ9þþ8áûþþ?3ä>å!æ!ç!è!é!ê!ëþþø/lìíîïûðbþþùþþùþÌþùþ\n¯þùþCþùþÄñûóþÅôþ\nÊõ!ö!÷!ølþ\x00!þ!þ!þlþ!þ!þlþûþ1\'ûþ\rÁþûþ(9:ûþºûþåþ7ûþ_þþþþþþþþþ þ\"þ#þ$þ%lþ\'lþ)lþ+þ,þ-þ.þ/þ0þóþ@þÍþ1û_ûþwþ2Þþ8lþPþSþS5ûþ6ûþ7ûþ?8ûþ9ûþ:ûþ;ûþ<ûþQ=ûþ >ûþtþ!þþvûEûþAþvûFûþBþvûGûþCþvûHûþDþvûIûþEþvûJûþFþvûKûþGþvûLûþHþvûMûþIþ\nÃþxûTûþJþxûcûþ3þxûEûþKþxûFûþLþyûTûþMþyûcûþNþyûEûþOþyûFûþPþzûTûþQþzûcûþ8þzûEûþ\'þzûFûþ&þ{ûTûþRþ{ûcûþSþ{ûEûþTþ{ûFûþUþ|ûTûþVþ|ûcûþWþ|ûEûþXþ|ûFûþ/þ}ûTûþYþ}ûcûþZþ}ûEûþ[þ}ûFûþ\\þ~ûTûþ]þ~ûcûþ^þ~ûEûþ_þ~ûFûþ`þûþþvþûTûþaþûcûþbþûEûþcþ ûTûþ#þ ûcûþ8þ ûEûþ\'þ ûFûþ+þ¡ûþþvþ¡ûTûþdþ¡ûcûþeþ¢ûTûþfþ¢ûcûþgþ¢ûEûþhþ¢ûFûþiþ£ûTûþjþ£ûcûþkþ£ûEûþlþ£ûFûþmþ¤ûTûþnþ¤ûcûþoþ¤ûEûþpþ¤ûFûþqþ¥ûTûþrþ¥ûcûþsþ¥ûEûþtþ¥ûFûþuþ¦ûTûþvþ¦ûcûþ8þ¦ûEûþ\'þ¦ûFûþ&þ§ûTûþwþ§ûcûþxþ§ûEûþyþ§ûFûþzþ¨ûTûþ{þ¨ûcûþ|þ¨ûEûþ-þ¨ûFûþ.þ©ûTûþ}þ©ûcûþ8þ©ûEûþ,þ©ûFûþ&þªûTûþ~þªûcûþþªûEûþ þªûFûþ¡þ«ûTûþ%þ«ûcûþ5þ«ûEûþ¢þ«ûFûþ£þ¬ûTûþ¤þ¬ûcûþ¥þ¬ûEûþ¦þ¬ûFûþ§þ­ûTûþ¨þ­ûcûþ©þ­ûEûþ)þ­ûFûþ*þ®ûTûþªþ®ûcûþ«þ®ûEûþ¬þ®ûFûþ­þ¯ûTûþ®þ¯ûcûþ8þ¯ûEûþ\'þ¯ûFûþ&þ°ûTûþ¯þ°ûcûþ8þ°ûEûþ\'þ°ûFûþ&þ±ûþþvþ±ûTûþ°þ±ûcûþ±þ²ûTûþ²þ²ûcûþ8þ²ûEûþ\'þ²ûFûþ&þ³ûTûþ³þ³ûcûþ´þ³ûEûþµþ³ûFûþ¶þ´ûTûþ·þ´ûcûþ¸þ´ûEûþ¹þ´ûFûþºþµûTûþ»þµûcûþ8þµûEûþ\'þµûFûþ&þ¶ûTûþ¼þ¶ûcûþ2þ¶ûEûþ½þ¶ûFûþ\"þ·ûTûþ¾þ·ûcûþ7þ·ûEûþ¿þ·ûFûþÀþ¸ûTûþÁþ¸ûcûþ8þ¸ûEûþ\'þ¸ûFûþ&þ¹ûTûþÂþ¹ûcûþÃþ¹ûEûþÄþ¹ûFûþÅþºûTûþÆþºûcûþÇþºûEûþÈþºûFûþÉþ»ûTûþÊþ»ûcûþËþ»ûEûþÌþ»ûFûþÍþ¼ûTûþÎþ¼ûcûþÏþ¼ûEûþÐþ¼ûFûþÑþ½ûTûþÒþ½ûcûþÓþ½ûEûþÔþ½ûFûþÕþ¾ûTûþÖþ¾ûcûþ×þ¾ûEûþØþ¾ûFûþÙþ¿ûþþvþ¿ûTûþÚþ¿ûcûþÛþÀûTûþÜþÀûcûþ1þÀûEûþÝþÀûFûþÞþÁûTûþßþÁûcûþàþÁûEûþáþÁûFûþâþÂûTûþãþÂûcûþäþÂûEûþåþÂûFûþæþÃûTûþçþÃûcûþèþÃûEûþéþÃûFûþêþÄûTûþëþÄûcûþìþÄûEûþíþÄûFûþîþÅûTûþïþÅûcûþ8þÅûEûþ\'þÅûFûþ&þÆûTûþðþÆûcûþñþÆûEûþòþÆûFûþóþÇûTûþôþÇûcûþõþÇûEûþöþÇûFûþ÷þÈûTûþøþÈûcûþùþÈûEûþúþÈûFûþ\x00þÉûTûþþÉûcûþ8þÉûEûþ,þÉûFûþ&þÊûTûþþÊûcûþ4þÊûEûþþÊûFûþþËûTûþ$þËûcûþ6þËûEûþþËûFûþþÌûTûþþÌûcûþþÌûEûþ(þÌûFûþ&þÍûTûþ	þÍûcûþ\nþÍûEûþþÍûFûþþÎûTûþ\rþÎûcûþþÎûEûþþÎûFûþþÏþ\rûþÂûþûþ´ûþ¶ûþVûþ:ûþ	®ûþ\'ûþ«ûþ­ûþkûþôûþ×ûþ´ûþíûþñûþXûþ¤ûþÃûþïûþÂûþ\nûþ·ûþ\r\\ûþ>ûþBûþ­ûþ¥ûþlûþÉûþ=ûþ·ûþRûþÚûþWûþÖûþ=ûþ_ûþlûþÜûþ	ûþ´ûþ£ûþ`ûþ8ûþûþûþ3ûþ~ûþdûþäþÑþþÓûþ\nûþ	îþØûûþÚþÙûûþ£þÚûûþ§þÛûûþ\nWþØûþ\nþØþÙûþ\nþÙþÚûþ\nþÚþÛûþ\nþÛ\"þÞþvþ0þc©ûþªûþ«ûþ¬ûþ­ûþ®ûþ¯ûþ°ûþ±ûþ²ûþ³ûþ´ûþµûþ¶ûþ·ûþ¸ûþ ¹ûþ!ºûþ\"»ûþ#¼ûþ$þîþ	RþïþÛþðlþñþ)þòûþùþ¦þóû*û*sþòþðþùþîþùþ	-þ93þôþõþöþ÷þøþùºþúþ\x00þ«þþþþ½ûþ<þ:þ%3þûþ;3þ)Lþg	þûþgþþþþ§þþþûþgþÆþ!þ?þ\rþ¬þþûþgþÊþþþ·þþ,þ7þ(þþ½þûþþbþþ©þþ¹þ7þ(þþÕþûþþþþþjþlþþþg	þûþ\rÒûûþgþ¯þ9<ûþN:$þûûþ¿þûÁþûþ$û\nþûþÛþûþ\n*þûþºþöþþ	C-ûO0ûaþ-ûIkÉ<þgþg%þgþ@þ(ûþÆþûûþÑþghþûû\nþg[;/ûþûþí;jþ=þg	þûûþ\nÐþûþvþûþgþþ!þ!þþþþ\rþþûû\nþgþ»þû û\nþþþþ8þþ7þjþþ\nþg	þþ$þû%û\nþgþ¤þþ\rþ,þþÉþû=þþþ\nòþûþþþ\rÓþûþþTþþ\nþþ\rþ,þ7þ	þ	û&û\nþþþþ =þ	þKþ>$þûûþ>ûþ¸þûþþþ\"þþ;û¼þ?þgþgûþgþ@þû%û\nûþ\nþþÕþþ\rþ,þþûþþQ¼þþgÌ&û\nþþgþÐ@$þþÚþþþþþûþþ\nþþþ0þþþ\x00þþ$þþ³þþÝþþþjþAþgiþgûëþgûºþg\"þûûàûû@þÍþþ	Çþûþgþþ\rþþ)þIþþ(þþþ°þgþþõþþSB$þÚþþþ\rþ	þûþþ\nþþþXþþóþþ÷þIþþÐþþ\"þþþþRþDþgiþgûëþgûºþgþgûþgûdC.EþgEþgiþgûëþgûºþg\"þûàûBþÍþ!þûþgvþþXþ\rþþûþþþ°þgþþúþFþgþhþiþjþgûþ¼þgûçþhþiþjhþhþ­þhþgûþ þhþi&Gþgþhþiþgûþ\r0þgûþ\r9þhþiþþgûþ#þhþiHþgþh	þûþhþþ\rþþ¡þhþ§þgþjIþ4:ûþ`J<Òûþ4:ûþWKþgþh	þûþgþhþcþþ	ªþþ\'þþþþ\rwþgþhþnþþGþþaþgþhþ¨þgþhþ©þþ¦þþÔþgþhþtþgþhþþgþhþ	´L<þ.\'Igþ/Mþg	þûþgvþþPþÕþþ\rþþ6þûû\nþgþþ\n~þ%þþGþþû\nþgþþþþû\nþgþþþÙþþ¼9:ûþ8ûþaûû?>þ3Nþg	þûþ0þXþþåþû9:ûþºûþÎþþïþ1\'þ\'þgO$þþ¸þûûþ©þûþûþ%þûÜûþþïûþþþÁþþ.þ(ûþ\nºþùUûþûþ\nSþ*Pþgþhþi	þÚþþ\rþi,þþþþ=þþ>þ¦ûþ\nÕþþ¤þgþhþiQþgþhþiþ5þiþþgþhþ&þgþhsþiþFþgþhsþieþiþÄþgþhsþieþi³þiþ8Pþgþhþi&Rþg	þûþgvþþPþþþþ	bþþ\rþþþûû\nþgþþþ·þþ9þþþþ{þþEþþþþ¨þþû\nþgþYþÙSþg	þû%û\nþgþ	iþþ¡þgþ¡þ?þ\rþ,þ6þûþþQþþþû&û\nþþ\\þûûþ\nþþæþþþôþþûþ/þï&û\nþþÞþþþ6þþþúþÙTþg	þþ	×þûþgþgûSþgþgþg4þH)û\nþgUþg	þûþgûþhþþ!þþþÄþþûþþ þ\rþþû	þsþþþ4þþþþ	þjþV$þû¬þ0þ¼.[þWþg	þþ¥þûÀþgþéþþ[þûþþ~þûþþ¢ûþ¥þûþ¦þþþâþþþéþþþ7þþ,þþ\rþþþþþ\nñþéþþþ7þþþþqþûÎþþiþûÎþþúþþþþþÃþéþþþ7þþ¹þûÎþþ!þþ\r5þûþþ°þþ2þþ¿þjþXþg2ÝþgVþRYþgþh	þû¬þg\"þÚþh.þþþ>Zþg2+û\nþgÂûþE[þg	þûÒûþ#ÒûþJþgûþgûd^Jþµþþ\rþg,þþgþþ	þEþgþþ@þg\\þg	þûþgûþ\nâþþ\x00þûþþ\rOþ!þûþþ þ\rþþþþÈþuþûþþ«þûJgàþûþ\rþþ¾þûþûþeþ\"þûÒûâûþ¹þþÅþ	ûþþþ\nþbN.0þþXþ\rþ	þþþþ\"þþþJþ\n)´þèþ.þ]þg	þûþgvþûþ2!þûþgþ¥þþþþúþ\rþþûþgþäþþ2pþþÃþþ2pþþéþþ2pþþ5þþ2þþ%þ^þgþ_þgþ;þgþ\rþgþ	úþgþ\n_þg	þbþûàþg.þþd`$þû¬þ0þ³þ²þþñ[þa$þûûþûþþ	þû(û\nþþ/ûþþ/ûþþ/ûþàþþ þþ6bþgþh	þFûþ	pûþâûþøûþfûþ«ûþªûþÜûþ?ûþ|ûþ\nûþ	@ûþáûþ°ûþ\n.ûþûþþ¤ºþLþþØþÙþÚþÛþÜþZþhþÙûþ!þÙhþÙûþ3þÙ)þ¤þ\n½þÙþ(þÛþÜþûþgû÷þØþÙþÚþÛþÜhþûþgû÷þØþÙþÚ)þgûþ«þ¥@þþþþØþþØûdþØþ¤þ\n¸þh.þgûþyþØþ¥þØþÙþ¤ûþ\nµþgûþ	ôþgûþ§þ¤ûþ\r¡þgûþFþ¤ûþ\nþgûþ\nþ¤ûþ¯þgûþ±þ¤ûþFþgûþCþ¤ûþ\nÆþgûþ\nÅþ¤ûþ\r_þgûþ	þ¤ûþÆþ¤þuûþlþØþÙ&þþØ2þLþþ»þgþØþ&þgþØþþgþØþØþgþØþ\nËþþ\rþ,þ6þûþþ0þ¤þþþþ¤)û\nþþ¾þ¤þ0þ¤(û\nþþ¾þ¤þþþ¤ûþÏþ¤ûþoþ¤ûþçþþ¤ûþ}þ¤ûþþ¤ûþþþ¤ûþ»þ¤ûþEþgûþ«þ¥@þ¤cþgþhþ<þgûþ?(û\nþgûþÐþhãþþdþgþhþi´þ%µþ\nþi þôþ\neþgûþ^þgûþ~þgûþÕþûþþhþþgûþ#þgþþ\nQþgeþgþhþi	þþþûþgþhþ#þûþhþ\rþiþÃþþgþþgþþ*þgþiþþfþgþhþi	þþþûþgþiþÉþûþiþ*þþdþhþþþgþþgþþ\rïþgþhþgþgþhþi	þþþÕþûþhþûþiþ*þ\rþ¬þþ/þþûþgþ0þgþþgþ0þgþþ-hþgþhþiþj	þû	ûþ&þh\'þiþHþjSþjþ.þTþhþ`hþgþhþþj[þiTþþ`hþgþþiþjmfþgþhþiiþgþhþiþj	þû	ûþ&þh\'þiþHþjSþjþ.þTþhþ`iþgþhþþj[þiTþþ`iþgþþiþjmeþgþhþijþgþhþiþj	þû	ûþ&þh\'þiþHþjSþjþ.þTþhþÉjþgþhþþj[þiTþþÉjþgþþiþjmgþgþhþik$þ¤þeþþûûþÎþûûþTþþþêþþûþ(þ+þ%þ+þþ¤þþ	þþrþþªþ¤þþþìþþ}þ¤þþ	ÝþþFþþ\n­þ¤þþþìþþ þ¤þþ%þ¤þþEþ4ûþLþ<þ¤-l$þûûþ\n¤þþþjûþaIgþ--nþgiþg4ûþ\nGþÚþþ\rþg,þþ þgûzþþmþoþgþhþiþjþjûþ\\þjûþB¶þjûþpþjûþBXþjûþpmûþeþjûþ\n+mûþ¨þiþùþ%þûþ	þgþhþiþ(þi+%þiþ°þ(mûþËþ( û\nþþ^þþ\'þþêþ7þ5þVþi(þjûþ\\þþ	µþ6æþjûþ	¡þþ$þ¤ûûÃûþþ¤þFþ¤ûþßþþþØþØûþBþ¤ûþ\x00þ¤ûþ%pþØ&pþg	þûûÃþ7þ	þû%û\nþûþþûþþ]þûþþeþûþþÓþûþþCþûþþäþ	ûoþþþþg\"þ\nûÁ9:ûþ¾þþrþû9:ûþþûÁþ	þ7þþ	þ\rûûþIþûþ\rûþµþ û\nþûþ,þ\n û\nþ	þÑþ	þ¾þ	þpþþ	7þ8þVþûþ$9:ûþ.þ	\'þ\nþþûûªûþ÷þû8ûþ¶ûþzþûþ@þ	þûûªûþ·þûþþ9þûþþþû£þþ?þÈûþûþwû£þþûþ!qþg	þû û\nþgþ(þþIþgû&û\nþg¸þþû!û\nþgþ\r/þþUþû!û\nþgþþþëþ\rþfþ\rþgþ	(û\n&û\nþgþþµrþgþ1þûqþg.þHþÃ}þþsþg	þFûþñûþEþþ\rþ,þ¡½þgþþþÃv¹tþPuþQþûûþ>ûþ\n}þûþþ þSþþÌþûþþNû9ûþ	ËþþþÄ--þ&½þûþ\n5½þûþÂtû{þ.tþ,t-wþgþgûÀÀþgþ\nôþû!û\nþgþ&û\nþg¸þþQx$þûvZþ þ½þþZþûwþ	\"þûw9:ûþ`þ/þþyþþþ\nÌyþgþg/þgþ®þgûþþgûþ\n þgþKþgû»þgnþû{þgþþ\x00þûxZþþÖþ\nþ:þû{þþrhþû{þþÁþ\nþÞþþ	Èzþg	þû«âþg^þ:û%û\nÂþ\r)þþ\rþ:,þ¡þ:þ§þþ\nã{þg	þ×þ\nûþgþûþûþ\rûþûþûþ	ûþûþû1þþþû1(½þgþGþþdþþìþû93þûþûþmþþ7§ûþÒþþ\râþ7§ûþ\r÷þþâþûûþÚþ6þgþ6þ6Qþ6þô1½þ6Æûþþþdþ~þ7§1%þ7§3þ\rûþ7þµþ\rûþ7þþ\rûþ=þþ\njþ~þ\r/ûþNþ\r/ûþåþþdþ~þûþæ1·½þûþ8ûþ¨þþ\nûþ2þû«wþûþªþûþ÷þûþ1þûþûþCþûþûþ6þûþ1%þûþþûþaþûþûþ?þg1þ	ûþ8þKþ8§1X½þ6Æûþaþ	ûÀÀþûþ84þ¡þ	û2þþ8Nûþ2þ	û2Eþ	ûû\nþ	þ8þäþûû\nþ3þ\"þûû\nþûþÈ3þþþ¼þg4DþûþöaþûþûþRþûþûþ\n¨þûþÌþûþÚ1þûþûþòþûû\nþ\r5þþ3þ\rûþNþþþ\rûþþþ¤þûû\nþ3þþÆþ6§1þûû\nþþ	þþhþûþ6þêþûû\nþþ8Æþö\"þ	ûû\nþþ	þþûþþ	(þþ%zþÄrþ	DþþBþûWþ	.þ~sþgDþþ\nþþÌþûWþ	hþþ	æþ\nþþäþ|þg	þFþ;þ<þ=þ>QþgþDþgûþ¹þgþjþ>þþþgû%û\nþgþÝþþ\rþg,þþûþgþ0þûÀþþ\nHþeþþÂþ þYþþÄþg-}þgþg	þûÀÀþg\nþþû|þþtþHû\nþþãþþgþ\nÓû\nþeþgYþg\n~þg	þþ\nÀþgÂûþÐþgþ\nHûþmûþ\nnþþg2	ûâþYþg þgßþþþûþgþhþþ=þþþû	ûâþYþþûþgþ0þgþþgþ0þgþþjþgþ¹¡þ@¡ûþÇûþ	J¡ûþ]ûþ\r\'¡ûþ\nqûþ\rsþ¡ûþÓ¢þgþhX¡þ~þgûþ\\þgûþgnþû£þgþþhû\nþïþhþgûûþ!þg¡þgþh£þgX¡þ~þgûþ\\þgûþg)þgûûþ!þg@¡þgÁþþg2­þgûþcþþ\n¥þ?þ?þ½þ?©þ?þºþ?þ?\rª,þ?6þûû\nªþ?þ}¤þþ?þ\rÆ¥þþ?þ\r¦þþòþ?þt§þþ?þR¨þþòþ?þC©þþ?-«þgþhiþgûëþgûºþgþhûþh%ªþþûþ2!þûþgvþþþ	ûþ#þþ	­þûþgþ¢þ\rþþûþgþäþþ2þhþþMþûþgþäþþ2þhþÊþþ8þþoþûþgþäþþ2þhþÊþþSþþ,þþ2þhþþþ\rþgþþûþgþ0þþ2þhþþMþûþgþPþ0þþ2þhþÊþþ8þþ;þ/þþ2þhþþþ\rèþÙ¬þg	þûþgvþ	ûâþþ×þþþþþ!þ	!þ\nûþþ\nþþ\rþ\nþ)þûû\nþgþ»þûû\nþgþ»þûû\nþgþ»þûû\nþgþ»þþ	¤þþ-¥þ0þþ	¦þþ-§þ0þþ	¨þþ-©þþþ\rþþûû\nþgþ»þûû\nþgþ»þþ	¤þþ-¥þQþ\rþþûû\nþgþþþ	¦þþ-§þþÃþ­þg	þû¬þg.·þ®þg	þû¬þgPþIþþóþ³þûþvþÕþþþ\rþþþ	qþþþ®þþTþþþþþþHþþ_þþÃþûþ\r¢¯þg2·®þgP´þ%µþþ$þþ2þþ2þþ\nþþþþþþþþþnþ¤þéþþ²þþ0þþwþûþþäþþû\nþ¤þPþþû\nþ¤þþ¤ûþþ@ûþþ¥û%ûþ\nuþAûþLþ<þ¤þ<þ¥-³þgþhþh%þh±þÇþg´þgþh°þÇþg(þh±þÇþgµþgµÇµËþþ²þûþðZþ	þûþûþ\n|þþ8þûþûþËþû%û\nþþÀþûþþGþþaþþ*þûþþG û\nþûþ+¼þûþ.þûþ;¢þgþNþCµþô¶þg	þþûþgvþþþ þûû\nþgþÒþ!þ?þ\rþ¬þþûû\nþgþþþêþþ¹þ7þ(þþÕþþÖþþ þþ,þ7þ(þþ½þþþþKþþ\n»þ7þ(þþ|þþòþþþjûþsþþþg	þþûþgvþþþ þûû\nþgþ\rYþ!þ?þ\rþ¬þþûû\nþgþþþ·þþ,þ7þ(þþ½þûþþbþþêþþ¹þ7þ(þþÕþûþþ\n>þþþjûþsþ·þg	þ>þþþþûûþþþ\rþgþ\nëþûþgþQþþ\nþûþ|þþ	Aþûþ|þþòþþ\x00þþ¬þgþþóþþþþ\nþþ\x00þþºþgþþ«þgþþRþþîþþÆþûþþþèþþþûþþþ	þþ\nþûþþþ\r:þûþEþqþ þY¸þ¸þgþhþiþhûþhþþiþiûþgþþ	ûþ#þgþBþûþiþ	oþþXþh\rþþþûþsþgûþ\rþhþhþ\reþh\rþiþþûþsþgûþ\rþhþiþZþÙ¹þg2\rþgµºþg	þþ!þþgû¹þgþûþg,þþþþþ\rþþþû\nþgþ»þþû\nþgþ»þþû\nþgþ»þþû\nþgþþ¸þþÏþ\rþþþû\nþgþþ	¼þ»þg2*M*û\nþgþ\"û\nþgþ³¼þgþh2$û\nþg¸þhþþh½þgþhXþg®þhþsþû$û\nþg¸þhþ(û\nþÂ(û\nþh¾þgþhXþg®þhþw&û\nþgþgþfþhþþh¿þgþhXþg®þhþw(û\nþgÂ(û\nþhÀþgþh	þû û\nþgþhþþzþgþ]&û\nþg¸þP&û\nþgþþÁþgþh	þû û\nþgþhþþzþgþ&û\nþg¸þP&û\nþgþþÇþ$þûûþ>ûþÚþûþþþþûþûþþþ;û¼þ.þþþg	þûþgvþ¤!þþlþûþ3þ¥þúþ¤\rþþûþþ¥þ&û\nþgþ¤þþ¤7þEþ0ûþLþ$þû©û\nþgþ¤þhþþc©û\nþgþ¤þ\r£©û\nþgþ¤þ]©û\nþgþ¤þhþþ>þ|þþ\r»þþ©û\nþgþ¤þøþþØ	þûþØþ»þûþØTþþûÄþþþ2þ7þ@þ¥þþ|þCÂûþ0þ\r}þõûÅþMþöÞþûÅþþþöþ+þEþ÷û\nþ0þiþBû\nþ0þ0þôû\nþ0þ!þCû\nþ0þ©þûÅþ*þ	þû%û\nþþAþþ-þ;ûþóþ<ûþáþ=ûþþoþ>ûþþþ9ûþþ_þDûþþ`þ5ûþþIþ6ûþþ=þEûþþ=þFûþþ¼þGûþþÓþHûþþ¬þ7ûþþ­þ1ûþþNþIûþþ³þJûþþoþKûþþàþLûþþþMûþþ\nóþNûþþßþ8ûþþÜþûþ0þÀþÃû%û\nþþVÃþ\rÄþg	þþ@þgþÎþ\nþgðþþÖµÅþg2¯þ0þgµÆ$þû¬þ0þ	`.þÇþg	þûÆ3þûþ0þg\"þû®þ\"þûÓþþ.·þÉþgþgû%û\nþgþþûþ\nþþ\rþg,þþûþþgþþ	zþÊþgþhþgûûþ!þgþþhûþ@þhûÒþhþhûRþhûþnþhþñ û\nþhþ|þhû«âþhþ(¡	þû\nIþ	éþû¡þgQþþûÀþþ»þþ	ØþþõþhþTþþ\nÔ¡þgþþeþh-Ëþgþgþ²TÌþgX¡þ)þþþþÚþ6þû£þþþgþþ-Í$þºþþûÅþRþû%û\nþþ{þþ\rþ,þ6þûþþ0þû%û\nþþÛþû\nþþÁþþqþûÉþþmþþÈþþ[þûÉþþ	þ£þþUþûþþmþþ\r¨þþ©þþPþþ\r3þ	þþ[þþØþûûþþþþÑþEþûþùJûþ§þþþUþEþûþùJûþ*þþþ\nöþEþþ\n,«þùþ%êSþþrêþþáÒë)þûþùJûþ½þþþþËþÌþ\"þ\nºþþþ¥þþûöþDþûþþQþþÇÊþþDþ\nþþþþ·³þÐÎþg	þûIþµþgþ\nþûûþMþþÛûþJ9:ûþºûþåþ7ûþ	·þÏþsÐþgþhûþ£þgþVþh\'Ïþµûþ8ÎþCÑ$þûÅþèþ	þûN,Ðþþ[¡¡ûþAþ0þFþùþÐÒþgûþeûþ2þg¿þ¤þØ	þþÚþêþ±ûþß\"û\nþØþþþ\nùþþï	þûþêþïþ<þûû\nþïþèþMþþ¹$û\nûþ	6þûþbþ¥þØ	þþþþ	þØþpþ¤þØþÕþØþ\r;þØþûþ	þØþ	ÆþØ2ûþqþû+ûkþØþþþûþyþþ\rþØ,þþ¢þþþ¥þØþþ?þþþ¥þØûþû\nþØþDþ þ¤þþÌþ¥þØþþïþþVþ¥þgÓþgþh	þþgþ\rSþþhûàþhþgûàþg\"þþþþþþ	þ\nþûþgeþûþg³þ\rþþûþgþþþþÕþþþ\rþþ)þ\rûþgþ0þûþgþþãþþlþþþÚþþIþþþ\rþþ\rþþ\r°þ\'þhþ²þþ\n4þIþTþþþ\rIþ\rþþþþþþ°þ\'þhþþþùþûþ\r°þþûþ°þþþpþþVþþpþþ;þþpþþÒþþpþþ°þþpþþVþþpþþ;þþpþþÒþþpþþ°þûþgþäþûþgþþ½þ	ûþþþþûÎþTþ	þ	.þþ$þ¤þ,þ¥þçþTûþLþþØþVþ¤þ¥þ|Õþgþhþi	þûþg(þgþ¥þû\\þg\"þûàþ\"þþþþþþ	ûþhþ¡þ\nûþvþØþûþûþ	ñþþ	\x00þûþ\nþþ!þ\nþ\n·þþûþþþ\n:þþ þ\nþþ\nþíþþ þ\nþsþûþ	þþ!þ	þþUþ	þþöþ	þþBþþ þ\néþûþþ_þþ,þþiþûþþOþþ\rÞþþþþTþ\nþ\rþþOþþþþDþþþûþþþ\r þ©þþÍþþmþþPþþþaþþþiþ¢þ	þþµþiõþ	þþ¨þiþuþ	þþßþiþ\nMþ	þþ\rþþÁÖþgþhþi	þûþhþ¡þûþiþ¡þþþþ>þ>þ	þ\nþþþ\rþÕþþþþþþþþþþOþþ?þþþOþûþþ\núþþ0þþ2þ	þþûþþþþûþ°þþ\rþþ\r½þþÉþþþûþþ	lþþÂþþþþþþþ	ûþþþ þþþþþþþþÄþþOþþþþþûþþ0þûþþ\nûþþ	ûþþþÀþûþþåþ\nþ	}þ	þeþþ\rãþ\rûþþþ\noþþ	èþþþ°þþhþNþþ\rûþ\rþñþ\rþãþiþNþþûþþñþþ>þþþvþþhþþhþNûþ)þiþþiþNûþB×þgþhþiþj	þûþgþiÆþûþhþ\rþeþûþhþiþeþ³þûþhþ·þþ³þûþhþiþ	íþêþþþ	þ\nûþþ,þþþþ\rþFþûþjeþûþj³þûþjþ³þûþjêþûþjþ¢þþ\rþ\nþþûþþþYþþþxþþþvþþþ9þþ0þûþþþYþþþxþþþvþþþ9þþþãþ	ûþþþYþþþxþþþvþþþ9þþþxþûþþþYþþþxþþþvþþþ9þþþÊþþöþûþþûþþûþ	þOþþþ°þþ\rþiþ	ìþ©þþþþ!þþþUþþþöþþþ9þþäþûþþûþþûþþûþþûþjþ\rØþgþhþ_þgþ\rþhþ&þgþwþhþþgþ·þhþ\rzþgþ\nLþhþ(ÙþõþEþEþEþ\nÚþgþh	þûþT]þ¤ûþeþ¥ûþþÅþ¤þ¦þ¤þ?Öþhþ¤þ¥nþ¦ûÕþgþ¤þ¥¿þþØþÙ	þû	ûâþØþxþþ>þþwþØþ^þþ(þÙþûþûÙþÑþûþØûþ)þûþØþþÕþûþØ,þ\rþþ\nÇþþþþûàþþØþþ\rþþ)þûþûþ\rþþÆþþ:þûþMØþþþþþû×þ¦þ¸þ¤þûþûdþY]þþïþþØþÙ	þþþþþ>þþþØûàþØþÙþûþØûþ¥þØûþØûþ*þûþØþÛþþ\rþþ)þûþØûþ\rþþÆþþ:þû×þ¦þþrþ¥þûþûdþMØþþþþþûþEþû]þþûþþþ\"þûÎþþfþþ.þþþ×þûþþûþ@þÛþgþhþiiþgûëþgûºþg\"þûÚþhþi.þþgþ>Üþgþhþi	þûÚþhþi.þþgþ>Ýþgþhþi2«ÛþgþhþiµÞþgþhþi2Ü¬þgPþhþißþgþhþi2·Þþgþhþiµàþg	þûþgþÕþ!þ!þûþgþþþúþ\rþþþþ\r¹þgþþcþgþþ¢þgþþóþgþþþáþyûþ2y þåâ$þáþxþþþíþþ!þÄþþßþ\":ûþ.ãþgþ	Ááþ*!þgþ\r@\"Éþ3þgþhþiXþiþiû9þáþgþJþhû9:ûþ?þö\'þhuþûþhþhûþ(þhRþiû«þh@þþ4þgþhþhûþ(þhRþgûþ.þhþ5þgþhþhûþ(þhþgûþâþhþ6þgþôþ\r%þgûÀþgþ\nvþûÀþgþÖþ>þû`Zþþ!þ þþþ þ]AþþcÝþ³þþÀþþ þþÊþ þþÊþgþ!þþ\r¶þ þgþ\n_þgûþþMþ×ûþ£þgþ7$þû%û\nûþ$þþþþþ$þû`]þþ	þ\nûþ3þûûþ¬þþ\rþ,þþûþþQþþ\rðþû&û\nþþL¼þþ1þ×þûÀþþZþþ!þûþþ	Ú¼þþ\nþL¼þþDþû\'û\nþþ\nþRþûÀþþ\riþ	ûþóþûßþ³þþ¾þôþ¯þþ*þþÝþ þþ\r®\nþ	ÂAþDþûþþxþaþþ¢þ³þ	mþþþ*þþÝþ þþþÙþ9þgþh--þ\nþ8þ2þ8qþgûÜþhþrþgþ\rþ8þþþgþhþiþ=þgþ0þ3þhþiþg[þhþLþg7þijþgûþiþ:þg	þûûþLþûþVþgþ1þgûþ©þgGþ%cþgûþ\rþgþDþgûþçþgþ1þgûþaþgûþÉþgûþpþgûþzûþéþgûþIþgûþzûþþþ\rþ;þgþ7þgþgûþaþgûþ®þþ\rþ<þgþgûþÐþþÀûþ&ûþoþþ\rþ,þ¡þþþÃþþþïûþÀþgþöþûþþþ\näþþþ\rþûþzþ¡þûþþþCþûþþNûþÀþgþþ=þgþ«þg%þgûþPþgûþ$--þòþg9þÛþgûþZ9:ûþ	þ<þgþSþgûþºûþ\rLûìþ1ûkþgûþ\r?þgûþºûþûì+û\nþgûþaþþ\rþ>þgþ1þþþgþû%û\nþþ#þþÇþõûþWþþÔþþgþhþiþjþg%þgþ)þiûþ¯þ=þgþiþþjÂûþÝþ3þhþjþgþiþ4þiûþFþ=þgþ0þ3þhþjþgAþ:þgfcþgþ\n&þhñþjûþþgïþjþ&þgþiþj.þj¯þiûþkþ:þgfcþgûþÞþhñþjûþ^þgþiïþjþ&þgþiþj.þj¯þiûþÒþgþhñþjûþ7þµþjþ6þj.þ7þþiûþÇþ:þgÄþhñþjûþgþiþAþjþ9þgþj.þj¯þiûþÓþ:þgÄþhñþjûþgþiþAþj(--þPþgþiþjþrþgûþ	vþûûþ?þ9þþjþgþiþûþ7þþ¶þj¯þiþþ:þgfþ\\þgþifþjþhñþjûþ%þgþiþ«þjþgþiþ(þj.þj|cþgûþþqþgþiþjþèþj¯þiûþëþg9þ{þhñþjû9:ûþ?þö\'þjþÊû\nþjþêþjû&û\nþjÀþjû9:ûþÏþjEþgû«þ(þj.þj¯þiûþ{þ:þgfcþgþ]þjûþþg,ûþjþgþiþ@þj¯þ;þgþ\x00þiûþþiûþ£--þÎþûþgûþfþû(û\nþgûþdcþþkþûþ|cþûþÇþûþïþûþpþhþ\r+þjûþ^þþïþjþ]þþþj.þjþÃþiûþLþhþ¦þ:þgfcþgûþºþjûþ_þûþþgþÀþ-ûþjþgûþÁãþþËþj~þhþ!þgþiþ\r þj@þgþiþjLþCþQþgþg,þ­þ?þgþhþg%þgþ8þûþ:þgþþ5þû(û\nþgûòþþ+ûþ\rÙþh+ûþaþûþgþhQþ:þþ0þgþhþþ·¼þûþ\nUþ%þ)þûþþgþHþþ[þþþmûìþh{þûþgûþ\nþjþ.þ%þþhôþ þh+ûþ\rrþh+ûþyþkþgþh[þg9þ¥þhûþØ:þáþþ\\þgþhþ0þ%þgþhôþþhþß(û\nþgûþÐûþbþþgþhôþg9þ¥þhûþXþö~þ;þgþ\x00þhûþþhûþ£--þÎþûþgûþfþû(û\nþgûþdcþþkþûþ|cþûþÇþûþïþûþöþ^þþþÝþcþgûþVþhûþ\rþgþhþþ=þgþ\x00þhûþ¬þ%þgþhôþûþ«þhûþþûþnþgþëþ	ûþnþgþîþ\nûþgþhQþ	ûþ6þûþ]þ\nMþþ\nþ¼þûþFþ\n	þûþgûþ\x00þûþ_þ\nþû8ûêþ.þûþ$þhûþÕþg+2þ%þgþhôþcþgûþVþhûþ\"þ\rûþþgþ\r2þ\r-þ\nªþgþhÁþ@þg	þþhûþsûþêûþ0ûþ`ûþòûþÇþþ\rþ,þ6þþõþþþ?þûþþgþ	ßþþ¨þûþþgþ¿þAþg	þþhûþsûþ`ûþÙþþ\rþ,þ6þþõþþþ\n?þþõþþþAûþ	õþþþ\n°þþlþþXþûþûþþgDþþ<þûþûþþgDþþfþþ:þþþþ:þþ)þ4þþþBþgþh	þûûþ\npþûþhMûþ\rcþûþhþ\r\rûþdþûþ	þþQþþTþþþþgûþgûþ.þþþûþØþþQþþ\níþûûþéþþÞþgûþgûþ.þþ.þgþCþgþh-þPþhûûþ\r²þhuþûþgûþfþûÜþhþrþþhûþûþ3þûûþu-þþhþºþþhû$û\nþhþYþhþDþgþhþ27þhþþAþ2þþ@þ2Dþgûþ*þ2þ2þÑ--þþûþ2þSþ2ûþCþgþ}þþ@þ2ûþBþÏþ2ûþCþgþ2þ2ûþBþ2þöþþ2ûþþ	Iþgûþ*þ2þDþ:ûþfþ2ûþ}þrþþþåûþ¡þgûþ*þþåûþ&þwûþ¡þgûþ*þwûþ[þ2þÀþþgþhþg%þgþ8þÚþþþþíþþwþþùþþ©þg þgûþSûþH-þíþ>þgÂûþóþgûþgþgûþ\nþhûþ4þFþþgþhûþþcûkþAþhûþÛþdûkþAþhûþ\nÈþhûkþgþAþhûþþiûkþgþ[þhûþ<ûþÝþêþÏþh+ûþÉþh+ûþWþJþgþhþ[þh+ûþLþh+ûþâþKþgþhþþBþg9þÛþgþhûþ¤þ4þgþþþhûþñþ5þgþþþhûþ	8þûÁþgûþþûÀþgûþòþö\'þ@þ¯þgþhûþþ÷þ¡ûþÝþDþgþäþhûþÒþ:þgfþgûþÔþ]þgþAþhûþ\rÖþ:þgfþgûþÔþ^þgþäþhûþ\ndþ:þgfþgûþÔþ`þgþþgûþÖþhûþ\nõþhûþ	?þaþhþAþhûþ~þgGûþ	Gþþ*ûþðþTþþHþhûþòûþ/þgGûþ/þþ*ûþðþTþþÊþøþ:þ:þgf¿þgûþ¾ûþ	þøþ*þþgþcþh+ûþSþgþ:þgfcþgûþÍþHþgþÑþh+ûþþgþ:þgÌþfþgþÑþh+ûþsþgþ:þgÌþeþgþCþh+ûþ	¤þgþ:þgÌþgþgþCþh+ûþÉþh+ûþWþJþgþhþAþh+ûþLþh+ûþâþKþgþhþAþh+ûþ3þgþ:þg{þ¤ûþgûþïþþ:þjþ¤þþ¤þþrþ¤.þ¤¯þh+ûþþNþgYQþgþhþ¿þþØþ¤þØþþjþØ&þþg	þÚþ?þþíþþwþþùþþ©þgûþ\rîþcûkþAþgûþ§þdûkþAþgûþ	SþhûkþAþgûþ\rÛþiûkþYþgûkþþþgþhþóþgûþXþhûþþêþhþþhþþgþg2þ7þþgûþCþEþg	þûþgûþ¶þH»þþF$þû¡ûþ$þû¡ûþDþû¡ûþ\rþ¡ûþAþ(þ¡ûþÐþ@þþGþgXþg.þg.bFþgûþ©þ\"þûþþgþþ-þgþûþgû9ûþTþ]þgûþ¤þþþØ	þþûþgþHþgþØþêþLþØþIþgþØ-þ¾þûþgûþÃþ·þOþØþûþûþÝþûþ²þûþXþLþØ}þ;þIþþØþûþ~þþMþgûþWþìþOþØDûþ²ûþXþLþØþIþØþÓþûþ^þgûþÓþûyþ\"þtþàþ½þþßþMþØfþþþgþLþØ)þNþØ&þHþgþh	þûþþgþþ-þ<þ-þ-ûþÒþ-û\nþgþh}þþ_þIþgþh	þûþg.(þþþëþþ\rþÐþþ1þûþþ0þûþÒþû\nþgþh}þþ\r	þJþgþhþi	þûþieþûþi³þûþiþþûþ×þûþûþ¦þþþûþÓþg/þg/þ	_þg/ þcþgþþþþYûþgû9ûþ»þY	þF0þ/1ûþ\nkþþO û\nþYþþþY%þþ[þgþBþþûþecþgûþ^þGþgþþg.þg.þ\rþhûþíþg. þAþhûþ\x00þg.ûþ	þþQþgþhþiþKþgþhþi	þûþieþûþi³þûþiþþ+ûþ×þûþûþ¦þþþûþþg/ßþþ\rþg/,þ¡þg/þ§þþg/ûÎþþ\n`þþûþeþg.ßþþ\rþg.þXþg.þ§þþg.ûÎþþàþþçQþgþhþiþLþgþgûþ@þgûþ¸þgûþþMþgþgûþíþgûþNþgûþªþNþgþgûþÝþgûþ	ëþgûþfþOþg2þgûþ/þQþgþPûþgþûþþg±þ®þ%þþáþ3þûþ2(þ%þþþgûþ\x00þgû«þEþþRþCþRþg&þRþg	þûþþgþPû(þ4þgû«ûþ,þTþgþSûþgþûþgû9ûþ\r=þ·¼þûþÉþûþþgþ+þþgûþ	¾þgû8û¾þþþRþCþUþg&þUþgþSûþgûþ@ûþçþVþgþ5þgþ|ûìþgµþWþgiþgûþ	{þûþ1û\nþg\"þû#û\nþþ	Yþûþþ\rFþû\'û\nþþþYþþXþg	þûþþg\"þûþþgþLþg,þ3ûþg,þµþ(þþ3þûþ3aþûþgû9ûþÚþ3ûþþ%þûþþûþWþ)þûþêþþöþþþ.þ¤F0þ/1ûþàþþ*--þþûûþûþ	jûþhþ¤ûþêþþQþ¤þgûþþ¤þÕþ¥þgûþþþ¹þ¥þYþþ±û9ûþ[þþ±ûþPû8ûþHþ¤þéþ¥þ\rVþþ\n9ûþ-þ¥þhû8ûþHþþyûþþ@þ-þYþgZþg/þSþþ\rþg/,þGþgûþþg/þþÚþZþgZþg/þSþþ\rþg/,þFþgûþþg/þþÚþ[þg¿þgûþ\rHþXþgþþFûþHûþ²þþ\rþ,þ6þûþþþ<þûþgû9þþVþÄþûþþYþgþTþûþþûþWþnþûûþs½þþþuþûþ\'þê&û\nþþþÍþûþêþÀþgþþ}þþÏþûþþZþgþsþ\\þgþh	þû(û\nþgûòþhþTþûþ\r¤þûþ(þþ|þûþ\rºþûþ\rbþûþ\rêþûþ	UþûþO¿þgû9ûþ~ûþ5þ]þgþhþi	þû(û\nþgûòþþzþhûþSþ&þgþhþiþNþhûþ¿þûþgû8þhþiþXþg.þ¯þ\\þgþhÄþiþiûþ(þiYþgû8þhþiAþûþÏþhûþkþ&þgþhþiþNþhûþ\"þûþþgþ®þþÌþ4ûþiþþiûþþËþiûþWþi)þiûþêþiÀþgû8ûþ¤þþÝþiþOþiþ-ûþgûþ	þ;þgû8ûþ¬þ+ûþ6þhþËþqþgþhþiþíþgû8þhþiþ^þgþh	þþû(û\nþgûòþþ¼þhûþþûþþgþþ\n2þ\nþþ%þgû9þhþZþûþÏþhûþaþûþþgþ þ\nþàþ\nûþþ\nþþ%þgû9þhþZþhûþ\"þûþþgþLþþ42þ4þÃþ\\þgþhDþûþgû9þh.þ%þAþûþ6þhþËþûþgû9þh.þMþþþ¼þûþ«þhûþþûþnþgþëþûþnþgþîþûþgû9þhþûþ6þûþ]þMþþþ¼þûþFþ2þ_þþþgû9þhþ_þg	þûþ%þg\"þû û\nþþFþÙþþÕþþþþÏ\'û\nþ¸þYþþ`þgþh	þû(û\nþgûòþôþ\r~þûþþgþþþ¼þhûþSþ\nûþ2ûþû|þûþÏþhûþkþ\nûþ2ûþû|þhûþ6þ4ûþ-ûþ	Ûþþgþhþaþgþh	þûþhþ]þûþhþeþûþhþÓþûþ(þþhþ%þhþ7ûþ[þgsþþþhûþ[þgsþþnþûyþþþõûþ	þöûþþbþ3þbþgXþúþþWþûxþþþþûþtþ¿þþØ	þû(û\nþØûòþþþûþ^þØûþ\'þ&þØûêþAþûþBþûþ^þØûþiþ&þØû¾þAþ\\þØþOþûþ^þØþYþ&þØþ\'þþ#þcþgþhþiþgþþgûþ(þg.û÷þgþhþiþdþgþhþiþgûþ(þgûþÒûþþgþhþiþeþgþhþiûþþhGûþ$þmþhþrþhYþgûþþhþiþfþgþhûþþhGûþ$þmþhþrþhYþgû£þhþgþgþhþiûþþhGûþ$þmþhþrþhYþgûþ	ÖþhþiþhþgiþgûþAþêþgþQûþþiþgiþgûþAþêþgþQûþªþjþg	þûþþgþþ34þgû8ûþHþ3þþCþþjcþgþØþgû8ûêþ\nAcþgûþ^þgû8û¾þ\nþg.þg.ûþäþ44þgû8ûþ¤þ4þþgûþþkþgþh--þþgûþ\rÃ(û\nþgûþÐûþbþgþhþ\r$þ¤ûûþ?þ¤ûÜþgþh0þjþ¤þþ¤þ.þ¤ûþ0þgûþgûþ¥þjþgþþgþ.þgþhþ´þþØþ¤þØþþjþØþþØþgþØþþjþØ&þlþgþhþhûþóþû(û\nþhûþ\rþIþûþþIþûþ\r|þgûþ	þ%þþÔþgûþsþDFþhûþþ&þþØþ\x00þ\r©þhþ\x00ûþ8Iþ\x00ûþñþØ-þmþgXþg%þgûþ<þgûþ\nîþû(û\nþgûþoþlþþgþgû9ûþOþûþlþGþg)þ[þgþÇþþþûþgû9ûþ\'þ&þgûêþAþûþBþûþgû9ûþiþ&þgû¾þþGþgAþ\\þgþOþûþEþgþ&þgþ\'þþ>þûþ7þþ	Nþôðþiþgûþ;ûþ¼¾þgûþðûþ	ÉþgûþÆþûþgûþ7þûþêþÀþgûÜþãþþ þpþgþ=þûþ)þ	ûþgû9ûþþ\nûþgû9ûþ	ãþ	þ	ûþ)þ\n	þûÀþ\nþuþþjþû\"û\nþþùþ\nûþþxþ(þþgû8ûþ þ\nþcþûþ»þ\rûþnþgþëþûþnþgþpþûþ6þ\rûþ	9þpþgAþ\rûþÂþoþgmþ[þgþnþgþhþi	þûþgû9þhþþû»þþiþiþBþû(û\nþ[þiSþû)û\nþþÞþþoþg	þûûþCþûþgû9þ±þÇþqþgþþþ½þpþg	þþ#þûþgû9þ±þÇþqþgþþþAþqþgþhþiþj	þûyþiþþþþãþgû8þhþiþþûû\nþþ	þ\"þûþZþþþgû8þhþiþÇþjéþiûþþihþiûþ_þi)þûyþi\"þûÀþiþzþiûþþvþþKþiþðþþ¢ûþþþ¿þiþ©þjéþi7þEæþ0þzþûqþ	±þ%þþlþiûþ(þiþ½þi7þFæþ0þ²þiûþ(þi[þþ!þiþ²þþ7þgû8þhþiþrþgþ@þþgþmþ_þþþ þg	þ>þÕþ?þþ	.þþþùþôþg+ûþþþ8þûþþþíþûþGþþþyþêþþûþ	c]þAþg+ûþ\rÜþþ;þþÓûþþþúþþ¶þõûþvûþcþþ´þþNþ!þeþþþ¹þþ¶þõûþ¦þõûþÌdþõûþtþþôþþþgþ\n¼þþ\rþgþþþþAþgþeþþgþþõþgþeþ³þþ	þsþgþ&þsþgþh	þÚþþ\rþh,þþþþ£þþ>þûþîþþ¤þgþhþt¹þúÇþú?Fûþ°þ\"þûx3þ¤ûþóþûþtþ¿þþØ	þþ#þû(û\nþØûòþþðþûûþCþûþþØ±þ®þþ&þØþþØû9þþþ¤%þþ&þØþþ\nþBþûþlþûûþ8þûþþØ±þ®þþ&þØþþØû9þþþ¤%þþ&þØþþ\nhþØû8þûþ\"þGþØAþ¤þ\\þØþ{þûþØû9þþ&þØþþ%þþþûþåþØûþ\rþØþÊû¼þØþþûþÜ--þÎþûþØû9ûþ\n\\þiþûþþûþWþnþûþêþÀþØ?ûþØûþZþþ]þlþþØ)þ[þØþ<þuþgþhþiþjþkþlûþg#@ûþh#Aûþi#Bûþj#Cûþk#Dûþlþvîþ\"þgNFþgþÚNGþ þ	:NOûþtþgPþ-þûþgþþQþGþvþPËþûþQþøþRþûþþþ\rþþþþFþg&þ#þgþgSþíþ$þgNTþgþgUVVþgUþîþ%þgrVþ¶VþøVþ¸Vþ>þgUþ×þgUVV5NTþgþwþyWþçXþçYyZûþ#[ûþ#\\ûþ#]ûþLþþìWþrþþìXþ$þþyYþfWþþrWþ-X1XW#WYþÛþ&îþ\'îþ(þgþgGVOþ)þgþgGVO5@Eþgþ*þg@Fþgþ+þgþgHþíþ,þgr^þgLV^&þ-þgþgKV^5_Eþgþ.þg_Fþgþ/þgr_·þg`þg`þ-þûþgþþQþGþvþ`ËþûþQEþ¤þgùNNFþgù__Fþgþ¤þØXþØþYþþ\rþØa,þ6þûþØaþ0þ`Ëþ¤þþ#þxþgþhNûþg#bûþhþyþgdûþgþzþg@ûþgþ{þgeûþgþ|þgþhNûþg#_ûþhþ}þgfûþgþ~þgþhgûþg#hûþhþþgþhþiOûþg#iûþh#_ûþi#jÖkyaylÖQþcmþþ þgOûþgþ¡þg_ûþg#jÖkyaylÖQþcmþþ¢þgfûþgþ£þgNûþgþ¤þgþhþiþj_ûþg#Oûþh#nûþi#oûþjþ¥þgþhgûþg#@ûþhþ¦îþ§þgþhþi_ûþg#Oûþh#nûþiþ¨þgþh^ûþg#_ûþhþ©þg^ûþgþªþgþhNûþg#_ûþhþ«þgþhVûþg#Nûþhþ¬þg@ûþgþ­þgþhOûþg#@ûþhþ®þgþhþiûþg#pûþh#_ûþiþ¯þg@ûþgþ°þg@ûþgþ±þgþhþiOûþg#iûþh#_ûþi#jÖkyaylÖQþcmþæqþ?þ²îþ³þg_ûþgþ´þg@ûþgþµþg@ûþgþ¶þgþhNûþg#Rûþhþ·þgþhNûþg#Rûþhþ¸îþ¹þgþhNûþg#_ûþhþºþgþhrûþg#_ûþhþ»þgNûþgþ¼þgþh_ûþg#oûþhþ½þgþhþirûþg#sûþh#tûþiþ¾þgþhþiþjûþg#rûþh#uûþi#_ûþjþ¿þgþhþiOûþg#iûþh#_ûþi#jÖkyaylÖQþcmþþÀþgþhþivûþg#Vûþh#wûþiþÁþgfûþgþÂþgþhrûþg#_ûþhþÃþgþhþivûþg#Vûþh#wûþiþÄþg_ûþgþÅþg@ûþgþÆþgþhþirûþg#_ûþh#tûþiþÇþgþhgûþg#hûþhþÈþgNûþgþÉþg^ûþgþÊþgþhNûþg#bûþhþËþgþhVûþg#NûþhþÌþgOûþgþÍþgþh_ûþg#rûþhþÎþgxûþgþÐþg2þÏþgÁþÒþg2þÑþgÁþÔþg2þÕþÓþgþôþÕþgþh	þ!þûþgþþþþþþ/þþþ\x00þ\'þþ]þûþgþQþ\rþhþûþþÀþþdþhþûþþ`þþh2þþ®þÖþgþh	þ!þûþgþþþþþþ/þþþ\x00þ\'þþ]þûþgþQþ\rþhþûþþÀþþdþhþûþþ`þþh2þþöþþ\nzþþ×þgþhþiþÖþhþiþJþÕþgþiþôþÜþg2þ×þØþÙþgþÝþg2þ×þÚþÛþgþßþgþ5þgþ©þgþ\rgþgþ þgþmþgþþÜþgµþàþg2þgþKþgþ\n\x00þáþgþgþþÞþgþ¢þßþgþâþgþgþþÞþgþßþßþgþHþÝþgþãþg	þ¤û\"û\nþgþ\"þ¥!þ¦!þ§þÂþ¨þ&û\nþ¤þ\næûþ4þ¥Øþ©FûþWûþ	ûþÖûþ=ûþ_ûþlûþÜûþ\r6ûþ3ûþ\n³ûþäûþúûþPûþ©ûþûþ8ûþûþ&ûþûþ	wûþ`ûþuþªþíþ«<û\nþ¤þ¥þ¬<û\nþ¤þ¥þ­$þûû\nþ¤þ¥þ¦þþ¢þ§þËþþ®þØþ\nþØþþ­Éþ¯þØ2&û\nþ¤þ¥þØþþØuþ°þ$þ±þþþþ±þþ°Ñþuþiþ²þØþÙ	þûþ°þ±0þ±Iþ±þ#þ±þ+þûþØþ@ûþÙþCûþ¦þDûþ§þ§þþ¨ûþØ@þþþ³þØþÙþSþØþþ´þØ	þûþ¥þþÝþûû\nþ¤þ¥þ¦þþjþûû\nþ¤þ¥þ¦þþ]þþþûû\nþ¤þ¥þ\'þÞþþþþ@þþ	Tþûû\nþ¤þ¥þBþþþVþþìþþ²þûû\nþ¤þ¥þÕþ%þþÍþàþDþûû\nþ¤þ¥þÖþþÝþØþûû\nþ¤þ¥þ¾þàþDþûû\nþ¤þ¥þ_þþ¬þþ þûû\nþ¤þ¥þ¦þþcþþ	Ìþûû\nþ¤þ¥þ¾þàþDþûû\nþ¤þ¥þUþáþþuþ³ûþÒþ¥þÌþû\'û\nþ¤þþ¥þØþûþØ\'þ@þ²þªþþïþµ$þûþ¥þûû\nþ¤þ¥þþþÆþûû\nþ¤þ¥þGþ%þþÒþ³ûþxþþªþ¥þþ/þHþ²þ%\'û\nþ¤þþ¥µþ¶$þû û\nþ¤þ¨þ¥Pþ(þþþû&û\nþ¤þ¥þ¥ûþ¤þºþû\'û\nþ¤þ¥þþ¥ûþjþ¾þ.þ·$þû û\nþ¤þþ¥þþäþ³ûþÞþû\'û\nþ¤þ¥þþ¥ûþþ	\\þ§ûþ§% û\nþþ^þ¾Éþ¸$þþûþ¥þûû\nþ¤þ¥þ¾þâþDþûû\nþ¤þ¥þ¸þ¥þÌþû\'û\nþ¤þþ¥.þþ¹þØ	þûþ¥þþþ\nAþûû\nþ¤þ¥þGþ%þþÒþ³ûþØþþ\n)þþ\n2þþªþ¥þ\r\nþþZþþ£þþQþþ¸*þ²þqþØ\'\'û\nþ¤þþ¥µþº$þûþ¨(þþ~þþoþþþþ®þþVþþ~þþäþþþ»Cþ¥þ\rÑþ«þùþ­*þ¶þlþ­*þ·þiþºþ{þ«þ·þ­*þ²þÓþ²þyþ¹þÊþ¼Cþ¥þÆþàþ¬þQþ´þGþ²þ×þ½$þûþ¸Zþ¨þxþ²þSþ\"þûþÕþ©þþþ1þûþªþþnþ²þþYþ²þSþþ¾$þûû\nþ¤þ¥úþþJþþþßþþ\nÉþÔþþgþþÒþ§Ëþûû\nþ¤þYþ¥)þ¦ûþ¥þûû\nþ¤þ¥þàþþ&þµþéþ¼þèþ»þ{þ­þûþ¬`þ¨þ­þûþ¬`þ¨þ­*þ²þ+þ²þ¥þ²þ\r×þ­þûþ¬`þ¨þ­*þ²þþ²þ9þ­þûþ¬`þþ	Îþ­*þ²þJþ­*þ²þþ²þ\nþ­þûþ¬`þ¨þ­*þ²þ	+þ²þþ­þûþ¬`þþUþ­*þ²þ©þ­*þ²þOþ²þþ¯þÙþ§þ®þ¨þ¶Ýþ­þûþ¬`þþNþ­*þ²þ>þ­*þ²þ	çþ²þ\rþ¯ûþùþ®þþ¶Ýþ­þûþ¬`þþ\nIþ­þûþ¬`þ¨þ­*þ²þôþ²þ	Bþ­*þ²þ´þ²þ³þ­þûþ¬`þ¨þ­þûþ¬`þ¨þ­*þ²þøþ²þhþ²þÉþ­þûþ¬`þ¨þ­*þ²þ½þ­þûþ¬`þ¨þ­*þ²þ\rCþ­þûþ¬`þ¨þ­*þ²þOûþeþ²þÞþ²þþ²þôþ­*þ²þ	¦þ­þûþ¬`þ¨þ­*þ²þþ²þùþ­þûþ¬`þ¨þ­*þ²þúþ­*þ²þ\nðþ²þEþ­*þ²þbþ­*þ²þ¯þ­*þ²þ\réþ­*þ²þ{þ­*þ²þ¶þ­*þ²þ[þ­*þ²þ®þ­*þ²þ3þ­*þ²þÙþ­*þ²þZþþ¾þáþÌþ½ZþàþÌþ´þþHþ²þHþ³ûþ\\þþ¼þ¾yûþ³þ¾zûþ@þ¾LþCþ¨þ¬þäþgþhþiþj	þ¤ûþãþg\"þ¥þ,þ¦þ,þ§þ,þ¥ûþªþ4þ¨þØ2þ¥þØþ©<þ§àþ§ûþ¤þRþªCþ¦ûþ¥(þ§þ¥ûþ§þ§þ\nrþ¥ûþ¤þþ¥þ«þØþÙþÚþÛþ¤yþØþÙþÚþÛþ¬þØþÙþ«þÙþØCþ­þØXþØþØûþ¥þ¬þØûþöþØþþØ@þ¨þ®þØþ¨þØþ0þªÝþ¬þ¥ûþ\rÎþ¥þÈþ¥@þ\r[ûþ þØþÈþÐþØþ&þ¯þáþj þ¥D%þ¥þ	[þ¥þ-þ°¹þ¥þOþªþ	¹þ¯þ=þ­Éþ±Cþ®þÐþûþÖþÕRþ¤zþ®þöþþ²$þþ^þ¥þ»þûþ¦Mþ¦þ\rÀþûþ´ZþNGþµ þþ\n1þþ¸þzþN@.þþþ©þóþKþ³þ³þ´þ	0þ³þ»þ¹þª¢þ¸þ\rBþª*þµþÉþÏþª*þµþ©þÖþªþ°¢þ²þ	½þª¢þÍþ²þVþ®þ\\þûþ±]þ°]þþ:þª¢þºþ±]þ²þNþª*þ¶þ±þª*þ¹þ±þ\n¾þª*þºþ\rAþª¢þ´þFþ¥þ×þªþþ¯þ\rçþûþÖþÕþáþ°]þþÉþª¢þ¹þ±]þ¼þëþªZþ¥Dþ«ûþþûþÖþÕRþ°¢þ¬þþ\n©þª*þ½þvþª3þþ¢þ¾þ·þ°*þþ2þª*þûþ¿]þ°]þþWþª¢þ|þ±]þ²þ\rJþ´þ3þ³$þûþÅþ®þcþûþ²¢þ¨þþþ´$þûþÖþÕRþ°¢þ»þþµþØ	þþ\r¯þ¯þ{þ¨þKþûþÅþ\rÔþþËþ°3þþØþ.þþ¶Cþ®þÐþþ¨þ¥þ]þûþ¨þ6þªþôþÁþ¾þþÖþÕþÙþ¨þÖþGþÁþfþYþ«ûþÎþª*þ¸þþþ·þþ·þØþ®þ£þûþ¥þAþÖþÕRþ®þ£þûþ¥þ)þÖþÕRþ¤zþ®þãþ¾þØþþþ²þRþ¸þØ	þûþÖþÕRþ¤zþ®þãþ®þØþþ²þRþ¹þØ	þûþØþ±þûþ¨þEþÅþhþ·þþ­þ®þ÷þØþþþ\r¦þþÄþþïþðþ\nþ¥þ\rþïþïþþ®þ\rúþð þÅþ¸þª*þðþ$þûþ»*þ-þº$þûþ±]þûþ²Zþ¨þ\nþª¢þÆþþþ²þ8þÂþþþ»Cþ®þþþFþ¥þ1þ¨þÃþ­þ þ²þ¸þª*þþ¼Cþ®þþ>þþJþþ»þ¥þ1þ¨þÃþ­Zþ¨þqþbþªþþªþÖþÕþáþþ þþ®þØþ¨þ	Qþbþªþ®þ{þþÄþþ þþ]þþ­þ þ²þáþª*þþ½$þûþ»]þþþ(þ¨þìþªþ®þJþûþÅþ®þgþûþ»þáþ¨þWþªþûþ»þiþ·þþ«ûþrþþþ¯þ¤þþþþþ)þ§þþþþzþ¼þþþ¾þØ	þþ|þûþÅZþ¨þ\rËþªþÑþ­þþÖþÕþþØþqþÑþÌþþPþ¥þ¤þªþþþ¿þ4þ}þ¾þ	)þÀþØþÙþÚ	þþÂþþFþ¥/þØþþþþ®þ\rµþÙþ¥þØþ	þ¥þjþÚþÑþ¦þAþ þÖþÕþàþª*þþÁCþ®þþþÂþþFþ¥þ1þþþþ®þ^þjþ¥þzþûþ¥þûþÂZþþáþ¥þ	7þþ/þÑþÇþÂ]þ¹þ¿þ}þþ	þÑþ~þÂ]þ¹þ¿þæþ®þ{þÑþ¥þþÖþÕþ¡þª¢þ{þþÂ$þûþ¥þª`þþfþ@þ}þÒþ@Ìþ@þ­þ3þÃ$þûþ¥þª`þþßþ@þ}þÒþ@Ìþ@þ­þ3þÄ$þûþ¥@þ­þ þþÅþþ¨þãþ«ûþäþûþÄþª*þuþþþÆþþÇþÎþÈþ¦þÉþ}þÊþþËþ	ZþÌþ½þÍþ\nÝþÎþôþÏþúþÐþKþÑþlþÒþyþÓþ×þÔþÜþÕþÁþÖþØþÙþÚ	þþ^þ¥þ_þþ þ¥@þªþ÷þþµþ¥@þªþÞþþ°þ¥@þªþ(þþÅþ¥@þªþþþ¯þ¥@þªþ²þûþÁþþªþþÎþÀþ}þjþ¨þªþþÈþÖþÕþ\nÏþ®þ\r!þªþûþ¹þþJþª3þûþÖþÆþ¹þ¥þJþª3þûþÀþgþþ·þþhþþ£þþMþûþ¥@þªþþ«þþÖþÈþ\r­þ­þ	5þþ^þþ5þ¥þõþª3þûþÖþÕRþ®þxþþÊþþþõþªþþxþþÃþ£þØcþÇHþþªþþ¶þþÀþyþØcþÇHþþþËþ¥@þþªþÅþØcþÉHþþûþ¥@þª3þûþÖþÉþþÃþþþþþØcþÊHþþûþ¥@þª3þûþÖþÊþþÃþþþþ-þØcþËHþþûþ¥@þª3þûþÖþËþþÃþþþþÇþØcþÌHþþûþ¥@þª3þûþÖþÌþþÃþþþþ.þØcþÌ%þÚHþþûþ¥@þª3þûþÖþÌþþÃþþþþöþØcþÍHþþûþ¥@þª3þûþÖþÍþþÃþþþþúþØcþÎHþþûþ¥@þª3þûþÖþÎþþÃþþþþ[þØcþÏHþþûþ¥@þª3þûþÖþÏþþÃþþþþ	ÅþØcþÐHþþûþ¥@þª3þûþÖþÐþþÃþþþþ<þØcþÑHþþûþ¥@þª3þûþÖþÑþþÃþþþþ\rþØcþÒHþþûþ¥@þª3þûþÖþÒþþÃþþþþqþØcþÓHþþª3þ	ûþÖþÕþ®þcþ\nûþÖþÕþþ½þþ	þ\nþáþØþdþÔHþþûþ¥@þª3þûþÖþÔþþÚþþÀþþþþ/þþ¤þþFþÙþ¥þóþªþ þÖþÕþþÚþPþþ2þûþ·þþ þyþYþ~þi2þÖþÕþÙþþ4þ$þþ	Vþ¨þÃþ þ²þÞþhþh_ûþh_ûdþhþhþ¡þYþh-þåþg{y|þæ}ûþ*þg5Uûþ#~ûþ#SûþLþþØ	þûû\nþØþ\r]|þâþþ¿{þ&þØþX{ þØ)þûû\nþØþØþÂ|ûþâþþþì{ÙþþØ	þ(þØ/þØþ@þþ}þØþµþûþØOþ|{þ&þþX{ þ5|þ¿þæþg	þFû¾ûêûþ¨ûþnûþ\nOûþòûþUûþSHþgþþ1þg	þwcþgþ1wûþþæVþ>VþÅþv(þGþx	þûþbþþ  \"þûþNcþg±þþûþNþþµþ~Vþ+þFþþþLþµþþþÅwþØþ¶þþAþGþÊ	þûþbþþ  \"þûþNcþg±þþûþNþþµþ~Vþ+þFþþþþ%wþØþ¶þþAþGþ þOûþäþþ ¡\"þþµþ~VþHþ¶þþþþþ%wþ\nhþvcþgþ1vûþþçþgþh2þgGþ þgOþh%þgGþÊþéþgb@Âþh%þgGþxþgbþhþèþgþh	þFûþ­ûþûþûþ@ûþ¢ûþYûþÛû³ûþ¡ûþ\n\'ûþ©ûþ7ûþ¤ûþ¶ûþÍûþKûþøûþ«ûþnûþÉûþ	\rûþ\rPûþ¼þgûþ	ÓþhûþHHþhþþéþgþgþgþlþûû\nþgþhþû\nþgþgþÔþþþþ\'û\nþgþrþgþ+þgþ2þg	þRþ\nþþ\rþ,þ6þûþþcþgþþþþuþN(þGþxþûþNcþgþþNûþ(þèþNþb{þûþbþþ ¢\"þFþNþLþµþþþ%ûþnRþ þ¶þþþ=þGþÊþûþNcþgþþNûþ(þèþNþéþb@þKþûþbþþ ¢\"þFþNþNûþnRþ þ¶þþþ=þGþ þOûþLþþ £\"þþ­þ þOþÅûþnRþ þ¶þþAþOûþ5þþ ¤\"þþ­þ þOþÅûþnR5RþQþ¶þþmþNcþgþ1Nûþþ3þg	þNcþgþ1NûþþæbûþQþ¶Óþ ¥þpNþîþæVb{þþµþ~bþHþ¶Óþ ¦þpNþþÔþ4þg	þNcþgþ1NûþþûþéVb@þûþQþ¶Óþ ¥þpNþîþæþþîþ¶Óþ ¦þpNþ%bþÔþ5þg	þN(þGþx	þûþNcþgþþNûþ|þGþÊ	þûþNcþgþþNûþþ-þNcþgþ1Nûþ-þ6þg	þN(þGþx	þûþNcþgþþNûþ|þGþÊ	þûþNcþgþþNûþþ-þNcþgþ1Nûþ-þ7þg	þNcþgþ	FNþR(þçþûþÍþþÜþ¶Óþ §þèþNûdþþÙþ8îþêþgþhXþgþÈþûI3þûþäþgþûIþcþûIþEþFZþ÷þÙþMÓþwþ¸þûI3þþåþ¨þTþ\"þûþ~þûIþþh	þûûþ÷þ.þjþþëþgþgþÂþëþgþþëþgþðþìþgþgþÂþgÛþìþgþþíþg	þþþ?þ\rþg¬þþ7þ@þþ9$þûûþ>ûþ¡þ?ûþþhþ?þVþ?þÐþþ?Nûþ\rþþ?þ2û¼þþ?þG+û+sþþ:CFûíþÑþþ+þ$þÉþ$þ¤þ¥(¡þ¤û\n¡ûþþþ¥ûþ¤þ ¡ûþÐþ¥þ6þþ¥þ\\ûþaþ\\ûþþþrþ¤(þ¤cþ¥þþþ¤þ$þûûþþ1% û\nþûþþû\nþûþþûþMþþuþ*ûþûþþaþûþ	Ñþ-þ$þûûÃûþ½þþ\nþûÅþ?þûþ\nøþCþðþ.û\nÅþ|þ/ûIþùþkþ$þûûÃþHþþ3þûûªûþ÷þû8ûþ¶ûþOþû%û\nþûþþûþ	þeþþtþûþþoþûþ@þþûûªûþ	xþþûþþ9þûþþEþû£þþ?þÈûþûþwû£þþûþ\röþCþtþÏþþAþ	þgþh	þû9:ûþ	ÐþûWþ\"þû[âþþ9þhû[¬þh^.þgûßþgþhþéþgûßþgþ}þ³þ^.þ°þgþ\nþgþhþ3þûÁ9:ûþþûþ	þgþh\"þû9:ûþþûÁþþ7þþ	þûûþIþûþûþµþ û\nþûþ,þ û\nþþÑþþ¾þþpþþ7þ8þVþûþ$9:ûþ.þ\'þþþgþh	þûÀþgþþþþû%û\nþþÕþþ\rþ,þ6þû%û\nþþþ\n0þþ\\þþÓþhHþþ\nÞþþgþhþgûþ¬þhþhþgþhþ\r8þgûþ¬þhþAþ\rþgþhiþgþh§ûþ°þgþhþþgû9þhþþþgþ+þgÇþûþgþþ²þûI3þûþþg\"þûþþ]þûþþeþûyþ\"þû(û\nþ\rþgûþ\nyþg%þ\rþgûþ	rûþ	\"þ þþ\r¸þþ\náþûþþôþ#þùþ¿þþgþþ\r´þ%µþöþùþçþ(--þPþûûªûþ÷þû8ûþ¶þ\rþgûþþû8ûþmþ\rþgûþ¥þû8ûþ[þ\rþgûþ}þû8ûþ\rÍþ\rþgûþuþûþgûþ0þþþÈþ	ûþþg\"þ\nûþ	þ]þ¤ûþ	þeþû(û\nþ\rþûþãþûþôþgþþ·þ9:ûþ\råþþþþþþûþ%þ\"þ\rþÛþ\nþ\rûþ\n~þ¼þþþþ+þ\r\'þaþûÀþþHþ\rþMþûþ(þþþÆþþþ\nKþû8û¾À9:ûþYþþþhþû8û¾þþþþþþnþûþþ´þþþ\nþ)þÈûþûþwû£þþ¹--þ{Igþþ9´þ¢þ\nþùþQþøþøûkþþâþûþ8wû¼þþ3/½-fþûþ\ráûþ\n6þþØ	þûþØû9ûþ\'þþûÁ9:ûþþûÁþþþûþþþ¥þØþeþþoþþØþÙþÚXþÙþ8þûÁþØû9ûþãþûþþþþÙûþ#þÙþþÚRþ¥þØþÙeþ¤\'þÙþoþ¥þØþÙþÚ	þûûªûþ·þûþþÙþûþþÚþûþ)ûþþØû£þþ¦þØþÙ	þêþþþÙþþ´þêLþþïþØþïþêþ¿þþØ	þûþþØPþ(þþ½þþqþûþ\naþûþØû9ûþpþþ\nwþûþþþ	þûþþØþÊþûþ(þþØû8û¾þþâþû:þ	³þþÁþþØ	þêÞþþvþþ\rþØ,þ6þûþØûþÎþQþûþrþûþÔþûþãûþkþûþ¼þûþ;ûþ	/þûþ;ûþDþûþ§þþûÅþûþ§¼þûþðûþ\n\rþþ\rþûþþ¡þûþþNûþRþþûÅþûþþNûþþûþ;ûþ	PþþûÅ\"û\nþûþ\rûþÛþûþ;ûþÔþþóþûþE(û\nþûþ(ûþòþþ\x00þIgþ\x00ûþÜþþûÅþûþ§þûþE(û\nþûþ(ûþ7þþûÅþûþ4þûþ\x00þ®þþûþE(û\nþûþ(ûþþ¦þþØfIgþ\x00ûþ1þûþ§þ\x00ûþðþûþÄþþûþ\rxþþ:þþûþþþ]/½-DþþûÅþûþÍþþ÷þþ:þþXþþ	Cþêþþ´þþïþðþêþ®þêþ	»þê7þïþ þð&þþØþÙXþØ	þûþ(þÙþØû8û¾þnþûþ\x00þ®þþûþEIgþ\x00ûþ-þûþr(û\nþûþ(ûþ\nçþ¥þØþûÅþûþ\rK(û\nþûþ(ûþ±þûþ§þ\x00ûþðþûþÄþ¥þØþûþÄþþ:þ¥þØþûþþþ]/½-Dþ¥þØþûÅþûþÍþ¥þØþIþþ:þ¥þØþÀþþµþøþøûkþØþ	 þØ¾þØ¾þÀþI-þwþØûþûþ\rÈþØûþûþñþ®ûþðþØûþiþ2ûþ ûkþØþaþØ¿þ?þ§þØþØûþxþØûþò	þQþØûþ\rþØþXûþê	þQþØûþ=þØþXûþþØûþ6þØûþ	\'þCþû-þþg	þÞþÞþFþ;þ<þ=þ>þ\r¿þþ\rþ,þ6þûþþgþþþ©þþûþþ0þûþþXþþÁþ$þû¬þ0þbÀ.[þþ<þGþÅþþg	þþûþ\\þçþûÝþþbþgþþÊþþûXþþbþg³þþûÅþ\r±Xþþbþþþgþh	þûûþúþþhúþhSþþþhªþgþ\n\nþgû	þsþgþþÙþþgþgþgûþ%þg\"þû û\nþgþEþÙþþÕþþþþnþgû\'û\nþg¸þþþgþþg	þûûþÚþû«þg@þûþ\rÅþþgþgû\'û\nþgþrþgþ_þgû¬þg.KþgþAþ;$þ¤ºþ¥×þ]ûþþ^ûþþ_ûþþZûþLþþØþÙþ¤þØþÙþþØ2þ¤þØÁþþØþÙþ¥þØþÙþþØ2þ¥þØþ|þþgþh	þûþgû9ûþþXþhþþþþûûþþûûþ³þþþvþþwþ7ª	þs	þþªþþ^þþuþgû8ûþ\r-þnþûþ^þ±þþ×þ]þþþÁûþ(û\nþþMþûþþÁþ2ûÇþ\"þûÀþ2þmþûþáþMþþæþ©þÞþ	ûÀþþêþ\nû|þ	þtþ\nMþ\nþ+þ\n©þ\nþQþ\nûû\nþ	eþ\nþsþ\nDþþ\nþþ±þþþgþh	þûþþg±þHþh@þ\n/Mþ\n©þhþþg	þû(û\nþgûþ\n/þþ1þgûþgûþ¼þgþgûþ!þû(û\nþgûþîþgþþgþhþiþgþþgþ8þþ~þ!þûûþ3þûûþ/þûûþ+þþþiþhþgþûþgþþbþþ6þþ\nþþþþÒþûþþQþhþþ\\þûþþÞþþþþûþþþþSþûþþþ0þûþþþ«þþgXþMþg{þûþþþgþ(þ	þûþþþ,þ®þ%þþáþþþ2þ#þþgþh	þ¤ûþgûþ9þgû«þhFûþJþþþ¿þþØþgû«þ¤Gûþ@þCþgû«þ¤-þþg2þgûþ]þgûþ/þþgþhþ5þgþhàþgþøþhµþ þgþg	þûÀÀþg\nþ\n´|þþsþgþ!þgþhþþg/ûëþgþþûyþgþgûþ%þgþ}þ2þg~þþþþ$þguþûþgþgûþ\'þ	þûþ þ\"þûþþdþþþûâTþ\'þþþûþùþoþþþhþgþ£þ(þþ2þûþþgþ\r--þPþgûMþgþ\nþ÷þúþûMþ)þþâþ#þþþiþg7þ@þgþ\"þgþhþi	þûTþhþ(þiþ2þþ¿Tþiþëþû\nþ0þ¦þûâþ\"þûþ«þûdþùþ[þgþ þùþøþûû\nþþþ\rTþ.û\nþþEþþ¯þ#þgþhþiþjþhþhûþEþhþ\rþgûþhþbþgþgû0\'þi\'þþg\"þûþD(þjþVþþgþþæþgþ©þg-þ$$þ¤ûûþ þ¤	þûþ¤ûþ<þþûþûþHþûþûþþûþÏþþûþ}þaûþþþøþ¥ûûþ	|þûþ÷þ¹þ¥à-þèþ{þ¦Fûþûþ(ûþÑûþûþåûþ2ûþ\rùûþ	yûþ\nÁûþ÷ûþ\ruûþ5ûþïûþÔûþ´þ	uþ§ûûþ	þ§~þ§Dûþ\nmþ\nþþ÷þ	4þûûþLþ	þûþûþÈþøûþûþ5þûþ	ÙþþCþþ»þ!þ7þûþdþCþþ\ndþÅþûþdþ<bÓþ¤þ:þ	þØþÙßþþ\rþ¦Ðþ¿þØþ¦þþbÓþ¥þØþaþÙþ¯þ¥þØþÙþ þ¥þØþ\nþØþÙ	þþþØûþþþúþÙþÙûþvûþcþþ´þûþØûþ!þØþAþØGûþþûþØþ\nþÙþÙûþXûþ¤þÙûþ¦þÙûþÌdþÙûþtþþÙþ§þØþÙþCþþþÖþ<þgþgûþþgþùþgþ´þâþùþgþ\r2´þ%µþèûþ*¯þ0þgþ9>Éþ%þgþhþ7þgþèþg~þh%þhþàþh/ûþ×þhûyþg[þhþ\r§þg~þhþ$}þh[þhþÞþûû\nþh	þhþhþhþ©þþxû\nþhþnþûû\nþhþh	þh\"þûþZþþHþ\'þh@}þh}þþþ&þgþhþiþj	þûyþiþþ¶þûþþ\nþþçþþ4þûþþgÀþgû8þhþ\nþi9þ§þ\nû:þWþ\nûþ%þ\nþ)þ2ûþ\nþûþþþþ\nYþVþ\nþWþûûþÁþiûþ\'þê&û\nþ\nþþIþûþþgÀþ\nûþ\nþ2ûþiþûþãþþvþ½þþ	Ôcþgþ{þþãþ\nþëþþ	nþMþiûþ©þiûþ\nþûþþgÀþ\nûþiþ2ûþiþûþþ÷þhþßþiþ³þûþ\'þþhþ\nþj%þ\n/þþgû8þhþþDþûþþgÀþ\nûþ\nþ2ûþþûþþgû8þhþPþgMþ©ûþîþhþ	ÃþûþþgþLþþ\nûþ\nþ2ûþûþþMþiûþ\n~þjþiþ\nþþgû8þhþiþ\'þgþ3þþHþgþ!þû$û\nþgþ\r\"þûþ\"þg\nþgþþþ2þûûþ\nÚþ#þþþµþûûþ^þ<þþþ\"þûû\nþg	þþg\"þûû\nþgþg	þþgþ[þûû\nþgþ[ û\nþþDþ÷þ_þþg\n.þþ(þgþh	þûyþgþþ\rÕþ½þþ2þh þþãþ\nþëþþ¹þMþ©þ\nþþ\'þþþgþ*þgþ)þg\rþ)þ´þ)Eþ)þg¤þþþ/þgþþ)þþ3þE þ).þ)þ+þgþh	þ¤!þûþgvþþþ¥þ¦ûÂþ§þ¨>þ>þ>þþûIþ¥û©þûþ©þ§ûþ*þþûIþûþ	þûIþûþ©þþþØþþ\rþþþþþ	þ6þ þþ	Í þþûIþûþþ	¢<þ¿þ©$þûþ¥þgûzþ¤þhþþÆþ|þþWþ¥þgûzþ¤þ>þþâþûþ¥þgûzþ¤þ\'þûþ¥þgûzþ¤þ±þ\'þþìþþÙþûþ¥þgûzþ¤þ\'þûþ¥þgûzþ¤þ\'þûþ¥þgûzþ¤þ±þ\'þþþþþþ	¨þûþ¥þgûzþ¤þ\'þûþ¥þgûzþ¤þ\'þûþ¥þgûzþ¤þ0þ`ûþ¥þgûzþ¤þ±þ\'þþþþ+þ`þÙþªþØ	þûþgûþ\n@þ¤þØþ¤7þØ@þþ	$þþþþþþûþ©3þþþØþþ\rþþ¡þþ;þûþ©þWþþ	¿þûþþþûþ©Zþéþþþ¨þþKþþUþûþªþþ¨ þþþþ|þþqþþþ§þþKþþ[þþþ¦þþKþþVþþþhþþ\nØþ-þ=þ\rÊûþwûþûþþþgûþçþþgûþ°þþgûþ_þLþ<nmûþ\rþ<nmûþÔþþØþçûþ\rÇþØþþØþçûþBþØ-þ>þgûþ\'þ¤ûþgûþ\n;þ¥ûþgûþxþ¦ûþgûþkþ§ûþgûþ	dþ¨ûþgûþRþ©ûþgûþ¦þgûþÂþgûþaþgûþÓþþ	]þªþËþgþÃþgþ1þûþ´ûþOþ¥þ/þgûþþþþ;Fþgûþtþ)ÈûþLþþØÃûþØ%þª#ÄþØþgûþ\nPÅûþgûþÒûþ\n£ûþÀþþ°þûþ§þþûþ;þLþ«þØþÙþÚþÛþÜþÝ	þêþ%þÛûþÛþþÛéþêÄÆûþ¬þØþÙþêÄÇûþ­þØþÙþêÄÈûþ®þØþÙþêÄÉûþ¯þØþÙþêÄÊûþ°þØþÙþ±û\nþêþØþÙþ²û\nþêþØþÙ[þÙ/þDþÝþâþgûþ	\nþêÄËþZþ© þêÄÌ%þêÄÌþ¥þÛþ;þêÃûþxþþ5þûþêÄþ>þ!þþþêÄþþ¥þþþþCþþþ\nþþþæþþþþÄþþþþÕþþþþþRþ¥þþþþ\r1þþûþþ0þûþþäþ/ þÜ%þÜþþêþ¥þØþþ\n¦þÚûþþÚþþ&þCþ«û\nþêþØþÙþÚþÛþÜ&þ¬þØþÙþ7þÙ/þ¥ûþ³þ¥þØþÙþÄþ´þØþ¥þ<þþþ­þØþÙþ¨þ7þÙ/þ¨ûþ®þØþÙþÄþ¨ûþÏþØþ<þþ_þ®þØþÙþ§þ1þûþµZþÙ/þ§þNþØþÙþþ§þNþØþHþþ_þ¯þØþÙþ¦þ7þÙ/þ¦ûþ®þØþÙþÄþ¦ûþÏþØþ<þþ_þ°þØþÙX-þ	Eþûþ¶þÉþûþvþÈûþUûþ	,þÙ/þû8þØþÙþûþ°þØhþûþÉþØ.þû9þØþKþþþ±þØþÙ	þêþßþûþêÅ(þþÙþûþqþhþûþqþþKþÔþþïþïûþ»ûþ§þþþïûþ»ûþ	êþØþÙÆþþ¿þþôþõÔþþôþõÔþþôþõÔþþôþõþþþïþïûþ»ûþ\n¡þØÆþþ¿þþôþõþõûþÁþêÄËûþõþZûþºûþ\n-þêÄËþ^þþôþõþ	þ²þØþÙ	þêþ«þ©	þØþûþ©û÷ûþ±þþûþþþûþÎþ(þÙ/þûþjþaþûþjþþ§þÔþþïÔþþï	þûþïþÓûþwþûþûþÖûþ\nûþ`þþï	þûþïþÓûþÙþþÈûþóûþÕþûþûþiûþ!ûþ+þûþûþ\'ûþ_þûþþ\ràþØþþÙþDþûþ\nsþþï	þûþïþÓûþ{þþÈûþóûþ\nþêÄÌûþ-þûþûþiûþ6þûþûþ\'ûþ_þóûþþTþØþóûþjþEþûþ\rmþþôþóûþÐþêÄÌûaþêÄÌûþóþ~ûþ<þ³þØþÙþÚþÚûþgûþ\rôþÚ û\nþØþsþÙþ­ û\nþØþÙþ\nÎþû û\nþØþsþÙþDþþ(þþþû û\nþØþÙþ¾þû û\nþØþCþþìþû&û\nþØ¸þþþ@þûþ\'&û\nþØþþtþþ\rªþÙæþÚaþûþþùþÙæþÚjþþþØþùþÙæþÚ-þ´þØþÙiþÙ/ûþ=þûþØþ	±þþþû%û\nþÙþøþþ\rþ,þþûþþþbû\nþþ6þû\'û\nþþrþþN û\nþþþåþgûþ\'û\nþþvþþEþµ<\"û\nþgþ\rÏûþ	1þ¶þØþÙþÚ	þ(þÙ/þ¤ûÃþÙDþûþ¤ûÃþÙhþûþ¤ûªþØ)þÈûþûþþÈûþÒûþpþÙþûþþÙ[þÚþ¤wû£þYþþCþ¥ûþ³þ¥ûþOþgûþÔþgûþþ¥þþØþÙþÚþÛþ«ûþlþØþÙþÚþÛþþØþÙþ«ûþlþØþÙ&þ?þy!ûþ#\"ûþ#þ¶gþµÍûþLþþØiþØûëþØûºþØ\"þûdþØ5 7þØþ þþzÍàþûþÍþ$þþþþûûþ\x00þþ¬þûþþUþþËþþþjþþþIÍàþûþ&þûàþþ 	ûþ¿ þ	þþf þ{Íþþûþþþþþ	Mþûþ2þ\rþþþûþþäþþ2pþþÃþþ2pþþéþþ2pþþ5þþ2þþ%þþþØ	þþþþþþþþ	ûþØûþÕþ\nþþþ\rûûþ$þûþ\nóþûþ\náþûþ\nþoþûþ\nþþûþ\nþ¢þþþ}þ¡þþ	sþûþ	þþ.þ	þþ/þ	þþ×þ	þþÛþ	þþòþþ\r4þþÌþIþþwþþíþþ#þIþðþþçþðþAþþaþûþ°þ°þ|þþEþIþðþþgþðþþgþðþAþþjþûþ°þ°þEþIþ\'þ\'þ\'þ	þþ&g	þ\rsþþWþûþþûþþIþþ7þþ\niþûþþûþEþ\nþ\"þ\nþ\r\x00þþ\\þ\nþuþ\nþÁþþ\\þ\nþ`þ\nþ=þþ\\þ\nþùþ\nþ\n8þþ\\þ\nþ\raþ\nþcþþ\r&þ@Cþ0ûþþ¤û\nþ0þ\nCþ¥û\nþ0þ.þ¦ûÅþMFûþJþFûþ´þFûþ)þFûþjþFûþÄþFûþþFûþnþFûþßþ¿þ§þØ	þêûþØþë!þì!þí>þºþþÎûþþÏûþþÐûþþÑûþþÒûþþÓûþ	þÔûþ\nþÕûþþÖûþþ×ûþ\rþØûþþÙûþ@þLþþcþìþNþê+þëþ<þì+þëþ$þþ!Ïþ§þûþíþë0þëIþëþNþêjþþ$þþ!Ïþ§þìIþìþRþêþþêþûþíþìþúþþþïrÎþEÐÝþíþìþïþìIþìþNþêþ	þÍþìTþë\'þêþþêþ\nCþëûþìþåþ<þëþ<þìþ\rþïþ5þïþNþêþþïþ5þïþRþêþþêþþï2þíþïþ|þ¨þØþÙþÚßþþ\rþÙ¬þþØþþÚ-þ©þØþÙþØ+%þÙ+þiþØþdþÙþÕþØþ	ºþÙþËþªþØþÙ2	þþØþ	þÙþõþØþ	þÙþàþØþèþÙþþØþèþÙþþ«þØþÙþÚþÛþ)þÙþyþÚþ\rtþ`þõþ`û	þ|þÙÛþØþÔþÚÛþØþ\'þÛþÎ	þ\néþÙÛþÙ\'þÚÛþÚþZþ`þ¬þØþÙ	þIþØþâþÙþÔþØþÚþÙþm	þþØþâþØþàþØþÚþØþÑ	þþÙþâþÙþàþÙþÚþÙþ\nR	þQþþ\ròþû\nþY	ûþ|þþ­þØþÙþÚþÚTþÙþþûþØþÚþÈþØþÙþ¢þûþØþÙþëþØþÚþþûþØþÚþ¹þØþÙþÈþØþÙþ¹þØþÚþ¢þþþûþÙþþ/þÚ¬þþ7þ«þØþÆþþþYþþïþÚTþÙþþ®þØþÙþÚ	þþþþþûþØþ­þþ\rþØÐþþSþÚþoþûþþ~þûþþôþÚþoþûþØþþþûþØþþ¼þ4þ%þ+þØþ½þÙ þ±þ©þþDþÙ þ)þûþØþþgþûþØþþþÙ þþ¯$þºþêþëþì>þíbþÚûþþÛûþþÜûþþÝûþþÞûþþßûþ@þLþþï	þþëþêþíÚþûþïÕþ4þïÖþûþï×þÄþ4þïÕþ{þ©þïÙþPþþþìþëþªþïÙþPþþê7þìþë0þëþ1þûþïÙþþí þ&þþõþêþëÁþþï	þþÏþ>þþ¨þþþ¯þþ\rþë¬þ	þûþìþQþþÔþþ}þþ	ïþþÃþþKþþþþþþíþþ#þþèþþÚþþ\rþ¬þþþþþþ´þþþï	þþÜþþþþúþþ<þ>þ>þ!þ	!þ\nþ!þþ\rþ>þþ­þþÑþíþ	àþ®þíþþ9þ®þþþ þ\nû	þ\nè\nþþTþþ þúþ	\rþ\nþ\rûþþûþþhþþöþcþ\rþaû\nþFþ\'þ\rþiþbûþ­þþþaþb\rþþ\rûþaþ+þûþaaþûþaþìþSþ	qþûþþ þ[þþaþ+þþwþ+þþ½þþtþ?þ\rþÐþþþþ\r7þþþ\nÛþþþþþïþð	þþÌþ!þûþíþû\nþÛþþ\nþþþûþ	þ\n!þ!þþ&þþ\nêþ\rûþþhþ\rcþþfþþþ\rþþÇþþ\rþëþþ\rþ\nåþþ\rþÈþþ\rþàþ4þ	ûþ¬þþþ\n7þ	þû	þCþþ	)þûþEþþ\x00þ\nTþþ£þþ`ûþ	þþþïþðþñ	þþ­þþ­þþ&þð4þ»þÁþïÓþþñû\\þ´þ©þïÙþïÕþ,þñDþþëþ-þ°$þºþê>þë!þìþÚûþþÛûþþàûþþáûþ@þLþþïþëþìþþûþïÕþ4þïÖþûþï×þ{þûþïÙþþû\\þ¸%þû\\þ¹þêþëþþëþfþû\\þ¸þìþÍþ<þìþþï	þþ	ÂþþþþJþ!þ>þ!þþ	þ&þëþ[þ\nþ\n\rþë¬þ\n	þûþêþ\nQþû\\þ¸þþàþþþûþ	Êþûþ	Àþþ1þûþþþ\nþ\n\rþ¬þ\nþþ\nþÐþþþ\\þþþï	þþþ1þþ\rþë¬þþ	þûþêþQþû\\þ¹%þû\\þ¸þûþþûþ\\þþ¾þûþêþþúþ-þ$þºþêûþ¯]þëûþ°]þì!þíþþÌþ@þLþþïþðþñ	þþØþï+þ¼ßþ¥þêþêûöþ{þûþêþsþÀþðþñþ/þþþþìþ-þÀÔþàþ¥þëþëûöþ{þûþëþsþÁþ/þþþþíþ-þÁÔþþþMþcûþ±ûþþ4þþØ	þºþê!þëûþ§þØPþìûþ§þØþâûþþãûþþäûþþåûþ@þLþþïþðþñþðþfþï+þ¼þëÒþñþêþ¹þìÒþñååÉþþïþðþï+2þðjþïþþï2\nþïþ	Òþ$þlþ!þ!þ!þ!þûþÅþ!þ	ûþÅþ\n!þûþÅþdûþëÓþeûþìÓZþdþ+þûþëÕþ4þëÖþûþë×þ{þ\rûþëÙþPþûþ\rÛþ7þóþ7þáþû	þCþ\rÜþþ\rÝ4þ+þÅþûþ\rÝaþþ¯þ\rÝþMþû	þCþ\rÞþþ\rß4þ	+þÅþ	ûþ\rßaþ	þ¯þ\rßþ[þeþ+þûþìÕþ4þìÖþûþì×þ{þ\rûþìÙþþ7þ\rÛþ\n7þ\rà(þ\rá4þ+þÅþûþ\ráaþþ¯þ\ráþ[þ	+þÅþ	þþ+þÅþþîþþcbþcþþùB	ûþDþ^þcþþùBþþcþþùBþêþcþþùBþþcþþþcþþùBþþcþþùBþþcþþùBþþcþþùBþþcþþùBþþcþþ	þcþþùBþþcþþùBþ\nþcþþþcûûþûþ(þcþÒþ±ûþ3þ²þþÇþ³!þ´þ¨þµþøþ¶þ¸þ·þþ¸þÜþ¹þ×þºþ\nßþ»!þØþ¼!þ½Øþ!þØþFûþ<ûþ¸ûþ£ûþqûþ¸ûþ¾ûþÖûþoþ¾!þ¿Øþþöþ	þøþÀûþ§þPþÁûþ§þ	\"þ\nþ\n¹þÂûþ§þ\nPþ!þÃûûþfþÄlþÅþ3þÆþØþÙþÚþçûþ)þØþ\r>þÙûþåþÙûþpûþ	ÄþÚþgûþ¸þÙûþ	#ûþPþÙûþqûþ¼þÙûþ6þÇþØþÙþ\rDþØþLþÙuþÈ!þÉþ¨þÊþøþËþ<þ!þ\r!þÌþÍ!þÎ!þÏLþÐþØ	þþØMþû	ûþDþØþþûI*þþÑþØþ5þØûþÙþ³Íþ¶Íþ·Íþ´ÍþµþjþÒþØþÙ	þþÆþØþÙþÐþÙûþ¥þ¤þÔþþþÑþÄþÏ+þ¼þÓþ¼)þÁÒþþÏûþ½þ÷þÏ+þ½þÓþ½þ+þÎþ£þÈþîþû\\þ³þÀÒþAþû\\þ´þÓþ¼þ»þþûþêþ¾þÎûþÊaþÍþÎûþË¯þû\\þ·þÌûþþÎûþÉþTþÉþîþû\\þ¶Xþ©þÌþDþÓþ¼)þÎûþÈþTþÊþîþû\\þµþÎûþÈ|þû\\þ´þûþêþ¿þÎûþËþÍþøþË©þû\\þ³MþÍþ=þÍþ&þÍþÉþÎûþÈþTþÏûþ¼-þÓþØþÙþÚ	þþFûþ\nûþþþØ+þ¼MþûþÀÓþ³þûþÁÓZþSþûþ±þÇþØþÙþÚþ²âþØþþ&þÔþØ	þbþ þØûþ\rÝþØûþÙþ³Íþ¶Íþ·©þ þØþªþ þØþÊþ´Íþµ©þ þØþªþ þØþÑþ þØûþËþ¸Íþ¹©þ þØûþ\\þ þØûþÝþÂÒþþ þÂÎþ§þÕþ(ûþ	¶þLþÕ$þ>þþÄqþ þ¥þ þÄþ þ¦þ;þûþÂÐþþ þ)þÖþþòþÖþØ	þþ¨ûþ¤þûþLûþ!þûþ	2þþàþûþ«þ×þþû÷ûþþÃRþûþyþØ&þ×þØþØûþ§þØûþ¢þ<þcþþØþÒþ³þØþþØþÒþ´þØþþØþÒþµþØþþØþÒþ¶þØþþØþÒþ·þØþþØþÒþ¸þØþþØþÒþ¹þØþþØþÒþºþØþ¹þ¤þÕþ	&þAþgþgQûþgþæqþgIVOþÝþgJþ±þi(þ	þûþþþ\rþþþQGþþþGþ_þûþþþ\rþþþþEþÖþBþg	þ_þûþþþ\rþþþþFþÖþCþg	þjþgOþ}þ®þþêþyjþgOþEþ þgþDþg	þjþgOþ}þ®þþ¸QþQHþgþGþg)þ þgþEþgþhGþgþFþga þgþGþg	þlþgOþ}þþylþgOþEþ þgþHþg	þlþgOþ}þþ	Kþg)þ þgþIþgþg\\þ-QþI`þIPßþþ÷jþþHþþÑjûöþ{þûþgZ3þjþþ<þûþþþ\rþþþþûþþ#þþþva,þ6þaþ0þMþgþåQ¨ûþg[Ýþg]ÉþJþgNTþgþgUþFþgUVbþKþgNEþgþLþgNFþgþMþg	þdþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgþ#þNþg	þdþûþþþ\rþþ6þûþþcþgþþþþ-þOþg	þdþûþþþ\rþþþþEþg&þPþg	þdþûþþþ\rþþþþFþg&þQþgþgUV@þgU²þRþgþgUxþeþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUÊþSþg	þeþûþþþ\rþþ6þûþþcþgþþþþ-þTþg	þeþûþþþ\rþþþþEþg&þUþg	þeþûþþþ\rþþþþFþg&þVþgþgUûþãþgU¶NTþgþgUþ_TþgþWþg	þNcþgþ1Nûþþ_cþgþ1_ûþþXþgNEþg5_EþgþYþgþgUûþ3þfþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgU²þZþg	þfþûþþþ\rþþ6þûþþcþgþþþþ-þ[þg	þfþûþþþ\rþþþþEþg&þ\\þg	þfþûþþþ\rþþþþFþg&þ]þgþgUþßþgUVg5hTþgþ^þg	þhcþgþ1hûþþ_þghEþgþ`þghFþgþaþgþgUûþÖOOTþg)þgUþ\"þiþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUèþgUxþ_þûþþþ\rþþþþTþg)þgUÊþbþg	þ_þûþþþ\rþþ6þûþþcþgþþþþ-þcþgrOGVO)þvûEûþlþgþdþg	þ_þûþþþ\rþþþþTþg&þeþg	þ_þûþþþ\rþþ6þûþþcþgþþþþ-þfþgþgUþYþfþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgU²þgþg	þfþûþþþ\rþþ6þûþþcþgþþþþ-þhþg	þfþûþþþ\rþþþþEþg&þiþg	þfþûþþþ\rþþþþFþg&þjþgþgUþ0NTþgþkþg	þNcþgþ1NûþþlþgNEþgþmþgNFþgþnþgþgUþFþgUxþ_þûþþþ\rþþþþTþg)þgUþªþgUûþ9þgU¶OTþgþgUèþgUxþnþûþþþ\rþþþþTþg)þgUþªþgUûþÌþgUxþoþûþþþ\rþþþþTþg)þgUÊþoþg	þ_þûþþþ\rþþ6þûþþcþgþþþþuþnþûþþþ\rþþ6þûþþcþgþþþþuþoþûþþþ\rþþ6þûþþcþgþþþþ-þpþg	þ_þûþþþ\rþþþþEþgåOEþg\"þnþûþþþ\rþþþþEþgnþoþûþþþ\rþþþþEþg&þqþg	þ_þûþþþ\rþþþþFþgåOFþg\"þnþûþþþ\rþþþþFþgnþoþûþþþ\rþþþþFþg&þrþgþgUVgþgUþ3@Tþgþsþg	þ@cþgþ1@ûþþtþg@Eþgþuþg@FþgþvþgÔþwþgþgUþFþgUxþ_þûþþþ\rþþþþTþg)þgUþªþgUûþ9þgU¶OTþgþgUèþgUxþnþûþþþ\rþþþþTþg)þgUÊþxþg	þ_þûþþþ\rþþ6þûþþcþgþþþþuþnþûþþþ\rþþ6þûþþcþgþþþþ-þyþg	þ_þûþþþ\rþþþþEþgåOEþg\"þnþûþþþ\rþþþþEþg&þzþg	þ_þûþþþ\rþþþþFþgåOFþg\"þnþûþþþ\rþþþþFþg&þ{þg^TþgþgUþ3_Tþgþ|þg	þ_cþgþ1_ûþþ}þgþgUûþ3^^Tþg)þgU²þ~þgþgUûþãNTþgþgUþ­þ_þûþþþ\rþþþþTþg&þþg	þNcþgþ1Nûþþ_þûþþþ\rþþ6þûþþcþgþþþþ-þ þgNEþg\"þ_þûþþþ\rþþþþEþg&þ¡þgNFþg\"þ_þûþþþ\rþþþþFþg&þ¢þgNEþgþ£þgNFþgþ¤þgþgUûþO@@Tþg)þgU²þ¥þgr@	þ@cþgþ1@ûþ-þ¦þgr@@Eþg&þ§þgr@@Fþg&þ¨þgOTþgþgUþ@Tþgþ©þg	þ@cþgþ1@ûþþªþgþgUþ(þgU¶TþgþgUþ\npTþgþgUþ_Tþgþ«þg	þcþgþ1ûþþpcþgþ1pûþþ_cþgþ1_ûþþ¬þgEþg5pEþg5_Eþgþ­þgFþg5pFþg5_Fþgþ®þgþgUV@þ¯þgþgUV@þ°þgþgUûþÖOOTþg)þgUþ\"þiþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUèþgUxþ_þûþþþ\rþþþþTþg)þgUÊþ±þg	þ_þûþþþ\rþþ6þûþþcþgþþþþ-þ²þgþgUûþ\r#þgU²þ³þgþgUxþ_þûþþþ\rþþþþTþg)þgUÊþ´þg	þ_þûþþþ\rþþ6þûþþcþgþþþþ-þµþg	þ_þûþþþ\rþþþþEþg&þ¶þg	þ_þûþþþ\rþþþþFþg&þ·þgþgUûþ\rp@@Tþg)þgU²þ¸þgr@	þ@cþgþ1@ûþ-þ¹þgr@@Eþg&þºþgr@@Fþg&þ»þgþgUV@þ¼þgNTþgþgUþ\"þRþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUþéþ½þgNEþg\"þRþûþþþ\rþþþþEþg&þ¾þgþgUþ0NTþgþgUþ\"þRþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUþéþ¿þgNEþg\"þRþûþþþ\rþþþþEþg&þÀþgNFþg\"þRþûþþþ\rþþþþFþg&þÁþgþgU²þÂþgþgUûþâþgU¶NTþgþgUèþgUxþ_þûþþþ\rþþþþTþg)þgUÊþÃþg	þNcþgþ1Nûþþ_þûþþþ\rþþ6þûþþcþgþþþþ-þÄþgNEþg\"þ_þûþþþ\rþþþþEþg&þÅþgNFþg\"þ_þûþþþ\rþþþþFþg&þÆþgþgUûþ±þgU¶rTþgþgUþ_TþgþÇþg	þrcþgþ1rûþþ_cþgþ1_ûþþÈþgrEþg5_EþgþÉþgrFþg5_FþgþÊþgNTþgþgU²þËþg	þNcþgþ1NûþþÌþgNEþgþÍþgNFþgþÎþgþgUþFþgUxþ_þûþþþ\rþþþþTþg)þgUþªþgUûþÌþgUxþoþûþþþ\rþþþþTþg)þgUÊþÏþg	þ_þûþþþ\rþþ6þûþþcþgþþþþuþoþûþþþ\rþþ6þûþþcþgþþþþ-þÐþg	þ_þûþþþ\rþþþþEþgnþoþûþþþ\rþþþþEþg&þÑþg	þ_þûþþþ\rþþþþFþgnþoþûþþþ\rþþþþFþg&þÒþgrTþgþgUþ:sTþgþgUþ3tTþgþÓþg	þrcþgþ1rûþþscþgþ1sûþþtcþgþ1tûþþÔþgrEþg5sEþg5tEþgþÕþgrFþg5sFþg5tFþgþÖþgþgUþ(þgUþ\n%Tþg)þgUþÅrrTþg)þgUþÅuuTþg)þgUþ_Tþgþ×þgr	þcþgþ1ûþþ#r	þrcþgþ1rûþþ#u	þucþgþ1uûþuþ_cþgþ1_ûþþØþgrEþgùrrEþgùuuEþgå_EþgþÙþgrFþgùrrFþgùuuFþgå_FþgþÚþgþgUþ\"þiþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUèþgUxþ_þûþþþ\rþþþþTþg)þgUÊþÛþg	þ_þûþþþ\rþþ6þûþþcþgþþþþ-þÜþgvTþgþgUVV5wTþgþÝþgvEþg5wEþgþÞþgvFþg5wFþgþßþgþgUþYþfþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgþ#þàþg	þfþûþþþ\rþþ6þûþþcþgþþþþ-þáþg	þfþûþþþ\rþþþþEþg&þâþg	þfþûþþþ\rþþþþFþg&þãþgþgUþùþgU¶rTþgþgUþ_Tþgþäþg	þrcþgþ1rûþþ_cþgþ1_ûþþåþgrEþg5_EþgþæþgrFþg5_FþgþçþgvTþgþgUVV5wTþgþèþg	þvcþgþ1vûþþwcþgþ1wûþþéþgvEþg5wEþgþêþgvFþg5wFþgþëþgþgUûþáþgUþ­þ_þûþþþ\rþþþþTþg&þìþg	þ_þûþþþ\rþþ6þûþþcþgþþþþ-þíþg	þ_þûþþþ\rþþþþEþg&þîþg	þ_þûþþþ\rþþþþFþg&þïþgþgUV@þðþgþgUþùþgU¶rTþgþgUþ_TþgþgUûþ\ntTþgþñþg	þrcþgþ1rûþþ_cþgþ1_ûþþtcþgþ1tûþþòþgrEþg5_Eþg5tEþgþóþgrFþg5_Fþg5tFþgþôþgþgUþsþgUVg5hTþgþõþg	þhcþgþ1hûþþöþghEþgþ÷þghFþgþøþgþgU¶NTþgþgUþéþùþg	þNcþgþ1NûþþúþgNEþgþ\x00þgNFþgþþgþgUûþ·^^Tþg)þgU²þþgNTþgþgUþùbTþgþgUþUþþgNEþg5bEþgþþgNFþg5bFþgþþgNEþgþþgNFþgþþgOTþgþþgÔþ	þgþgUþ\nÒ_TþgþgUûþ±þgU¶rTþgþgUèþgU²þ\nþg	þ_cþgþ1_ûþþrcþgþ1rûþþþg_Eþg5rEþgþþg_Fþg5rFþgþ\rþgþgUþ\rdþxþûþ¦þSþ´Tþg¤þ?þ\rþþþgU­þþTþgmþgUþUþþg	þxþûþþþ\rþþ6þûþþcþgþþþþ-þþg	þxþûþþþ\rþþþþEþg&þþg	þxþûþþþ\rþþþþFþg&þþg	þgþÛþþYþbþ@þg\'þþ<þSþ<ûþçþ¹-þ%ûþºþþgþhþiþg?þhþþiþ{þûþuûþ;þg\'þiþIþh\'þiþIþh\'þiþ6þìþþg\'þhÛþiþþgþh2þëþ1þ<þìþÜþìþ«þ<þìþoþ<þíþGþ<þíþgþëþþìþbþþg	þgþÛþþYþ/þ@þg\'þþ<ûþ	öþ<ûªûþ\n	þ¹-þ%ûþNþþgþhþiþg?þhþþiþ{þûþuûþ;þg\'þiþIþh\'þiþIþh\'þiþ6þìþþg@þg\'þhÛþiþ þgþhþgþÈþhþ\nþëþhïþgþ!<þìþÜþìþ	Oþ\"<þìþZþ#<þíþ	þ$þÍþíþgþëþþìþðþ%¹ûþþfûûþ\r*ûþÜþþ	;9:ûþ	¸9:ûþ´9:ûþÀ9:ûþB9:ûþø9:ûþÜþþØþÙþÚþôþDþØûþ(þØþÙþfþØþÙþÚmûþþþþþùþúþþþgþhþiþþþ\nþ©þ¨þþþ§þþþþþþþþ¤þ¥þ¦þ	þ\rþ.þy@þmûþ£Úþ Âþ¢Ôþ¡Ïþnþoþq#þr%þpþu1þs\'þt)þx9þv3þw6þ|PþzJþ{Lþ}»þ~¿þÁþ¯þHHRþþaþsÈ¡þaþQþþwþþQþ@FþþOþþQþÓþþ;þ*þQþUþÖþþ_þ\x00þ/þQþ þQþþq|sÂþîãþþdíþþaþ/ùþæþþ]ôþ»þìþþôþäìþþôìþþôþþþ þQ\nþQÍ¬ñþVþWþ3!þQþ1þ\nþþ#þQþþP÷<þQÅðþöþQfþÆ`þñþoþþ+þ¡þ0þVþ!þþZþñþ@þEþBØþçþKþOþ ãþþQþcþãþQÍþÀþ©þTÝþQþjþþQþ\rþþÚ0þQþþQþP2þàñþQþWÖþQþ@þrçñþ\rþJþQþ?þ\nñþ\rþJþQþ­þÐþQþ[þ²þ¹þQ1þ£ñV¨ñ¯ûÁñ$6­ñO¦@ñ¿µæþrþËþþWªþêPñþJþ·ñ&þþÅñþdþèñþ	zñ¤þÌþþSmþQ^þ\\þQÍþÞMþQþ6þ8þHþá¢ñþþWþþ&þåþQþ6þþQþfþþYþQþþSþþlþþQþþþþQþ=þ_þ¨¸þøþÂþÏþKþþN×±þþßÙþ °þ&ñ§þþÈþ&ñþ]þDdþvvþ0þþÔäþ®þÝW½þX«âþ&ñþ]þ.þgþ&ñþ]þ\'þ¡îAþ·þ`þA´;þ®þ&þ!þ¼ñ}þIþ¡þCyþR{þañÛþ\"þJþ¡þW»þ.¶þþþ÷þtþ$þ3þ(þ¡þí(ÉñþÉºþ ñþM\"QÐñow>ÐñoþöþþUþþþkþ+þQpþþ^þ[þQhþrþAþµþùþXþþQÍþÙþ¤þAþÌþGþ¡þ´Eþgpþþ¥þI8þiþþ`þQþhþþ9þÑþQpþþ,YþQeþ(ëþQþ\nëþQéþ¡?þ,þ4þQþþ«þ^ñþÊþWúþQþ~þKþÛþQþ}þþ\'Cþá¹þLþ7xÕþþ	þ¡þ%³þþ2:þRÔþ5þptXþ²,þ>êIþQòqþQþ+þQþþ#þþQþEñþnþQþEñþBþºþQþEþÒþQþ=óþ=þLþõõþ¡þÊiþ-%þQ4þþQþEdÜþ-ñþDÓþ\\þÄþ¡þþþmþQþ~þëþQDþQþEþþQþþ¶þþþMþþQ¼þþ\'þQ)þ¬¾£þcþþìþQþ:¾þz¥þÁþéþQÍ þyìZkñþþ5þñTïþbñþßþúñþÒþOÆñþ©þWj!þQþ§JþQþ<þQþèLþQþ6þQþ¯ñþþQBþþþQþâþÃþQþØþ4þ&þ¡þTþ1þ¢þ$þþ&7þ[ñþ>þþþþ*þ\\þQÍþ:þCþ¡þÇþQËþQþQnþÑþQþ°þ<þ¾þFþ¡þðþuþQÃþÎþQþ8þþïþþQþ/þþ-þ³þQ=þ\"lþ½\\ñÏþWþNþQþ%þQþ¿þ?þ\x00añþÇþ±þAþªþGþuþ7U]þ5þ×þQþ¸þÜ9ø\rGþþ3þ¦Úþòþ{	þþ3þxþQþ¸þÜàþþQþ9þ|ñþ;þþþFþåþZÞþÍS*þeþQþ2þ)ñþÕbþQcþQÍþ)!þQNþ?þóìþ¡ÄÎ#þQþ¸rþQþb_þYÀþ.þQûþeþþ:þûäþ@þ%þ6þ\'þ6þ)þ=þûþþ	~ä þgûþkþgþçþgþÑþþOþùþk	ð ûþþþ\nfþùþqKþ¤ûûþþ¤¥ûçûþmþ þþ¤ûûþbûçûþÀþ þþ¤ûûþ9ûçûþ2þ þþ¤ûûþ\n!ûçûþþ þÅþ.þÁþ $þtþ¤Qþ+þ/Çþ/ûþ(þ/þ-ûIþWþ.7Igþ-þäþ¤þôþúþîþ;þûþ/þ	ûþ`ûþBþg	þûû\nþÏ=û\nþþ>þ	fþþûþþ	=\n	þàþgþÎ	þYWþþ\rþX,þþþþXûzþ)þûþþowû£þ¤þ\nûûþ\rhþûûþ½þþþ\"þûþrþûþ[ó=þx=þþþþûþáþûþùþÎ=þOþþþèKKþûþùUþþLþùUþþZûþþ\nDûþ¾þûþÌþ¥þþHþûþ°ûþ+þNûþ7þþþþ\rþ,þ¡þSû9þþþªþþ\ntþ;þûþùJûþ?	þûûþ^=þþþ\n¢	=û\nþþ>þðþùþjWþþ\rþ¤Ðþþûþ¤þ0þ¥þ«ãþûþåþùþ¯þûþ4%þ4	þþþùBþþûþgûþòþgûþ%	þûÛþþ\n	=ûþûþ(þKþûþùþ\røþþùoûþ¿þþùþwþ;þt-%-þïûþ¡#Wþþ\rþ	,þþûþ	þQþûþ	¯þ þûþ	<þûþ\rkþ þûþ9\rþ\x00þ¥¼þûþ\rßþfKþûûþ^þûþûþ	þûþ,±þ\rÂ±þ±þ±þùUûþïþùþ û\nþûþþùþ\x00þùUûþ\n§þùþþùUûþ}þùþôþùUûþæþùþ3þùUûþ}!û\nþûþõþùþ³þùþ\rlþû-(þþ	hþùþ\nìþþþ	²ûþ\x00ûþûþWþþ§þùUûþÃþùUûþ¯ûþòþùþõûþ\rQþþÈþûþ\nÑ³þ	÷þùUûþ·þùþ û\nþûþ\n±þùþ1þùþÈûþñþñûþþñûþ>ûþMþ×ûþM·ûþ*ûþ	Kþùþûþûþ\n7þÆûþËûþ þÆûþ	þÆûþ`$þ§ûþÝþSûþìþùþ	¬þùUûþ\rþùþÂþùUûþþùþ	óþùUûþEþùþi û\nþûþIþùþ\räþûûþ	Lþþûþ$þùþ\rûþW±þªþùþ\n±þ	þ;³þgKþþþùþþþþþùþnþþþþùþVþ þþ\r´þ;þ¤þ¥þÅþþáþþïYWþ?þþ°þ¡þ½þþþ¦þþþþNûþðþþ\rþþþ\r¾þþþNþûþ\nþþNþþ¼ûþþþNþþ	åþþNþþþþNþþ7þþþNþþºþþþþþ	äþûþgûþºþûþó	Fûíþ\rRþûþ#\rþùoþgÝþh\\`þlþûÅþ³þûmûþ¯þþJIgþþûþùþ\x00	þþþùBþþ¤ûþùJûþD	Fûþ)úR#Kþûþ,ûkþgþþ\rþg/ûþÕþûìþþZþh4þg/þhþuþUþëþ;	þû\nþþpþ^þþ»þûþþÂþþ\\OþþþþùþÁþþûþ\rfþúþDþûþìþûþ;þûþ	Þûþkþyþ¸þ;þùþ	«þùþoKþûûþûþ\nEþûþ/ûìþûþ¹ûþûþ1þþAûþÝþSûþìþûþ	*û÷ûþ\rvþûþþþûþjþ|ûþþhûþ$ûþÁþþGûþ®þ@ûþ¿þþÊþþþ&ûþ\x00ûþûþWþþWþþ®þþÝþbþùþöþû$þûmûþþûþOþ\nûþùþ.þþþ	þûþûþ\rþîþ~þþq	þþþùBøþùþÓþùþOþþþ\rXþûþþùþûûþ\r,þtþ%þþ\nXþîþÎþgþâþþî0þþùþFþIûþùþIûþ÷þIûþ±þþþþþ;ûþnþ¢Oþþþ.þtþþó	ÐN,Pþþùþ\rÌOþþþ\'èqþû#þ-%-þ\n#þ\x00ûþþûõþ=þ¤ ûþþ	þûþû\\ûþDþFþg0þùþ\ræþp	þû¬(\rþþþùBþþ0ûdþþûäþªïûï%þ=âþþ¬ûþ<-Wþ¥þþ@þûþûöþ}þþþþþ þþ/ûþ\n=þ/ûþøþûþþþ1þ/ûþ@þ þþaþùþtþø	þþþùBæþþ	Fûþþ(R	þþþùBþþþþ	ûþùJûþD	þûûþ^þþþûþûíþ:íþ0þûþ\r4Wþþ\rþ,þþnþQþþþ4þO þþþdþþÌþþ	þhûþsþûþþ]þùþ®þûþgûþ0þþ\n<þþþþûþùUûþ­=ñþùþÎþþòþûûþþûþùUûþÙ²þòþùþôþûþùþ§þþ]þ\nc±²þ4ûþÆþuFûþò\rþþþùBÒûþDþ$^þþëþ\nûþùJûþªþûûþûþqþgûþgþá	FûþJþ	RþþU	þþþùþþ,	þûþùþvðþgþ	þþþùBþOþþþöþùþÜþûûþ¿þûþùUûþ9þþþûþ\"þ/ûIþûþûdþhþùþ[þgþ þiþþùþ þPûþùþ\nïûþ	e	þûþû\\ûþøþûþó7þFûþBûþ\rëûþÏûþ¬ûþÍûþ\n{ûþºûþìûþ>ûþhûþ<ûþ\r¼ûþlþþ³ûþ\nÜþþRþkþ÷þþ¤þmþûûþàûþ!ûþ	uþ¥þ?þþþû\n­þùJûþkþþrþÇþûIZ	þQþTþþ	gþùJûþúþùJûþnþùoûþÛ«þûþqþûûþ»ûþ3þûûþ»ûþÜþ¦þþþþ¦ûþ\nÍþ}þ¦ûþ	3þ¦ûþÁþ~þþ§þ\rþãþ\nxþã¹þ¦ûþZþû%û\nþ¦ûþþûþßþò[þ§þEþ¨þ©Dþúþõþ§þrþòþô û\nþôûþzþúþ/þôþaþúþBþØ	þûþ¥ûþþØPþûþMþþþþûþûþ\rþ%þ¤þþ\rÐ û\nþØûþ	!þ©ûþùþ®þþûþùJûþ\rõþ©þ/«þ©Äþ©þUþùoûþ0«þ©þþ©þyþ%þþþùoûþ0«þ©þ* û\nþØûþ³þ¨ûþùþ®þþûþùJûþÓþ¨þ/«þ¨Äþ¨þUþùoûþË«þ¨þþ¨þyþ%þþþùoûþË«þ¨þ	øþ;þûûþÍþùUûþ\rjûþ	þþû0\'þ\'Xþþúþþûþ,=þûþ¬)*&+þ4	ð ûþþþ	þùþiûþ\nÂ)þ±þ(ûþþûçûþþþ\r³ûþêþûçûþ	Õþ!þãþ;	Fûþßþ&R/ûþhþþþ¥þþ/	þ	ûàþûþ\x00	þþ¬þ		þùþiûþeþ	HñIþ/^þûDþûdþ^þþèþûþþ\\	FûþþRþûþùJûþ?þûþ	þþþùBþ%þþgþþûþùUûþ	þûûþûþ\nF\rþþûìþûþ?þûþÁþûþþ=íû\nþ0þwþùþ`þgþûþ	þûþûdþùþ-	þþþùBþþþäþtþPOþþøþûûþ÷ûþ þUû	þû%û\nþþTþûûþ	Fûíþnþh Eþh^þûþáþFûþ\nûþõûþuûþËëFþgûþeþgûþþgûþñþùoûþùþþSûûþ	þùþiûþ¶þþ¬	þûûÃûþ	$)þûþ\rþ^ûþîþ^ûþùþz)þûûþþûþtþþ¤ûþúþþ¤ûþûþkþ{þ<þ;þûþþmþþGþÑ:ûþ	þùþdéqþ\r¥þgþ0þgþÞþ!$?þþÞþ?þ\rûþ0³þ+þûþ\nþþ¬	þûþgûþ°þþûþþdûþ£þãþ;	þûþû\\ûþëOþþþKþûþùJûþþþûþ0þ	þþùoûþ¿þþKþ;þþ\n¶þ	ûþûþjþðûþþþ	þû\'ûþwþþgþhþPûãþþþûþùJûþ?þûþùþÐþþN1KþûÞþ\\`þ\rnþþ|þûþþþ4Eþûþ1þEþû_þûþJgþþÆþEþûþûþîþ;þþ¤Fûþoòþûþ	Fûþ´ùRþûI	þûþþ/aKþûûªûþ½þþûþvþûþáþûþ¡þûþûþíþûûþNþûþ\nþûþûþ\rþûþ²ûþ\nbþûþLþûþ²ûþtþûþ»þþþûþ²ûþþûþ»þþöþû«ãþûþ5þùoûþþ.þþþ;þvþûþþÎèþ¥bþþ=þþb	þûþùJþgPþþûþùþþgþÙþþùþìþ	þ)	Fûþ,þRþûâþgUþg^þûLþûþ4þgûþZþ4þgûþ\rÉþ 4þgûþZþûþðþ+þ	þ%þþþùþ\rEþ!þûûþiþûûþ\x00þFûþåûþ\nûþ\n[þûÅþ³÷þJIgõþ¤ûÜûþ¾þN\'ûþ	Wþ\'þIþ\rþNþÞ	þûþX þXþ\nþXþ	á	þùþiûþ\r«þ¤ûþûþuþûþ\rþþûþþe	þtþþh/åq	þûþ+þ,/þþþ	þWûþvWþiûþiþþi\rþgÐþiþ	§þgþi§þhHþi	Fûíþ¡´þþû±þ.ûþ	ð ûþþsþ\"þûþgþ\"Kþûþ\nNþþûþûþjþûþûþèþûþþûþ´þþôþûûþþþõûþuþ£þûþûdþòþõûIþW	þþ¬þçq	þû«ãþ¥þ:þùþþûþ	þ¤baKþþþ\rìûþrþ¤ûûþ?þ¤Èûþûþþ¤ûÜûþ\rZwû£þ¤þ	ûþ¤ûþ	£þ\nûþ	ûþIþûþ	ûþPþþ\rþÐþþ	ÈûþÚþþQþ\n4þ	ûþÇþ4þ	ûþ×þ þþþGþùþñþþáwû¼þ¤}þ;#Wþþ\rþ,þþûþþQþûþ»þ þûþÏþûþþ þûþå\r=þñ\'«þûdþþ^þûþgþµþûþùJûþþûäþ\rþûþþAþþ\nÄ	þhû%û\nþhþTþûÎþþþfþþgþ	=þÏûþþþ\ro	þ¤ûÜûþ¢	Fûíþt	þ>þþþOþþþkþObCKþû¬þùJûþ\r`þþþUþþþþþ\r^þþþêþþþþþ×þû¬þùJûþªþþþUþþþþþµþþþêþþþþþ©þ;Wþþ\rþîþ+þþþþ	þE	þþþùBå\rþùJûþ³þgM«ãþgþ\rþÅþ	þØþ\nþAþûþûþ[þûþqþûþñþûþgûþeþûEþûdþ^þûþþ/þð&û&þ\nàþùþ=þùþþiTþgþÖþhTþg^=þPOþþþ¬=þþµþþIþûþùUûþéþûþ\x00þ=ä þgûþLþûÜþþùþ.þ^	þûûþ^´þqîþþþû¬\'û\nþþØêqþûþ4þþ\n«þ4þþÄþ4þþmþûþo	þþþùBþ\'þþþ÷þâûþ¡ûþmûþµûþ¡ûþmûþ\nÙ	Kþ[ûþùþ\ngþþ[þ		þûþþþºþïþûþúþ.=þûþ¥þþJþTþ\x00þ	öþûþgûþ¢þþ\n þû\\`þ¨=þûþ\rØþûþ	þûþ\n¿þPþûûþ{þPþ·þùþ[Wþþ\rþ,þFþþÆþ)Wþþ\rþ,þþ þúþMþþþ\\þûþ4þ¤ûû\nþ¤Xþûdâþ¤þ	(þû\nÅþ|þûþûñ4þ ûþgûþZþþeþþ¤þTûþxþ|þûþU\rþûûþ+ûþ9þþ	>þþXþRþûþùJûþþþíëþÊþûûþdþûþTþ\x00Wþ	þ	\rþîþ+þ	þþ	þ	þE)û)sþþþþó=ûþNþæqþþ\ryþû--þð	þþþùBèþóûþþXKþ¥bþûûþ{þûûþ\n$þûþ¤ûþþ¤ûþrþ¤ûþÉþþûþXþ¤ûþêþ¤ûþÉþþ¤ûþ(þûþ\'þûþ\r¬þûþ¤ûþ¸þ	ûþ¤ûþnþ¤ûþbþ¤ûþlþ	þþ¤ûþPþ	þ\nûþ¤ûþnþ¤ûþ\nþ¤ûþlþ\nþþ¤ûþPþ\nþ¤ûþþþ	þ¤ûþþþ\nþ¤ûþ	Üþþ¤ûþrþþûþ\nTþ¤ûþ~þûþKþûþ²þ¤ûþ¶þûþ\rUþ¤ûþóþûþþ¤ûþ	âþûþ\n]þûþ¦þ¤ûþ2þ¤ûþ:þûþ¼þ¤ûþ°þ¤ûþÆþûþæþ¤ûþLþ¥ þ¤þÑûþTþúþþúþ\"þ¤þ¤ûþ5þFþ¤ûþ þ¤ûþ\naþFþ¤ûþþ¤ûþsþ¤ûþ«þ¤ûþMþ¤ûþUþ¤ûþëþ\rþ\r\rþ,þ\rþRþþ\rþ,þþûþ¤ûþ\rþþ\rÆþþþ4þ¥ þûþõþûþ	Ïþûþ5þ;	þÅþþþþ0þþþþþþûûþ\nÖþûIþþùþ\"þûþùþÁþ	þþþùBþ)þûþqþþ°þIþþ	©/Oþþþéþ¤Èþþ\nlþûþùþ^þûþùþØþgWþþ\rþ,þþ	þ\nþþþÕûþºþ þ\nþþþ¿	þ¦ûûþþmþMþ	þ\'þ	þþþwûþ	þþûÒûþþ.þtþ/MIgþ-þ\'þûþûþ	¥þbþ.ûþþ¤ûûþ?	þ\nûàþûþCþûþùþúþ þþ¤FþWþþl0þþ`Kþ\nû¬þ\nþ\nþêþþþ\nþþ\r<þùoûþfþ;þ	øû\n÷þÎö	þûþû\\ûþc	þû?N,^=þ¤þûþhþûþþðþþ\rÚ	þgûÒûþDþgþþ.	þûâ\\Vþn	þþþùBé	þþ^þ	Fûíòþûþþùþæ	Fûþyþ*RþûþùUûþYþûþhþ/ûþWþþþÊþþþþðþþ0þþþAþþþwû¼þ¤	îûîþ\n3gþþæWþþ\rþh,þ¡þgþhþþ\n×þ#	FûþJþRþûþþ#þFûþ;òþþþB	þû-+%-þïþûþùþ\nV	=þgûþmþhþiþþþgþûþþ%þþ.ûþùþþgþþþùþQþùþñþþAþ¤ûû\nþþIþÜþM\'ûþØþùþ4þûþ4þ4þ 4Eþûþþ\rIþû û\nûþÂþþþþûþ³þûþóûþ£þ\'ûþ0þûþéþþ\rÄ- ûþÜþûþqþùþ\n(þ÷þpþ÷þtûþ|ûþ\n¬þ;þþ¤=þSþgþûþ.49Kþûûþ>þû«ûþ9þûûþ>þû«þgþû«þûþ9þûþûþÀþûþ	°þûþÀþûþpþþþ\"=þþFþÅþþ1ûþþþþûþûþA%Wþþ\rþgûþYþþûþgûþ\rþ0ä þûþ2þûþCþûþ þûþþÅþþþûÆ	þþþùBçþûþþþ\\þþþÍþþþzþþþ\'	Fûþèþ	KþûûþKþ;þûþgûþTþþ\rþû¡%%à%þô	þûþûþeþîþÁþûþþg0ä þgûþ6þgûþ·þgþçþgþÑ	KþXûþùþ-þg}þÇ=þûþ[áþVû=þþÁþþþþQþû-OþþþÔþFûþ´ûþ)ûþJûþûþJûþjûþ,ûþûþßûþ?þûÒûþIgìþëþþþþïþ0þlþû]þþþgþþ	ûâþ.þé	ûâþ/þ¯þûþþîþãþû-þïþûì4þùþQþRûþ¦	Fûþjþ\nRþþþ\rþûþqþþkþhûþhûd^JþnþGþþþùþ¡þûþþ¢ûþÏKþûûªûþóþ¤ûþûþûþfþûþûþæþÇWþ?þ\rþþ\rqûþ	^þþ þûþïþþ¼þþþ+	þþþùBþ=þgþûþùþhþþ­þ×þfþûûþÊþþ	þgûþ=þùþ	kþûþ\"4=þO	þûþû\\ûþwþûþþôþùþ¸þþþþþúþ\x00þþþØþÙþêþëþìþíþîþþþþþþþþè4þé8þç#þæþâ\rþÞûþäþßþàþã%þåþáç\'!\'Ml-dS88P8 8B3>8`8D@888#8w8=898mL:$v8.8WY8Uh8o]nq[T8;(nEf8<8I8I8?87#lk^RXb*\"\raO!%{JtlK\rjEK88VAAN~8_\\x}nrZ/\"rp,QsyxFn)Ze\"2)8C86888	\"Km|K&8H0c8un1Ez8u8ûG\ni54g+8û	þêûûþ	òûþÎþ+ûþ±þMþ¤þ¥ûþzþ,þîbþ$	þ\"û\nþØûþ	DþÞãþ;þãþ9þ/ûþþí?OþþþËþtþ¤0þ+ûþþtþ%þþÛþûþúþþþúþ/þØþ\rûþúOþþþWþþ\rþ,þþûþþ0þûþ¤ûþKþþ¥ þþúþ\"þ)þ¥qþûþúþþØþêûþÂþêûþ«þæìûIþûþ©þ/«þ©þûþ+þ/þþ+þ\x00þ¥þØ)û\nþÂþiþØþþæûþ\rNþûþ¤ûþ5þØþþ©þ4iþûþ\n\"þþ		þ¥ þþaþûþùJûþ#KþûþùJûþäþþûûÃþNþþDþûþûþìþùþñþûþ4ûþæþ;Oþþþä	þû%û\nþØþÇþûþ/þÞþúþ þØþÙþZþÙ¥þØþLþØûöþÙ}þþ\n®þûþOþþþ¬þûþØvOþþþkþ.7Igþ-þþþûþØûþ\ríûþ\rG	þùoûþË«þ¨^þûþþþ¤bþû û\nþØûþMþSþ¦þùþ-þßþûþ©þ5þêþIþ¤þØþtþ%þþÛWþþ\rþþ4þþûþúþ þþþþ¡þþ)ûþþéûþtþèþ¦ûþ­þØþäþåþþGþùþIþttþ#ûþØûþ\r·AKþþþþ\rþØ,þþûþØþ0þûþûþñþþþþ	 þû«ãþ^þûþ%þ(þ¤þþþ·þ®þ¤fþþ¤ûþþùoûþ	ðþ¤þ<þ;þgþ~	=þúþgþþþþé\rKþûYþØVþ þãþ;þÞÏþþaþûþûþØûþÔÏþþþûþ¨þ¶þëþì×	þêûûªûþ°þúþ	%þØþ¤þ¥ûþxþûþùþGþûþ¥þ\r{þþûþûþzþþËþûþ¤ûþÁþ¨ûþùþ®þþwû¼þ¤=þùþlþ¨þ¤ûþ¤Mþ¤þ³þùþlþ¨þûþ¥ûþþØPþûþMþþ¢þþþþûþ0þ8#þgþþ\rþ¥Ðþþûþ¤þ0þû«ãþûþ	þ¥þþôþþUþ±þ;þþkþÏþ©ûþùþ®þþûþþoþûþû û\nþØûþÈþÞþØþÙþþþ	þ¤þTûþzþáþûþwû£þê	þûûÃûþuþûþ¨þ5	þ$û\nþØûþ·Wþþ\rþ¤,þþûþ¤þ0þÝ	þ¥ûþ¥þ÷þàÏûþ4þçþ¤þTûþzþâþtþ%þþ	Oþþþöþ-ûIOþþøþûlgþgþþ¬þVË	þùoûþ0«þ©^þûþùJûþ	þûþþûûþCuËþgþ£Oþþþèþûþ¨þ/«þ¨þ¤ þØþ,þøþûþ©þ¶	þtþ%þ¤þ0þþþþþ\x00þþþþïþðþñþþþòû>\n$	%)#\r,\'.,, !û&,(\"+*,-û/	þþ=þíþ	ù:ûþÏþG	þûûþ2þî=þþSû£þëþëþIûþÐûþ2þþ×þûþ¦ûþ\rMþ,qþ,ûþïKþùoûþ¿þïþùþþ;þþÈþûþßþòþþþ¤þ¥ûþzþ,þþmþ,ûûþþ,þíþ,þ\r(þìþï0\rþþGûþTûþ4ûþ	aûþ4ûþ¶þîbþtþëþûþPþðþùþ¤ûþ\nBþPþî þþûþþïþ,û\nþïþúþõþPûþùþÍþûþÒþþìþþñþ§qþêþ;û¼þê	þêûþÂþêûþEþëþIûþþëÈûþ\rRûþþ¤ûþ¥ûOþþþ¬þûþêþû%û\nþ¦ûþþø	þëûûªûþ	Xþûþþûþìþï0Oþþøþþð	þûþ§þEþ¨þ©þþþþþûþþþôûûûûOþþþþúþ/þôþGþû û\nþôûþ';

//canvas toDateUrl
yqvm.memory.globalVar.canvas_2d = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAAAAXNSR0IArs4c6QAAEkpJREFUeF7tXXd4FcX6fmd3T0s7SQgSKdIEBASR5CJFpQoIiHQQpAiCgJeqEIwKEaUFUEIg8kNAREWa/pSqFKmSEAigKGKABBSUIslJTk7fnbnPTEwkSrhIos+5YecfHnanfeWd9/u+2QOEza7BoDe/0QCZkkH8ZjP6RkB0gPiXF+gA8TN76ADxM4PoDOJXBtEZxK/MAegM4l8G0QHiX/bQAeJv9tBDLP+yiM4gfmYPHSB+ZhA9B/Erg+ghll+ZQ89B/MwcepnX7wyiM4hfmURnEL8yh84gfmYOnUH8ziA6g/iVSXQG8Stz6AziZ+bQGcTvDKIziF+ZRGcQvzKHziB+Zg6dQfzOIDqD+JVJdAbxK3PoDOJn5tAZ5EYGoZBwRqsKF0yoJl2Eldj/Mbvpn5r8Y6q+pYVuyiDveXpggjNWTHTK2gF3SdduadI/dlIhY5F7IPoZtyBSuipe3207CBO8OBfa6rbmLG7QEbUB2tvfFa8/Dx6KJso3Rbo6mQUtctfiPK2IuQFzMMy0vvB9ulYdIx3TcVyrW2RMQ/kHzAiYjxbK0SLPuQyBcOFMaNubynCr/fgkfxkgcUwJc2W/KDNt1a/x5X8uVWXqk92cQZrnrsMprYZQ0wvmFXjZknRbKnveEYePvF2QEtIbteXMvxUgfPKZrlGY5x6GQOLEUWs3lCdZYk0Ggh55i7HX1wSPG/bhw6CJhfJ86O2KMY6p4u+15HNophwDB1Oy90E4mRkOEoCVQTHoaNhXOOau7EMIIXn/FSC32u92ABI+5dpKxshgidF61+Ijvr8tA+mDitVAsQzCT9OmuevRxbAbp73V0YIewxsBb8JkcYOQv/Yr3UF5c7HZ11oApCb9EZJCQUn+L0s1p0H8aQzwlJqZeIjUKzcRd3uuobJ0CZPClkKRVLzsnIi3Pf1RUbqC1JCeMLg1MEZwQY5EtPNjKNCwOmgC2srJUL0GMJq/R85KH3q6IpuEYHjwGrQ2pYjnBY5/0tjppjJ4kS8jnNJ/lfWvMkh4zLVPGEh3k+Sp/72rqzHUSdPJ0jRnqSnzDp+oWIDEOCfjHU8frA0ah3POKjjurYdnzB/jQfN3kA1qEbXtVZtgqbsf9qnRUKGgnnwGcy1z0Fj5DkMds7DZ2wY8zOrM9qIdScYg68fo6FgOM7xYL4/DCk8vLJN64bPgkagkXS6cO5uFoL19JepKZ7EqaJJ4flStj5dcL+Ab7T7x94byKcyyzBdrXd+u0HIYYHsTtbXzaG88AJPFhf6OtwQIDob0QTXfz6BUgiRTdPAuxzG1Ht6wvIWRyhqoXkVMxQ8CIlOAERz0RGGtpxOqyxcw0bpMjCsAyBJpGr7wPYL3pG6CIWMtb6OTYW/hdtraVwmmWStNKARIcXJEvbKpyG/SrZNtbSWJjgVDGwAKAzkhM+3f1+IjUsNistYC6MGfP0zTrjalJ86M1lZ1Cltw3HaH+3WpiX9DgHBnrmLbLxb5KeQRXHBWwjjPy2hOjmGC+d0ip/1htSE62FeIvi2VVFxmESIs4+HND9YOmOYaizXeznCwAAzERjxM0tArZCsq5n5VmIPMco3CXPcwEcLxUK6gcYByoI41r0KcZSG2+FphYN488ZqzQC3pHDg4eVsXNBbtDAeLKGa3rymW5jyFcJaDXBKErfIjWBH4ErpgDzRVBicxg8UjHJ3LfNnaFMwtizkUk0+AoKDxcOvh7DV4hKaJ3IW/j8xNFuP6qdsQLtvwvbE6+Jq8JQVOEzkXb38MsW4mB4BO2XPCt/Fx4S9da8YoEUIRsF0MJBJAfQB5Rs0b6VWM8WAYBCCoA/0qozH9LmO4tqa3DpBSw8eNc5CN3rYY4piDwaZPME+JF87U2bsUskaxwhSLSMvlQuepYtsnnH9T8Ag0I8dBVRmfuttjp68ZHjUexlNBmzDYOQfZnlAkmeJQQfpVOGYv50J8LdfBaXN7XGOhqOfeih5sJ962TIVi9onT+9Hc1fhWq42jId1QwZuF4c43sFV6FMsDY9FN2SlO+rO+qljgGQwmESwOnQpF0opoJ845BpecFSAziprm8xgf8C5UT37IYzB7cQnlUT9nqzjh+V54WMUZUjYUnYf3r2PbjmDqwGfG0bhLuYZKrv0CIAlkBvoat0I2qjjlvheLXU+DShISQ+NgkH2FAPne/Ljo38C9GVnMekM58hCYHev8v3r1k7ZeCovJ4uWzIEZJqzNqpzMGqt2/RO49NkOq1Kkccj4em/f26HrW3Uua0+Pdp/iWT72fpl+mjDiIzC6GLTiyp/Tc5M6d6YYM0tn+DpLVB7ErZBDqe84K7SySBmCR82nMkBLQy7xNONcFGomGOZtFdWdj4Ej43PmO55WM2O5tgdrknAg5nqPTcdETieWm2HyASAxdnUvwvVQD6cYOYkxHdRmoT8YHphdxt+kKLsnl0CBniwjX9gYMwBlXdYzyxuGKEo5vgroUOjkH2wTXS2CahCmWpahk+bnIyT/LNRLvu7qhtZaKKOVbPG36rAhDHNPqoW3uKtSQfsJBQz/xrrh8iIdKJ9Q6+FIZLOSq7NknHP68sTVMxCvGcmBPc49DjhqMSZZluMd8EZH2gwKAPFfJoFXQ3LdGMGBxcgzQNsftlv71xXzDM8kg2HvK9XhfE9Oe5PNfksKz1kqdej3A0n9uqR0+cZ9lc9eGNL3bK74lrzxAf7gKgmuEyhetiYfyEyW9lUgDfwLIJVoe9XIEw2OYsgG11XO4LJXDfikKPJzqru1ComU6LAFObFVbipBnlHk1prHF+aeyyZcft/ME3KsI9nnd9zwW0/44au6OiuyKAFdBiFUAkHVyR0xxvoiFZCaeMO1CAhkoqlHxAfEYzD5FiqcRBtB5cMKMvto2mOBDitwQP5FIwWDlWTY+MkxEAyVdhE28FYR/PO9oQNNxH83EUPMGPGA6CcWYn0fxsZwFI0g2vjV2uSlAOINcZeHIMLVDAFyo696GQNmJI4aeYpykaGLeKc5J+NT9GN5TYvCgchJVPHsRTBwCIPzg6a4tggRarByv+xYmuZjZO9E0eTyF9Famq/0JAmYwSGxT4IK0X/haOWOimzCCRkOMM5/aK0e3WuGd+mxrLUVmkrpOD7FKhIkig/8EkNmu5xDvHi46tdNSUJ5l4Qu5BbKIVTyrT89ihvImmlvSsIZ1xljnq5hsegcTsVIwA3f+65vmUzDeHYsP1a43BYjPIqO6bTd60u1IsLyBVt73cYrVwHlrS5jcKnZoLTBQjUctnMdAthEeYsQhQ4Mia71KklCHZIo9OIgFjXI2iVBmdsBcBPrcOOiKgkJUTA1ehHKm/NIvb5wFnZoFh4y9ESLnwWApKgPvY2MhqGH7UpSMvzV3EaFYlPv/YZI9vzMPByYBXnWNx2L30/jMMBoPSV/jfvcWUIkIgHypNkN/bV6xcuz0Nd+22Pv6YTcxVZuujB6kQJ1/xN0nnTLyS3ji4U0Fe2Yjogw5BjRoE7BiRqZUpaMOkNIDxfUz/Qkg99p2CadKDu6NKt4rom8BIxxQo7HM1Rt1SYao1Bwx1kcX+1IMVTZgpvwWZEUTcTgPO0Y43kB16QJetSxGQZn3ZgzCw5rBjnic9NRCkvIaYnwvIsKUhY9ME6H5ZKSSBujqXoI2JAWrjS8U0cZVWg4UBBFSNmRoIoEe6JqHbb5HxX3G5sDn4HUbMd81DBdpBdwr/4hx1hWFodhox2vY4O2I2ZgvQrAbhViTnDFY7uktyt7LpVfAC901PLtACMVZ42OFCT/fWL+8BdjuexjJlj6oTi+iuXstbFKwAMh3Wi20VVcWK8fZvKqv3KdlZqVK99eMNU14IQjOLdvcz23UJOlEuQWpyci/GPwQBGezZ4fHFpR5dYD8AwDZr0bjSfsS1JR/RIqlj3DM6xsv4U5xTIIGCRMt7yLclIWaebtQm53H56ZhCDbmiQSXV6240z1j+hjzA2aJUu+n3seQYu6DauziDUMs7pS8ItXbnog+6udwEjP6WjejjZoKxoAcUyDq5G5HHZqJ9aZx4lafV5lsNASjHNPFnhYGTkek9Cs+pe0wwv26yAu+CekCq9shxPhVCcVT9gW4n55GD9N2tAn+SuQMl2kEHsrdgNbqYfQ2bEPHkD2QyO8VrKWeviJs4m1H0BA08J3mRIFKv+UgO5Rn0FD5QTBPQV7G184IaAtZpUUAYmeBqOW9uRzD1Q3DKtCref3Nc9eGMIe22jt5UhjN+ioi8UhqaEz2IAL2HhiWZMeHj/qt1Nsn0Tv7+S7al6oeYpUuUIowSMFJ/7plAYbT/E8weLjCQ6eCxm/FeT4wiqzBYPMnmInn8JHrCXSju/CQ+TgOSI2x2vsEPMyIH0LbI8xrR4J3MGaoI9EPW9GBHEDXkB1/ykE4QPhNNw+zGmrpqM4uYF7YTDCPLIDAWWGqaxw+cXVAe3pQVMjOGCtjpacnfqZ3IcayFJON7yCTVkZz+3p4oeCDoBdEX6pJheEfv/DbYm+DCGbD5KClqGzJ/zrjtFYNE20v4x76CxyyGcHmPF5axUFfY5FY88bvSUZIa0Wlju+povOAYMv+6ha0MqbiiilUhKe5LAgzA+bjWWwQa/OqlSZJgkHEPGRksXIwRuIySLsFxKORWoYdL5UjOZMf1/bbDUz9YJnSk4BgCACzQfZFptu7NBhumjZ6p9y8+2Na8k/N2PFvhmjrn9ZzkNIDSSFAXMyMSrYDYub04PYI8TrE6frHeJxfcPFvnfqoX4gE2mJx4k3PUJzLqyIc/BOlnRi3KOA1dJfyS7EXpApo416FBtppEXIklHvthgDha/P4fYPrcUyVktDT+LnYT8GdBL8hT3QNxNm86oIxtsgtYZFd6GbYCQ5q6pJFYr9C6oEuxt1YZJpeeOnH5Sj4AqC//U2Euh24W7qCWGuSCA15O6HWxtbcNvhRq4ivpTo4KdUU1adWhkN41rQOzXBcFB7yDw4fKuYeEDf1A9TNAmD75ShcIhHizmaUaTV8LqPoW9WzR9wLFQBECfAVK0cz97mQlu49fQEqZUqV13UzLJzUme6LLdCtFwY3CIam2zumGWTaaqPUxjXONCWxBT1mrUov0llIqBAyP+3X0nORO3umG/5L4rYxUe1BSDVKaEp4wtGiX/v9pi/7+OhWGkVtgJwNXXh416UxLZqek6s8pkJy1WI/bbfAGUJB6oBBtsuG96u8lezaO3Fw1xrquarBcF4GJRmhi1KP2MZFD2OUaGGJh1deb4rsMf8aQggzgkCzLjiygvDj/Ld2bcxDTTPlSq0ByXcfzu9UfVSiklRXIiwQoGmhC4+mZcVEWSWX3Js7GpOU7WELUs5dP3/uuOg6lKElIFErI+tI4qFc/j57fKNQOw0dcF6pXF5mvuy6asZxRQLzMVZRAkJ4nz/qxTa2ybNXSWjwLygfXEO9sCNAsTsIlRvz/cvAwXss24/xwlOmq+MUQqjXmnBkFZ/nVuTg/W5Xt3e2a5eO9H8CCItrpeRk5Q3l0xc49o2WujSy4V1mo7Ebf2cND1qBuD1azr+bREGijQv7E2jER/dak46e4c9sox4OY4rnSeH4kGjowtRlxQEkZ8xDTRnRGlLCToYnpOVT22+NAcQ2JroRIVIUBwB/TAhxEoaM4PDDKSQONGtsdD/u0LKE9OBiLs1yxkZ3YkBlEJYdmpBW+FnvzyOiIixG0pxI4DfXojFGvETBBZ9PPVl+0bEiX81yGaCRPEJoHiOkUv4IiVKipt5j2HvJIPv49zNnMl0d51wPkFuRQ6wNkNvRbem4yJ09S6n/XxTC6OMbWUM1E0XiITsR9i3a2IRmFlhNPhK3p+hHXbdhi6uTWwRH5BkYSdqTdxvDbzqEHxa5OZ4Qr0HylY//6pZ+FMLG3GvKUSMDrEkHbOFTsniMKL6hAvBOpqtj6vUAuX7xW5Hjn9Ztaevzf3G+UgfI/6IS/q49h03OWgOCemBIHimvjo1xrOxJgdzwhUfW/F1r6vOWrgZ0gJSuPm84W34oJ1UU+RAhp8ISDv/+o5J/YH19idvXgA6Q29fdLY+0jf1XWzAWJkG6HFwuILk0QstbXlzvWCIN6AApkfr0wWVdAzpAyrqFdflKpAEdICVSnz64rGtAB0hZt7AuX4k0oAOkROrTB5d1DegAKesW1uUrkQZ0gJRIffrgsq4BHSBl3cK6fCXSgA6QEqlPH1zWNaADpKxbWJevRBrQAVIi9emDy7oGdICUdQvr8pVIAzpASqQ+fXBZ14AOkLJuYV2+EmngP1+wqqs5+FYyAAAAAElFTkSuQmCC'
yqvm.memory.globalVar.canvas_webgl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAADRxJREFUeF7tnV2IZEcVx0/1jOQhiPoQxISIAUOECKtEgiJCD4oiCioiIhEUVFBQ8AMR/GD64seDoogEFBSFCOpDwI8HRR8yLQpKJDtxZ8kmO2tm3WEnuosuSXQXM2Gv3O6edM9Mf9zuvlV1TtVvXvfeqlP//8kvVaerbjnhDwVQAAWMKOCMxEmYKIACKCAAiyRAARQwowDAMmMVgaIACgAscgAFUMCMAgDLjFUEigIoALDIARRAATMKACwzVhEoCqAAwCIHUAAFzCgAsMxYRaAogAIAixxAARQwowDAMmMVgaIACgAscgAFUMCMAgDLjFUEigIoALDIgcYVKEtpi0jbOek03jgNZq0AwMrafj+DHwBrQ0TWnJOun15oNUcFAFaOrnse8/VSNpz0Zlld52TNc3c0n5ECACsjs0MNdQRYVZcFS8NQyqffD8BK3+PgI7xeSnkksYBWcBfS7BBgpelrtFHtl9Jekd6S8Ogf9axorqTTMcBKx0sVI9kvpbMisj4msahnqXDIdhAAy7Z/6qJ/tpSNVrWlYXxkLA3VOWYrIIBlyy/10T5bStkSmXZZANBS76LeAAGWXm/MRVbVr5z0ZlhTbzdxjstPzJmrJGCApcSIFMKoCyz2Z6XgdpwxAKw4uifZ6/5gw+isGdZg8CwNk8wCv4MCWH71zar1/cH+q5rAqrQBWlllyPKDBVjLa0gLInKtlPbqYP/VHMAS6lmkzzwKAKx51OLZiQosCizqWSTVPAoArHnU4tmJCjwzqF9VCTXPDIt6Fkk1jwIAax61eNYXsKhnkVu1FABYtWTioVkK/G9kw+gCM6xe89SzZqnMvwMscmBpBar6VWtkw+iiwKKetbQVyTcAsJK32P8Arw3ODx6AaglgsTT0b5fpHgCWaft0BN8wsICWDltVRgGwVNpiK6hrg/pVQzMs6lm27A8aLcAKKnd6nVX1KxnUr5oEFrvg08uVJkYEsJpQMeM2/ltKpyWyXsGqYWCxNMw4ryYNHWCRFEspcHXkwLMHYAGtpdxJ72WAlZ6nQUd0deTAsydgsT8rqKO6OwNYuv1RHd3TIxdOeFoSHoyfrzqozoRwwQGscFon11NAYLE0TC57FhsQwFpMN94Skf+MXDjheYbFTIuM6ykAsEiEhRWIACzqWQu7lcaLACsNH4OPoloOjl44EWiGxdIwuNO6OgRYuvwwE01EYAEtM1nSfKAAq3lNs2jxqTEHnn1ta5ggKL8cZpFphwcJsDI0vYkhKwAW9awmjDTWBsAyZpiWcJ8ac+A58AyLpaGWZAgYB8AKKHYqXV0ZbBg9WmiPACyglUpS1RwHwKopFI8NFXiylI4bc+A5ErCqwNacky4epa8AwErf48ZHWNWvRHqfRT70hYaIwKKe1bjLOhsEWDp9UR3VkxMOPMcEFt/PUp0yjQUHsBqTMo+GqvpVdeHEwf2Do5CKDCzqWRmkIMDKwOQmh6gcWNSzmjRbYVsAS6EpmkO6MuXAs4IZVk867jfUnEHLxQawltMvu7evHLkwVdmS8MAPdsEnmpkAK1FjfQzrcint1SMXpioFFvUsHwmgoE2ApcAEKyEYAxb1LCuJNUecAGsOsXJ/9N8jF04o/ZXwmEXUs9LKWoCVlp9eR2MRWOzP8poSwRsHWMElt9vhv2YceNbyK+EYhSnC2027Q5EDrESM9D2Mqn5VbRiddhxHMbCoZ/lOkEDtA6xAQlvv5vLIB/sm/TKoHFhd52TNug+5xw+wcs+AmuNPAFhsdajptebHAJZmdxTFdnmkfmV0hnWgJvUsRXk1bygAa17FMny+ql/JSP3KOLCoZxnOYYBl2LxQof+zlE5r5IN9CQCLelao5Gm4H4DVsKApNndpZMOo4V8Jj1rD0tBgsgIsg6aFDvnSkQ/2JTDDop4VOoka6g9gNSRkqs08MbhwYvQoTkLAop5lLHEBljHDQoebAbCoZ4VOqiX6A1hLiJfDq/8Y88G+xGZYlY3Us4wkM8AyYlSsMDMBFtCKlWBz9guw5hQsp8er5aAb88G+BGdYPVv5FI3+7AZY+j2KFuET+9J2rf6B54SL7kN9nXRdi/OG0RKuRscAq4ZIuT6y90wPVr0LU7MAVmV0KYW7QTq5eq593ABLu0MR49u7miGwDqB1I9CKmHoTuwZYGl1REtPe01KO29meag1rVHb3/N6kkj9lCmCKMkO0hLN7RdorbvwH+3IAloh03QupZ2nJx4M4AJY2R5TEc/GydJyT9VxnWD0bqnrWTSwNlaRkLwyApckNRbHsXZIN6X8WWbIquh/3oHAvBlpaUhNgaXFCWRwXL0o56SqvTJaEzznibuF/7FrSE2BpcUJRHLu70m71PynTm11lPsOqnOm6l1LP0pCiAEuDC8pi2N3p35ADsA4ZU7jbWBrGTlWAFdsBhf3vbvf3XwGsY+YU7nagFTNlAVZM9ZX2vftof/8VwDpukHsF9ayYaQuwYqqvsO+dLWmvDvZfAayxBnXdK6lnxUpdgBVLeaX97mxKe3XMgedszhLW86VwJ1ga1pOq2acAVrN6mm/twslesf3YgWeAdcTaalPpXUArdMIDrNCKK+/vwoMAq65F7m7qWXW1auo5gNWUkom08/c/jT/wzAxrrMGFex2zrJCpD7BCqq28r50/9Pdfzbp7MLed7jNsK9wbgFao1AZYoZQ20M/57nA5yLaGOQyr6llrQGsOxRZ+FGAtLF16L55/QDbchAPPLAmn+l24NwKsEP9FAKwQKhvp4/xvJx94BlgTTSzcW4BVqBQHWKGUVt7Pzm+k7aYceAZYY7Y1vA1QhU5rgBVacaX9/e2X0llxsj5pdzvAGhhX1aveAahipTHAiqW8sn4f//n0A88ASwr3LkAVO20BVmwHlPT/+P3TDzxnC6xqRvUeQKUkTdmpq8WImHFs/3R44QRLwpGl3/sAVcy8HNc3MyxtjkSIZ/vH0l6ZceA5oxlW4e4BVBHSsFaXAKuWTGk/dO4+2WgN9l9lPMMqKpfdB4CV5mwHWJrdCRTbuR9lDqyqTvUhQBUo3ZbqBmAtJZ/9l7e/3/sU8szzg4kuCQv3EUBlKYsBliW3PMS6/d0sgVW4jwEqD+nkvUmA5V1i3R2cvbe//2rWFxqSmGFVS79PACrdGTk9OoBl2b0GYj/77QyAVYHqU4CqgXSJ3gTAim5B3ADOfnP4wb4637mqOxNTkliF+wygipthzfauJK+aHRSt1VPgzDekvVIOC+7JAKuaUX0OUNXLAltPASxbfjUa7WNflY5zsn4wazIPrFL6e6m+AKwaTRRFjQEsRWaEDuXsl2VDRgruxoFVuC8BqtA5FLo/gBVacUX9PbZ++IN9JoHlpHAdQKUorbyGArC8yqu38TNf7F84Me92BUVF98J9BVDpzTA/kQEsP7qqb/XM56XTKg9/sM/EDKuaUX0NUKlPME8BAixPwmpv9sxnj3+wTzWwKlB9HVBpzyvf8QEs3worbf/Mp49/sE8psAr3LUClNI2ChwWwgksev8OtT0p79Xp//5XiGlbhvgOo4meLrggAli4/gkSz9XFprw42jKoDlhvspboXWAVJBmOdACxjhjUR7iMfHd7wrAxYhfseoGrC41TbAFipOjtlXI98WB2wCvcDQJVhKs49ZIA1t2S2X9j6oLRbbvwH+4IX3atf/n4IqGxnVNjoAVZYvaP3tvV+BcCqQHUfoIqeDAYDAFgGTVsm5NP3yIYbXDgR4VfCwv0EUC3jX+7vAqzMMuD0e4f1q2DAqmZUPwNUmaWal+ECLC+y6m309LsPH3j2+ithBar7AZXebLAXGcCy59nCEW+9s3/hxCikfADLiRS92dsvgNXCZvHiWAUAVkaJ8de3S2dFDh94bhpY0pLieb8CVBmlVdChAqygcsft7NRbjx94bgxYToobfg2o4jqcfu8AK32PnxvhqTcfP/C8LLCq5d+NvwNUGaVR1KECrKjyh+t8803SXhlz4HlRYIlI8YIHAFU4B+mpUgBgZZIHm+3hDTlLFd2dFC/qAqpM0kbdMAGWOkv8BPTw64cXpi4ELCfFTX8EVH7codW6CgCsukoZf+7h1y4GrKpG9ZI/Ayrj9icTPsBKxsrJA9l8jbTdhAPPE2tYg+9S3fIgsMogRcwMEWCZsWrxQDdfNSewnBS3ngRUiyvOm74UAFi+lFXU7uaJyQeej9SzittOASpF1hHKEQUAVgYpsXnndGC5lhS3nwZUGaSC+SECLPMWzh7A5h0TDjw7Ke54FFDNVpAntCgAsLQ44SmOv7xc2qvHDzwXd54DVJ4kp1mPCgAsj+JqaPqhl0mnNTjwXG1ROHEeUGnwhRgWUwBgLaabmbdO3iobzsnvX30BUJkxjUAnKgCwEk+Oh26Wzl17wCpxm7MZHsDKxmoGigL2FQBY9j1kBCiQjQIAKxurGSgK2FcAYNn3kBGgQDYKAKxsrGagKGBfAYBl30NGgALZKACwsrGagaKAfQX+D71uELW5j8nEAAAAAElFTkSuQmCC'

// 需要代理的对象
window = yqvm.toolsFunc.proxy(window, "window");
document = yqvm.toolsFunc.proxy(document, "document");
location = yqvm.toolsFunc.proxy(location, "location");
localStorage = yqvm.toolsFunc.proxy(localStorage, "localStorage");
sessionStorage = yqvm.toolsFunc.proxy(sessionStorage, "sessionStorage");
navigator = yqvm.toolsFunc.proxy(navigator, "navigator");
debugger;
//自执行函数
(function () {
    var _$ee = 0
        , _$Ez = [[5, 2, 3, 1, 10, 7, 0, 4, 8, 6, 9], [10, 63, 0, 13, 61, 94, 37, 26, 46, 26, 87, 32, 17, 9, 67, 55, 31, 29, 59, 39, 68, 64, 58, 21, 49, 91, 44, 25, 26, 45, 65, 89, 95, 88, 51, 15, 79, 57, 38, 4, 15, 7, 99, 11, 26, 30, 23, 15, 66, 83, 8, 13, 93, 15, 52, 34, 90, 81, 22, 86, 16, 14, 15, 1, 54, 15, 80, 28, 48, 3, 26, 50, 2, 96, 48, 42, 35, 26, 98, 48, 26, 41, 13, 71, 62, 6, 12, 82, 26, 19, 53, 33, 56, 97, 84, 78, 70, 69, 72, 47, 75, 20, 74, 5, 92, 85, 76, 77, 27, 60, 40, 18, 73, 43, 24, 36, 26], [17, 6, 24, 9, 24, 16, 28, 12, 22, 13, 0, 11, 10, 21, 14, 0, 30, 8, 29, 8, 1, 33, 31, 3, 4, 23, 26, 18, 26, 32, 26, 15, 26, 7, 25, 26, 5, 26, 20, 27, 2, 19, 0], [8, 42, 11, 31, 3, 19, 24, 21, 39, 38, 45, 23, 46, 41, 34, 40, 30, 2, 5, 4, 15, 18, 46, 44, 3, 33, 32, 6, 47, 17, 42, 7, 13, 26, 35, 7, 9, 25, 20, 25, 1, 43, 1, 0, 46, 25, 36, 0, 30, 27, 28, 10, 22, 37, 14, 20, 0, 36, 27, 21, 16, 29, 12, 24], [15, 25, 24, 32, 25, 31, 7, 21, 12, 26, 25, 22, 14, 13, 25, 19, 11, 13, 36, 9, 33, 4, 8, 0, 28, 1, 36, 29, 3, 34, 18, 20, 8, 6, 1, 10, 29, 25, 16, 2, 5, 17, 12, 30, 27, 35, 23]];
    function _$RY(_$oc, _$8A) {
        return _$H2.Math.abs(_$oc) % _$8A;
    }
    function _$cE(_$lD) {
        _$id(_$lD);
        _$lD[2] = _$fn() - _$lD[_$RY(_$39(), 16)];
        if (_$GP() - _$lD[_$RY(_$sF(), 16)]) {
            _$lD[3] = _$fn();
        }
        if (_$lD[_$RY(_$$s() + _$xU(), 16)]) {
            _$c7(_$lD);
        }
        var _$DY = _$fn();
        if (_$lD[_$RY(_$$s() + _$xU(), 16)]) {
            if (_$lD[_$RY(_$sF(), 16)]) {
                var _$rq = _$hQ();
            }
        }
        return _$oV(_$lD);
    }
    function _$id(_$lD) {
        _$zg(_$lD);
        var _$ZY = _$79();
        var _$DY = _$$s() + _$xU();
        _$lD[6] = _$Qe() + _$8g();
        _$lD[_$RY(_$lD[_$RY(_$39(), 16)], 16)] = _$zC(_$lD);
        _$lD[4] = _$4K(_$lD);
        return _$ub(_$lD);
    }
    function _$zg(_$lD) {
        _$lD[_$RY(_$hQ(), 16)] = _$$s();
        var _$ZY = _$_T();
        var _$DY = _$sF();
        _$lD[_$RY(_$8g(), 16)] = _$fn();
        _$fD(_$lD);
        return _$Qe();
    }
    function _$hQ() {
        return 15
    }
    function _$$s() {
        return 5
    }
    function _$_T() {
        return 6
    }
    function _$sF() {
        return 4
    }
    function _$8g() {
        return 3
    }
    function _$fn() {
        return 9
    }
    function _$fD(_$lD) {
        var _$ZY = _$ig();
        var _$rq = _$_T();
        var _$rq = _$w9();
        var _$ZY = _$hQ();
        var _$DY = _$$s();
        _$lD[11] = _$GP();
        return _$uj();
    }
    function _$ig() {
        return 8
    }
    function _$w9() {
        return 2
    }
    function _$GP() {
        return 1
    }
    function _$uj() {
        return 7
    }
    function _$Qe() {
        return 13
    }
    function _$79() {
        return 14
    }
    function _$xU() {
        return 11
    }
    function _$39() {
        return 12
    }
    function _$zC(_$lD) {
        _$lD[8] = _$_T();
        var _$DY = _$8g();
        var _$rq = _$fn();
        var _$rq = _$YJ();
        var _$DY = _$ig();
        return _$_T();
    }
    function _$YJ() {
        return 10
    }
    function _$4K(_$lD) {
        _$lD[0] = _$79();
        _$lD[12] = _$YJ();
        _$lD[8] = _$_T();
        return _$sF();
    }
    function _$ub(_$lD) {
        _$lD[_$RY(_$fn(), 16)] = _$hQ();
        _$lD[5] = _$xU();
        _$DI(_$lD);
        _$lD[3] = _$fn();
        _$02(_$lD);
        return _$GP() + _$uj();
    }
    function _$DI(_$lD) {
        _$lD[7] = _$Qe();
        _$lD[_$RY(_$Zs(), 16)] = _$79();
        _$lD[12] = _$YJ();
        _$lD[_$RY(_$GP(), 16)] = _$uj();
        return _$Qe();
    }
    function _$Zs() {
        return 0
    }
    function _$02(_$lD) {
        _$lD[_$RY(_$YJ(), 16)] = _$ig();
        _$lD[6] = _$sF();
        _$lD[2] = _$Zs();
        _$lD[14] = _$39();
        return _$YJ();
    }
    function _$c7(_$lD) {
        _$lD[_$RY(_$Qe(), 16)] = _$8g();
        var _$rq = _$xU();
        if (_$79()) {
            var _$rq = _$GP();
        }
        var _$rq = _$hQ();
        var _$ZY = _$$s();
        return _$lD[_$RY(_$ig(), 16)];
    }
    function _$Mw(_$lD) {
        _$lD[7] = _$Qe();
        _$lD[_$RY(_$Zs(), 16)] = _$79();
        _$lD[12] = _$YJ();
        return _$GP() + _$uj();
    }
    function _$oV(_$lD) {
        var _$DY = _$hQ();
        var _$ZY = _$$s();
        _$Gq(_$lD);
        var _$rq = _$GP();
        if (_$fn() + _$hQ()) {
            var _$DY = _$uj();
        }
        var _$rq = _$Zs();
        if (_$lD[_$RY(_$ig(), 16)]) {
            if (_$uj()) {
                var _$rq = _$79();
            }
        }
        _$lD[_$RY(_$$s() + _$xU(), 16)] = _$j5(_$lD);
        return _$$J(_$lD);
    }
    function _$Gq(_$lD) {
        var _$DY = _$39();
        if (_$_T()) {
            _$lD[_$RY(_$Qe(), 16)] = _$8g();
        }
        _$lD[8] = _$_T();
        var _$ZY = _$YJ();
        if (_$Qe()) {
            _$lD[3] = _$fn();
        }
        var _$ZY = _$sF();
        return _$kS(_$lD);
    }
    function _$kS(_$lD) {
        _$lD[0] = _$79();
        _$lD[12] = _$YJ();
        _$lD[_$RY(_$GP(), 16)] = _$uj();
        return _$Qe();
    }
    function _$S9(_$lD) {
        _$lD[_$RY(_$Zs(), 16)] = _$79();
        _$lD[12] = _$YJ();
        var _$rq = _$uj();
        var _$rq = _$Qe();
        _$lD[_$RY(_$Zs(), 16)] = _$79();
        return _$39();
    }
    function _$j5(_$lD) {
        _$lD[_$RY(_$Qe(), 16)] = _$8g();
        var _$ZY = _$39();
        var _$DY = _$YJ();
        _$lD[8] = _$_T();
        return _$sF();
    }
    function _$$J(_$lD) {
        _$lD[0] = _$79();
        _$lD[_$RY(_$$s(), 16)] = _$xU();
        _$pM(_$lD);
        return _$fn();
    }
    function _$pM(_$lD) {
        _$lD[7] = _$Qe();
        _$lD[3] = _$fn();
        _$lD[_$RY(_$39(), 16)] = _$YJ();
        var _$ZY = _$uj();
        var _$rq = _$Qe();
        return _$8g();
    }
    var _$zo, _$g_, _$H2, _$mI, _$bS, _$cE, _$cn;
    var _$4r, _$0m, _$kT = _$ee, _$Ch = _$Ez[0];
    while (1) {
        _$0m = _$Ch[_$kT++];
        if (_$0m < 4) {
            if (_$0m < 1) {
                _$bS = _$H2['$_ts'] = {};
            } else if (_$0m < 2) {
                _$kT += 5;
            } else if (_$0m < 3) {
                _$H2 = window,
                    _$cn = String,
                    _$mI = Array;
            } else {
                _$bS = _$H2['$_ts'];
            }
        } else if (_$0m < 8) {
            if (_$0m < 5) {
                _$GR(0);
            } else if (_$0m < 6) {
                _$zo = [4, 16, 64, 256, 1024, 4096, 16384, 65536];
            } else if (_$0m < 7) {
                _$4r = !_$bS;
            } else {
                if (!_$4r)
                    _$kT += 1;
            }
        } else {
            if (_$0m < 9) {
                _$kT += -5;
            } else if (_$0m < 10) {
                _$kT += -6;
            } else {
                return;
            }
        }
    }
    function _$GR(_$ZY, _$oc) {
        function _$rE() {
            var _$cn = _$2c.charCodeAt(_$aS++), _$RY;
            if (_$cn < 128) {
                return _$cn;
            } else if (_$cn < 251) {
                return _$cn - 32;
            } else if (_$cn === 251) {
                return 0;
            } else if (_$cn === 254) {
                _$cn = _$2c.charCodeAt(_$aS++);
                if (_$cn >= 128)
                    _$cn -= 32;
                _$RY = _$2c.charCodeAt(_$aS++);
                if (_$RY >= 128)
                    _$RY -= 32;
                return _$cn * 219 + _$RY;
            } else if (_$cn === 255) {
                _$cn = _$2c.charCodeAt(_$aS++);
                if (_$cn >= 128)
                    _$cn -= 32;
                _$RY = _$2c.charCodeAt(_$aS++);
                if (_$RY >= 128)
                    _$RY -= 32;
                _$cn = _$cn * 219 * 219 + _$RY * 219;
                _$RY = _$2c.charCodeAt(_$aS++);
                if (_$RY >= 128)
                    _$RY -= 32;
                return _$cn + _$RY;
            } else if (_$cn === 252) {
                _$RY = _$2c.charCodeAt(_$aS++);
                if (_$RY >= 128)
                    _$RY -= 32;
                return -_$RY;
            } else if (_$cn === 253) {
                _$cn = _$2c.charCodeAt(_$aS++);
                if (_$cn >= 128)
                    _$cn -= 32;
                _$RY = _$2c.charCodeAt(_$aS++);
                if (_$RY >= 128)
                    _$RY -= 32;
                return _$cn * -219 - _$RY;
            } else { }
        }
        var _$aS, _$2c, _$aH, _$3q, _$cn, _$RY, _$ee, _$kT, _$4r, _$E3, _$0m, _$Ch, _$lD, _$Qv, _$BP, _$rq, _$DY, _$tu, _$SY, _$$q;
        var _$zg, _$$s, _$id = _$ZY, _$_T = _$Ez[1];
        while (1) {
            _$$s = _$_T[_$id++];
            if (_$$s < 64) {
                if (_$$s < 16) {
                    if (_$$s < 4) {
                        if (_$$s < 1) {
                            _$zg = _$bS["dfe1675"];
                        } else if (_$$s < 2) {
                            _$RY = _$GR(8);
                        } else if (_$$s < 3) {
                            _$cn = _$cn.replace(/[\r\n\s]/g, "");
                        } else {
                            _$bS._$tt = 1;
                        }
                    } else if (_$$s < 8) {
                        if (_$$s < 5) {
                            var _$aS = 0;
                        } else if (_$$s < 6) {
                            _$oc._$Fg = "jQlJhI9YwmG";
                        } else if (_$$s < 7) {
                            _$cn = _$H2.eval;
                        } else {
                            var _$4r = _$rE();
                        }
                    } else if (_$$s < 12) {
                        if (_$$s < 9) {
                            _$zg = _$$q > 0;
                        } else if (_$$s < 10) {
                            _$id += 30;
                        } else if (_$$s < 11) {
                            _$bS._$x$ = _$GR(16);
                        } else {
                            _$id += -30;
                        }
                    } else {
                        if (_$$s < 13) {
                            debugger
                            ret = _$cn.call(_$H2, _$oc);
                        } else if (_$$s < 14) {
                            if (!_$zg)
                                _$id += 2;
                        } else if (_$$s < 15) {
                            _$bS._$gl -= _$GR(8);
                        } else { }
                    }
                } else if (_$$s < 32) {
                    if (_$$s < 20) {
                        if (_$$s < 17) {
                            var _$rq = _$lD.join('');
                        } else if (_$$s < 18) {
                            return _$kT;
                        } else if (_$$s < 19) {
                            _$oc._$hg = "_$hp";
                        } else {
                            _$oc._$0Z = 46;
                        }
                    } else if (_$$s < 24) {
                        if (_$$s < 21) {
                            _$oc._$4r = "_$jX";
                        } else if (_$$s < 22) {
                            _$cn += "PwDdYeWQAOnZaLEtO4NRrxJoH5cddu8c08Lv1MXDKu4joNwGOqLR5AeNkAAR3U1gnV7XEdQZ2KSyesomEeu$7TkKG3p4v3LsH7siasMDB8ejjKKn1y81Y1XPvYy5xdzLMApaLitEUNV2anwFbAmO5g$K_cKPXA9RqomAxT1AB6B9_mqrJxpRo11T";
                        } else if (_$$s < 23) {
                            for (_$BP = 0; _$BP < _$$q; _$BP++) {
                                _$lD.push("}");
                            }
                        } else {
                            var _$0m = _$rE();
                        }
                    } else if (_$$s < 28) {
                        if (_$$s < 25) {
                            _$oc._$y$ = "_$23";
                        } else if (_$$s < 26) {
                            return _$GR(10, _$cn);
                        } else if (_$$s < 27) {
                            return;
                        } else {
                            _$oc._$J_ = "_$23";
                        }
                    } else {
                        if (_$$s < 29) {
                            _$zg = _$DY - _$cn > 12000;
                        } else if (_$$s < 30) {
                            _$cn += "zog_H2mIbScEoc8ArE2caH3qaSSYQvtuUO_3NOpka5vH4p0ZSNFgIBrrJgHPLl80VYbB53gl1ux3EzjXGRGahgIycnRYeekT4rE30mChlD$qBPrqDYZYidzghQ$s_TsF8gfnfDigw9GPujQe79xU39zCYJ4KubDIZs02c7MwoVGqkSS9j5$JpMBZ";
                        } else if (_$$s < 31) {
                            var _$Qv = _$rE();
                        } else {
                            var _$cn = '';
                        }
                    }
                } else if (_$$s < 48) {
                    if (_$$s < 36) {
                        if (_$$s < 33) {
                            for (_$cn = 0,
                                _$RY = 0; _$RY < _$ee; _$RY += 2) {
                                _$kT[_$cn++] = _$4r + _$oc.substr(_$RY, 2);
                            }
                        } else if (_$$s < 34) {
                            _$oc._$SN = 1;
                        } else if (_$$s < 35) {
                            var _$lD = [];
                        } else {
                            return 0;
                        }
                    } else if (_$$s < 40) {
                        if (_$$s < 37) {
                            _$oc._$Iy = "_$SH";
                        } else if (_$$s < 38) {
                            _$Ga(0);
                        } else if (_$$s < 39) {
                            var _$kT = _$2c.length;
                        } else {
                            _$cn += "ULljJNvLUKyHQYZekMB4Mdn$HhoattJ_dJa1y$lpewc9VhA_DNjewkex9f8oRwdGp5k7ykt4E09a3OD7_w17Og4A6yXFXY28k6$pn98QPtUJ7pOGyTl8Tkx51G06caOEn3CrNGdW6g6s6jm4R9_D0eFjkLZuqVzHcvhMuQSelz8Sj3UjbkbKDlml";
                        }
                    } else if (_$$s < 44) {
                        if (_$$s < 41) {
                            _$oc._$dJ = "_$9W";
                        } else if (_$$s < 42) {
                            _$zg = _$H2.execScript;
                        } else if (_$$s < 43) {
                            return 1;
                        } else {
                            _$oc._$Ez = "_$na";
                        }
                    } else {
                        if (_$$s < 45) {
                            _$cn += "$ktNIWQCcqYNH8zxqkAzMj8wFfsgHy3DZWy90p50qmIDXiASof9cFRIXPBl9rOTUarOb6eqy9ge4LHTZaeHZVoP0woMXN4YtztvaQEh0Y$9mPIEsyqF52ftwg4K$su3mN1ingN$SQl0j8sDqdl0StYN0LCEWjqIc1DVqMSiIPhrLc$0Kfd0ieS5oUU";
                        } else if (_$$s < 46) {
                            _$bS._$gl = new Date().getTime();
                        } else if (_$$s < 47) {
                            return new Date().getTime();
                        } else {
                            _$oc._$En = "_$$s";
                        }
                    }
                } else {
                    if (_$$s < 52) {
                        if (_$$s < 49) {
                            if (!_$zg)
                                _$id += 1;
                        } else if (_$$s < 50) {
                            _$cn += "EMt6uPU8JrweHUvgFYTqzTvid93gI8fydFqS4GREY2hqTuTarQmMugS29p5MLME$B54b0ABUBq34GoMef7uWnE_F1$iqKS0whPwaqGfCd1keiLYhUlpsNFQ40UIT5qJM87FyRCJt$HO9aGQopLEEIaKx4SW2qaBaxX2MUyrN_VhvpA1xH0nQ1BBf";
                        } else if (_$$s < 51) {
                            var _$cn = _$H2.eval.toString();
                        } else {
                            var _$RY = _$GR(8);
                        }
                    } else if (_$$s < 56) {
                        if (_$$s < 53) {
                            _$aS += _$Ch;
                        } else if (_$$s < 54) {
                            _$oc._$H2 = 16;
                        } else if (_$$s < 55) {
                            _$GR(78, _$rq);
                        } else {
                            _$id += 29;
                        }
                    } else if (_$$s < 60) {
                        if (_$$s < 57) {
                            _$oc._$AB = "_$zg";
                        } else if (_$$s < 58) {
                            var _$ee = _$GR(71);
                        } else if (_$$s < 59) {
                            _$cn += "ZcWmr5S1seoMQxGfuzm0llry6$wwkIF6yn3IM3sPY7Tdb8aW94UmTzHJibI0BdEUG1EX7kxpVFT7O0cUy2VaKEV9f$CTjJwLWoSk0LQPFxd2JfIodhTiDoxtjTrvGv2pPTzwRDneciGF8Yc1o2X7ghi7jkKNF8VJa6sx5kXQMWF$eF8rA0RRrIAv";
                        } else {
                            _$cn += "L09KvbLx2krafL9TGGVpOHZox0zYwExZoiRgbwP5YlaKi47ML618FQqpYoRJuSZHY9$ZrWCfnj4mkpngysABBHEnZP$QHgmrBktIkVBESHGTjcnaxV$8jjhpxgWWs2lO4RebegB2v6Dsx$fgwJk2EpVx5mNX7zJTOmD$RpPU_bbTVCDCniAxv90c";
                        }
                    } else {
                        if (_$$s < 61) {
                            _$oc._$Ga = "_$Hg";
                        } else if (_$$s < 62) {
                            _$GR(29);
                        } else if (_$$s < 63) {
                            _$id += 2;
                        } else {
                            _$GR(89, _$bS);
                        }
                    }
                }
            } else {
                if (_$$s < 80) {
                    if (_$$s < 68) {
                        if (_$$s < 65) {
                            _$cn += "25gcs$0RWLM9SMG7eWnTg852PClUQbtCncSCxkrefhGhUCWxg9CqPpGXc05ywMO5vMgY1d3zKWVNqhzNTNyrGJECJz75yE1oH6aXhoLZ5X5BjDuYgiZy3LrXeXb7XOHm55Fa4iMmbL6Mo_6cr8161QWcfz_JXwqP49XqJvtm2OEvwKWhzquHUGm8";
                        } else if (_$$s < 66) {
                            var _$2c = _$bS["dfe1675"];
                        } else if (_$$s < 67) {
                            _$$q = _$rE();
                        } else {
                            var _$SY = _$rE();
                        }
                    } else if (_$$s < 72) {
                        if (_$$s < 69) {
                            _$cn += "jR7B_RSR1t5rYfGH1kt_pZlTTppUMyM2JyFklAGWf3mBm9AJ0ldHZgx_lPqe9MjQ2QuDHwFNcWP_MzL5LP3S2Dj2j1NdfFTmopacCQbxRUAaWF2syPGyRc0TQViAHFjpMkS7aYjzdZlQNw2BsZ0QbR7bLQDUXRCNGzf1YaXe68q8KrXEUf_KtqkY";
                        } else if (_$$s < 70) {
                            _$oc._$ng = "_$ZY";
                        } else if (_$$s < 71) {
                            _$oc._$kp = "_$DY";
                        } else {
                            ret = _$H2.execScript(_$oc);
                        }
                    } else if (_$$s < 76) {
                        if (_$$s < 73) {
                            _$oc._$ys = "_$id";
                        } else if (_$$s < 74) {
                            _$oc._$a1 = "_$PO";
                        } else if (_$$s < 75) {
                            _$oc._$bS = "ctTA9Z3Ty6a";
                        } else {
                            _$oc._$E3 = "_$hQ";
                        }
                    } else {
                        if (_$$s < 77) {
                            _$oc._$mI = _$cE;
                        } else if (_$$s < 78) {
                            _$oc._$GR = "kky2IePQY3eQ7svz4z_YQq";
                        } else if (_$$s < 79) {
                            _$oc._$BH = "_$rq";
                        } else {
                            var _$3q = _$bS.aebi = [];
                        }
                    }
                } else if (_$$s < 96) {
                    if (_$$s < 84) {
                        if (_$$s < 81) {
                            var _$DY = _$GR(8);
                        } else if (_$$s < 82) {
                            for (_$BP = 0; _$BP < _$$q; _$BP++) {
                                _$Ga(16, _$BP, _$lD);
                            }
                        } else if (_$$s < 83) {
                            return ret;
                        } else {
                            var _$Ch = _$rE();
                        }
                    } else if (_$$s < 88) {
                        if (_$$s < 85) {
                            _$oc._$4m = "_$BP";
                        } else if (_$$s < 86) {
                            _$oc._$v6 = "ug4glgmUFxq";
                        } else if (_$$s < 87) {
                            _$lD.push(")();");
                        } else {
                            var _$cn, _$RY, _$ee = _$oc.length, _$kT = new _$mI(_$ee / 2), _$4r = '_$';
                        }
                    } else if (_$$s < 92) {
                        if (_$$s < 89) {
                            var _$cn = _$GR(8);
                        } else if (_$$s < 90) {
                            _$bS["dfe1675"] = _$g_;
                        } else if (_$$s < 91) {
                            var _$$q = _$rE();
                        } else {
                            _$cn += "1P82tAXnWPMMFixJ8_ByiXVUOlv$mifkSbkO77ooU_wmkg_hp9OBZ0zSI52WlnnA5De3cDUAi8MI4h$7kFp3pSx2hsII5KSUiThZMhcuZldRVPqC2J9IQwLyFtkrIV6GgGkkf88qipcxzRUnsjxM6SUwC7Ljgvk0rn6a0qog9d76dIjwTTVb7aoS";
                        }
                    } else {
                        if (_$$s < 93) {
                            _$oc._$oc = "K5st8nEkOH6WrHWeyyWZMl";
                        } else if (_$$s < 94) {
                            _$tu = _$2c.substr(_$aS, _$Ch).split(String.fromCharCode(255));
                        } else if (_$$s < 95) {
                            _$id += 1;
                        } else {
                            var _$aH = _$bS._$x$;
                        }
                    }
                } else {
                    if (_$$s < 97) {
                        _$zg = _$cn !== "functioneval(){[nativecode]}";
                    } else if (_$$s < 98) {
                        _$oc._$nj = "_$$q";
                    } else if (_$$s < 99) {
                        _$zg = _$oc === undefined || _$oc === "";
                    } else {
                        var _$E3 = _$rE();
                    }
                }
            }
        }
        function _$Ga(_$kT, _$UO, _$_3) {
            function _$NO() {
                var _$0m = [0];
                Array.prototype.push.apply(_$0m, arguments);
                return _$hg.apply(this, _$0m);
            }
            var _$cn, _$RY, _$ee, _$pk, _$a5, _$vH, _$4p, _$0Z, _$SN, _$Fg, _$IB, _$rr, _$Jg, _$HP, _$Ll, _$80;
            var _$E3, _$Ch, _$4r = _$kT, _$lD = _$Ez[2];
            while (1) {
                _$Ch = _$lD[_$4r++];
                if (_$Ch < 16) {
                    if (_$Ch < 4) {
                        if (_$Ch < 1) {
                            return;
                        } else if (_$Ch < 2) {
                            var _$vH = _$rE();
                        } else if (_$Ch < 3) {
                            for (_$ee = 0; _$ee < _$RY; _$ee++) {
                                _$80[_$ee] = _$Ga(11);
                            }
                        } else {
                            var _$SN = _$rE();
                        }
                    } else if (_$Ch < 8) {
                        if (_$Ch < 5) {
                            var _$Fg = _$rE();
                        } else if (_$Ch < 6) {
                            var _$Ll = _$Ga(11);
                        } else if (_$Ch < 7) {
                            var _$RY = _$cn > 1 ? document.scripts[_$cn - 2].src : _$g_;
                        } else {
                            var _$cn = _$Ga(11);
                        }
                    } else if (_$Ch < 12) {
                        if (_$Ch < 9) {
                            _$4r += -15;
                        } else if (_$Ch < 10) {
                            var _$a5 = _$rE();
                        } else if (_$Ch < 11) {
                            var _$RY = new Array(_$cn);
                        } else {
                            var _$cn = _$rE();
                        }
                    } else {
                        if (_$Ch < 13) {
                            _$pk.open('GET', _$RY, false);
                        } else if (_$Ch < 14) {
                            _$pk.send();
                        } else if (_$Ch < 15) {
                            return _$RY;
                        } else {
                            var _$HP = _$Ga(11);
                        }
                    }
                } else if (_$Ch < 32) {
                    if (_$Ch < 20) {
                        if (_$Ch < 17) {
                            if (!_$E3)
                                _$4r += 4;
                        } else if (_$Ch < 18) {
                            var _$cn = document.scripts.length;
                        } else if (_$Ch < 19) {
                            var _$rr = _$Ga(11);
                        } else {
                            _$hg(41, _$_3);
                        }
                    } else if (_$Ch < 24) {
                        if (_$Ch < 21) {
                            var _$RY = _$rE();
                        } else if (_$Ch < 22) {
                            for (_$ee = 0; _$ee < _$cn; _$ee++) {
                                _$RY[_$ee] = _$rE();
                            }
                        } else if (_$Ch < 23) {
                            _$pk.onreadystatechange = _$NO;
                        } else {
                            var _$IB = _$rE();
                        }
                    } else if (_$Ch < 28) {
                        if (_$Ch < 25) {
                            _$4r += 15;
                        } else if (_$Ch < 26) {
                            _$3q[_$UO] = _$cn;
                        } else if (_$Ch < 27) { } else {
                            var _$80 = [];
                        }
                    } else {
                        if (_$Ch < 29) {
                            _$pk = _$H2.ActiveXObject ? new _$H2.ActiveXObject('Microsoft.XMLHTTP') : new _$H2.XMLHttpRequest();
                        } else if (_$Ch < 30) {
                            _$E3 = _$RY;
                        } else if (_$Ch < 31) {
                            var _$pk = _$rE();
                        } else {
                            var _$0Z = _$rE();
                        }
                    }
                } else {
                    if (_$Ch < 33) {
                        var _$Jg = _$Ga(11);
                    } else {
                        var _$4p = _$rE();
                    }
                }
            }
            function _$hg(_$RY, _$VY) {
                var _$bB, _$cn;
                var _$kT, _$E3, _$ee = _$RY, _$0m = _$Ez[3];
                while (1) {
                    _$E3 = _$0m[_$ee++];
                    if (_$E3 < 16) {
                        if (_$E3 < 4) {
                            if (_$E3 < 1) {
                                _$VY.push("=");
                            } else if (_$E3 < 2) {
                                _$ee += -34;
                            } else if (_$E3 < 3) {
                                _$VY.push("=$_ts.aebi;");
                            } else {
                                if (!_$kT)
                                    _$ee += 1;
                            }
                        } else if (_$E3 < 8) {
                            if (_$E3 < 5) {
                                _$VY.push("function ");
                            } else if (_$E3 < 6) {
                                _$ee += 8;
                            } else if (_$E3 < 7) {
                                for (_$cn = 0; _$cn < _$HP.length; _$cn += 2) {
                                    _$Iy(0, _$HP[_$cn], _$HP[_$cn + 1], _$VY);
                                }
                            } else {
                                _$VY.push("var ");
                            }
                        } else if (_$E3 < 12) {
                            if (_$E3 < 9) {
                                _$kT = _$pk.readyState == 4;
                            } else if (_$E3 < 10) {
                                _$VY.push(_$aH[_$vH]);
                            } else if (_$E3 < 11) {
                                _$VY.push("];");
                            } else {
                                _$GR(78, _$pk.responseText);
                            }
                        } else {
                            if (_$E3 < 13) {
                                _$VY.push("}");
                            } else if (_$E3 < 14) {
                                _$VY.push(_$aH[_$Jg[0]]);
                            } else if (_$E3 < 15) {
                                _$VY.push("while(1){");
                            } else {
                                _$VY.push(_$aH[_$0Z]);
                            }
                        }
                    } else if (_$E3 < 32) {
                        if (_$E3 < 20) {
                            if (_$E3 < 17) {
                                _$VY.push("++];");
                            } else if (_$E3 < 18) {
                                _$kT = _$Jg.length;
                            } else if (_$E3 < 19) {
                                _$VY.push("(");
                            } else {
                                _$GR(29);
                            }
                        } else if (_$E3 < 24) {
                            if (_$E3 < 21) {
                                _$VY.push(_$aH[_$Fg]);
                            } else if (_$E3 < 22) {
                                _$VY.push(_$aH[_$pk]);
                            } else if (_$E3 < 23) {
                                _$kT = _$80.length;
                            } else {
                                _$VY.push("(function(){var ");
                            }
                        } else if (_$E3 < 28) {
                            if (_$E3 < 25) {
                                return;
                            } else if (_$E3 < 26) {
                                _$VY.push(",");
                            } else if (_$E3 < 27) {
                                for (_$cn = 1; _$cn < _$Jg.length; _$cn++) {
                                    _$VY.push(",");
                                    _$VY.push(_$aH[_$Jg[_$cn]]);
                                }
                            } else {
                                _$VY.push("[");
                            }
                        } else {
                            if (_$E3 < 29) {
                                _$VY.push(_$UO);
                            } else if (_$E3 < 30) {
                                _$Iy(11, 0, _$80.length);
                            } else if (_$E3 < 31) {
                                _$VY.push(_$aH[_$Qv]);
                            } else {
                                _$kT = _$bS["dfe1675"];
                            }
                        }
                    } else {
                        if (_$E3 < 36) {
                            if (_$E3 < 33) {
                                _$VY.push("){");
                            } else if (_$E3 < 34) {
                                for (_$cn = 0; _$cn < _$rr.length; _$cn++) {
                                    _$VY.push(",");
                                    _$VY.push(_$aH[_$rr[_$cn]]);
                                }
                            } else if (_$E3 < 35) {
                                _$VY.push(_$aH[_$SY]);
                            } else {
                                _$VY.push(";");
                            }
                        } else if (_$E3 < 40) {
                            if (_$E3 < 37) {
                                _$VY.push(_$aH[_$IB]);
                            } else if (_$E3 < 38) {
                                if (!_$kT)
                                    _$ee += 9;
                            } else if (_$E3 < 39) {
                                _$kT = _$UO == 0;
                            } else {
                                _$ee += 34;
                            }
                        } else if (_$E3 < 44) {
                            if (_$E3 < 41) {
                                _$VY.push("=$_ts.scj,");
                            } else if (_$E3 < 42) {
                                _$VY.push("=0,");
                            } else if (_$E3 < 43) {
                                if (!_$kT)
                                    _$ee += 4;
                            } else {
                                var _$cn, _$bB = 4;
                            }
                        } else {
                            if (_$E3 < 45) {
                                _$kT = _$rr.length;
                            } else if (_$E3 < 46) {
                                if (!_$kT)
                                    _$ee += 8;
                            } else if (_$E3 < 47) {
                                _$VY.push(_$aH[_$a5]);
                            } else {
                                _$Iy(38);
                            }
                        }
                    }
                }
                function _$Iy(_$4r, _$53, _$gl, _$1u) {
                    var _$cn, _$RY, _$ee, _$kT;
                    var _$0m, _$lD, _$E3 = _$4r, _$$q = _$Ez[4];
                    while (1) {
                        _$lD = _$$q[_$E3++];
                        if (_$lD < 16) {
                            if (_$lD < 4) {
                                if (_$lD < 1) {
                                    _$gl--;
                                } else if (_$lD < 2) {
                                    _$VY.push("}else{");
                                } else if (_$lD < 3) {
                                    _$cn -= _$cn % 2;
                                } else {
                                    _$E3 += 8;
                                }
                            } else if (_$lD < 8) {
                                if (_$lD < 5) {
                                    if (!_$0m)
                                        _$E3 += 7;
                                } else if (_$lD < 6) {
                                    for (_$RY = 0; _$RY < _$cn; _$RY += 2) {
                                        _$VY.push(_$tu[_$Ll[_$RY]]);
                                        _$VY.push(_$aH[_$Ll[_$RY + 1]]);
                                    }
                                } else if (_$lD < 7) {
                                    for (; _$53 + _$ee < _$gl; _$53 += _$ee) {
                                        _$VY.push(_$RY);
                                        _$VY.push(_$aH[_$Fg]);
                                        _$VY.push('<');
                                        _$VY.push(_$53 + _$ee);
                                        _$VY.push("){");
                                        _$Iy(11, _$53, _$53 + _$ee);
                                        _$RY = "}else if(";
                                    }
                                } else {
                                    for (k = 0; k < _$RY; k += 2) {
                                        _$VY.push(_$tu[_$cn[k]]);
                                        _$VY.push(_$aH[_$cn[k + 1]]);
                                    }
                                }
                            } else if (_$lD < 12) {
                                if (_$lD < 9) {
                                    _$RY = "if(";
                                } else if (_$lD < 10) {
                                    _$E3 += 17;
                                } else if (_$lD < 11) {
                                    _$Iy(11, _$53, _$gl);
                                } else {
                                    _$0m = _$kT == 1;
                                }
                            } else {
                                if (_$lD < 13) {
                                    if (!_$0m)
                                        _$E3 += 1;
                                } else if (_$lD < 14) {
                                    if (!_$0m)
                                        _$E3 += 2;
                                } else if (_$lD < 15) {
                                    _$0m = _$kT == 0;
                                } else {
                                    _$1u.push(["function ", _$aH[_$53], "(){var ", _$aH[_$4p], "=[", _$gl, "];Array.prototype.push.apply(", _$aH[_$4p], ",arguments);return ", _$aH[_$SN], ".apply(this,", _$aH[_$4p], ");}"].join(''));
                                }
                            }
                        } else if (_$lD < 32) {
                            if (_$lD < 20) {
                                if (_$lD < 17) {
                                    var _$cn = _$Ll.length;
                                } else if (_$lD < 18) {
                                    _$0m = _$Ll.length != _$cn;
                                } else if (_$lD < 19) {
                                    for (_$cn = 1; _$cn < 7; _$cn++) {
                                        if (_$kT <= _$zo[_$cn]) {
                                            _$ee = _$zo[_$cn - 1];
                                            break;
                                        }
                                    }
                                } else {
                                    _$E3 += 21;
                                }
                            } else if (_$lD < 24) {
                                if (_$lD < 21) { } else if (_$lD < 22) {
                                    _$0m = _$cn.length != _$RY;
                                } else if (_$lD < 23) {
                                    var _$cn, _$RY, _$ee, _$kT = _$gl - _$53;
                                } else {
                                    _$E3 += -42;
                                }
                            } else if (_$lD < 28) {
                                if (_$lD < 25) {
                                    var _$cn = _$80[_$53];
                                } else if (_$lD < 26) {
                                    return;
                                } else if (_$lD < 27) {
                                    _$VY.push(_$tu[_$cn[_$RY]]);
                                } else {
                                    _$E3 += -41;
                                }
                            } else {
                                if (_$lD < 29) {
                                    for (; _$53 < _$gl; _$53++) {
                                        _$VY.push(_$RY);
                                        _$VY.push(_$aH[_$Fg]);
                                        _$VY.push('<');
                                        _$VY.push(_$53 + 1);
                                        _$VY.push("){");
                                        _$Iy(2, _$53);
                                        _$RY = "}else if(";
                                    }
                                } else if (_$lD < 30) {
                                    _$VY.push("}");
                                } else if (_$lD < 31) {
                                    _$VY.push(_$tu[_$Ll[_$cn]]);
                                } else {
                                    _$RY -= _$RY % 2;
                                }
                            }
                        } else {
                            if (_$lD < 36) {
                                if (_$lD < 33) {
                                    _$E3 += 41;
                                } else if (_$lD < 34) {
                                    _$0m = _$kT <= _$bB;
                                } else if (_$lD < 35) {
                                    _$ee = 0;
                                } else {
                                    var _$RY = _$cn.length;
                                }
                            } else {
                                _$Iy(2, _$53);
                            }
                        }
                    }
                }
            }
        }
    }
}
)()
_$eb('NEAn');
_$_T();
debugger
//异步环境
//异步池排列逻辑,每执行完一个异步事件对异步池重新排列(因为异步任务有可能还会注册异步任务)
let asyncTaskExec = []
function async_pool_get() {
    //每次执行前,排列异步池事件,逻辑:setTimeout/setInterval time 0权重最大,先于load执行,每执行完一个从池中删除
    let setTimeoutPool = yqvm.memory.asyncTask.setTimeout || [];
    let setIntervalPool = yqvm.memory.asyncTask.setInterval || [];
    setTIEventPool = setTimeoutPool.concat(setIntervalPool)
    asyncTaskExec = asyncTaskExec.concat(setTIEventPool)
    //清空池
    yqvm.memory.asyncTask.setTimeout = []
    yqvm.memory.asyncTask.setInterval = []

    yqvm.memory.asyncTask.listener && yqvm.memory.asyncTask.listener['unload'] && delete yqvm.memory.asyncTask.listener['unload'] //删除unload事件

    let listeners = yqvm.memory.asyncTask.listener || {}
    for (const listenersKey in listeners) {
        let listenersValue = listeners[listenersKey]
        asyncTaskExec = asyncTaskExec.concat(listenersValue)
        yqvm.memory.asyncTask.listener[listenersKey] = []
    }
    //pool中time大于1000的全部丢弃,丢弃阈值由浏览器端调试结论决定,这里笔者调试结论为1s
    asyncTaskExec = asyncTaskExec.filter((ele) => {
        return ele.delay <= 1000
    })

    //对pool进行排序 load在监听事件中理应是先的,但不排除非先清空,到时候具体问题具体分析,这里先手动给load time设置为1
    asyncTaskExec.sort((a, b) => {
        if (a['delay'] < b['delay']) {
            return -1
        } else if (a['delay'] > b['delay']) {
            return 1
        }
        if (a['seq'] < b['seq']) {
            return -1
        } else if (a['seq'] > b['seq']) {
            return 1
        }
        return 0
    })

    return asyncTaskExec
}
function async_pool_exec(asyncTaskExec) {
    if (asyncTaskExec.length === 0) {
        return //池空则不执行
    }
    //遍历执行pool,用shift取
    let pool_event = asyncTaskExec.shift()
    let pool_event_out_type = pool_event['outer_type']
    if (pool_event_out_type === 'addEventListener') {
        let inner_type = pool_event['inner_type']
        let self = pool_event['self']
        let func = pool_event['listener']
        let args = pool_event['options']
        if (inner_type === 'load') {
            console.log(`${this} ${pool_event_out_type} ${inner_type} 事件正在执行 > ${func.name}`)
            let loadEvent = yqvm.memory.asyncEvent.load //从全局中拿到load事件
            debugger
            func.call(self, loadEvent, args)
        } else {
            //除load事件外,其余事件均以观察为主,如果调式发现确实用到,则取消注释
            /*             let loadEvent=init_events_pool.other
                        func.call(self, loadEvent)
                        console.log(`${pool_event_out_type} ${inner_type} 正在执行 > ${func.name}`) */
        }
    } else if (['setInterval', 'setTimeout'].indexOf(pool_event_out_type) !== -1) {
        if (pool_event) { //因为有取消事件的方法
            let func = pool_event['callback']
            let params = pool_event['args']
            let time = pool_event['delay']
            if (pool_event.type === 1) { //传入进来的参数有可能是函数也可能是字符串,用type区别
                console.log(`${pool_event_out_type}|${time}|func 事件正在执行 > ${func.name}`)
                debugger
                func(params);
            } else {
                console.log(`${pool_event_out_type}|${time}|eval 事件正在执行 > ${func.name}`)
                debugger
                eval(func);
            }
        }
    } else {
        debugger
        console.log(`${pool_event_out_type} 未实现`)
    }
    return asyncTaskExec
}

while (asyncTaskExec) {
    asyncTaskExec = async_pool_get()
    asyncTaskExec = async_pool_exec(asyncTaskExec)
}

//触发xhr.open()获取签名
let yq_xml = new XMLHttpRequest
let url = yq_xml.open('POST', "./modules/banner.jsp", true)
console.log(url)
