const express = require("express");
const { handleCustomErrors } = require("./controllers/errors.controllers");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewId,
} = require("./controllers/games.controllers");

app.get("/api", (request, response) => {
  response.status(200).send({ message: "All okay" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewId);

app.use(handleCustomErrors);

module.exports = app;
