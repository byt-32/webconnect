const fs = require('fs');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
})

module.exports = {
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "../server/dist"),
    filename: "bundle.js",
  },
  "devServer": {
    "port": 3000,
    "hot": true,
    "open": true,
    "proxy": {
      "/": {
        "target": "http://localhost:3100",
        "router":  () => "http://localhost:3001"
      }
    },
    static: {
      directory: path.join(__dirname, 'public')
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: {
            loader: 'url-loader'
          }
      },
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  plugins: [htmlPlugin]
};