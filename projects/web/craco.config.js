const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  webpack: {
    plugins: [process.env.npm_config_report && new BundleAnalyzerPlugin()].filter(Boolean),
  },
}
