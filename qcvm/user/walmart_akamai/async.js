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

console.log(document.cookie)
//触发xhr.open()获取签名
// let yq_xml = new XMLHttpRequest
// let url = yq_xml.open('POST', "./modules/banner.jsp", true)
// console.log(url)