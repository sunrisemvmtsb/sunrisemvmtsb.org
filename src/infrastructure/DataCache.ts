type Entry<T> = {
  timestamp: number,
  value: T,
}

export default class DataCache<T> {
  private _timeout: number
  private _entries: Map<string | symbol, Entry<T>>

  constructor({
    ttl,
  }: {
    ttl: number,
  }) {
    this._timeout = ttl * 1000
    this._entries = new Map()
  }

  get(key: string | symbol): T | null {
    const current = this._entries.get(key)
    const now = Date.now()
    if (current && now - current.timestamp < this._timeout) {
      console.log('[DataCache]', 'HIT', key)
      return current.value
    }
    this._entries.delete(key)
    return null
  }

  delete(key: string | symbol) {
    this._entries.delete(key)
  }

  put(key: string | symbol, value: T) {
    this._entries.set(key, { timestamp: Date.now(), value })
  }

  update(key: string | symbol, update: (value: T) => T) {
    const current = this._entries.get(key)
    if (!current) return
    const updated = update(current.value)
    this._entries.set(key, { ...current, value: updated })
  }
}
