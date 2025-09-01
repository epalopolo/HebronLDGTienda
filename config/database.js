// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client:', err);
      process.exit(-1);
    });
  }

  async connect() {
    try {
      const client = await this.pool.connect();
      console.log('✅ Conectado a PostgreSQL');
      client.release();
      return true;
    } catch (error) {
      console.error('❌ Error conectando a PostgreSQL:', error);
      return false;
    }
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query:', { text, duration, rows: res.rowCount });
      }
      
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async transaction(callback) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async end() {
    await this.pool.end();
    console.log('✅ Conexión a base de datos cerrada');
  }

  // Health check method
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        database: 'postgresql'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        database: 'postgresql'
      };
    }
  }
}

// Create and export singleton instance
const database = new Database();

module.exports = database;