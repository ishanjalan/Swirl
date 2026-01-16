// Worker Pool Manager
// Distributes GIF processing jobs across multiple Web Workers

export interface GifJob {
	id: string;
	type: 'optimize' | 'resize' | 'speed' | 'reverse';
	gifBuffer: ArrayBuffer;
	options: GifProcessingOptions;
	onProgress?: (progress: number) => void;
	onComplete: (result: ArrayBuffer, stats: ProcessingStats) => void;
	onError: (error: string) => void;
}

export interface GifProcessingOptions {
	// Optimize options
	targetSizeKB?: number;
	colors?: number;
	lossy?: number;
	
	// Resize options
	width?: number;
	height?: number;
	fit?: 'contain' | 'cover' | 'fill';
	
	// Speed options
	speedMultiplier?: number;
	reverse?: boolean;
	boomerang?: boolean;
}

export interface ProcessingStats {
	originalSize: number;
	outputSize: number;
	framesProcessed: number;
	processingTimeMs: number;
}

export interface WorkerRequest {
	id: string;
	type: 'optimize' | 'resize' | 'speed' | 'reverse';
	gifBuffer: ArrayBuffer;
	options: GifProcessingOptions;
}

export interface WorkerResponse {
	id: string;
	success: boolean;
	result?: ArrayBuffer;
	stats?: ProcessingStats;
	error?: string;
	progress?: number;
}

interface PoolWorker {
	worker: Worker;
	busy: boolean;
	currentJobId: string | null;
}

// Pool configuration
const MAX_WORKERS = 4;
const MIN_WORKERS = 1;

// Pool state
let workers: PoolWorker[] = [];
let jobQueue: GifJob[] = [];
let jobCallbacks: Map<string, GifJob> = new Map();
let poolInitialized = false;
let poolInitializing = false;

// Get optimal worker count based on hardware
function getOptimalWorkerCount(): number {
	if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
		const cores = navigator.hardwareConcurrency;
		return Math.min(MAX_WORKERS, Math.max(MIN_WORKERS, Math.floor(cores / 2)));
	}
	return MIN_WORKERS;
}

// Create a single worker
function createWorker(): Promise<PoolWorker> {
	return new Promise((resolve, reject) => {
		try {
			const worker = new Worker(
				new URL('../workers/gif.worker.ts', import.meta.url),
				{ type: 'module' }
			);

			const poolWorker: PoolWorker = {
				worker,
				busy: false,
				currentJobId: null
			};

			// Handle messages from worker
			worker.onmessage = (event: MessageEvent<WorkerResponse | { type: string }>) => {
				const data = event.data;

				// Worker ready signal
				if ('type' in data && data.type === 'ready') {
					resolve(poolWorker);
					return;
				}

				// Processing response
				const response = data as WorkerResponse;
				const job = jobCallbacks.get(response.id);

				if (!job) return;

				// Progress update
				if (response.progress !== undefined && !response.result && !response.error) {
					job.onProgress?.(response.progress);
					return;
				}

				// Job completed
				if (response.success && response.result && response.stats) {
					job.onComplete(response.result, response.stats);
				} else if (!response.success) {
					job.onError(response.error || 'Unknown error');
				}

				// Clean up and process next job
				jobCallbacks.delete(response.id);
				poolWorker.busy = false;
				poolWorker.currentJobId = null;
				processNextJob();
			};

			worker.onerror = (error) => {
				console.error('Worker error:', error);
				
				// If worker had a job, report error
				if (poolWorker.currentJobId) {
					const job = jobCallbacks.get(poolWorker.currentJobId);
					if (job) {
						job.onError('Worker crashed');
						jobCallbacks.delete(poolWorker.currentJobId);
					}
				}

				poolWorker.busy = false;
				poolWorker.currentJobId = null;
				processNextJob();
			};

			// Timeout for worker initialization
			setTimeout(() => {
				reject(new Error('Worker initialization timeout'));
			}, 10000);
		} catch (error) {
			reject(error);
		}
	});
}

// Initialize the worker pool
export async function initPool(): Promise<void> {
	if (poolInitialized || poolInitializing) return;
	
	poolInitializing = true;

	try {
		const workerCount = getOptimalWorkerCount();
		console.log(`Initializing GIF worker pool with ${workerCount} workers`);

		const workerPromises = Array(workerCount).fill(null).map(() => createWorker());
		workers = await Promise.all(workerPromises);
		
		poolInitialized = true;
		console.log('GIF worker pool initialized');

		// Process any queued jobs
		processNextJob();
	} catch (error) {
		console.error('Failed to initialize worker pool:', error);
		throw error;
	} finally {
		poolInitializing = false;
	}
}

// Find an available worker
function getAvailableWorker(): PoolWorker | null {
	return workers.find(w => !w.busy) || null;
}

// Process the next job in queue
function processNextJob(): void {
	if (jobQueue.length === 0) return;

	const availableWorker = getAvailableWorker();
	if (!availableWorker) return;

	const job = jobQueue.shift()!;
	assignJobToWorker(availableWorker, job);
}

// Assign a job to a specific worker
function assignJobToWorker(poolWorker: PoolWorker, job: GifJob): void {
	poolWorker.busy = true;
	poolWorker.currentJobId = job.id;
	jobCallbacks.set(job.id, job);

	const request: WorkerRequest = {
		id: job.id,
		type: job.type,
		gifBuffer: job.gifBuffer,
		options: job.options
	};

	// Transfer the buffer to the worker for better performance
	poolWorker.worker.postMessage(request, [job.gifBuffer]);
}

// Queue a GIF processing job
export async function queueJob(job: GifJob): Promise<void> {
	// Ensure pool is initialized
	if (!poolInitialized) {
		await initPool();
	}

	// Check if a worker is available
	const availableWorker = getAvailableWorker();
	
	if (availableWorker) {
		assignJobToWorker(availableWorker, job);
	} else {
		jobQueue.push(job);
	}
}

// Process a GIF and return a promise
export function processGif(
	id: string,
	type: GifJob['type'],
	gifBuffer: ArrayBuffer,
	options: GifProcessingOptions,
	onProgress?: (progress: number) => void
): Promise<{ result: ArrayBuffer; stats: ProcessingStats }> {
	return new Promise((resolve, reject) => {
		const job: GifJob = {
			id,
			type,
			gifBuffer,
			options,
			onProgress,
			onComplete: (result, stats) => resolve({ result, stats }),
			onError: (error) => reject(new Error(error))
		};

		queueJob(job);
	});
}

// Terminate all workers in the pool
export function terminatePool(): void {
	workers.forEach(({ worker }) => {
		worker.terminate();
	});
	workers = [];
	jobQueue = [];
	jobCallbacks.clear();
	poolInitialized = false;
	console.log('GIF worker pool terminated');
}

// Get pool status
export function getPoolStatus(): {
	initialized: boolean;
	workerCount: number;
	busyWorkers: number;
	queuedJobs: number;
} {
	return {
		initialized: poolInitialized,
		workerCount: workers.length,
		busyWorkers: workers.filter(w => w.busy).length,
		queuedJobs: jobQueue.length
	};
}
