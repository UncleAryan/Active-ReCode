// same as the codeRunnerWorker.js but loads Pyodide and runs Python

importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js');

let pyodide = null;

async function init() {
    pyodide = await loadPyodide();
}

const ready = init();

self.onmessage = async function (e) {
    await ready;
    const { userCode, functionName, testInput } = e.data;

    try {
        const fullCode = `${userCode}\n_result = ${functionName}(${testInput})`; // _result is temp holder for return value of func
        // python scripts don't have a return value the way function calls does, so temp var is needed to retrive result afterward

        pyodide.runPython(fullCode);
        const actual = pyodide.globals.get('_result').toJs();
        self.postMessage({ success: true, actual });
    } catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
};