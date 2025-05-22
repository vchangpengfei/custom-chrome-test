const fs = require("fs");
const dom_parse = require('html-dom-parser')
const yqvmundef = require("./yqvmundefind");
const undefFunc = [];
yqvmundef.undefobj(undefFunc);
let undefObj = new undefFunc.undefObj();

!function (){
    fs.writeFileSync(__dirname + "/proxy_log.txt", "");
    yqvm.toolsFunc.printLog = function printLog(logList){
        let log = "";
        for(let i=0;i<logList.length;i++){
            if(logList[i] instanceof Object){
                if(typeof logList[i] === "function"){
                    log += logList[i].toString() + " ";
                }else{
                    log += yqvm.toolsFunc.getType(logList[i]) + " ";
                }
            }else if(typeof logList[i] === "symbol"){
                log += logList[i].toString() + " ";
            }else{
                log += logList[i] + " ";
            }
        }
        log += "\r\n";
        fs.appendFileSync(`./user/${_name_}/log.txt`, log);
    }
}();