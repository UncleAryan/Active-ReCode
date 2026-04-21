import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the db.js module
// This is important so createcard and getFsrsCard tests can run without database
vi.mock("../../src/logic/db.js", () => ({
	storage: {
		getCard: vi.fn(),
		addCard: vi.fn(),
		updateCard: vi.fn(),
		getCardsByUser: vi.fn(),
	},
}));

const nextMock = vi.fn();
// Mock the ts-fsrs library
// Important for preview function to work
vi.mock("ts-fsrs", async (importOriginal) => {
	const actual = await importOriginal();

	const mockScheduler = {
		repeat: vi.fn(),
		export: vi.fn(),
		next: vi.fn(),
	};

	return {
		...actual,
		createEmptyCard: vi.fn(() => ({ id: "mocked-CardID" })),
		fsrs: vi.fn(() => mockScheduler),
		_mockScheduler: mockScheduler,
	};
});

// Imports the scheduler and other functions after mocking
import { scheduler } from "../../src/logic/scheduler.js";
import { getFsrsCard } from "../../src/logic/scheduler.js";
import { storage } from "../../src/logic/db.js";
import { createEmptyCard, fsrs, FSRSVersion } from "ts-fsrs";
import { _mockScheduler } from "ts-fsrs";
import { Rating } from "ts-fsrs";

const userId = "User1";
const challengeId = "Challenge1";
const existingCard = { id: "Card43", userId, challengeId };
const emptyCard = { id: "", userId, challengeId };

describe("Scheduler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createCard", () => {
		// Tests that if a card already exists the card is returned instead of creating a new one
		// Looks in storage for a card with the userId and challengeId and if it finds one it returns that card instead of creating a new one
		it("Returns the existing card if it exists", async () => {
			storage.getCard.mockResolvedValue({
				fsrsCard: existingCard,
			});

			const result = await scheduler.createCard(userId, challengeId);

			expect(storage.getCard).toHaveBeenCalledWith(userId, challengeId);
			expect(result).toEqual(existingCard);
		});

		// Tests to see if a new card is created when looking for one that doesn't exist
		// If a card isn't found then a new card is created with createEmptyCard and added to the storage with a userId and challengeId
		it("Creates a new card if one doesn't exist", async () => {
			storage.getCard.mockResolvedValue(null);

			const result = await scheduler.createCard(userId, challengeId);

			expect(storage.getCard).toHaveBeenCalledWith(userId, challengeId);

			expect(storage.addCard).toHaveBeenCalledWith(
				userId,
				challengeId,
				expect.any(Object),
			);

			expect(result).toBeDefined();
		});

		describe(getFsrsCard, () => {
			// Tests that if a card exists then fsrscard will find it in storage and return it
			it("Returns the fsrsCard if it exists", async () => {
				const fakeFsrsCard = { id: "Card43" };

				storage.getCard.mockResolvedValue({
					fsrsCard: fakeFsrsCard,
				});

				const result = await scheduler.getFsrsCard(userId, challengeId);

				expect(storage.getCard).toHaveBeenCalledWith(userId, challengeId);
				expect(result).toEqual(fakeFsrsCard);
			});

			// Test that if no card exists in storage then null will be returned
			it("Returns null if no card exists", async () => {
				storage.getCard.mockResolvedValue(null);

				const result = await scheduler.getFsrsCard(userId, challengeId);

				expect(storage.getCard).toHaveBeenCalledWith(userId, challengeId);
				expect(result).toBeNull();
			});
		});

		describe("previewCard", () => {
			// Tests that you can view the next due date of a card without modifying the storage of the card
			// returns the preview of the cards without modifying it in storage
			it("Returns the preview of the card if it exists without modifying the storage", async () => {
				const fakeCard = { id: "card123" };
				const now = new Date();

				const previewResult = { card: fakeCard, log: "Preview log" };

				vi.spyOn(scheduler, "getFsrsCard").mockResolvedValue(fakeCard);

				_mockScheduler.repeat.mockReturnValue(previewResult);

				const result = await scheduler.previewCard(userId, challengeId, now);

				expect(scheduler.getFsrsCard).toHaveBeenCalledWith(userId, challengeId);
				expect(_mockScheduler.repeat).toHaveBeenCalledWith(fakeCard, now);
				expect(result).toEqual(previewResult);
				expect(storage.addCard).not.toHaveBeenCalledTimes(1);
			});
		});

		// Tests review function and that it updates the card based on user rating
		describe("review", () => {
			// This tests if user inputs invalid rating calls rejects.tothrow Invailid rating
			// Does not update the card
			it("Will throw an error if for invalid user ratings", async () => {
				await expect(
					scheduler.review(userId, challengeId, "InvalidRating"),
				).rejects.toThrow(/Invalid rating/);
			});
			// Tests taking the users input and updating the cards dificulty based on the users rating
			it("updates the cards based on user's review rating", async () => {
				const now = new Date();

				vi.spyOn(scheduler, "getFsrsCard").mockResolvedValue({
					id: "Outdated-Card",
				});

				const fsrsResult = { card: { id: "Updated-Card" }, log: "Review log" };

				_mockScheduler.next.mockReturnValue(fsrsResult);

				await scheduler.review(userId, challengeId, Rating.Hard, now);

				expect(_mockScheduler.next).toHaveBeenCalledWith(
					{ id: "Outdated-Card" },
					now,
					Rating.Hard,
				);

				expect(storage.updateCard).toHaveBeenCalledWith(
					userId,
					challengeId,
					fsrsResult.card,
				);

				expect(storage.addCard).not.toHaveBeenCalled();
			});
		});
	});
});

describe("getDueCards", () => {
	// Tests that when a users has no cards due for a review an empty array is returned
	it("returns empty array when user has no cards that are due for a review", async () => {
		storage.getCardsByUser.mockResolvedValue([]);

		const result = await scheduler.getDueCards(userId);

		expect(storage.getCardsByUser).toHaveBeenCalledWith(userId);
		expect(result).toEqual([]);
	});
	// Filters to find all the due cards for a user and returns them in an array
	it("Filters out only the cards that are due", async () => {
		const now = new Date();
		storage.getCardsByUser.mockResolvedValue([
			{
				id: "1",
				challengeId: "A",
				fsrsCard: {
					due: new Date(now.getTime() + 1000000),
				},
			},
		]);
		const result = await scheduler.getDueCards(userId, now);
		expect(result).toEqual([]); // Nothings due yet
	});
	// Tests that the function will return all cards that are due for review for a user
	it("Returns all due cards", async () => {
		const now = new Date();

		storage.getCardsByUser.mockResolvedValue([
			{
				id: "1",
				challengeId: "A",
				fsrsCard: {
					due: new Date(now.getTime() - 1000), // Card is due
				},
			},
			{
				id: "2",
				challengeId: "B",
				fsrsCard: {
					due: new Date(now.getTime() + 1000000), // Not due
				},
			},
		]);

		const result = await scheduler.getDueCards(userId, now);
		expect(result).toEqual([
			{
				id: "1",
				challengeId: "A",
				fsrsCard: {
					due: new Date(now.getTime() - 1000),
				},
			},
		]);
	});
});
