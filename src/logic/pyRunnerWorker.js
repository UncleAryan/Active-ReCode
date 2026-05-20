// same as the codeRunnerWorker.js but loads Pyodide and runs Python 

import { loadPyodide } from "pyodide";

importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js'); 

let pyodide = null;

async function init() {
    pyodide = await loadPyodide();
}

const ready = init();

self.onmessage = async function (e) {
    await ready;
    const { code, func, test } = e.data;

    try {
        const fullCode = `
        ${code}
        _result = ${func}(${test})`; // _result is temp holder for return value of func
        // python scripts don't have a return value the way function calls does, so temp var is needed to retrive result afterward

        pyodide.runPython(fullCode);
        const actual = pyodide.globals.get('_result').toJs();
        self.postMessage({ success: true, actual });
    } catch (err) {
        self.postMessage({ success: false, error = err.message });
    }
};