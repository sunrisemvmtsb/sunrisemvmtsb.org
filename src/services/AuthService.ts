export default abstract class AuthService {
  private static _instance: AuthService | null = null
  static get instance(): AuthService {
    if (this._instance === null) this._instance = new ClientAuthService()
    return this._instance
  }

  abstract isLoggedIn(): Promise<boolean>
  abstract signout(): Promise<void>
}

class ClientAuthService extends AuthService {
  async isLoggedIn() {
    return sessionStorage.getItem('preview') === 'active'
  }

  async signout() {
    const url = '/api/auth/signout'
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
    })
    if (!response.ok) throw Error('failed to sign out')
    sessionStorage.removeItem('preview')
    window.dispatchEvent(new Event('storage'))
  }
}
