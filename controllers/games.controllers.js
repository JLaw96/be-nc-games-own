const {
    fetchCategories,
} = require("../models/games.models");

function getCategories(request, response, next) {
    fetchCategories()
    .then((categories) => {
        response.status(200).send({ categories });
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = {
    getCategories,
}