const properties = require('./json/properties.json');
const users = require('./json/users.json');

//connect to database
const {Pool} = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'vagrant',
  password: '123',
  database: 'lightbnb'
});


pool.connect();

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(
    `SELECT * FROM users
    WHERE email = $1;
    `, [email])
    .then(data => data.rows[0])
    .catch(e => null);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(
    `SELECT * FROM users
    WHERE id = $1;
    `, [id])
    .then(data => data.rows[0])
    .catch(e => null);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(
    `INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id;
    `, [user.name, user.email, user.password])
    .then(data => data.rows[0])
    .catch(e => null);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(
    `SELECT res.*, prop.*, AVG(pr.rating) AS "average_rating"
    FROM reservations res 
    JOIN properties prop ON res.property_id = prop.id
    JOIN property_reviews pr ON prop.id = pr.property_id
    WHERE res.guest_id = $1 AND res.end_date < Now()::DATE
    GROUP BY res.id, prop.id
    ORDER BY start_date
    LIMIT $2;
    `, [guest_id, limit])
    .then(data => data.rows)
    .catch(e => null);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return  pool.query(`
  SELECT * FROM properties 
  LIMIT $1;
  `, [limit])
    .then(data => data.rows);
};
exports.getAllProperties = getAllProperties;
 

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
