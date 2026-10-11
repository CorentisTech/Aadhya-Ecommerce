import { Redis } from '@upstash/redis'

// Initialize Redis from UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv()
