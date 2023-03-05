let proxyObj = {}

proxyObj['/'] = {
    //websocket
    ws: false,
    target: 'http://0.0.0.0:8081',
    //发送请求的host会被设置为target
    changeOrigin: true,
    //不重新请求地址，因为我们的后端项目并没有前置路径，即项目名
    pathRewrite: {
        '^/': '/'
    }
}

proxyObj['/ws']={
    ws:true,
    target:'ws://0.0.0.0:8081'
}

module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        proxy: proxyObj,
        client: {
            webSocketURL: 'ws://0.0.0.0:8081',
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }
}