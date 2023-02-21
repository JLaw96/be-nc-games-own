const db = require ("../db/connection");

function fetchCategories() {
    return db.query("SELECT * FROM categories").then(({ rows: categories }) => {
        return categories;
    });
};

module.exports = {
    fetchCategories,
}