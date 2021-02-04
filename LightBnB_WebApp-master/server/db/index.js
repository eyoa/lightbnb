const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'vagrant',
  password: '123',
  database: 'lightbnb'
});

module.exports = pool;