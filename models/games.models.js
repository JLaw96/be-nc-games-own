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
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
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

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewId,
};
