const path = require("path");
const fs = require("fs");
const { VueLoaderPlugin } = require("vue-loader");
var k,jj;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require("webpack");
module.exports = {
  devtool:false,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
},
  entry:
    (
      (k = (function (dir) {
      var files_ = {},
        name1;
      var files = fs.readdirSync(dir);
      files.forEach((v) => {
        fs.readdirSync((name1 = path.resolve(dir, v, "entrypoints"))).forEach(
          (_) => {
            files_[v] = (files_[v] ?? []).concat(path.resolve(name1, _));
          }
        );
      });
      return files_;
    })(path.resolve(__dirname, "ui", "pages"))),
    (
      jj = function(pk,pat){
        k[pk] = []
        var p = path.resolve(__dirname, pat)
        var files = fs.readdirSync(p)
        files.forEach((v)=>{
         if(v.endsWith(".js")){
           k[pk] = k[pk].concat(path.resolve(p,v))
         } 
        })  
      }
  ),jj("vuedist", "vue_du/src"),
    k),
  devServer: {
    hot: true,
    open: true,
  },
  output: {
    path: path.resolve(__dirname, "./public/javascripts", "bundles"),
    filename: "[name]/[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{ loader: "vue-loader" }],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            options: { transpileOnly: true },
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.m?js/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".tsx", ".jsx"],
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  optimization: {
    minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
  },
          plugins:  [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
              'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            new MiniCssExtractPlugin({
              filename: "bundle.css",
            }),
            new webpack.optimize.AggressiveMergingPlugin(),
            new TerserPlugin({
              terserOptions: {
                mangle: true,
                compress: {
                  warnings: false,
                  pure_getters: true,
                  unsafe: true,
                  unsafe_comps: true,
                  conditionals: true,
                  unused: true,
                  comparisons: true,
                  sequences: true,
                  dead_code: true,
                  evaluate: true,
                  if_return: true,
                  join_vars: true,
                },
                output: {
                  comments: false,
                },
              },
              extractComments: false,
            }),
            new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
            new CompressionPlugin({
              filename: "[path][base].gz",
              algorithm: "gzip",
              test: /\.(js|css|html)$/,
              threshold: 10240,
              minRatio: 0,
            }),
          ],

  // plugins: [],
  //     plugins: [
  //       new webpack.DefinePlugin({
  //         'process.env.LOGINKEY': JSON.stringify({key: process.env.LOGINKEY}),
  //       })
  //   ],
};
