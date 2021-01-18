module.exports = {
  env: {},
  target: 'serverless',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  },
}
