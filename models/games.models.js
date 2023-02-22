const db = require ("../db/connection");

function fetchCategories() {
    return db.query("SELECT * FROM categories").then((categories) => {
        return categories.rows;
        
    });
};

function fetchReviews() {
    return db.query(
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
        ORDER BY reviews.created_at DESC;`).then((reviews) => {
        return reviews.rows;
    })
}

module.exports = {
    fetchCategories,
    fetchReviews,
}