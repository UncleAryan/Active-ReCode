import { storage } from '../../src/logic/db.js';
import { scheduler } from '../../src/logic/scheduler.js';
import { describe, it, expect } from 'vitest';
import { runUserCode } from "../../src/logic/codeRunner.js";

describe('Logic Integration', () => {
  const userId = 999;
  const challengeId = 42;

  it('create a card, review it, and check due cards, testing db and scheduler integration', async () => {
    // create a card for a fake challenge and user
    await storage.addChallenge('Fake Challenge', 'desc', [], 'return x;', 'testFunc');
    await scheduler.createCard(userId, challengeId);
    const reviewResult = await scheduler.review(userId, challengeId, scheduler.Rating.Good);

    expect(reviewResult.success).toBe(true);

    // card should be due within the next year
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
    const due = await scheduler.getDueCards(userId, future);
    expect(Array.isArray(due)).toBe(true);
  });

  it('run user code, testing codeRunner, which doesnt rely on either of the others', async () => {
    // Mock or real challenge with test cases
    const result = await runUserCode({
      userCode: 'function sum(arr) { return arr.reduce((a,b)=>a+b,0); }',
      functionName: 'sum',
      testInput: '[1,2,3]',
      expectedOutput: 6,
    });

    expect(result.passed).toBe(true);
  });
});