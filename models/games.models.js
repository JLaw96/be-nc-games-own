const db = require("../db/connection");

function fetchCategories() {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
}

function fetchReviews(category, sort_by = "created_at", order = "DESC") {
  let queryString = `SELECT
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
  ON reviews.review_id = comments.review_id `;

  const queryValues = [];
  const order_by = order.toUpperCase();
  const validSortColumns = [
    "owner",
    "title",
    "review_id",
    "category",
    "designer",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrders = ["ASC", "DESC"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({
      status: 404,
      message: "Invalid sort query",
    });
  }
  if (!validOrders.includes(order_by)) {
    return Promise.reject({
      status: 404,
      message: "Invalid order query",
    });
  }

  if (category !== undefined) {
    queryValues.push(category);
    queryString += ` WHERE reviews.category = $1 GROUP BY reviews.review_id ORDER BY ${sort_by} ${order_by}`;
  } else {
    queryString += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order_by}`;
  }

  return db
    .query(`SELECT * FROM categories;`)
    .then((result) => {
      if (
        !result.rows.map((cat) => cat.slug).includes(category) &&
        category !== undefined
      ) {
        return Promise.reject({ status: 404, message: "Category Not Found" });
      }
    })
    .then(() => {
      return db.query(queryString, queryValues);
    })
    .then((result) => {
      return result.rows;
    });
}

function fetchReviewId(review_id) {
  return db
    .query(
      `
      SELECT reviews.*,
             (SELECT COUNT(*) FROM comments WHERE review_id = $1) AS comment_count
      FROM reviews
      WHERE review_id = $1;
    `,
      [review_id]
    )
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

function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then((comment) => {
      if (comment.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `The comment ID (${comment_id} you entered was not found)`,
        });
      }
    });
}

function amendReview({ inc_votes }, review_id) {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [inc_votes, review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "review_id Not Found",
        });
      } else {
        return review.rows[0];
      }
    });
}

function fetchUsers() {
  return db.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
}

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewId,
  fetchCommentsByReviewId,
  sendComment,
  amendReview,
  fetchUsers,
  removeComment,
};
