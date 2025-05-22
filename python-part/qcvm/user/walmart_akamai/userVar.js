//不代理的属性
yqvm.memory.filterProxyProp=yqvm.memory.filterProxyProp.concat(['performance','atob'])

//用户location重写
// location对象
location = {}
Object.setPrototypeOf(location, Location.prototype);
yqvm.toolsFunc.defineProperty(location, "valueOf", {configurable:false, enumerable:false, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "valueOf", arguments)}});
yqvm.toolsFunc.defineProperty(location, "ancestorOrigins", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "ancestorOrigins_get", arguments)}, set:undefined});
yqvm.toolsFunc.defineProperty(location, "href", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "href_get", arguments, 'https://www.walmart.ca/en')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "href_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "origin", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "origin_get", arguments, 'https://www.walmart.ca')}, set:undefined});
yqvm.toolsFunc.defineProperty(location, "protocol", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_get", arguments, 'https:')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "protocol_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "host", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "host_get", arguments, 'www.walmart.ca')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "host_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "hostname", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_get", arguments, 'www.walmart.ca')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hostname_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "port", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "port_get", arguments, '')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "port_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "pathname", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_get", arguments, '/en')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "pathname_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "search", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "search_get", arguments, '')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "search_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "hash", {configurable:false, enumerable:true, get:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hash_get", arguments, '')}, set:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "hash_set", arguments)}});
yqvm.toolsFunc.defineProperty(location, "assign", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "assign", arguments)}});
yqvm.toolsFunc.defineProperty(location, "reload", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "reload", arguments)}});
yqvm.toolsFunc.defineProperty(location, "replace", {configurable:false, enumerable:true, writable:false, value:function (){return yqvm.toolsFunc.dispatch(this, location, "location", "replace", arguments)}});
yqvm.toolsFunc.defineProperty(location, "toString", {configurable:false, enumerable:true, writable:false, value:function (){
    debugger
    yqvm.log(`func:location_toString | result:https://www.walmart.ca/en`)
    return 'https://www.walmart.ca/en'}});

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

// let meta = yqvm.envFunc.Document_createElement('meta');
// yqvm.envFunc.Node_appendChild(meta)
// yqvm.toolsFunc.setProtoArr.call(meta, "parentNode", head) //设立附属关系

// let meta1 = yqvm.envFunc.Document_createElement('meta');
// let content="HUKLOsKdkObe_hvnzLFMgFNU47ErYjQEjGQXOdN2j_YJE3Ckpq382Wz_6yuRIyzTM98kAUKGN3lYLbZNoeu1ij4hJhJI3KFMDb2hjqmKTJg6bcNESfcBP599Tz6oFppm7IZdW9QI1XNehsSY0wsGQHivHfEvHI0HMVHwYRSZUP.iqqMZw89rGiMFauD5fhO3ppmsMOTLgz5VJhHwk6TYpJ.xyZM4j9ETur9aJmUrEr9RQae6XM1n0MfSPcpWN5r5user26RTIwq"
// yqvm.toolsFunc.setProtoArr.call(meta1, "content", content)
// yqvm.toolsFunc.setProtoArr.call(meta1, "r", 'm')
// yqvm.toolsFunc.setProtoArr.call(meta1, "parentNode", head) //设立附属关系
// yqvm.envFunc.Node_appendChild(meta1)


// let script1 = yqvm.envFunc.Document_createElement('script');
// yqvm.toolsFunc.setProtoArr.call(script1, "r", 'm') //自身属性
// yqvm.envFunc.Node_appendChild(script1) //dom池添加
// yqvm.toolsFunc.setProtoArr.call(script1, "parentNode", head) //设立附属关系
// yqvm.toolsFunc.setProtoArr.call(script1, "parentElement", head) //设立附属关系
let body = yqvm.envFunc.Document_createElement('body');
yqvm.envFunc.Node_appendChild(body)

let script = yqvm.envFunc.Document_createElement('script');
yqvm.toolsFunc.setProtoArr.call(script, "parentNode", body) //设立附属关系
yqvm.toolsFunc.setProtoArr.call(script, "parentElement", body) //设立附属关系
yqvm.toolsFunc.setProtoArr.call(script, "src", 'https://www.walmart.ca/px/PXnp9B16Cq/init.js') //设立附属关系
script["yq_name"]= 'outjs'
yqvm.envFunc.Node_appendChild(script)

//canvas toDateUrl
yqvm.memory.globalVar.canvas_2d = 'data:image/png;base64,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'
yqvm.memory.globalVar.canvas_webgl = 'data:image/png;base64,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'

//难解耦的环境接口
yqvm.envFunc.Document_currentScript_get = function Document_currentScript_get() {
    // debugger
    let result=yqvm.toolsFunc.getMemoryObj('outjs') //这个功能没法解耦，放到userVar下
    return result
}