const pool = require('../config/database');
const logger = require('../utils/logger');

const getPersonById = async (id) => {
  logger.info(`Executing getPersonById use case for id: ${id}`);
  
  const result = await pool.query(
    'SELECT id, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt" FROM persons WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) {
    logger.info(`Person not found with id: ${id}`);
    return { found: false, data: null };
  }
  
  logger.info(`Person retrieved successfully: ${id}`);
  return { found: true, data: result.rows[0] };
};

const getPersonsList = async (filters) => {
  const { firstName, lastName } = filters;
  logger.info(`Executing getPersonsList use case with filters:`, { firstName, lastName });
  
  let query = 'SELECT id, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt" FROM persons WHERE 1=1';
  const params = [];
  let paramCount = 0;
  
  if (firstName) {
    paramCount++;
    query += ` AND LOWER(first_name) LIKE LOWER($${paramCount})`;
    params.push(`%${firstName}%`);
  }
  
  if (lastName) {
    paramCount++;
    query += ` AND LOWER(last_name) LIKE LOWER($${paramCount})`;
    params.push(`%${lastName}%`);
  }
  
  query += ' ORDER BY id';
  
  const result = await pool.query(query, params);
  
  logger.info(`Person list retrieved with filters:`, { 
    firstName, 
    lastName, 
    count: result.rows.length 
  });
  
  return {
    data: result.rows,
    count: result.rows.length,
    filters: { firstName, lastName }
  };
};

const createPerson = async (personData) => {
  const { firstName, lastName } = personData;
  logger.info(`Executing createPerson use case:`, { firstName, lastName });
  
  const existingPersonQuery = await pool.query(
    'SELECT id FROM persons WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)',
    [firstName, lastName]
  );
  
  if (existingPersonQuery.rows.length > 0) {
    logger.warn(`Person with name ${firstName} ${lastName} already exists`);
    return { 
      created: false, 
      data: null, 
      reason: 'DUPLICATE_NAME',
      message: 'A person with this name already exists' 
    };
  }
  
  const result = await pool.query(
    'INSERT INTO persons (first_name, last_name) VALUES ($1, $2) RETURNING id, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"',
    [firstName, lastName]
  );
  
  logger.info(`Person created successfully:`, { 
    id: result.rows[0].id, 
    firstName, 
    lastName 
  });
  
  return { 
    created: true, 
    data: result.rows[0] 
  };
};

module.exports = {
  getPersonById,
  getPersonsList,
  createPerson
};
