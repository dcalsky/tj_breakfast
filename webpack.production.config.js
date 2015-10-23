var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
	entry: {
		app: [path.resolve(__dirname, 'app/js/main.js')],
		vendors: ['react', 'react-router'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.[hash].js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loaders: ['babel-loader']
		},{
			test: /\.css$/,
			loader: 'style!css',
		},{
			test: /\.scss$/,
			loader: 'style!css!sass'
		},{
			test: /\.(woff|ttf)/,
			loader: 'url?limit=100000',
		}]
	},
	resolve: {
	    extensions: ['', '.webpack.js', '.web.js', '.coffee', '.js', '.json', '.jsx', '.html', '.scss', '.css']
	},
	  node: {
	    net: 'empty',
	    tls: 'empty',
	    dns: 'empty'
	  },
	plugins: [
		new CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
	    new HtmlWebpackPlugin({
	      title: '同济早餐',
	      template: './app/www/index.html',
	      inject: 'body'
	    }),
		new UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		})
	    
	]
};