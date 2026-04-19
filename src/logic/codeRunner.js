// Safe Web Worker based code runner

/*
How to use: call runUserCode with an object containing:
- userCode: the JavaScript code provided by the user
- functionName: the name of the function to test
- testInput: the input to pass to the function
- expectedOutput: the expected output of the function
- timeoutMs: the maximum time (in milliseconds) to allow for execution
*/

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
          // fullCode is the user code plus a call to the function with the test input
          const fullCode = \`
            \${userCode}
            // need to stringify testInput to handle strings, arrays, and objects correctly
            return \${functionName}(\${JSON.stringify(testInput)});
          \`;

          // here is where we execute fullCode and send the result back from the Web Worker via postMessage
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

    // blob and Web Worker setup
    const blob = new Blob([workerScript], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    let timeoutId = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      worker.terminate();
    };

    // listen for messages from the worker (results of code execution)
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

    // postMessage gives the Worker its input and starts execution
    worker.postMessage({ userCode, functionName, testInput });
  });
}