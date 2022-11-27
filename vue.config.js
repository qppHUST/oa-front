let proxyObj = {}

proxyObj['/'] = {
    //websocket
    ws: false,
    target: 'http://localhost:8081',
    //发送请求的host会被设置为target
    changeOrigin: true,
    //不重新请求地址，因为我们的后端项目并没有前置路径，即项目名
    pathRewrite: {
        '^/': '/'
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}