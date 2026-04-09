// Lightweight ID generator — no dependency needed
export function nanoid(size = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  const array = new Uint8Array(size)
  crypto.getRandomValues(array)
  for (let i = 0; i < size; i++) {
    id += chars[array[i] % chars.length]
  }
  return id
}
