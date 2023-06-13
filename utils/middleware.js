const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Endpoint desconhecido' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).json({ error: 'ID do formato inválido' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
