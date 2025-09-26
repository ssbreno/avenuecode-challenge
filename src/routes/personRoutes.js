const express = require('express');
const { validateRequest } = require('../middleware/validation');
const { personIdSchema, personCreateSchema, personListSchema } = require('../validation/schemas');
const { getPersonById, getPersonsList, createPerson } = require('../controllers/personController');

const router = express.Router();

router.get('/:id', 
  validateRequest(personIdSchema, 'params'),
  getPersonById
);

router.post('/list',
  validateRequest(personListSchema, 'body'),
  getPersonsList
);

router.post('/',
  validateRequest(personCreateSchema, 'body'),
  createPerson
);

module.exports = router;
