require('dotenv').config()

module.exports = {
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_BASE_BRANCH: process.env.GITHUB_BASE_BRANCH,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
}
