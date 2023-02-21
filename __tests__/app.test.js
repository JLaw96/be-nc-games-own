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
});
