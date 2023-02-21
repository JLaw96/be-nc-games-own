const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(testData);
});

describe("app", () => {
    describe("/api", () => {
      it("should respond with a status code 200 and a message of All okay", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then((response) => {
            expect(response.body.message).toBe("All okay");
          });
      });
    });
    describe("GET /api/categories", () => {
      it("200: GET - should respond with an array containing the categories object.", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            const { categories } = body;
            expect(categories).toBeInstanceOf(Array);
            expect(categories).toHaveLength(4);
          });
      });
    });
    describe("GET /api/categories", () => {
      it("200: GET - should respond with an array containing the categories object with the correct data types for the keys values.", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            const { categories } = body;
            categories.forEach((category) => {
              expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
            })
          });
      });
    });
});
