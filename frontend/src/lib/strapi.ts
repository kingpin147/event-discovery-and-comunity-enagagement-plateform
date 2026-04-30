import { redis } from './redis'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const CACHE_TTL = 3600 // 1 hour

export async function fetchStrapi(endpoint: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}/api/${endpoint}`
  
  // Try to get from cache first for GET requests
  const isCacheable = options.method === 'GET' || !options.method
  const cacheKey = `strapi:${endpoint}`

  if (isCacheable) {
    try {
      const cachedData = await redis.get(cacheKey)
      if (cachedData) {
        return cachedData
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }

  // Fetch from Strapi
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  // Save to cache if successful
  if (isCacheable && response.ok) {
    try {
      await redis.set(cacheKey, data, { ex: CACHE_TTL })
    } catch (error) {
      console.error('Redis save error:', error)
    }
  }

  return data
}
