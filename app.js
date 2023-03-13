const express = require("express");
const cors = require("cors");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewId,
  getCommentsByReviewId,
  addComment,
  updateReviewById,
  getUsers,
} = require("./controllers/games.controllers");
app.use(cors());

app.get("/api", (request, response) => {
  response.status(200).send({ message: "All okay" });
});

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewId);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", addComment);

app.patch("/api/reviews/:review_id", updateReviewById);

app.get("/api/users", getUsers);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
