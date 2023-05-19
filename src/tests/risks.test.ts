import * as request from "supertest";
import { TestInit } from "./test.init";
import "reflect-metadata";

let serverApp;

beforeAll(async () => {
  serverApp = await TestInit.initializeTestSuite();
});

afterAll(async () => {
  await TestInit.tearDownTestSuite();
});

describe("Get Policy", () => {
  const policyRequest = {
    age: 35,
    dependents: 2,
    house: { ownership_status: "owned" },
    income: 0,
    marital_status: "married",
    risk_questions: [0, 1, 0],
    vehicle: { year: 2018 },
  };
  test("should be able to get a valid risk assessment", async () => {
    const response = await request(serverApp)
      .post("/policies")
      .type("json")
      .set("Accept", "application/json")
      .send(policyRequest);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      auto: "regular",
      disability: "ineligible",
      home: "economic",
      life: "regular",
    });
  });
});

describe("Get Another Policy", () => {
  const policyRequest = {
    age: 20,
    dependents: 0,
    house: { ownership_status: "owned" },
    income: 300000,
    marital_status: "single",
    risk_questions: [0, 0, 0],
    vehicle: { year: 2023 },
  };
  test("should be able to get another valid risk assessment", async () => {
    const response = await request(serverApp)
      .post("/policies")
      .type("json")
      .set("Accept", "application/json")
      .send(policyRequest);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      auto: "regular",
      disability: "economic",
      home: "economic",
      life: "economic",
    });
  });
});

describe("Invalid Policy", () => {
  const policyRequest = {
    age: 35,
    dependents: 2,
    house: { ownership_status: "owned" },
    income: 0,
    marital_status: "married",
    risk_questions: [0, 1, 0],
    vehicle: { year: 2018 },
  };
  test("should be able to get a valid risk assessment", async () => {
    const response = await request(serverApp)
      .post("/policies")
      .type("json")
      .set("Accept", "application/json")
      .send({});
    expect(response.status).toBe(400);
  });
});
