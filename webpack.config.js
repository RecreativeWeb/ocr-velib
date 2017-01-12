const webpack =  require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
	entry: './src/js/main.js',
	devtool: 'source-map',
	output: {
		filename: './lib/js/main.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, loader: 'babel-loader', options: { presets: ['es2015'] }},
      		{ test: /\.scss$/, loader: ExtractTextPlugin.extract({
      			fallbackLoader: "style-loader",
    			loader: "css-loader!sass-loader",
    			})
      		},
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	performance: {
	   hints: false
	},
	plugins: [
        new ExtractTextPlugin("./lib/css/main.css")
    ]
};

module.exports = config;