// module.exports = {
//   // babel: {
//   //   plugins: ['./config/babel/babel-plugin-bem-classname'],
//   // },
// }

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  webpack: {
    plugins: [process.env.ANALYZE && new BundleAnalyzerPlugin()].filter(Boolean),
  },
}
