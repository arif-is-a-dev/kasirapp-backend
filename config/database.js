import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',
  database: 'kasir-app',  
  password: '123',   
  port: 5432,
});

// Test koneksi
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('✅ Database connected successfully');
  release();
});

export default pool;