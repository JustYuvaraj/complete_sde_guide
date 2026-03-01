// pyodide Web Worker implementation
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodide = null;

async function loadPyodideAndPackages() {
    if (!pyodide) {
        pyodide = await loadPyodide();
    }
}

let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
    const { id, pythonCode, testCode } = event.data;

    try {
        await pyodideReadyPromise;

        // Capture stdout
        let stdoutText = "";
        pyodide.setStdout({
            batched: (str) => {
                stdoutText += str + "\n";
            },
        });

        // Run user code
        await pyodide.runPythonAsync(pythonCode);

        // Run test code
        let testResult = await pyodide.runPythonAsync(testCode);

        self.postMessage({ id, results: testResult, stdout: stdoutText });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};
