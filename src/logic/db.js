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
            this.updateChallenge(title, { description, testCases, exampleSolution, functionName });
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
    async saveDraft(userId, problemTitle, code) {
        await db.drafts.put({ userId, problemTitle, code });
    },
    async getDraft(userId, problemTitle) {
        return await db.drafts.get({ userId, problemTitle });
    },

    // Attempt history management
    async addAttempt(userId, challengeId, solutionCode, rating) {
        await db.attempt_history.add({ userId, challengeId, timestamp: Date.now(), solutionCode, rating });
    },
    async getAttemptsByUserAndChallenge(userId, challengeId) {
        return await db.attempt_history.where({ userId, challengeId }).toArray();
    },
}


class BaseStorage {
    constructor(tableName) {
        this.table = db[tableName];
    }

    async add(item) {
        return await this.table.add(item);
    }

    async getByID(id) {
        return await this.table.get(id);
    }

    async update(id, updatedFields) {
        await this.table.update(id, updatedFields);
    }

    async getAll() {
        return await this.table.toArray();
    }
}

class UserStorage extends BaseStorage {
    constructor() {
        super("users");
    }
    async getByUsername(username) {
        return await this.table.where({ username }).first();
    }
    async updateByUsername(username, updatedFields) {
        const user = await this.getByUsername(username);
        if (user) {
            await this.update(user.id, updatedFields);
        }
    }
}

class ChallengeStorage extends BaseStorage {
    constructor() {
        super("challenges");
    }
    async getByTitle(title) {
        return await this.table.where({ title }).first();
    }
    async updateByTitle(title, updatedFields) {
        const challenge = await this.getByTitle(title);
        if (challenge) {
            await this.update(challenge.id, updatedFields);
        }
    }
}

class CardStorage extends BaseStorage {
    constructor() {
        super("cards");
    }
    async getByUserAndChallenge(userId, challengeId) {
        return await this.table.where({ userId, challengeId }).first();
    }
    async getByUser(userId) {
        return await this.table.where("userId").equals(userId).toArray();
    }
    async updateByUserAndChallenge(userId, challengeId, updatedFields) {
        const card = await this.getByUserAndChallenge(userId, challengeId);
        if (card) {
            await this.update(card.id, updatedFields);
        }
    }
}

export const storageFactory = {
    createUserStorage() {
        return new UserStorage();
    },
    createChallengeStorage() {
        return new ChallengeStorage();
    },
    createCardStorage() {
        return new CardStorage();
    },
}