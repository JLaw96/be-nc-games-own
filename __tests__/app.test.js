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
          expect(reviews).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
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
          expect(body).toHaveProperty("message", "review_id not found");
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    it("400: GET - This test should return a 400 error with the correct message as our path/request contains a review_id that is not a number", () => {
      return request(app)
        .get("/api/reviews/IShouldNotBeHere")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "Bad Request");
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: GET - This test should return one object via the review_id that is being requested in the path.", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments[0]).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: GET - This test should return an array of comments based on the given review_id and they should be in order of most recent comments first", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toHaveLength(3);
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toBeSorted({ descending: true });
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: GET - This test should return an array of comments based on the given review_id and they should be in order of most recent comments first", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual([]);
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("404: GET - This test should return an error message as the review_id that does not exist given in the path", () => {
      return request(app)
        .get("/api/reviews/200/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "review_id not found");
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("400: GET - This test should return a 400 error with the correct message as our path/request contains a review_id that is not a number", () => {
      return request(app)
        .get("/api/reviews/IShouldNotBeHere/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "Bad Request");
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("201: POST - This test should insert a new comment into the comments data and then return that new information.", () => {
      const addComment = {
        username: "bainesface",
        body: "newBody",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(addComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment[2]).toEqual({
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "bainesface",
            body: "newBody",
            review_id: 1,
          });
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("400: POST - This test should return with a 400 error message as the key in our new comment is not valid", () => {
      const addComment = {
        wrong: "bainesface",
        body: "newBody",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(addComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty(
            "message",
            "Bad Request - No username/body"
          );
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("404: POST - This test should return a 404 error as the review_id is valid but does not exist", () => {
      const addComment = {
        username: "bainesface",
        body: "newBody",
      };

      return request(app)
        .post("/api/reviews/500/comments")
        .send(addComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "review_id not found");
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("400: POST - This test should return a 400 as the ID is invalid", () => {
      const addComment = {
        username: "bainesface",
        body: "newBody",
      };

      return request(app)
        .post("/api/reviews/banana/comments")
        .send(addComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "Bad Request");
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("404: POST - This test should return a 404 as the username is invalid", () => {
      const addComment = {
        username: "IAmInTheWrongPlace",
        body: "newBody",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(addComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "Username Not Found");
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("201: POST - This test should return a 201 as the request and path are valid however, the extra property of votes should be ignored.", () => {
      const addComment = {
        username: "bainesface",
        body: "newBody",
        votes: 2,
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(addComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment[2]).toEqual({
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "bainesface",
            body: "newBody",
            review_id: 1,
          });
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    it(" 201: PATCH - This test should return an amended review with the votes count increased", () => {
      const newVote = { inc_votes: 10 };

      return request(app)
        .patch("/api/reviews/1")
        .send(newVote)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url: expect.any(String),
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 11,
          });
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    it(" 201: PATCH - This test should return an amended review with the votes count decreased as the value we are passing is negative.", () => {
      const newVote = { inc_votes: -1 };

      return request(app)
        .patch("/api/reviews/1")
        .send(newVote)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url: expect.any(String),
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    it(" 404: PATCH - This test should return an error message as the review ID is valid but does not exist", () => {
      const newVote = { inc_votes: 10 };

      return request(app)
        .patch("/api/reviews/500")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "review_id Not Found");
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    it(" 400: PATCH - This test should return an error message as the review_id is not valid.", () => {
      const newVote = { inc_votes: 10 };

      return request(app)
        .patch("/api/reviews/banana")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("message", "Bad Request");
        });
    });
  });
  describe("GET /api/users", () => {
    it(" 200: GET - This test should return an array containing the users data", () => {
      const newVote = { inc_votes: 10 };

      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
        });
    });
  });
  describe("GET /api/users", () => {
    it(" 200: GET - This test should return an array containing the users data", () => {
      const newVote = { inc_votes: 10 };

      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET /api/users", () => {
    it("404: GET - This test should respond with a 404 as the path we are searching for does not exist", () => {
      return request(app)
        .get("/api/userzz")
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
});
