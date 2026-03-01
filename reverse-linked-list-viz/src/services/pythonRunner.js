class PythonRunnerService {
    constructor() {
        this.worker = null;
        this.promises = new Map();
        this.idCounter = 0;
    }

    initWorker() {
        if (!this.worker) {
            this.worker = new Worker('/pythonWorker.js');
            this.worker.onmessage = (event) => {
                const { id, results, error, stdout } = event.data;
                if (this.promises.has(id)) {
                    const { resolve, reject } = this.promises.get(id);
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve({ results, stdout });
                    }
                    this.promises.delete(id);
                }
            };
        }
    }

    async runCode(pythonCode, testCode) {
        this.initWorker();
        return new Promise((resolve, reject) => {
            const id = ++this.idCounter;
            this.promises.set(id, { resolve, reject });
            this.worker.postMessage({ id, pythonCode, testCode });
        });
    }
}

export const pythonRunner = new PythonRunnerService();
