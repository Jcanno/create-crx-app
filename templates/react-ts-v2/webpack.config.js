/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
  'popup/index': './src/popup/index.tsx',
  'devtools/index': './src/devtools/index.tsx',
  'inject/index': './src/inject/index.ts',
  'content/index': './src/content/index.tsx',
  'background/index': './src/background/index.ts',
  'devtools/panel': './src/devtools/panel.tsx',
}

// page with html
// custom by your need
const pages = [
  new HtmlWebpackPlugin({
    filename: 'popup/index.html',
    template: 'src/popup/index.html',
    chunks: ['popup/index'],
  }),
  new HtmlWebpackPlugin({
    filename: 'devtools/index.html',
    template: 'src/devtools/index.html',
    chunks: ['devtools/index'],
  }),
  new HtmlWebpackPlugin({
    filename: 'devtools/panel.html',
    template: 'src/devtools/panel.html',
    chunks: ['devtools/panel'],
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
          options: {
            cacheDirectory: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          'ts-loader',
        ],
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    ...pages,
    ...hotReload,
    new CopyWebpackPlugin({
      patterns: copyFiles,
    }),
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
}
