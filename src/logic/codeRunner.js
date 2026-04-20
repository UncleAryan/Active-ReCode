// Safe Web Worker based code runner - supports any function name

export async function runUserCode({
  userCode,
  functionName,
  testInput,
  expectedOutput,
  timeoutMs = 3000
}) {
  return new Promise((resolve) => {
    const startTime = performance.now();

    const worker = new Worker(new URL('./codeRunnerWorker.js', import.meta.url), {
        type: 'module',
    });

    let timeoutId = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      worker.terminate();
    };

    worker.onmessage = (e) => {
      cleanup();
      const timeTaken = (performance.now() - startTime).toFixed(2);

      const result = {
        passed: false,
        actual: null,
        expected: expectedOutput,
        timeTaken: `${timeTaken} ms`,
        error: null,
        functionName
      };

      if (e.data.success) {
        result.actual = e.data.actual;
        // Compare actual vs expected (works for numbers, strings, arrays, simple objects)
        result.passed = JSON.stringify(e.data.actual) === JSON.stringify(expectedOutput);
      } else {
        result.error = e.data.error;
      }

      resolve(result);
    };

    worker.onerror = (err) => {
      cleanup();
      resolve({
        passed: false,
        actual: null,
        expected: expectedOutput,
        timeTaken: "Error",
        error: `Worker error: ${err.message}`,
        functionName
      });
    };

    // Timeout protection (catches infinite loops)
    timeoutId = setTimeout(() => {
      cleanup();
      resolve({
        passed: false,
        actual: null,
        expected: expectedOutput,
        timeTaken: "Timeout",
        error: `Execution timed out after ${timeoutMs}ms (possible infinite loop)`,
        functionName
      });
    }, timeoutMs);

    // Send data to the worker
    worker.postMessage({ userCode, functionName, testInput });
  });
}
