function handleCustomErrors(error, request, response, next) {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
}

function handlePsqlErrors(error, request, response, next) {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad Request" });
  } else {
    next(error);
  }
}

module.exports = {
  handleCustomErrors,
  handlePsqlErrors,
};
