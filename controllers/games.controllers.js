const {
    fetchCategories,
    fetchReviews,
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

function getReviews (request, response, next) {
    fetchReviews()
    .then((reviews) => {
        response.status(200).send({ reviews });
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = {
    getCategories,
    getReviews,
}
