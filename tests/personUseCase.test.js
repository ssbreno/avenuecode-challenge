const personUseCases = require('../src/usecases/personUseCases');
const pool = require('../src/config/database');

// Mock the database pool
jest.mock('../src/config/database');
const mockPool = pool;

describe('Person Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPersonById', () => {
    it('should return person when found', async () => {
      const mockPerson = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };

      mockPool.query.mockResolvedValue({ rows: [mockPerson] });

      const result = await personUseCases.getPersonById(1);

      expect(result.found).toBe(true);
      expect(result.data).toEqual(mockPerson);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT id, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt" FROM persons WHERE id = $1',
        [1]
      );
    });

    it('should return not found when person does not exist', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await personUseCases.getPersonById(999);

      expect(result.found).toBe(false);
      expect(result.data).toBeNull();
    });
  });

  describe('getPersonsList', () => {
    it('should filter by firstName only', async () => {
      const mockPersons = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Johnny', lastName: 'Smith' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockPersons });

      const result = await personUseCases.getPersonsList({ firstName: 'John' });

      expect(result.data).toEqual(mockPersons);
      expect(result.count).toBe(2);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(first_name) LIKE LOWER($1)'),
        ['%John%']
      );
    });

    it('should filter by lastName only', async () => {
      const mockPersons = [
        { id: 1, firstName: 'John', lastName: 'Doe' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockPersons });

      const result = await personUseCases.getPersonsList({ lastName: 'Doe' });

      expect(result.data).toEqual(mockPersons);
      expect(result.count).toBe(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(last_name) LIKE LOWER($1)'),
        ['%Doe%']
      );
    });

    it('should filter by both firstName and lastName', async () => {
      const mockPersons = [
        { id: 1, firstName: 'John', lastName: 'Doe' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockPersons });

      const result = await personUseCases.getPersonsList({ 
        firstName: 'John', 
        lastName: 'Doe' 
      });

      expect(result.data).toEqual(mockPersons);
      expect(result.count).toBe(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(first_name) LIKE LOWER($1)'),
        ['%John%', '%Doe%']
      );
    });
  });

  describe('createPerson', () => {
    it('should create person when name is unique', async () => {
      const newPerson = { firstName: 'Jane', lastName: 'Smith' };
      const createdPerson = {
        id: 10,
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };

      // Mock: no existing person found
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })  // Check duplicate
        .mockResolvedValueOnce({ rows: [createdPerson] }); // Insert person

      const result = await personUseCases.createPerson(newPerson);

      expect(result.created).toBe(true);
      expect(result.data).toEqual(createdPerson);
      expect(mockPool.query).toHaveBeenCalledTimes(2);
    });

    it('should not create person when name already exists', async () => {
      const newPerson = { firstName: 'John', lastName: 'Doe' };

      // Mock: existing person found
      mockPool.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await personUseCases.createPerson(newPerson);

      expect(result.created).toBe(false);
      expect(result.data).toBeNull();
      expect(result.reason).toBe('DUPLICATE_NAME');
      expect(result.message).toBe('A person with this name already exists');
      expect(mockPool.query).toHaveBeenCalledTimes(1); // Only duplicate check
    });
  });
});
