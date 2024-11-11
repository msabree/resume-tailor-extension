const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require('webpack');
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.tsx",
        contentScript: "./src/contentScript.tsx",
        background: './src/background.js',
    },
    mode: "production",
    module: {
        rules: [
            {
              test: /\.tsx?$/,
               use: [
                 {
                  loader: "ts-loader",
                   options: {
                     compilerOptions: { noEmit: false },
                    }
                  }],
               exclude: /node_modules/,
            },
            {
              exclude: /node_modules/,
              test: /\.css$/i,
               use: [
                  "style-loader",
                  "css-loader"
               ]
            },
        ],
    },
    plugins: [
        new Dotenv(),
        new webpack.ProvidePlugin({
            process: 'process/browser', // Make process globally available
            Buffer: ['buffer', 'Buffer']
          }),
        new CopyPlugin({
            patterns: [
                { 
                    from: "manifest.json", 
                    to: "../manifest.json" 
                },
                {
                    from: path.resolve(__dirname, 'public/icons'),
                    to: path.resolve(__dirname, 'dist/icons'),
                }
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            assert: require.resolve("assert/"),
            stream: require.resolve('stream-browserify'),
            process: require.resolve('process/browser'),
            buffer: require.resolve('buffer/'),
        },
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}