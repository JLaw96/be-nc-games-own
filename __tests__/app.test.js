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
            });
          });
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
        });
    });
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
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            });
          });
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
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              comment_count: expect.any(Number),
            });
          });
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
        });
    });
  });
  describe("GET /api/reviews", () => {
    it("200: GET - Using jest-sorted, this test should confirm that the response from our request is in descending order.", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSorted({ descending: true });
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    it("200: GET - This test should respond with the data for the specific review that has been requested in the path (in this case review 1)", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toEqual({
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            review_body: "Farmyard fun!",
            review_id: 1,
            category: "euro game",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    it("404: GET - This test should return a 404 error with the correct message as our path/request contains a review_id that does not exist", () => {
      return request(app)
        .get("/api/reviews/500")
        .expect(404)
        .then(({ body }) => {
          console.log(body, "log in test file");
          expect(body).toHaveProperty("message", "review_id not found");
        });
    });
  });
});
