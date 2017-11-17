const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ["whatwg-fetch","./js/app.js","./scss/style.scss"],
    output: { filename: "./js/out.js" },
    devServer: {
        inline: true,
        contentBase: './',
        port: 3001
    },
    watch: true,

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { presets: ['es2015', 'stage-2', 'react'] }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })

            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./css/style.css')

    ]
};