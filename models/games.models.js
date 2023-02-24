const db = require("../db/connection");

function fetchCategories() {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
}

function fetchReviews() {
  return db
    .query(
      `SELECT 
        reviews.owner, 
        reviews.title, 
        reviews.review_id, 
        reviews.category, 
        reviews.review_img_url, 
        reviews.created_at, 
        reviews.votes, 
        reviews.designer,
        COUNT(comments.comment_id)::int AS comment_count
        FROM reviews LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;`
    )
    .then((reviews) => {
      return reviews.rows;
    });
}

function fetchReviewId(review_id) {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((reviews) => {
      if (reviews.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "review_id not found",
        });
      } else {
        return reviews.rows[0];
      }
    });
}

function fetchCommentsByReviewId(review_id) {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((reviews) => {
      if (!reviews.rows[0]) {
        return Promise.reject({
          status: 404,
          message: "review_id not found",
        });
      } else {
        return reviews.rows[0];
      }
    })
    .then(() => {
      return db.query(
        "SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;",
        [review_id]
      );
    })
    .then((comments) => {
      return comments.rows;
    });
}

function sendComment(newCommment, review_id) {
  const { username, body } = newCommment;
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: "Bad Request - No username/body",
    });
  }
  const validId = db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((reviews) => {
      if (reviews.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "review_id not found",
        });
      } else {
        return reviews.rows[0];
      }
    });
  const validUsername = db
    .query("SELECT * FROM comments WHERE author = $1;", [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Username Not Found",
        });
      } else {
        return user.rows[0];
      }
    });
  const insertComment = db
    .query(
      `INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, review_id]
    )
    .then((comments) => comments.rows[0]);

  return Promise.all([validId, validUsername, insertComment]);
}

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewId,
  fetchCommentsByReviewId,
  sendComment,
};
