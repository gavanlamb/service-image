const path = require('path');
const PACKAGE = require('./package.json');
const name = PACKAGE.name;
const version = PACKAGE.version;
const ZipPlugin = require('zip-webpack-plugin');

module.exports = () => {
    return {
        entry: './src/lambda.ts',
        
        mode: 'production',
        target: 'node',

        devtool: 'inline-source-map',
        
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        optimization: {
            minimize: true
        },
        performance: {
            hints: false
        },
        output: {
            path: path.join(__dirname, 'webpack'),
            filename: 'lambda.js',
        },
        plugins: [
            new ZipPlugin({
                filename: `${name}@${version}.zip`
            })
        ],
    }
};
