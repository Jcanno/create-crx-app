const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path')
const ExtensionReloader = require('webpack-ext-reloader')

const isDev = process.env.NODE_ENV === 'development'
// copy file to dist
const copyFiles = [
  {
    from: path.resolve('src/manifest.json'),
    to: path.resolve("dist")
  },
  {
    from: path.resolve('assets'),
    to: path.resolve('dist/assets'),
  },
]

// dev hot reload
// https://github.com/SimplifyJobs/webpack-ext-reloader
const hotReload = isDev
  ? [
      new ExtensionReloader({
        reloadPage: true,
        manifest: path.resolve(__dirname, 'src/manifest.json'),
      }),
    ]
  : []

module.exports = {
  productionSourceMap: false,
  pages: {
    popup: {
      entry: `src/popup/index.js`,
      template: `pages/popup.html`,
      filename: `pages/popup.html`
    },
    options: {
      entry: `src/options/index.js`,
      template: `pages/options.html`,
      filename: `pages/options.html`
    }
  },
  configureWebpack: {
    mode: isDev ? 'development' : 'production',
    entry: {
      content: "./src/content/index.js",
      background: "./src/background/index.js"
    },
    output: {
      filename: '[name].js'
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: copyFiles
      }),
      ...hotReload
    ],
  },
  css: {
    extract: false
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
  }
}
