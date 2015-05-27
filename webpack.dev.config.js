var path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        library: 'Typeahead',
        path: path.join(__dirname, 'dist'),
        filename: 'react-typeahead-component.dev.js'
    },
    externals: [
        {'react': 'var React'}
    ],
    devtool: '#inline-source-map',
    module: {
        loaders: [
            {test: /\.jsx/, loader: 'jsx-loader'}
        ]
    }
};
