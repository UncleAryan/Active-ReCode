import Dexie from "dexie";

const db = new Dexie("CodeRunnerDB");

db.version(1).stores({
  cards: "++id, userId, challengeId, [userId+challengeId], fsrsCard, fsrsCard.due",
  challenges: "++id, title, description, testCases, exampleSolution, functionName",
  users: "++id, username, passwordHash"
});

db.version(2).stores({
  cards: "++id, userId, challengeId, [userId+challengeId], fsrsCard, fsrsCard.due",
  challenges: "++id, title, description, testCases, exampleSolution, functionName",
  users: "++id, username, passwordHash",
  drafts: "[userId+problemTitle], code"
});
db.version(3).stores({
  cards: "++id, userId, challengeId, [userId+challengeId], fsrsCard, fsrsCard.due",
  challenges: "++id, title, description, testCases, exampleSolution, functionName",
  users: "++id, username, passwordHash",
  drafts: "[userId+problemTitle], code",
  attempt_history: "++id, userId, challengeId, timestamp, solutionCode, rating"
});

db.version(4).stores({
  cards: "++id, userId, challengeId, [userId+challengeId], fsrsCard, fsrsCard.due",
  challenges: "++id, title, description, testCases, exampleSolution, functionName",
  users: "++id, username, passwordHash",
  drafts: null,
  attempt_history: "++id, userId, challengeId, timestamp, solutionCode, rating"
});

db.version(5).stores({
  cards: "++id, userId, challengeId, [userId+challengeId], fsrsCard, fsrsCard.due",
  challenges: "++id, title, description, testCases, exampleSolution, functionName",
  users: "++id, username, passwordHash",
  drafts: "[userId+problemTitle+language], code, lastUsed",
  attempt_history: "++id, userId, challengeId, timestamp, solutionCode, rating"
});

// legacy version of storage: no factory pattern
export const storage = {
    // User management
    async addUser(username, passwordHash) {
        await db.users.add({ username, passwordHash });
    },
    async getUser(username) {
        return await db.users.where({ username }).first();
    },
    async updateUser(username, updatedFields) {
        const user = await db.users.where({ username }).first();
        if (user) {
            await db.users.update(user.id, updatedFields);
        }
    },
    async getUserById(id) {
        return await db.users.where({ id }).first();
    },
    async getAllUsers() {
        return await db.users.toArray();
    },
    // Card management
    async addCard(userId, challengeId, fsrsCard) {
        await db.cards.add({ userId, challengeId, fsrsCard });
    },
    async getCard(userId, challengeId) {
        return await db.cards.where({ userId, challengeId }).first();
    },
    async getCardsByUser(userId) {
        return await db.cards.where("userId").equals(userId).toArray();
    },
    async updateCard(userId, challengeId, fsrsCard) {
        const card = await db.cards.where({ userId, challengeId }).first();
        if (card) {
            await db.cards.update(card.id, { fsrsCard });
        }
    },
    // Challenge management
    async addChallenge(title, description, testCases, exampleSolution, functionName) {
        const existing = await db.challenges.where({ title }).first();
        if (!existing) {
            await db.challenges.add({ title, description, testCases, exampleSolution, functionName });
        }
        else {
            await this.updateChallenge(title, { description, testCases, exampleSolution, functionName });
        }
    },
    async getChallenge(name) {
        return await db.challenges.where({ title: name }).first();
    },
    async updateChallenge(name, updatedFields) {
        const challenge = await db.challenges.where({ title: name }).first();
        if (challenge) {
            await db.challenges.update(challenge.id, updatedFields);
        }
    },
    async getAllChallenges() {
        return await db.challenges.toArray();
    },
    // Draft management
    async saveDraft(userId, problemTitle, language, code) {
        await db.drafts.put({ userId, problemTitle, language, code, lastUsed: Date.now() });
    },
    async getDraft(userId, problemTitle, language) {
        return await db.drafts.get({ userId, problemTitle, language });
    },
    async getLastDraft(userId, problemTitle) {
        const drafts = await db.drafts
            .where('[userId+problemTitle+language]')
            .between([userId, problemTitle, Dexie.minKey], [userId, problemTitle, Dexie.maxKey])
            .toArray();
        if (!drafts.length) return null;
        return drafts.reduce((a, b) => (a.lastUsed > b.lastUsed ? a : b));
    },

    // Attempt history management
    async addAttempt(userId, challengeId, solutionCode, rating) {
        await db.attempt_history.add({ userId, challengeId, timestamp: Date.now(), solutionCode, rating });
    },
    async getAttemptsByUserAndChallenge(userId, challengeId) {
        return await db.attempt_history.where({ userId, challengeId }).toArray();
    },
}
