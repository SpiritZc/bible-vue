/*
 * @Description: 
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2020-06-04 08:36:18
 * @LastEditors: caiyang
 * @LastEditTime: 2020-07-09 08:40:27
 */ 
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths 
    // env: require('./dev.env'), // 使用 config/dev.env.js 中定义的编译环境
    assetsSubDirectory: 'static',// 编译输出的二级目录
    assetsPublicPath: '/',// 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    proxyTable: { // 需要 proxyTable 代理的接口（可跨域）
       '/admin/api': {
          target: 'http://localhost:9090',
          changeOrigin: true,
          pathRewrite: {
            '^/admin/api': '/api'
          }
      }

    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true  // 是否开启 cssSourceMap
  },

  build: {
    // Template for index.html
    // 下面是相对路径的拼接，假如当前跟目录是config，那么下面配置的index属性的属性值就是dist/index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    // 下面定义的是静态资源的根目录 也就是dist目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 下面定义的是静态资源根目录的子目录static，也就是dist目录下面的static
    assetsSubDirectory: 'static',
     // 下面定义的是静态资源的公开路径，也就是真正的引用路径
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    // 下面定义是否生成生产环境的sourcmap，sourcmap是用来debug编译后文件的，通过映射到编译前文件来实现
    productionSourceMap: false,//改成false,减少文件
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // cnpm install --save-dev compression-webpack-plugin@1.1.12　　　　//记得带版本号,上边的报错用这个,发现服务端开启gzip就行,这里不用设置
    // 下面是是否在生产环境中压缩代码，如果要压缩必须安装compression-webpack-plugin
    productionGzip: false,//改成true,压缩
     // 下面定义要压缩哪些类型的文件
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
     // 下面是用来开启编译完成后的报告，可以通过设置值为true和false来开启或关闭
        // 下面的process.env.npm_config_report表示定义的一个npm_config_report环境变量，可以自行设置
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
