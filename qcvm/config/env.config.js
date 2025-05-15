const fs = require("fs");

function getFile(name) {
    try {
        return fs.readFileSync(`./env/${name}.js`) + "\r\n";
    } catch (e) {
        console.log(`./env/${name}.js不存在`);
        return "";
    }
}

function getHtmlElement() {
    try {
        let code = "";
        let fileList = fs.readdirSync("./env/htmlElements");
        for (let i = 0; i < fileList.length; i++) {
            code += fs.readFileSync(`./env/htmlElements/${fileList[i]}`) + "\r\n";
        }
        return code;
    } catch (e) {
        console.log(`./env/${name}不存在`);
        return "";
    }
}

function getCode() {
    let code = "// env相关代码";
    code += getFile("EventTarget");
    code += getFile("SpeechSynthesis");
    code += getFile("WebSocket");
    code += getFile("MediaQueryList");
    code += getFile("HTMLAllCollection");
    code += getFile("MutationObserver");
    code += getFile("XPathExpression");
    code += getFile("Request");
    code += getFile("TextTrackList");
    code += getFile("SpeechSynthesisUtterance");
    code += getFile("SourceBuffer");
    code += getFile("ScreenOrientation");
    code += getFile("PerformanceEntry");
    code += getFile("PerformancePaintTiming");
    code += getFile("Path2D");
    code += getFile("OffscreenCanvasRenderingContext2D");
    code += getFile("Notification");
    code += getFile("WindowProperties");
    code += getFile("Window");
    code += getFile("Storage");
    code += getFile("Node");
    code += getFile("CharacterData");
    code += getFile("Text");
    code += getFile("CDATASection");
    code += getFile("Element");
    code += getFile("SVGElement");
    code += getFile("SVGPatternElement");
    code += getFile("HTMLElement");
    code += getFile("HTMLMediaElement");
    code += getFile("Document");
    code += getFile("HTMLDocument");
    code += getHtmlElement();
    code += getFile("Audio");
    code += getFile("Navigator");
    code += getFile("Location");
    code += getFile("HTMLCollection");
    code += getFile("Plugin");
    code += getFile("PluginArray");
    code += getFile("MimeType");
    code += getFile("MimeTypeArray");
    code += getFile("CSSStyleDeclaration");
    code += getFile("CanvasRenderingContext2D");
    code += getFile("WebGLRenderingContext");
    code += getFile("WebGLBuffer");
    code += getFile("WebGLProgram");
    code += getFile("WebGLShader");
    code += getFile("XMLHttpRequestEventTarget");
    code += getFile("XMLHttpRequest");
    code += getFile("BatteryManager");
    code += getFile("Event");
    code += getFile("MediaEncryptedEvent");
    code += getFile("UIEvent");
    code += getFile("MouseEvent");
    code += getFile("Screen");
    code += getFile("IDBFactory");
    code += getFile("IDBRequest");
    code += getFile("IDBOpenDBRequest");
    code += getFile("NetworkInformation");
    code += getFile("WebGLUniformLocation");
    code += getFile("Performance");
    code += getFile("Crypto");
    code += getFile("chrome");
    code += getFile("external");
    code += getFile("PerformanceTiming");
    code += getFile("MemoryInfo");
    code += getFile("Permissions");
    code += getFile("SpeechSynthesisVoice");
    code += getFile("Image");
    code += getFile("CacheStorage");
    code += getFile("Worker");
    code += getFile("StyleMedia");
    code += getFile("FeaturePolicy");
    code += getFile("History");
    code += getFile("DOMStringList");
    code += getFile("PerformanceNavigation");
    code += getFile("StyleSheetList");
    code += getFile("Geolocation");
    code += getFile("NavigatorUAData");
    code += getFile("globalThis");// 全局环境
    return code;
}

module.exports = {
    getCode
}
