import { Worker } from 'worker_threads'
import path from 'path';

export class WorkerNode {
    private workerFile = path.resolve(__dirname, '..', '__worker.js')
    private workers: Worker[] = [];

    createWorker(data: Record<string, any>) {
        const worker = new Worker(this.workerFile, { workerData: data });
        this.workers.push(worker);

        worker.on('message', (message) => {
            console.log(`Received message from worker: ${message}`);
        });

        worker.on('error', (error) => {
            console.error(`Worker error: ${error}`);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });

        return this.workers.length - 1; // this is the index of the worker, can be used as an id
    }

    sendToWorker(index: number, data: any) {
        this.workers[index].postMessage(data);
    }

    async terminateWorker(index: number) {
        await this.workers[index].terminate();
        this.workers.splice(index, 1);
    }

    async terminateAllWorkers() {
        await Promise.all(
            this.workers.map(async (worker) => worker.terminate())
        );
        this.workers = [];
    }
}