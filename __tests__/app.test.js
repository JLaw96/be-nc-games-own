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
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
              expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
            })
          });
      });
    });
    describe("GET /api/categoriezz", () => {
      it("404: GET - This test should respond with a 404 as the path we are searching for does not exist", () => {
        return request(app)
          .get("/api/categoriezz")
          .expect(404)
          .then((response) => {
            expect(response.statusCode).toBe(404);
          })
          }) 
        
      });
      describe("GET /api/reviews", () => {
        it("200: GET - Should respond with an array containing the review data.", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeInstanceOf(Array);
              expect(reviews).toHaveLength(13);
            });
        });
      });
      describe("GET /api/reviews", () => {
        it("200: GET - This request should respond with an array containing specific data types as the keys values", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toHaveLength(13);
              console.log(reviews, 'this is in the test file')
              reviews.forEach((review) => {
                expect(review).toMatchObject({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  category: expect.any(String),
                  designer: expect.any(String),
                  owner: expect.any(String),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number)
                })
              })
            });
        });
      });
      describe("GET /api/reviews", () => {
        it("200: GET - This request should contain a comment count within the reviews array containing the number of comments on that specific review id.", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toHaveLength(13);
              console.log(reviews, 'this is in the test file')
              reviews.forEach((review) => {
                expect(review).toMatchObject({
                  comment_count: expect.any(Number)
                })
              })
            });
        });
      });
      describe("GET /api/reviewzz", () => {
        it("404: GET - This test should respond with a 404 as the path we are searching for does not exist", () => {
          return request(app)
            .get("/api/reviewzz")
            .expect(404)
            .then((response) => {
              expect(response.statusCode).toBe(404);
            })
            }) 
    });
  });
