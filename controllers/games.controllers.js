const {
  fetchCategories,
  fetchReviews,
  fetchReviewId,
  fetchCommentsByReviewId,
  sendComment,
  amendReview,
  fetchUsers,
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
      next(error);
    });
}

function updateReviewById(request, response, next) {
  const { review_id } = request.params;
  const inc_votes = request.body;
  amendReview(inc_votes, review_id)
    .then((review) => {
      response.status(201).send({ review });
    })
    .catch((error) => {
      next(error);
    });
}

function getUsers(request, response, next) {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  getCategories,
  getReviews,
  getReviewId,
  getCommentsByReviewId,
  addComment,
  updateReviewById,
  getUsers,
};
