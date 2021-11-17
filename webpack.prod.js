const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
            {   
                type: 'javascript/auto',
                test: /\.json$/,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: './assets'
                }
              }
        ]
    },
    output:{
        libraryTarget: 'var',
        library: 'Client',
    },
    optimization: {
        minimizer: [new TerserPlugin({})],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({filename: '[name].css'}),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
        new CopyPlugin({
          patterns: [
            {   from:   "./src/client/assets/images/weather", 
                to:     "./images/weather" }
          ],
        }),
    ]
}
