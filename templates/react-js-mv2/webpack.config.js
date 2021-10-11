const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ExtensionReloader = require('webpack-ext-reloader')
const isDev = process.env.NODE_ENV === 'development'

// copy file to dist
const copyFiles = [
  {
    from: path.resolve('src/manifest.json'),
    to: `${path.resolve('dist')}`,
  },
  {
    from: path.resolve('assets'),
    to: path.resolve('dist/assets'),
  },
]

// all script entry
// custom by your need
const entries = {
  'js/popup': './src/popup/index.js',
  'js/content': './src/content/index.js',
  'js/background': './src/background/index.js',
  'js/options': './src/options/index.js',
}

// page with html
// custom by your need
const pages = [
  new HtmlWebpackPlugin({
    filename: 'pages/popup.html',
    template: 'pages/popup.html',
    chunks: ['js/popup'],
  }),
  new HtmlWebpackPlugin({
    filename: 'pages/options.html',
    template: 'pages/options.html',
    chunks: ['js/options'],
  }),
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

const terser = isDev
  ? []
  : [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ]

const babelOptions = {
  cacheDirectory: true,
  presets: ['@babel/preset-react', ['@babel/preset-env']],
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: entries,
  output: {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...pages,
    ...hotReload,
    new CopyWebpackPlugin({
      patterns: copyFiles,
    }),
    new WebpackBar(),
  ],
  resolve: {
    extensions: ['.js', 'less'],
  },
  optimization: {
    minimize: !isDev,
    minimizer: terser,
  },
}
