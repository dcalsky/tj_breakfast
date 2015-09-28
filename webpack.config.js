var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
	entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.js')],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.[hash].js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loaders: ['react-hot', 'babel-loader']
		},{
			test: /\.css$/,
			loader: 'style!css',
		},{
			test: /\.scss$/,
			loader: 'sass-loader',
		}]
	},
	plugins: [
		new CommonsChunkPlugin('vendor', 'vendors.[hash].js'),
	    new HtmlWebpackPlugin({
	      title: 'hello webpack',
	      template: './app/www/index.html',
	      inject: 'body'
	    })
	    
	]
};