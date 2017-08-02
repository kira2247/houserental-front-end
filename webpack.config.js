
module.exports = {
	entry: "./src/index.js",

	output: {
		filename: "./bundle.js"
	},

	devServer: {
		inline: true,
		port: process.env.PORT || 8080
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_module/,
				use: "babel-loader"
			},
			{ test: /\.json$/, use: 'json-loader' }
		],
		loaders: [{
	      	exclude: /node_modules/,
	      	loader: 'babel',
	      	query: {
	        	presets: ['es2015','react','stage-1']
	      	}
    	}]
	},

	resolve: {
    	extensions: ['.js', '.jsx']
  	},
	node: {
    console: false,
    fs: "empty",
    net: "empty",
    tls: "empty"
  	},

  	devServer: {
    historyApiFallback: true,
    contentBase: './'
  }

}
