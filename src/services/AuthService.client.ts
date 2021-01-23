import base64 from 'base-64'

export default class AuthService {
  async isLoggedIn() {
    return sessionStorage.getItem('preview') === 'active'
  }

  async signin() {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const array = new Uint8Array(40)
    crypto.getRandomValues(array)
    const chars = array.map((x) => validChars.charCodeAt(x % validChars.length))
    const csrf = String.fromCharCode(...chars)

    const state = base64.encode(JSON.stringify({ csrf, redirect: window.location.href }))

    const url = '/api/auth/signin'
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ state }),
    })
    const data = await response.json()
    window.location.assign(data.url)
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
