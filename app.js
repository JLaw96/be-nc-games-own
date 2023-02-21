const express = require("express");
const app = express();
const  {
    getCategories
} = require("./controllers/games.controllers");
const {
    handleCustomErrors,
} = require("./controllers/errors.controllers");


app.get("/api", (request, response) => {
    response.status(200).send({ message: "All okay"})
});

app.get("/api/categories", getCategories);


module.exports = app;