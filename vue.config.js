const port = 1080;
module.exports = {
    devServer: {
      //解决Invalid Host header,
      disableHostCheck: true,
      port: port,
      host: '127.0.0.1',
      open: true,
      overlay: {
        warnings: false,
        errors: true
      },
      proxy: {
        '/shop-swagger': {
          target: 'http://ppsk.dc.eehp.cn:8017/shop-swagger',
          pathRewrite: {
            '^/shop-swagger': ''
          }
        }
      },
    }
  }