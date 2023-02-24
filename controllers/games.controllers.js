const {
  fetchCategories,
  fetchReviews,
  fetchReviewId,
  fetchCommentsByReviewId,
  sendComment,
} = require("../models/games.models");

function getCategories(request, response, next) {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((error) => {
      next(error);
    });
}

function getReviews(request, response, next) {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((error) => {
      next(error);
    });
}

function getReviewId(request, response, next) {
  const { review_id } = request.params;
  fetchReviewId(review_id)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((error) => {
      next(error);
    });
}

function getCommentsByReviewId(request, response, next) {
  const { review_id } = request.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
}

function addComment(request, response, next) {
  const newCommment = request.body;
  const { review_id } = request.params;
  sendComment(newCommment, review_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      console.log(error, "error in controllers");
      next(error);
    });
}

module.exports = {
  getCategories,
  getReviews,
  getReviewId,
  getCommentsByReviewId,
  addComment,
};
