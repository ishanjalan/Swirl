// GIF Processing Web Worker
// Handles GIF optimization, resizing, and speed changes using gifsicle-wasm

import type { WorkerRequest, WorkerResponse, ProcessingStats, GifProcessingOptions } from '../utils/worker-pool';

let gifsicle: ((args: string[], files: { [name: string]: Uint8Array }) => Promise<Uint8Array>) | null = null;
let gifsicleInitialized = false;

// Initialize gifsicle WASM
async function initGifsicle() {
	if (gifsicleInitialized) return;

	try {
		const module = await import('gifsicle-wasm-browser');
		gifsicle = module.default || module.gifsicle;
		gifsicleInitialized = true;
	} catch (error) {
		console.error('Failed to initialize gifsicle:', error);
		throw error;
	}
}

// Send progress update to main thread
function sendProgress(id: string, progress: number) {
	const response: WorkerResponse = { id, success: true, progress };
	self.postMessage(response);
}

// Optimize a GIF using gifsicle
async function optimizeGif(
	id: string,
	gifData: Uint8Array,
	options: GifProcessingOptions
): Promise<Uint8Array> {
	await initGifsicle();
	if (!gifsicle) throw new Error('Gifsicle not initialized');

	sendProgress(id, 10);

	const args: string[] = ['-O3']; // Maximum optimization level

	// Color reduction
	if (options.colors && options.colors < 256) {
		args.push(`--colors=${options.colors}`);
	}

	// Lossy compression (0-200, higher = more lossy)
	if (options.lossy && options.lossy > 0) {
		args.push(`--lossy=${options.lossy}`);
	}

	// Output file
	args.push('-o', '/output.gif');
	args.push('/input.gif');

	sendProgress(id, 30);

	const result = await gifsicle(args, {
		'/input.gif': gifData
	});

	sendProgress(id, 90);

	return result;
}

// Resize a GIF using gifsicle
async function resizeGif(
	id: string,
	gifData: Uint8Array,
	options: GifProcessingOptions
): Promise<Uint8Array> {
	await initGifsicle();
	if (!gifsicle) throw new Error('Gifsicle not initialized');

	sendProgress(id, 10);

	const args: string[] = ['-O2'];

	// Resize
	if (options.width && options.height) {
		args.push(`--resize=${options.width}x${options.height}`);
	} else if (options.width) {
		args.push(`--resize-width=${options.width}`);
	} else if (options.height) {
		args.push(`--resize-height=${options.height}`);
	}

	// Color optimization after resize
	if (options.colors) {
		args.push(`--colors=${options.colors}`);
	}

	args.push('-o', '/output.gif');
	args.push('/input.gif');

	sendProgress(id, 50);

	const result = await gifsicle(args, {
		'/input.gif': gifData
	});

	sendProgress(id, 90);

	return result;
}

// Change GIF speed using gifsicle
async function changeGifSpeed(
	id: string,
	gifData: Uint8Array,
	options: GifProcessingOptions
): Promise<Uint8Array> {
	await initGifsicle();
	if (!gifsicle) throw new Error('Gifsicle not initialized');

	sendProgress(id, 10);

	const args: string[] = [];

	// Speed multiplier: >1 speeds up, <1 slows down
	// gifsicle uses delay, so we need to adjust inversely
	const speedMultiplier = options.speedMultiplier || 1;
	
	// Delay adjustment (in hundredths of a second)
	// Lower delay = faster animation
	if (speedMultiplier !== 1) {
		// We'll use --delay to set a new global delay
		// To speed up by 2x, we need to halve the delay
		// We use #0- to apply to all frames
		const delayFactor = Math.round(100 / speedMultiplier) / 100;
		args.push(`-d${Math.max(1, Math.round(10 * delayFactor))}`);
	}

	args.push('-O2');
	args.push('-o', '/output.gif');
	args.push('/input.gif');

	sendProgress(id, 50);

	const result = await gifsicle(args, {
		'/input.gif': gifData
	});

	sendProgress(id, 90);

	return result;
}

