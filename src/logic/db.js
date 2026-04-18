import Dexie from "dexie";

const db = new Dexie("CodeRunnerDB");

db.version(1).stores({
  cards: "++id, userId, challengeId, fsrsCard",
  challenges: "++id, title, description, testCases, exampleSolution, functionName",
  users: "++id, username, passwordHash"
});

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
        await db.challenges.add({ title, description, testCases, exampleSolution, functionName });
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
    }
}