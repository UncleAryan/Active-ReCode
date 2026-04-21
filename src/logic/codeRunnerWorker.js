self.onmessage = function (e) {
  const { userCode, functionName, testInput } = e.data;

  try {
    const fullCode = `
      ${userCode}
      return ${functionName}(${testInput});
    `;

    const userFunction = new Function(fullCode);
    const actualOutput = userFunction();

    self.postMessage({
      success: true,
      actual: actualOutput,
    });
  } catch (err) {
    self.postMessage({
      success: false,
      error: err.message || err.toString(),
    });
  }
};