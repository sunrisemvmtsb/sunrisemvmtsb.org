import { useGithubAuthRedirect } from 'react-tinacms-github'

const GitHubAuth = () => {
  useGithubAuthRedirect()
  return <h2>Authorizing with GitHub, please wait...</h2>
}

export default GitHubAuth
