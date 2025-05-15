//不代理的属性
yqvm.memory.filterProxyProp=yqvm.memory.filterProxyProp.concat(['$_ts'])

//用户location重写
// location对象
location = {}
Object.setPrototypeOf(location, Location.prototype);
yqvm.toolsFunc.defineProperty(location, "valueOf", {configurable:false, enumerable:false, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "valueOf", arguments)}});
yqvm.toolsFunc.defineProperty(location, "ancestorOrigins", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "ancestorOrigins_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(location, "href", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "href_get", arguments, 'https://www.google.com/travel/search?ts=CAEaHgoAEhoSFAoHCOcPEAwYHBIHCOcPEAwYHRgBMgIIAioHCgU6A0NOWQ&ved=0CAAQ5JsGahcKEwiI_MDKpqiDAxUAAAAAHQAAAAAQBQ&ictx=3&authuser=0&ap=KigKEgnlhuKE2jg_QBHQxyFXVlZeQBISCU7MyVupOT9AEdDHIbcEV15AMAC6AQZwcmljZXM&qs=MidDaGtJbU5hLWtKMzZuY0lWR2cwdlp5OHhNV1kyTm5Sa2FHWXhFQUU4DQ')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "href_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "origin", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "origin_get", arguments, 'https://www.google.com')}, set:undefined});
yqvm.toolsFunc.defineProperty(location, "protocol", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_get", arguments, 'https:')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "host", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "host_get", arguments, 'www.google.com')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "host_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "hostname", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_get", arguments, 'www.google.com')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "port", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "port_get", arguments, '')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "port_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "pathname", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_get", arguments, '/travel/search')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "search", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "search_get", arguments, '?ts=CAEaHgoAEhoSFAoHCOcPEAwYHBIHCOcPEAwYHRgBMgIIAioHCgU6A0NOWQ&ved=0CAAQ5JsGahcKEwiI_MDKpqiDAxUAAAAAHQAAAAAQBQ&ictx=3&authuser=0&ap=KigKEgnlhuKE2jg_QBHQxyFXVlZeQBISCU7MyVupOT9AEdDHIbcEV15AMAC6AQZwcmljZXM&qs=MidDaGtJbU5hLWtKMzZuY0lWR2cwdlp5OHhNV1kyTm5Sa2FHWXhFQUU4DQ')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "search_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "hash", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hash_get", arguments, '')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hash_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "assign", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "assign", arguments)}});
yqvm.toolsFunc.defineProperty(location, "reload", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "reload", arguments)}});
yqvm.toolsFunc.defineProperty(location, "replace", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "replace", arguments)}});
yqvm.toolsFunc.defineProperty(location, "toString", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "toString", arguments)}});





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

if(yqvm.config.random){
    hook_random()
}

let html = yqvm.envFunc.Document_createElement('html');
yqvm.envFunc.Node_appendChild(html)

let head = yqvm.envFunc.Document_createElement('head');
yqvm.envFunc.Node_appendChild(head)

let meta = yqvm.envFunc.Document_createElement('meta');
yqvm.toolsFunc.setProtoArr.call(meta, "parentNode", head) //设立附属关系
yqvm.envFunc.Node_appendChild(meta)

let script = yqvm.envFunc.Document_createElement('script');
// yqvm.toolsFunc.setProtoArr.call(script, "parentElement",head)
yqvm.toolsFunc.setProtoArr.call(script, "parentNode", head) //设立附属关系
yqvm.toolsFunc.setProtoArr.call(script, "parentElement", head) //设立附属关系
yqvm.toolsFunc.setProtoArr.call(script, "r", 'm')
yqvm.envFunc.Node_appendChild(script)

let script1 = yqvm.envFunc.Document_createElement('script');
yqvm.toolsFunc.setProtoArr.call(script1, "r", 'm') //自身属性
yqvm.toolsFunc.setProtoArr.call(script1, "parentNode", head) //设立附属关系
yqvm.toolsFunc.setProtoArr.call(script1, "parentElement", head) //设立附属关系
yqvm.envFunc.Node_appendChild(script1) //dom池添加

let body = yqvm.envFunc.Document_createElement('body');
yqvm.envFunc.Node_appendChild(body)

let script2 = yqvm.envFunc.Document_createElement('script');
yqvm.toolsFunc.setProtoArr.call(script1, "r", 'm') //自身属性
yqvm.toolsFunc.setProtoArr.call(script1, "parentNode", html) //设立附属关系
yqvm.toolsFunc.setProtoArr.call(script1, "parentElement", html) //设立附属关系
yqvm.envFunc.Node_appendChild(script1) //dom池添加

//canvas toDateUrl
yqvm.memory.globalVar.canvas_2d = 'data:image/png;base64,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'
yqvm.memory.globalVar.canvas_webgl = 'data:image/png;base64,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'

