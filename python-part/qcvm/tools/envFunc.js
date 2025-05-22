// 浏览器接口具体的实现
!function () {
    yqvm.envFunc.Document_querySelector = function (arg) {
        let result = {}
        yqvm.log(`func:Document_querySelector | arg:${arg} | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Performance_getEntriesByType = function (arg) {
        let result = {}
        if (arg === 'navigation') {
            result = yqvm.toolsFunc.createProxyObj(result, PerformanceNavigationTiming, `Performance_getEntriesByType_${arg}`);
        }
        else {
            yqvm.log(`func:Performance_getEntriesByType | arg:${arg} | this:${this} 未实现`)
        }
        yqvm.log(`func:Performance_getEntriesByType | arg:${arg} | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Navigator_userAgentData_get = function () {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, NavigatorUAData, "Navigator_userAgentData_NavigatorUAData");
        yqvm.log(`func:Navigator_userAgentData | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.DOMStringList_length_get = function () {
        let result = 0
        yqvm.log(`func:DOMStringList_length | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.StyleSheetList_length_get = function StyleSheetList_length_get() {
        let result = 1
        yqvm.log(`func:StyleSheetList_length | result:${result} | this:${this}`)
        return result
    }
    yqvm.envFunc.PerformanceNavigation_type_get = function PerformanceNavigation_type_get() {
        let result = 1
        yqvm.log(`func:PerformanceNavigation_type | result:${result} | this:${this}`)
        return result
    }
    yqvm.envFunc.Document_head_get = function Document_head_get() {
        let result = yqvm.toolsFunc.getMemoryObj('HEAD')
        yqvm.log(`func:Document_head | result:${result} | this:${this}`)
        return result
    }
    yqvm.envFunc.HTMLIFrameElement_srcdoc_set = function HTMLIFrameElement_srcdoc_set(value) {
        let result = value
        yqvm.toolsFunc.setProtoArr.call(this, "srcdoc", result);
        yqvm.log(`func:HTMLIFrameElement_srcdoc | arg:${value} | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Document_referrer_get = function Document_referrer_get() {
        let result = ''
        yqvm.log(`func:Document_referrer | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Document_styleSheets_get = function Document_styleSheets_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, StyleSheetList, "Document_styleSheets");
        yqvm.log(`func:Document_styleSheets | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.location_ancestorOrigins_get = function location_ancestorOrigins_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, DOMStringList, "location_ancestorOrigins");
        yqvm.log(`func:location_ancestorOrigins | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Performance_navigation_get = function Performance_navigation_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, PerformanceNavigation, "Performance_navigation");
        yqvm.log(`func:Performance_navigation | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.window_history_get = function window_history_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, History, "window_history");
        yqvm.log(`func:window_history | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Element_outerHTML_get = function Element_outerHTML_get() {
        let tagName = yqvm.toolsFunc.getProtoArr.call(this, 'tagName')
        let style = yqvm.toolsFunc.getProtoArr.call(this, 'style')
        let result = `<${tagName.toLowerCase()} style='${style}'>`
        yqvm.log(`func:Element_outerHTML_get | result:${result} | this:${this}`)
        return result
    }
    yqvm.envFunc.Document_webkitIsFullScreen_get = function Document_webkitIsFullScreen_get() {
        let result = false
        yqvm.log(`func:Document_webkitIsFullScreen | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Document_webkitFullscreenElement_get = function Document_webkitFullscreenElement_get() {
        let result = null
        yqvm.log(`func:Document_webkitFullscreenElement | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.FeaturePolicy_allowedFeatures = function FeaturePolicy_allowedFeatures() {
        let result = [
            "geolocation",
            "storage-access",
            "gamepad",
            "ch-ect",
            "midi",
            "display-capture",
            "usb",
            "browsing-topics",
            "local-fonts",
            "picture-in-picture",
            "join-ad-interest-group",
            "publickey-credentials-get",
            "otp-credentials",
            "ch-ua-form-factor",
            "encrypted-media",
            "ch-save-data",
            "ch-ua-full-version-list",
            "ch-ua-wow64",
            "shared-storage",
            "ch-downlink",
            "ch-prefers-color-scheme",
            "sync-xhr",
            "ch-ua-model",
            "ch-prefers-reduced-transparency",
            "serial",
            "camera",
            "ch-prefers-reduced-motion",
            "private-state-token-issuance",
            "bluetooth",
            "identity-credentials-get",
            "ch-ua-full-version",
            "fullscreen",
            "ch-dpr",
            "unload",
            "keyboard-map",
            "ch-ua-platform",
            "shared-storage-select-url",
            "gyroscope",
            "interest-cohort",
            "window-placement",
            "ch-ua-mobile",
            "ch-ua",
            "run-ad-auction",
            "magnetometer",
            "accelerometer",
            "private-state-token-redemption",
            "ch-ua-arch",
            "xr-spatial-tracking",
            "idle-detection",
            "ch-ua-platform-version",
            "ch-width",
            "clipboard-read",
            "ch-viewport-width",
            "payment",
            "ch-viewport-height",
            "ch-rtt",
            "autoplay",
            "cross-origin-isolated",
            "hid",
            "ch-ua-bitness",
            "screen-wake-lock",
            "private-aggregation",
            "clipboard-write",
            "attribution-reporting",
            "ch-device-memory",
            "microphone"]
        yqvm.log(`func:FeaturePolicy_allowedFeatures | result:${result.length} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Navigator_geolocation_get = function Navigator_geolocation_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, Geolocation, "Navigator_geolocation");
        yqvm.log(`func:Navigator_geolocation | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Document_featurePolicy_get = function Document_featurePolicy_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, FeaturePolicy, "document_featurePolicy");
        yqvm.log(`func:document_featurePolicy | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.window_styleMedia_get = function window_styleMedia_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, StyleMedia, "window_styleMedia");
        yqvm.log(`func:window_styleMedia | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.window_Worker = function window_Worker() {
        let arg = arguments[0]
        let result = {}
        if (arg === 'chrome://juggler/content') {
            result = { name: 'DOMException', message: "Script at 'chrome://juggler/content' cannot be accessed from origin 'https://www.walmart.ca'." }
            result[yqvm.memory.symbolError] = true
            return result
        } else {
            result = yqvm.toolsFunc.createProxyObj(result, Worker, "window_Worker");
        }
        yqvm.log(`func:window_Worker | args:${arguments} | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.window_caches_get = function window_caches_get() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, CacheStorage, "window_caches");
        yqvm.log(`func:window_caches | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.window_Image = function window_Image() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, Image, "window_image");
        yqvm.log(`func:window_Image | args:${arguments} | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.Node_baseURI_get = function Node_baseURI_get() {
        let result = location.href
        yqvm.log(`func:Node_baseURI_get | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.CSSStyleDeclaration_length_get = function CSSStyleDeclaration_length_get() {
        yqvm.log(`func:CSSStyleDeclaration_length_get | result:365 | this:${this}`)
        return 365;
    }
    yqvm.envFunc.window_getComputedStyle = function window_getComputedStyle() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, CSSStyleDeclaration, "getComputedStyle_style");
        yqvm.log(`func:window_getComputedStyle | args:${arguments} | result:${result} | this:${this}`)
        return result;
    }
    yqvm.envFunc.XMLHttpRequest_responseText_get = function XMLHttpRequest_responseText_get() {
        let result = '{"do":null,"ob":"UisrKytSUlIePRIaBgceUVFSHlFUA1VTUVFbAVoGW1JQAAZaB1JQBgNaVVUDBlcAA1AGVlVQU1RWU1EAV1MGUVtSVFcBV1IDBlpbWltaAVRTBwRYBxsoUgM1Uw4BUTAKADojCy0IJ1AtNgVRLxgJGy8mL1EtNihbHhYQFwceUVJSHBwcHCsrKysrUh49EhpRHlFRUh5UAFEHAVsDV1cBVQYDVFUDB1pVA1ABBwBaAwMDBwAEBAFSWwNbUFtTU1ZVVFEEB1oDBANaUlpXVFdXBlVaBARVWAQwKC1aLwRXESEwVhg7G1YkGhYVLzNXVjZUGgYtBw40IBQwUTQaATg2WhghFi5ROwkgGBEGIy8jECMMM1oFTSQyAxQxARhbGFRaW1AQBDsKJwFXVyozX19YU1JSUlgnIRYAIVU6UykDSTMDOFQ7MwUQCVcaOw8MCRYAMQUWNAcFNhUOEQgQWhYkAS8EJgUFDlRTLS4XJSwbMzAWLAgvWgMEMSASLDVNNwFWODFbDltJKCMUCSYKBgM3EwEUVzAINBcNEhQaC1RQOCMkEwUXLjcVBRAvCwEXCFIWKScOCgcnEygXCQdXKQNRLiopE1Y2FS8sEQQsJjQPCQYVOAUBBDMWDTEwDlMHOFAXCQVQLy0vTSkEMQEhCA4mMzQGUipRTRgKVzcbMBINMwxXKzAUDCkgLwkGFBUOCgNWOhUDUlo7LjYEIytVFiA7Xx4WEBcHHlFSUhwcHBxSUitSK1IeARc="}'
        yqvm.log(`func:XMLHttpRequest_responseText_get | result:${result} | this:${this}`)
        return result
    }
    yqvm.envFunc.HTMLIFrameElement_contentWindow_get = function HTMLIFrameElement_contentWindow_get() {
        yqvm.log(`func:HTMLIFrameElement_contentWindow_get | result:window | this:${this}`)
        return window
    }
    yqvm.envFunc.XMLHttpRequest_status_get = function XMLHttpRequest_status_get() {
        yqvm.log(`func:XMLHttpRequest_status_get | result:200 | this:${this}`)
        return 200
    }
    yqvm.envFunc.XMLHttpRequest_send = function XMLHttpRequest_send(value) {
        yqvm.log(`func:XMLHttpRequest_send | arg:${value} | this:${this}`)
        debugger
    }
    yqvm.envFunc.XMLHttpRequestEventTarget_onerror_set = function XMLHttpRequestEventTarget_onerror_set(func) {
        yqvm.log(`func:XMLHttpRequestEventTarget_onerror_set | arg:${func} | this:${this}`)
        yqvm.toolsFunc.setProtoArr.call(this, 'onerror', func)
        return func
    }
    yqvm.envFunc.XMLHttpRequestEventTarget_onabort_set = function XMLHttpRequestEventTarget_onabort_set(func) {
        yqvm.log(`func:XMLHttpRequestEventTarget_onabort_set | arg:${func} | this:${this}`)
        yqvm.toolsFunc.setProtoArr.call(this, 'onabort', func)
        return func
    }
    yqvm.envFunc.XMLHttpRequestEventTarget_ontimeout_set = function XMLHttpRequestEventTarget_ontimeout_set(func) {
        yqvm.log(`func:XMLHttpRequestEventTarget_ontimeout_set | arg:${func} | this:${this}`)
        yqvm.toolsFunc.setProtoArr.call(this, 'ontimeout', func)
        return func
    }
    yqvm.envFunc.XMLHttpRequestEventTarget_onload_set = function XMLHttpRequestEventTarget_onload_set(func) {
        let type = 'load'
        let default_delay = 0
        let listener = arguments[0];
        let options = arguments[1];
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
        yqvm.log(`${this}.onload|${listener.name} > 正在注册`)
        yqvm.memory.asyncTask.listener[type].push(event);
    }
    yqvm.envFunc.XMLHttpRequest_onreadystatechange_set = function XMLHttpRequest_onreadystatechange_set(func) {
        yqvm.log(`func:XMLHttpRequest_onreadystatechange_set | arg:${func.name} | this:${this}`)
        yqvm.toolsFunc.setProtoArr.call(this, 'onreadystatechange', func)
        return func
    }
    yqvm.envFunc.XMLHttpRequest_readyState_get = function XMLHttpRequest_readyState_get() {
        yqvm.log(`func:XMLHttpRequest_readyState_get | result:1 | this:${this}`)
        return 1
    }
    yqvm.envFunc.XMLHttpRequest_timeout_set = function XMLHttpRequest_timeout_set(value) {
        yqvm.toolsFunc.setProtoArr.call(this, 'timeout', value)
        yqvm.log(`func:XMLHttpRequest_setRequestHeader | arg:${value} | this:${this}`)
    }
    yqvm.envFunc.XMLHttpRequest_setRequestHeader = function XMLHttpRequest_setRequestHeader(name, value) {
        yqvm.log(`func:XMLHttpRequest_setRequestHeader | arg:${name},${value} | this:${this}`)
    }
    yqvm.envFunc.HTMLElement_onload_set = function HTMLElement_onload_set() {
        let type = 'load'
        let default_delay = 0
        let listener = arguments[0];
        if (!listener) {
            yqvm.log(`${this}.onload = undefined`)
            return
        }
        let options = arguments[1];
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
        yqvm.log(`${this}.onload|${listener.name} > 正在注册`)
        yqvm.memory.asyncTask.listener[type].push(event);
    }
    yqvm.envFunc.Element_setAttribute = function Element_setAttribute(name, value) {
        yqvm.toolsFunc.setProtoArr.call(this, name, value)
        yqvm.log(`func:Element_setAttribute | arg:${name},${value} | this:${this}`)
    }
    yqvm.envFunc.SpeechSynthesis_onvoiceschanged_set = function SpeechSynthesis_onvoiceschanged_set(func) {
        yqvm.log(`func:SpeechSynthesis_onvoiceschanged_set | arg:${func} | this:${this}`)
        debugger
        // this['onvoiceschanged'] = func
    }
    yqvm.envFunc.Document_readyState_get = function Document_readyState_get() {
        return 'interactive'
    }
    yqvm.envFunc.Performance_memory_get = function Performance_memory_get() {
        let result = {}
        yqvm.toolsFunc.createProxyObj(result, MemoryInfo, 'memoryInfo')
        return result
    }
    yqvm.envFunc.SpeechSynthesis_getVoices = function SpeechSynthesis_getVoices() {
        let result = {}
        yqvm.toolsFunc.createProxyObj(result, SpeechSynthesisVoice, 'speechSynthesisVoice')
        collection = [result]
        return collection
    }
    yqvm.envFunc.window_speechSynthesis_get = function window_speechSynthesis_get() {
        let result = {}
        yqvm.toolsFunc.createProxyObj(result, SpeechSynthesis, 'window_speechSynthesis')
        return result
    }
    yqvm.envFunc.Navigator_permissions_get = function Navigator_permissions_get() {
        let result = {}
        yqvm.toolsFunc.createProxyObj(result, Permissions, 'permissions')
        return result
    }
    yqvm.envFunc.Performance_now = function Performance_now() {
        let result = Date.now() - yqvm.memory.globalVar.startime + 50000
        return result
    }
    yqvm.envFunc.Performance_timing_get = function Performance_timing_get() {
        let result = {}
        yqvm.toolsFunc.createProxyObj(result, PerformanceTiming, 'performanceTiming')
        return result
    }
    yqvm.envFunc.HTMLScriptElement_src_get = function HTMLScriptElement_src_get() {
        let result = yqvm.toolsFunc.getProtoArr.call(this, "src");
        return result
    }
    yqvm.envFunc.Document_createEvent = function Document_createEvent(arg) {
        if (arg === 'TouchEvent') {
            let result = { name: 'NotSupportedError', message: "Failed to execute 'createEvent' on 'Document': The provided event type ('TouchEvent') is invalid." }
            result[yqvm.memory.symbolError] = true
            return result
        }
        return {}
    }
    yqvm.envFunc.HTMLAllCollection_length_get = function HTMLAllCollection_length_get() {
        //document.all不被代理,只能靠自身输出日志了
        let result = undefObj.length
        yqvm.log(`HTMLAllCollection_length_get正在调用,return [${result}]`)
        return result
    }
    yqvm.envFunc.MediaQueryList_matches_get = function MediaQueryList_matches_get(arg) {
        return yqvm.toolsFunc.getProtoArr.call(this, "matches");
    }
    yqvm.envFunc.window_matchMedia = function window_matchMedia(arg) {
        let mediaQueryList = {}
        yqvm.toolsFunc.createProxyObj(mediaQueryList, MediaQueryList, 'mediaQueryList')
        if (['(any-pointer: fine )', '(any-pointer )', '(any-hover: hover )', '(color-gamut: srgb )', '(color-gamut: p3 )', '(color-gamut )'].indexOf('arg') !== -1) {
            yqvm.toolsFunc.setProtoArr.call(mediaQueryList, "matches", true);
        } else {
            yqvm.toolsFunc.setProtoArr.call(mediaQueryList, "matches", false);
        }
        yqvm.toolsFunc.setProtoArr.call(mediaQueryList, "media", arg);
        yqvm.toolsFunc.setProtoArr.call(mediaQueryList, "onchange", null);
        return mediaQueryList
    }
    yqvm.envFunc.HTMLMediaElement_canPlayType = function HTMLMediaElement_canPlayType() {
        let arg = arguments[0]
        let result
        if (['audio/ogg; codecs="vorbis"', 'audio/wav; codecs="1"', 'audio/mpeg;'].indexOf(arg) !== -1) {
            result = 'probably'
        } else if (arg === 'audio/x-m4a;audio/aac;') {
            result = 'maybe'
        } else if (['video/ogg; codecs="theora"', 'video/mp4; codecs="avc1.42E01E"', 'video/webm; codecs="vp8, vorbis"'].indexOf(arg) !== -1) {
            result = 'probably'
        } else if (['video/mp4; codecs="mp4v.20.8, mp4a.40.2"', 'video/mp4; codecs="mp4v.20.240, mp4a.40.2"', 'video/x-matroska; codecs="theora, vorbis"'].indexOf(arg) !== -1) {
            result = ''
        }
        return result
    }
    yqvm.envFunc.HTMLElement_innerText_set = function HTMLElement_innerText_set() {
        let result = arguments[0]
        yqvm.toolsFunc.setProtoArr.call(this, "innerText", result);
        return result
    }
    yqvm.envFunc.HTMLElement_innerText_get = function HTMLElement_innerText_get() {
        let result = yqvm.toolsFunc.getProtoArr.call(this, "innerText");
        return result
    }
    yqvm.envFunc.Node_textContent_set = function Node_textContent_set() {
        let result = arguments[0]
        yqvm.toolsFunc.setProtoArr.call(this, "textContent", result);
        return result
    }
    yqvm.envFunc.Node_textContent_get = function Node_textContent_get() {
        let result = yqvm.toolsFunc.getProtoArr.call(this, "textContent");
        return result
    }
    yqvm.envFunc.Document_all_get = function Document_all_get() {
        let result = Object.setPrototypeOf(undefObj, HTMLAllCollection.prototype) //防止typeof 检测,但这样也等于眼睛瞎了,因为只要被proxy,类型就不可以是undefined
        // result=yqvm.toolsFunc.createProxyObj(undefObj,HTMLAllCollection,'Document_all_get_obj')
        yqvm.log(`Document_all_get  ret:${yqvm.toolsFunc.getType(result)}  len:${result.length}`)
        return result
    }
    yqvm.envFunc.MutationObserver_observe = function MutationObserver_observe() {
        return
    }
    yqvm.envFunc.window_name_get = function window_name_get() {
        return ''
    }
    yqvm.envFunc.window_webkitRequestFileSystem = function window_webkitRequestFileSystem() {
        return
    }
    yqvm.envFunc.Document_createExpression = function Document_createExpression() {
        let result = {}
        result = yqvm.toolsFunc.createProxyObj(result, XPathExpression, 'Document_createExpression_XPathExpression')
        return result
    }
    yqvm.envFunc.Document_visibilityState_get = function Document_visibilityState_get() {
        return 'hidden';
    }
    yqvm.envFunc.location_replace = function location_replace() {
        yqvm.log('页面重新刷新,剩下异步任务全部取消')
        yqvm.memory.asyncEvent = []
        yqvm.memory.asyncTask = []
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
        return yqvm.toolsFunc.getProtoArr.call(this, "parentElement");

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
        let result = yqvm.toolsFunc.getProtoArr.call(this, arguments[0]) || null
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
    yqvm.envFunc.Element_getElementsBy
        = function Element_getElementsByTagName() {
            let tagName = arguments[0].toLowerCase()
            let collection = []
            switch (tagName) {
                case 'i':
                    collection = yqvm.toolsFunc.getCollection('[object HTMLElement]');
                    collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Element_getElementsByTagName_${tagName}`)
                    break
                case 'head':
                    collection = yqvm.toolsFunc.getCollection('[object HTMLHeadElement]');
                    collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Element_getElementsByTagName_${tagName}`)
                    break
                case 'script':
                    collection = yqvm.toolsFunc.getCollection('[object HTMLScriptElement]');
                    collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Element_getElementsByTagName_${tagName}`)
                    break
                default:
                    yqvm.log(`Element_getElementsByTagName_${tagName}未实现`)
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
        yqvm.log(`setInterval(${func.name},${delay}) 正在注册`)
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
        yqvm.log(`${this}.addEventListener(${type}|${listener.name}) > 正在注册`)
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
        // if (func.name ==='_$eK'){debugger}
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
        yqvm.log(`setTimeout(${func.name},${delay}) 正在注册`)
        return yqvm.memory.globalVar.timeoutID;
    }
    yqvm.envFunc.XMLHttpRequest_open = function XMLHttpRequest_open() {
        // 浏览器接口
        let method = arguments[0];
        let url = arguments[1];
        yqvm.log(`xmlrequest_open正在调用, url: ${url}`)
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
        //useVar中创建的元素this是globalThis是没有[yqvm.memory.symbolData]属性的,因此需要审核,而能添加的必然是被创造的tagName无须审核,但也怕document.write和innerHTML,遇到再说吧
        if (this[yqvm.memory.symbolData] && this[yqvm.memory.symbolData].tagName === 'FORM' && tag[yqvm.memory.symbolData].tagName === 'INPUT') { //form标签特别处理
            let ele_input = tag[yqvm.memory.symbolData]
            if (ele_input.id) {
                this[ele_input.id] = tag;
            }
            if (ele_input.name) {
                this[ele_input.name] = tag;
            }
        }
        if (this[yqvm.memory.symbolData] && this[yqvm.memory.symbolData].tagName === 'BODY' && tag[yqvm.memory.symbolData].tagName === 'FORM') { //form标签特别处理
            let ele_input = tag[yqvm.memory.symbolData]
            if (ele_input.id) {
                Object.getPrototypeOf(Window.prototype)[ele_input.id] = tag; //对于window要放在其原型链至WindowProperties
            }
            if (ele_input.name) {
                Object.getPrototypeOf(Window.prototype)[ele_input.name] = tag;
            }
        }
        yqvm.toolsFunc.setProtoArr.call(this, "children", collection);
        Array.prototype.push.call(undefObj, tag)
        return tag;
    }
    yqvm.envFunc.Document_body_get = function Document_body_get() {
        // document.body对象,不考虑set 不,要考虑的
        // debugger
        let body = Array.prototype.find.call(undefObj, (ele) => { return Object.prototype.toString.call(ele) === '[object HTMLBodyElement]' }) //|| yqvm.envFunc.Document_createElement('body')
        if (!body) {
            body = null
        }
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
                yqvm.log('yqvm.memory.globalVar.canvas_2d 未补充')
            };
        } else if (type === "webgl") {
            if (yqvm.memory.globalVar.canvas_webgl) {
                return yqvm.memory.globalVar.canvas_webgl;
            }
            else {
                yqvm.log('yqvm.memory.globalVar.canvas_webgl 未补充')
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
                yqvm.log(`HTMLCanvasElement_getContext_${type}未实现`);
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
        let result; //严格来讲删除非其子元素会报错,这里宽松处理
        for (let i = 0; i < undefObj.length; i++) {
            if (tag === undefObj[i]) {
                // debugger
                //返回也是一个数组,所以要加[0]
                result = Array.prototype.splice.call(undefObj, i, 1); //这种删法能够改变数组长度,undefObj本身没有splice方法,从原型链上也拿不到,暂时没搞懂
            }
        }
        return result && result[0]
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
        let tag = {};
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
                yqvm.log('Document_createElement 正在创建[a]标签')
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
            case "audio":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLAudioElement, `Document_createElement_${tagName}`);
                break;
            case "video":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLVideoElement, `Document_createElement_${tagName}`);
                break;
            case "html":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLHtmlElement, `Document_createElement_${tagName}`);
                break;
            case "iframe":
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLIFrameElement, `Document_createElement_${tagName}`);
                break;
            default:
                tag = yqvm.toolsFunc.createProxyObj(tag, HTMLUnknownElement, `Document_createElement_${tagName}`);
                yqvm.log(`Document_createElement_${tagName}未实现`)
                break
        }
        yqvm.toolsFunc.setProtoArr.call(tag, "tagName", tagName.toUpperCase())
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
        yqvm.log(`Document_cookie_set: [value:${arguments[0]}, length:${arguments[0].length}]`)
        // debugger
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
        let tags = undefObj;
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
            case 'head':
                collection = yqvm.toolsFunc.getCollection('[object HTMLHeadElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            case 'script':
                collection = yqvm.toolsFunc.getCollection('[object HTMLScriptElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            case 'html':
                collection = yqvm.toolsFunc.getCollection('[object HTMLHtmlElement]');
                collection = yqvm.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break
            default:
                yqvm.log(`Document_getElementsByTagName_${tagName}未实现`)
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
