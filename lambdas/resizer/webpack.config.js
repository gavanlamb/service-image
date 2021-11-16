const path = require('path');
const PACKAGE = require('./package.json');
const name = PACKAGE.name;
const version = PACKAGE.version;
const ZipPlugin = require('zip-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = () => {
    return {
        entry: './src/lambda.ts',
        mode: 'production',
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        optimization: {
            minimize: false
        },
        performance: {
            hints: false
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, 'webpack'),
            filename: 'lambda.js'
        },
        plugins: [
            new CopyPlugin({
                patterns:[
                    {
                        from: 'node_modules/',
                        to: "node_modules/"
                    }
                ]
            }),
            new ZipPlugin({
                filename: `${name}@${version}.zip`
            })
        ],
        externals: [nodeExternals()]
    }
};
