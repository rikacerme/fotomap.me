class StorageClient {
  private prefix = 'APP_'

  set<T>(key: string, value: T): void {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      localStorage.setItem(prefixedKey, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to set storage key ${key}:`, error)
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      const item = localStorage.getItem(prefixedKey)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error(`Failed to get storage key ${key}:`, error)
      return defaultValue || null
    }
  }

  remove(key: string): void {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      localStorage.removeItem(prefixedKey)
    } catch (error) {
      console.error(`Failed to remove storage key ${key}:`, error)
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`
  }
}

export const storageClient = new StorageClient()
