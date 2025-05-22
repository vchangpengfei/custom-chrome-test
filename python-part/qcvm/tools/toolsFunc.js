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
        for (let i = 0; i < undefObj.length; i++) {
            let tag = undefObj[i];
            if (yqvm.toolsFunc.getType(tag) === type) {
                collection.push(tag);
            }
        }
        return collection;
    }
    //从全局环境返回对象
    yqvm.toolsFunc.getMemoryObj = function getMemoryObj(yq_name) {
        let result = null
        for (let i = 0; i < undefObj.length; i++) {
            let tag = undefObj[i];
            if (tag['yq_name'] === yq_name) {
                result = tag
            }else if(yqvm.toolsFunc.getProtoArr.call(tag, 'tagName')===yq_name){
                result=tag;
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
                enumerable: false,
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
                yqvm.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
            }
        }
        if (!onLeave) {
            onLeave = function (obj) {
                yqvm.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，返回值是[${obj.result}}]`);
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
        yqvm.log(`hook ${name}.prototype`);
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
                // if(prop==='href'){debugger}
                try {//防止报错
                    result = Reflect.get(target, prop, receiver);
                    //拦截
                    if (objName === 'document' && prop === 'all') {
                        yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],该对象为防typeof检测不设代理}`);
                        // debugger
                        return result
                    }
                    if (yqvm.toolsFunc.filterProxyProp(prop)) {
                        return result; //Proxy对象白名单
                    }
                    let type = yqvm.toolsFunc.getType(result);
                    if (result instanceof Object) {
                        yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                        //将原生父对象(相对于result)的地址存到result的symbol属性中,方便在apply行为中更改this指向
                        Object.defineProperty(result, yqvm.memory.symbolRawFatherObj, {
                            configurable: true,
                            enumerable: false,
                            writable: true,
                            value: target
                        })
                        //将原生对象地址存到result的symbol属性中,方便在construct行为中更改this指向
                        Object.defineProperty(result, yqvm.memory.symbolRawSelfObj, {
                            configurable: true,
                            enumerable: false,
                            writable: true,
                            value: result
                        })
                        //将对象名字存到result的symbol属性中,在过滤不可配置属性时(Object.hasOwnProperty)作为prop字符串
                        Object.defineProperty(result, yqvm.memory.symbolRawName, {
                            configurable: true,
                            enumerable: false,
                            writable: true,
                            value: prop
                        })
                        // 递归代理
                        result = yqvm.toolsFunc.proxy(result, `${objName}.${prop.toString()}`);
                    } else if (typeof result === "symbol") {
                        yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result.toString()}]}`);
                    } else {
                        yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result}]}`);
                    }

                } catch (e) {
                    yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
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
                        yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                    } else if (typeof value === "symbol") {
                        yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value.toString()}]}`);
                    } else {
                        yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value}]}`);
                    }
                } catch (e) {
                    yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
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
            //             yqvm.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
            //         }
            //         // if(typeof result !== "undefined"){
            //         //     result = yqvm.toolsFunc.proxy(result, `${objName}.${prop.toString()}.PropertyDescriptor`);
            //         // }
            //     } catch (e) {
            //         yqvm.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
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
            //             yqvm.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}]}`);
            //         }

            //     } catch (e) {
            //         debugger
            //         yqvm.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
            //     }
            //     return result;
            // },
            apply: function (target, thisArg, argumentsList) {
                // target: 函数对象
                // thisArg: 调用函数的this指针
                // argumentsList: 数组， 函数的入参组成的一个列表
                // debug
                let result;
                try {
                    // if(argumentsList.indexOf('iframe')!==-1){debugger}
                    //特殊函数过滤（不可被执行）
                    // if(['URL'].indexOf(objName)!==-1){
                    //     return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'URL': 1 argument required, but only 0 present.")
                    // }
                    result = Reflect.apply(target, thisArg, argumentsList);
                    let type = yqvm.toolsFunc.getType(result);
                    if (result instanceof Object) {
                        let result_objName = `${objName}_obj${yqvm.memory.globalVar.id++}`
                        result = yqvm.toolsFunc.proxy(result, result_objName) //让function返回的对象也自动套上代理
                        yqvm.log(`{apply|function:[${objName}], args:[${argumentsList}], type:[${type}]}`);
                    } else if (typeof result === "symbol") {
                        yqvm.log(`{apply|function:[${objName}], args:[${argumentsList}], result:[${result.toString()}]}`);
                    } else {
                        yqvm.log(`{apply|function:[${objName}], args:[${argumentsList}], result:[${result}]}`);
                    }
                } catch (e) {
                    yqvm.log(`{apply|function:[${objName}],error:[${e.message}]}`);
                    if (e[yqvm.memory.symbolError]) {
                        yqvm.toolsFunc.throwError(e['name'], e['message'])
                    }
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
                    yqvm.log(`{construct|function:[${objName}], argArray:[${argArray}] , type:[${type}]}`);
                } catch (e) {
                    yqvm.log(`{construct|function:[${objName}],error:[${e.message}]}`);
                }
                return result;

            },
            deleteProperty: function (target, propKey) {
                let result = Reflect.deleteProperty(target, propKey);
                yqvm.log(`{deleteProperty|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
                return result;
            },
            // has: function (target, propKey) { // in 操作符
            //     let result = Reflect.has(target, propKey);
            //     if (!yqvm.toolsFunc.filterLogProxyProp(propKey)) {
            //         yqvm.log(`{has|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
            //     }
            //     return result;
            // },
            // ownKeys: function (target) {
            //     let result = Reflect.ownKeys(target);
            //     yqvm.log(`{ownKeys|obj:[${objName}]}`);
            //     return result
            // },
            // getPrototypeOf: function (target) {
            //     let result = Reflect.getPrototypeOf(target);
            //     yqvm.log(`{getPrototypeOf|obj:[${objName}]}`);
            //     return result;
            // },
            // setPrototypeOf: function (target, proto) {
            //     let result = Reflect.setPrototypeOf(target, proto);
            //     yqvm.log(`{setPrototypeOf|obj:[${objName}]}`);
            //     return result;
            // },
            // preventExtensions: function (target) {
            //     let result = Reflect.preventExtensions(target, proto);
            //     yqvm.log(`{preventExtensions|obj:[${objName}]}`);
            //     return result;
            // },
            // isExtensible: function (target) {
            //     let result = Reflect.isExtensible(target, proto);
            //     yqvm.log(`{isExtensible|obj:[${objName}]}`);
            //     return result;
            // }
        };
        let proxyObj = new Proxy(obj, handler);
        //防止重复代理，导致代理被用嵌套对比的方式检测出来
        Object.defineProperty(obj, yqvm.memory.symbolProxy, {
            configurable: true,
            enumerable: false,
            writable: false,
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
            let result = yqvm.envFunc[name].apply(self, argList);
            //主动抛出异常
            if (result instanceof Object && result[yqvm.memory.symbolError]) {
                yqvm.toolsFunc.throwError(result['name'], result['message'], result[yqvm.memory.symbolError])
            }
            return result
        } catch (e) {
            if (e[yqvm.memory.symbolError]) { //还要再抛一层
                yqvm.toolsFunc.throwError(e['name'], e['message'], e[yqvm.memory.symbolError])
            }
            if (defaultValue === undefined) {
                yqvm.log(`[${name}]正在执行，错误信息: ${e.message}`);
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
            writable: true
        });
    }
    // 函数重命名
    yqvm.toolsFunc.reNameFunc = function reNameFunc(func, name) {
        Object.defineProperty(func, "name", {
            configurable: true,
            enumerable: false,
            writable: true,
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
    yqvm.toolsFunc.throwError = function throwError(name, message, sign) {
        let e = new Error();
        e.name = name;
        e.message = message;
        e.stack = `${name}: ${message}\n    at snippet://`;
        Object.defineProperty(e, yqvm.memory.symbolError, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: sign
        }) //报错标记,方便主动抛出
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