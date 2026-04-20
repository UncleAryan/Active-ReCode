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

    // Worker code as a string
    const workerScript = `
      self.onmessage = function(e) {
        const { userCode, functionName, testInput } = e.data;

        try {
          // Dynamically call the function the user was supposed to implement
          const fullCode = \`
            \${userCode}

            // Call the function with the test input
            return \${functionName}(\${testInput});
          \`;

          const userFunction = new Function(fullCode);
          const actualOutput = userFunction();

          self.postMessage({
            success: true,
            actual: actualOutput
          });
        } catch (err) {
          self.postMessage({
            success: false,
            error: err.message
          });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

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
