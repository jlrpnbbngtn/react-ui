const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  target: 'node',
  plugins: [
		new NodePolyfillPlugin()
	],
  paths :{
    "http": ["node_modules/http-browserify"]
  },
  resolve: {
    fallback: {
      "http": require.resolve("http-browserify"),
      "https": require.resolve("https-browserify")
    }
  }
}
