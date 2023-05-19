import * as request from "supertest";
import { TestInit } from "./util/test.init";

let serverApp;

beforeAll(async () => {
  serverApp = await TestInit.initializeTestSuite();
});

afterAll(async () => {
  await TestInit.tearDownTestSuite();
});

describe("Get Districts", () => {
  test("should be able to get all active districts", async () => {
    const response = await request(serverApp)
      .get("/risks")
      .type("json")
      .set("Accept", "application/json")
      .send();
    expect(response.status).toBe(200);
    expect(response.body).not.toBeNull();
    expect(response.body).not.toBeUndefined();
    expect(response.body.length).toBe(2);
  });
});
