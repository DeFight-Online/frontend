module.exports = {
  devServer: {
    port: 5050,
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/defight/'
    : '/'
}