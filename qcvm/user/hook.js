//自定义配置部分
// hook random


//yqvm.hookRandom() //hook随机让其失效
// yqvm.hookXmlOpen() //hook open方法导出签名
//hookLocalStorage






    //hook append/appendChild
    // yqvm.toolsFunc.hookObj(Document.prototype, 'Document.prototype', 'append',true)
    // yqvm.toolsFunc.hookObj(Node.prototype, 'Node.prototype', 'appendChild',true)
    // yqvm.toolsFunc.hookObj(window, 'window', "ARSession", true)
    // hook Array.prototype push
    // yqvm.toolsFunc.hookObj(Array.prototype, 'Array.prototype', 'push', false,
    // (obj) => {
    //     if (obj.args[0] === 44) {
    //       console.log(`Array.prototype>push>${obj.args[0]}`)
    //         debugger
    //     }
    // }, () => {
    // })
    // hook
