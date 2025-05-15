// 全局变量初始化
!function (){
    //hooke console.log
    let onEnter = function (obj){
        try{
            yqvm.toolsFunc.printLog(obj.args);
        }catch (e){}
    }
    yqvm.log = yqvm.toolsFunc.hook(
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
