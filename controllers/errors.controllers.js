function handleCustomErrors(error, request, response, next) {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
}

module.exports = {
  handleCustomErrors,
};
