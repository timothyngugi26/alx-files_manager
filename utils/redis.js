import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    });

    // Log any Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Connect the client
    this.client.connect();
  }

  /**
   * Check if the Redis connection is alive
   * @returns {boolean} Connection status
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Get a value from Redis by key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The value associated with the key
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error('Error getting value:', error);
      return null;
    }
  }

  /**
   * Set a value in Redis with optional expiration
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<boolean>} Success status of the operation
   */
  async set(key, value, duration) {
    try {
      await this.client.setEx(key, duration, value);
      return true;
    } catch (error) {
      console.error('Error setting value:', error);
      return false;
    }
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<boolean>} Success status of the operation
   */
  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting key:', error);
      return false;
    }
  }
}

export default new RedisClient();
