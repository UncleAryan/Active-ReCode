import { storage } from "../../src/logic/db.js";
import { describe, it, expect } from "vitest";

describe("db.js unit tests", () => {

  it("Happy Path: add and retrieve user", async () => {
    await storage.addUser("testuser", "hashedpass123");
    const user = await storage.getUser("testuser");

    expect(user).toBeDefined();
    expect(user.username).toBe("testuser");
    expect(user.passwordHash).toBe("hashedpass123");
  });

  it("Happy Path: add, update, and retrieve challenge", async () => {
    await storage.addChallenge(
      "Two Sum",
      "Find indices that add to target",
      [{ input: "[2,7,11,15], 9", expected: "[0,1]" }],
      "return [0,1];",
      "twoSum"
    );

    await storage.updateChallenge("Two Sum", { description: "Updated desc" });
    const challenge = await storage.getChallenge("Two Sum");

    expect(challenge.description).toBe("Updated desc");
  });

  it("Happy Path: manage cards correctly", async () => {
    await storage.addCard(42, 100, { due: new Date(), interval: 1 });
    const card = await storage.getCard(42, 100);
    expect(card).toBeDefined();
  });

  it("Rainy Day Path: get non-existent user", async () => {
    const user = await storage.getUser("nonexistent");
    expect(user).toBeUndefined();
  });

  it("Rainy Day Path: update non-existent challenge", async () => {
    await storage.updateChallenge("No Challenge", { description: "Should not work" });
    const challenge = await storage.getChallenge("No Challenge");
    expect(challenge).toBeUndefined();
  });

    it("Rainy Day Path: get non-existent card", async () => {
      const card = await storage.getCard(999, 999);
      expect(card).toBeUndefined();
    });

});