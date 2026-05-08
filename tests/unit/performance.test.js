import { storage } from "../../src/logic/db.js";
import { scheduler } from "../../src/logic/scheduler.js";
import { describe, it, expect } from "vitest";

describe("logic performance tests", () => {

  it("verifies due card retrieval performance", async () => {
    const dummyUser = { username: "perfTestUser", passwordHash: "hashedPass" };
    const cardCount = 2500; // total cards to create
    await storage.addUser(dummyUser.username, dummyUser.passwordHash);
    // create many cards and make them all due for review
    for (let i = 0; i < cardCount; i++) {
        const card = await scheduler.createCard(dummyUser.username, i);
        card.due = new Date(Date.now() - 1000);
        storage.updateCard(dummyUser.username, i, card);
    }
    // time how long it takes to retrieve all cards
    const start = performance.now();
    const cards = await scheduler.getDueCards(dummyUser.username);
    const end = performance.now();
    const duration = end - start;
    // expect the retrieval of all due cards to take less than 500ms
    expect(duration).toBeLessThan(500);
    // also verify that we got the expected number of cards back
    expect(cards.length).toBe(cardCount);
  }, 20000);
});