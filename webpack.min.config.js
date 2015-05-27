var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        library: 'Typeahead',
        path: path.join(__dirname, 'dist'),
        filename: 'react-typeahead-component.min.js'
    },
    externals: [
        {'react': 'var React'}
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: true,
            beautify: true,
            output: {
                beautify: false,
                ascii_only: true
            }
        })
    ],
    module: {
        loaders: [
            {test: /\.jsx/, loader: 'jsx-loader'}
        ]
    }
};
