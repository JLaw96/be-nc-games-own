function handleCustomErrors(error, request, response, next) {
    if (error.status && error.message) {
        console.log(error.status, 'error status in ec')
        response.status(404).send({ message: 'Not Found' })
    } else {
        next(error);
    };
    };

    module.exports = {
        handleCustomErrors
    };