// Reverse a GIF using gifsicle
async function reverseGif(
	id: string,
	gifData: Uint8Array,
	options: GifProcessingOptions
): Promise<Uint8Array> {
	await initGifsicle();
	if (!gifsicle) throw new Error('Gifsicle not initialized');

	sendProgress(id, 10);

	let args: string[] = [];

	if (options.boomerang) {
		// For boomerang effect, we need to append reversed frames
		// First, get info about the GIF to know frame count
		// gifsicle "#0-" includes all frames, "#-1-0" reverses them
		args = ['-O2', '--no-warnings'];
		
		// Create a boomerang: forward + reverse (excluding first and last to avoid duplicate)
		args.push('-o', '/output.gif');
		args.push('/input.gif');
		args.push('--append');
		args.push('/input.gif', '#-2-1'); // Reverse frames (excluding first and last)
	} else {
		// Simple reverse
		args = ['-O2', '--no-warnings', '#-1-0', '-o', '/output.gif', '/input.gif'];
	}

	sendProgress(id, 50);

	const result = await gifsicle(args, {
		'/input.gif': gifData
	});

	sendProgress(id, 90);

	return result;
}

// Merge two GIFs using gifsicle
async function mergeGifs(
	id: string,
	gifData1: Uint8Array,
	options: GifProcessingOptions
): Promise<Uint8Array> {
	await initGifsicle();
	if (!gifsicle) throw new Error('Gifsicle not initialized');

	if (!options.secondGif) {
		throw new Error('Second GIF required for merge operation');
	}

	const gifData2 = new Uint8Array(options.secondGif);
	sendProgress(id, 10);

	const files: { [name: string]: Uint8Array } = {
		'/input1.gif': gifData1,
		'/input2.gif': gifData2
	};

	let args: string[] = ['-O2', '--no-warnings'];
	const mode = options.mode || 'sequential';

	// Resize if needed
	if (options.normalizeSize && options.outputWidth) {
		args.push(`--resize-width=${options.outputWidth}`);
	}

	switch (mode) {
		case 'sequential':
			// Append second GIF after first (end-to-end)
			args.push('-o', '/output.gif');
			args.push('/input1.gif');
			args.push('--append');
			args.push('/input2.gif');
			break;

		case 'horizontal':
			// Stack GIFs side by side using --merge
			// Note: gifsicle --merge combines at same time, not sequentially
			args.push('--merge');
			args.push('-o', '/output.gif');
			args.push('/input1.gif');
			args.push('/input2.gif');
			break;

		case 'vertical':
			// For vertical stacking, we'd need more complex handling
			// For now, use merge (plays simultaneously)
			args.push('--merge');
			args.push('-o', '/output.gif');
			args.push('/input1.gif');
			args.push('/input2.gif');
			break;
	}

	sendProgress(id, 50);

	const result = await gifsicle(args, files);

	sendProgress(id, 90);

	return result;
}

// Process a GIF job
async function processJob(request: WorkerRequest): Promise<void> {
	const { id, type, gifBuffer, options } = request;
	const startTime = performance.now();

	try {
		const inputData = new Uint8Array(gifBuffer);
		let result: Uint8Array;

		switch (type) {
			case 'optimize':
				result = await optimizeGif(id, inputData, options);
				break;
			case 'resize':
				result = await resizeGif(id, inputData, options);
				break;
			case 'speed':
				result = await changeGifSpeed(id, inputData, options);
				break;
			case 'reverse':
				result = await reverseGif(id, inputData, options);
				break;
			case 'merge':
				result = await mergeGifs(id, inputData, options);
				break;
			default:
				throw new Error(`Unknown job type: ${type}`);
		}

		const processingTimeMs = performance.now() - startTime;

		const stats: ProcessingStats = {
			originalSize: gifBuffer.byteLength,
			outputSize: result.byteLength,
			framesProcessed: 0, // We don't have easy access to frame count
			processingTimeMs
		};

		const resultBuffer = result.buffer.slice(
			result.byteOffset,
			result.byteOffset + result.byteLength
		);

		const response: WorkerResponse = {
			id,
			success: true,
			result: resultBuffer,
			stats
		};

		self.postMessage(response, [resultBuffer]);
	} catch (error) {
		const response: WorkerResponse = {
			id,
			success: false,
			error: error instanceof Error ? error.message : 'Processing failed'
		};
		self.postMessage(response);
	}
}

// Message handler
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	await processJob(event.data);
};

// Signal that worker is ready
self.postMessage({ type: 'ready' });
