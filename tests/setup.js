// just so we can add more matchers to expect behaviours
import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import "@vitest/web-worker";
import { beforeEach } from "vitest";

// clear out indexedDB before each test
beforeEach( async () => {
    await new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase("CodeRunnerDB");
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
});