var webpack = require("webpack");

module.exports = {
    entry: "./home.jsx",
    output: {
        path: "../static",
        filename: "bundle.js"
    },
    plugins: [
      new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ],
    module: {
        loaders: [
            { test: /\.jsx$/, loader: "jsx-loader" }
        ]
    }
};
