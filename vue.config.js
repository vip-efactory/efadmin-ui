'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // 网址标题
const port = 8013 // 端口配置

module.exports = {
  transpileDependencies: [],
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          quietDeps: true
        }
      }
    }
  },
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    // 核心修改1：删掉根层级的overlay（Webpack5不支持）
    // overlay: { warnings: false, errors: true },
    // 核心修改2：把overlay移到client配置里（Webpack5正确写法）
    client: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      },
      '/auth': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': 'auth'
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@crud': resolve('src/components/Crud')
      },
      // 新增：补全Webpack5缺失的path polyfill
      fallback: {
        path: require.resolve('path-browserify')
      }
    },
    devtool: 'source-map'
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // SVG loader配置（保留）
    // 替换原有SVG loader配置为这个最简版
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()
    config.module.rule('svg').exclude.add(resolve('src/assets/icons/svg')).end()

    // 开发环境devtool配置（保留）
    config.when(process.env.NODE_ENV === 'development',
      config => config.devtool('source-map')
    )

    // 生产环境打包配置（保留）
    config.when(process.env.NODE_ENV !== 'development',
      config => {
        config
          .plugin('ScriptExtHtmlWebpackPlugin')
          .after('html')
          .use('script-ext-html-webpack-plugin', [{
            inline: /runtime\..*\.js$/
          }])
          .end()
        config
          .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial'
              },
              elementPlus: {
                name: 'chunk-elementPlus',
                priority: 20,
                test: /[\\/]node_modules[\\/]_?element-plus(.*)/
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'),
                minChunks: 3,
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
        config.optimization.runtimeChunk('single')
      }
    )
  }
}
