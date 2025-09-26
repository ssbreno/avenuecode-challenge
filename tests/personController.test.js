const request = require('supertest');
const app = require('../src/app');

describe('Person API Endpoints', () => {
  
  describe('GET /person/:id', () => {
    it('should return person by valid ID', async () => {
      const response = await request(app)
        .get('/person/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('firstName', 'Mickey');
      expect(response.body.data).toHaveProperty('lastName', 'Mouse');
    });

    it('should return 404 for non-existent person', async () => {
      const response = await request(app)
        .get('/person/999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Person not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/person/invalid')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 400 for negative ID', async () => {
      const response = await request(app)
        .get('/person/-1')
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /person/list', () => {
    it('should filter by firstName', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({ firstName: 'Mickey' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Mickey');
      expect(response.body.count).toBe(1);
    });

    it('should filter by lastName', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({ lastName: 'Mouse' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every(person => person.lastName === 'Mouse')).toBe(true);
    });

    it('should filter by both firstName and lastName', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({ firstName: 'Donald', lastName: 'Duck' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Donald');
      expect(response.body.data[0].lastName).toBe('Duck');
    });

    it('should perform case-insensitive partial matching', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({ firstName: 'mic' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].firstName.toLowerCase()).toContain('mic');
    });

    it('should return empty array when no matches found', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({ firstName: 'NonExistent' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });

    it('should return 400 when no filter provided', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 400 for empty string filters', async () => {
      const response = await request(app)
        .post('/person/list')
        .send({ firstName: '' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /person', () => {
    it('should create a new person with valid data', async () => {
      const newPerson = {
        firstName: 'TestUser',
        lastName: 'UniqueLastName'
      };

      const response = await request(app)
        .post('/person')
        .send(newPerson)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe(newPerson.firstName);
      expect(response.body.data.lastName).toBe(newPerson.lastName);
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should return 400 when person with same name already exists', async () => {
      const duplicatePerson = {
        firstName: 'Mickey',
        lastName: 'Mouse'
      };

      const response = await request(app)
        .post('/person')
        .send(duplicatePerson)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.reason).toBe('DUPLICATE_NAME');
      expect(response.body.message).toBe('A person with this name already exists');
    });

    it('should trim whitespace from names', async () => {
      const newPerson = {
        firstName: '  Jane  ',
        lastName: '  Smith  '
      };

      const response = await request(app)
        .post('/person')
        .send(newPerson)
        .expect(201);
      
      expect(response.body.data.firstName).toBe('Jane');
      expect(response.body.data.lastName).toBe('Smith');
    });

    it('should return 400 when firstName is missing', async () => {
      const response = await request(app)
        .post('/person')
        .send({ lastName: 'Doe' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 400 when lastName is missing', async () => {
      const response = await request(app)
        .post('/person')
        .send({ firstName: 'John' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for empty firstName', async () => {
      const response = await request(app)
        .post('/person')
        .send({ firstName: '', lastName: 'Doe' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for too long names', async () => {
      const longName = 'a'.repeat(101);
      
      const response = await request(app)
        .post('/person')
        .send({ firstName: longName, lastName: 'Doe' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('General API', () => {
    it('should return health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API is running');
    });

    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
  });
});
