let webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
let path = require('path');
// let glob = require('glob');

function resolve(dir) {
    return path.join(__dirname, './', dir)
}

function cssLoaders(options) {
    options = options || {}
  
    const cssLoader = {
      loader: 'css-loader',
      options: {
        minimize: process.env.NODE_ENV === 'production',
        sourceMap: options.sourceMap
      }
    }
  
    // generate loader string to be used with extract text plugin
    function generateLoaders (loader, loaderOptions) {
      const loaders = [cssLoader]
      if (loader) {
        loaders.push({
          loader: loader + '-loader',
          options: Object.assign({}, loaderOptions, {
            sourceMap: options.sourceMap
          })
        })
      }
  
      // Extract CSS when that option is specified
      // (which is the case during production build)
      if (options.extract) {
        return ExtractTextPlugin.extract({
          use: loaders,
          fallback: 'vue-style-loader'
        })
      } else {
        return ['vue-style-loader'].concat(loaders)
      }
    }
  
    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
      css: generateLoaders(),
      postcss: generateLoaders('postcss'),
      less: generateLoaders('less'),
      sass: generateLoaders('sass', { indentedSyntax: true }),
      scss: generateLoaders('sass'),
      stylus: generateLoaders('stylus'),
      styl: generateLoaders('stylus')
    }
  }
let webpackConfig = {
    entry: {
        btPage: './index',
        btPageNg: './ng',
        btPageVue: './vue',
        webViewBridge: '../webViewBridge/index',
        // vendor: ['jquery', 'say', 'confirm', 'loading', 'util', `webViewBridge`],
    },
    //入口文件输出配置
    output: {
        path: resolve('./dist'),//用来存放打包后文件的输出目录
        filename: `[name].js`,
        chunkFilename: `[name].js`
        // hash: true
    },
    //加载器配置
    module: {
        rules: [//loaders
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                loaders: cssLoaders({
                  sourceMap: false,
                  extract: false
                }),
                transformToRequire: {
                  video: 'src',
                  source: 'src',
                  img: 'src',
                  image: 'xlink:href'
                }
              }
            },
            { test: /\.json$/, loader: "json-loader"},
            //less独立打包
            {
                test: /\.less$/,  
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }, 
            //css独立打包
            { 
                test: /\.css$/, 
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {//图片文件
                test: /\.(png|jpe?g|gif)$/, 
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000000,
                        name: `[name].[ext]`
                    }
                }]
            },
            { 
                test: /\.js|jsx$/, 
                loader: 'babel-loader', //用es6语法的话，可以开启这个（webpack1如果要使用import要引入，webpack2版本可以不用，原生就可以支持import）
                exclude: /node_modules/
            },
            // {
            //     // 得到jquery模块的绝对路径
            //     test: require.resolve('jquery'),
            //     // 将jquery绑定为window.jQuery、$
            //     loader: 'expose-loader?jQuery!expose-loader?$'
            // }
        ]
    },
    //插件项
    plugins: [
        // new HtmlWebpackPlugin(util.getHtmlWebpackConfig('app-index.html')),
        // new HtmlWebpackPlugin(util.getHtmlWebpackConfig('app-overlay.html')),
        //优化id分配并且保持一致性
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.BannerPlugin('Copyright cheok.com'),//版权声明
        // new ExtractTextPlugin('[name].css?' + config.hashDegree),//css最好跟入口文件一个目录级别，这样静态资源的引用不会有问题
        // new webpack.optimize.CommonsChunkPlugin('vendor'),
        new FriendlyErrorsPlugin(),//用于更友好地输出webpack的警告、错误等信息
        //压缩文件
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告  
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        // //$ and jQuery available in every module without writing require("jquery").
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery",
        //     "window.$": "jquery"
        // }),
        // new webpack.HotModuleReplacementPlugin(),//热加载插件
        // new webpack.WebpackBrowserPlugin()//browser-sync，自动打开浏览器
    ],
    //设置不打包扩展
    externals:[
        {
            jquery: 'jQuery',
            say: 'Say',
            confirm: 'Confirm',
            loading: 'Loading', 
            webViewBridge: 'wv'
        }
    ],
    //其它解决方案配置
    resolve: {
        modules: [resolve("node_modules")],
        extensions: ['.js'],//自动扩展文件后缀名
        alias: {
            // "loading" : resolve("../overlay/loading.min"),
            // "confirm" : resolve("../overlay/confirm.min"),
            // "say" : resolve("../overlay/say.min"),
            // "webViewBridge": resolve("../webViewBridge"),
            // "util" : resolve("../util"),
        }
    },
    /**
     * 配置生成Source Maps
     *     source-map:在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包文件的构建速度；
     *     cheap-module-source-map:在一个单独的文件中生成一个不带列映射的map，不带列映射提高项目构建速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
     *     eval-source-map:使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项；
     *     cheap-module-eval-source-map:这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；
     */
    devtool: '#source-map',

    // //web本地服务，先全局安装webpack-dev-server,这里的配置只会命令行模式有效
    // devServer: {
    //     // contentBase: "",//本地服务器所加载的页面所在的目录
    //     host: util.getLocalIP(),
    //     // colors: true,//终端中输出结果为彩色
    //     hot: true,        //对修改进行热加载
    //     // historyApiFallback: true,//在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    //     // inline: true,//实时刷新浏览器 注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
    //     // openPage: 'index.html'
    //     // proxy: {
    //     //     "**": "http://localhost:9090"
    //     // },
    //     // port: 4400//端口
    // } 
}
module.exports = webpackConfig;

