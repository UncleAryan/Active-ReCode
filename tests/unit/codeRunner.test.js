import { runUserCode } from "../../src/logic/codeRunner.js";
import { describe, it, expect } from "vitest";
import "@vitest/web-worker";

describe("codeRunner unit tests", () => {
	it("Happy Path", async () => {
		const result = await runUserCode({
			userCode: "function add(a, b) { return a + b; }",
			functionName: "add",
			testInput: "2, 3",
			expectedOutput: 5,
			timeoutMs: 1000,
		});

		expect(result.passed).toBe(true);
		expect(result.actual).toBe(5);
		expect(result.error).toBeNull();
		expect(result.timeTaken).toMatch(/\d+\.\d+ ms/);
	});

	it("Rainy Day Path : incorrect output", async () => {
		const result = await runUserCode({
			userCode: "function add(a, b) { return a + b; }",
			functionName: "add",
			testInput: "2, 3",
			expectedOutput: 999,
			timeoutMs: 1000,
		});

		expect(result.passed).toBe(false);
		expect(result.actual).toBe(5);
	});

	it("Rainy Day Path: runtime error", async () => {
		const result = await runUserCode({
			userCode: "function bad() { throw new Error('user made a mistake'); }",
			functionName: "bad",
			testInput: "",
			expectedOutput: null,
			timeoutMs: 1000,
		});

		expect(result.passed).toBe(false);
		expect(result.error).toContain("user made a mistake");
	});

	it("Rainy Day Path : infinite loop", async () => {
		const OriginalWorker = global.Worker;
		global.Worker = class {
			constructor() {}
			postMessage() {}
			terminate() {}
		};

		const result = await runUserCode({
			userCode: "function infinite() { while(true) {} }",
			functionName: "infinite",
			testInput: "",
			expectedOutput: null,
			timeoutMs: 1000,
		});

		global.Worker = OriginalWorker;

		expect(result.passed).toBe(false);
		expect(result.error).toContain("timed out");
	});

	it("Rainy Day Path : used wrong function name", async () => {
		const result = await runUserCode({
			userCode: "function add(a, b) { return a + b; }",
			functionName: "subtract",
			testInput: "2, 3",
			expectedOutput: 5,
			timeoutMs: 1000,
		});

		expect(result.passed).toBe(false);
		expect(result.error).toContain("is not defined");
	});
});
