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
  const queryParams = [];

  let queryString = `
  SELECT p.*, AVG(pr.rating) AS "average_rating"
  FROM properties p 
  LEFT JOIN property_reviews pr ON p.id = pr.property_id
  `;

  // get array of keys with actual values
  const keys = Object.keys(options).filter(key =>{
    if (!options[key]) {
      return false;
    }
    return key;
  });
  
  if (keys.length > 0) {
    queryString += `WHERE `;

    for (const key of keys) {
      // enter the AND to connect the options on queries
      // don't need AND for the HAVING clause
      if (queryParams.length > 0 && key !== 'minimum_rating') {
        queryString += 'AND ';
      }
      
      if (options[key]) {
        // the values in the table are cents and not dollar units
        switch (key) {
        case 'city':
          queryParams.push(`%${options[key]}%`);
          queryString += ` city LIKE $${queryParams.length} `;
          break;
        case 'owner_id':
          console.log("checking ownerid", options[key]);
          queryParams.push(Number(options[key]));
          queryString += ` owner_id = $${queryParams.length} `;
          break;
        case 'minimum_price_per_night':
          queryParams.push(Number(options[key]) * 100);
          queryString += ` cost_per_night > $${queryParams.length} `;
          break;
        case 'maximum_price_per_night':
          queryParams.push(Number(options[key]) * 100);
          queryString += ` cost_per_night < $${queryParams.length} `;
          break;
        }
      }
    }

  }

  queryString += ` GROUP BY p.id `;
  
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += ` HAVING AVG(pr.rating) >= $${queryParams.length} `;
  }
  
  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams)
    .then(data => {
      console.log("What is retuned getAllProperties");
      console.log(data.rows);
      return data.rows;
    });
};
exports.getAllProperties = getAllProperties;
 

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const updateParams = [];
  let updateString = `INSERT INTO properties (`;
  console.log("property object is");
  console.log(property);

  const keys = Object.keys(property);
  for (const key of keys) {
    updateString += key;
    if (keys.indexOf(key) ===  keys.length - 1) {
      updateString +=  `) `;
    } else {
      updateString +=  `, `;
    }
  }
  updateString +=  `VALUES (`;
  
  for (const key of keys) {
    // check to push correct type to db
    const numRegex = new RegExp("^[0-9]*$", "gm");
    if (typeof property[key] === 'string' && numRegex.test(property[key]) && key !== 'post_code') {
      updateParams.push(Number(property[key]));
    } else {
      updateParams.push(property[key]);
    }
    
    if (keys.indexOf(key) ===  keys.length - 1) {
      updateString += `$${updateParams.length} ) `;
    } else {
      updateString += `$${updateParams.length}, `;
    }
  }

  updateString += `RETURNING *;`;

  console.log("======================================================= ");
  console.log(updateString);
  console.log(updateParams);

  return pool.query(updateString, updateParams)
    .then(data => {
      console.log("return from addProperty");
      console.log(data.rows);
      return data.rows;
    })
    .catch(e => null);
};
exports.addProperty = addProperty;
