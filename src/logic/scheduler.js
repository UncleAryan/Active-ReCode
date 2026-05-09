import { createEmptyCard, fsrs, Rating } from 'ts-fsrs';
import { storage } from "./db.js";

// global FSRS scheduler instance
const fsrsScheduler = fsrs();

export const scheduler = {
    // Rating enum from ts-fsrs
    // includes Again, Hard, Good, Easy
    Rating,

    // Card management functions
    async createCard(userId, challengeId) {
        let record = await storage.getCard(userId, challengeId);
        if (record) {
            return record.fsrsCard;
        }

        const emptyCard = createEmptyCard();
        await storage.addCard(userId, challengeId, emptyCard);
        return emptyCard;
    },
    async getFsrsCard(userId, challengeId) {
        const record = await storage.getCard(userId, challengeId);
        return record ? record.fsrsCard : null;
    },
    // Allows previewing the next due date without modifying the card
    async previewCard(userId, challengeId, now = new Date()) {
        let card = await this.getFsrsCard(userId, challengeId);
        if (!card) {
            card = createEmptyCard();
        }
        return fsrsScheduler.repeat(card, now);
    },
    // Main review function - updates the card based on user rating
    async review(userId, challengeId, rating, now = new Date()) {
        // check for valid Rating value and throw an error if != vaild
        if (!Object.values(Rating).includes(rating)) {
            throw new Error(`Invalid rating. Must be one of: ${Object.values(Rating).join(', ')}`);
        }

        // Fetch the existing card for the user and challenge
        const card = await this.getFsrsCard(userId, challengeId) ?? createEmptyCard();
        // Run the FSRS algorithm to calculate the updated card based off the rating
        const result = fsrsScheduler.next(card, now, rating);

        // If the card exists update the rating
        // if the card doesn't exist make a new card
        if (card) {
            await storage.updateCard(userId, challengeId, result.card);
        } else {
            await storage.addCard(userId, challengeId, result.card);
        }

        // Return updated card, result.log, and rating
        return {
            success: true,
            card: result.card,
            log: result.log,
            rating,
        };
    },
    // Get all cards that are due for review for a user
    async getDueCards(userId, now = new Date()) {
        const userCards = await storage.getCardsByUser(userId);
        const due = [];

        for (const record of userCards) {
            const card = record.fsrsCard;
            if (card && card.due <= now) {
                due.push({
                    id: record.id,
                    challengeId: record.challengeId,
                    fsrsCard: card,
                });
            }
        }
        return due;
    },
};