import { describe, it, expect } from "vitest";
import { runUserCode } from "./runUserCode";

// Test suite for the browser-based code runner
// These tests run against a real Web Worker (no mocks)
describe("runUserCode (browser)", () => {

  // Verifies that valid user code executes correctly
  // and matches the expected output
  it("passes for correct output", async () => {
    const result = await runUserCode({
      // Simple correct implementation
      userCode: `function add(a, b) { return a + b; }`,
      functionName: "add",
      // Note: input is passed as a string and interpolated into the function call
      testInput: "2, 3",
      expectedOutput: 5
    });

    // Should mark test as passed
    expect(result.passed).toBe(true);
    // Should return correct computed value
    expect(result.actual).toBe(5);
    // No error should be present
    expect(result.error).toBe(null);
  });

  // Verifies that incorrect logic is detected properly
  it("fails for incorrect output", async () => {
    const result = await runUserCode({
      // Intentionally wrong implementation
      userCode: `function add(a, b) { return a - b; }`,
      functionName: "add",
      testInput: "2, 3",
      expectedOutput: 5
    });

    // Should fail because output is wrong
    expect(result.passed).toBe(false);
    // Actual result reflects incorrect logic
    expect(result.actual).toBe(-1);
  });

  // Ensures runtime errors inside user code are caught and returned
  it("handles thrown errors", async () => {
    const result = await runUserCode({
      // Function that throws an error
      userCode: `function boom() { throw new Error("fail"); }`,
      functionName: "boom",
      testInput: "",
      expectedOutput: null
    });

    // Execution should fail
    expect(result.passed).toBe(false);
    // Error message should propagate back from the worker
    expect(result.error).toBe("fail");
  });

  // Confirms that complex return types (objects/arrays) are handled correctly
  // using JSON.stringify comparison inside runUserCode
  it("handles objects and arrays", async () => {
    const result = await runUserCode({
      userCode: `function data() { return { x: 1, y: [2,3] }; }`,
      functionName: "data",
      testInput: "",
      expectedOutput: { x: 1, y: [2, 3] }
    });

    // Should pass because structures match
    expect(result.passed).toBe(true);
    // Deep equality check for returned object
    expect(result.actual).toEqual({ x: 1, y: [2, 3] });
  });

  // Ensures that infinite loops (or long-running code) are safely terminated
  // by the timeout mechanism in runUserCode
  it("times out on infinite loop", async () => {
    const result = await runUserCode({
      // Infinite loop - would hang without timeout protection
      userCode: `function loop() { while(true) {} }`,
      functionName: "loop",
      testInput: "",
      expectedOutput: null,
      // Use a short timeout to keep tests fast
      timeoutMs: 50
    });

    // Should fail due to timeout
    expect(result.passed).toBe(false);
    // Special timeout indicator
    expect(result.timeTaken).toBe("Timeout");
    // Error message should indicate timeout cause
    expect(result.error).toMatch(/timed out/i);
  });
});
