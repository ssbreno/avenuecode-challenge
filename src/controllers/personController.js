const personUseCases = require('../usecases/personUseCases');

const getPersonById = async (req, res, next) => {
  try {
    const { id } = req.validated;
    
    const result = await personUseCases.getPersonById(id);
    
    if (!result.found) {
      return res.status(404).json({
        success: false,
        message: 'Person not found'
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    next(error);
  }
};

const getPersonsList = async (req, res, next) => {
  try {
    const filters = req.validated;
    
    const result = await personUseCases.getPersonsList(filters);
    
    res.json({
      success: true,
      data: result.data,
      count: result.count
    });
    
  } catch (error) {
    next(error);
  }
};

const createPerson = async (req, res, next) => {
  try {
    const personData = req.validated;
    
    const result = await personUseCases.createPerson(personData);
    
    if (!result.created) {
      return res.status(400).json({
        success: false,
        message: result.message,
        reason: result.reason
      });
    }
    
    res.status(201).json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPersonById,
  getPersonsList,
  createPerson
};
