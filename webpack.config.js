import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import OfflinePlugin from 'offline-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import ResourceHintWebpackPlugin from 'resource-hints-webpack-plugin';
import path from 'path';

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, "src"),

  entry: './index.js',

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.css'],
    modules: [
      'node_modules'
    ],
    alias: {
      App: path.resolve(__dirname, 'src/views/containers/App'),
      Components: path.resolve(__dirname, 'src/views/components'),
      Containers: path.resolve(__dirname, 'src/views/containers'),
      Internal: path.resolve(__dirname, 'src/internal'),

      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class',
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'src'),
        enforce: 'pre',
        use: 'source-map-loader'
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { targets: { browsers: ['last 2 versions', 'ie 11'], node: true } }],
              'stage-0'
            ],
            plugins: [
              ['transform-es2015-block-scoping'],
              ['transform-decorators-legacy'],
              ['transform-react-jsx', { pragma: 'h' }]
            ]
          }
        }
      },
      {
        test: /[^.global].(css)$/,
        include: [path.resolve(__dirname, 'src/views')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { modules: true, sourceMap: IS_DEV, importLoaders: 1, root: '', localIdentName: '[name]_[local]_[hash:base64:5]' }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: IS_DEV
              }
            }
          ]
        })
      },
      {
        test: /\.global.(css)$/,
        include: [path.resolve(__dirname, 'src/views')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: IS_DEV, importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: IS_DEV
              }
            }
          ]
        })
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        use: 'raw-loader'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif|mp4|pdf)(\?.*)?$/i,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new WebpackMd5Hash(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
      __IS_DEV__: JSON.stringify(IS_DEV)
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { collapseWhitespace: true }
    }),
    new ResourceHintWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: './public', to: './' }
    ])
  ].concat(!IS_DEV ? [
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),

    new webpack.optimize.UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false
        },
        compress: {
          unsafe_comps: true,
          properties: true,
          keep_fargs: false,
          pure_getters: false,
          collapse_vars: true,
          unsafe: true,
          warnings: false,
          screw_ie8: true,
          sequences: true,
          dead_code: true,
          drop_debugger: true,
          comparisons: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true,
          if_return: true,
          join_vars: true,
          cascade: true,
          drop_console: true
        }
      }
    }),

    new OfflinePlugin({
      safeToUseOptionalCaches: true,
      caches: {
        main: [
          'bundle.js',
          'style.css',
          'index.html'
        ],
        additional: [
          '*.jpg',
          '*.png',
          '*.svg',
          '*.gif'
        ],
        optional: [
          ':rest:'
        ]
      },
      AppCache: false,
      ServiceWorker: {
        events: true
      }
    })
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: !IS_DEV ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 9000,
    host: 'localhost',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    }
  }
};
