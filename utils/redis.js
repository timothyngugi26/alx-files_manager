import Redis from 'ioredis';

class RedisClient {
  constructor(options = {}) {
    const defaultOptions = {
      host: 'localhost',
      port: 6379,
      db: 0
    };
    
    this.client = new Redis({
      ...defaultOptions,
      ...options
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  isAlive() {
    return this.client.status === 'ready';
  }

  async set(key, value, duration) {
    try {
      if (duration) {
        await this.client.set(key, JSON.stringify(value), 'EX', duration);
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error setting value:', error);
    }
  }

  async get(key) {
    try {
      const result = await this.client.get(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error('Error getting value:', error);
      return null;
    }
  }
}

export default new RedisClient();
