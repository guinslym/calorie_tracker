var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

require('babel-polyfill').default;

module.exports = {
	context: __dirname,
	entry: './static/index',

        output: {
                path: path.resolve('./static/bundles'),
                filename: 'bundle.js',
        },

	plugins: [
                new BundleTracker({filename: './webpack-stats.json'}),
                new webpack.ProvidePlugin({
                        $: 'jquery',
                        jQuery: 'jquery',
                        'window.jQuery': 'jquery'
                })
        ],

        module: {
                loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            }
        ]
        },

        resolve: {
                modulesDirectories: ['node_modules'],
                extensions: ['', '.js', '.jsx']
        }	
}
