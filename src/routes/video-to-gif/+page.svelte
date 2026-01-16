<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import { toast } from '$lib/components/Toast.svelte';
	import { Film, Settings, Download, Play, Pause, RotateCcw } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	// State
	let videoFile = $state<File | null>(null);
	let videoUrl = $state<string | null>(null);
	let videoElement: HTMLVideoElement;
	let isPlaying = $state(false);
	let duration = $state(0);
	let currentTime = $state(0);

	// Settings
	let fps = $state(15);
	let width = $state(480);
	let quality = $state(80);
	let startTime = $state(0);
	let endTime = $state(0);
	let outputFormat = $state<'gif' | 'webp' | 'apng'>('gif');

	// Processing
	let isProcessing = $state(false);
	let progress = $state(0);
	let resultUrl = $state<string | null>(null);
	let resultSize = $state(0);

	function handleFiles(files: File[]) {
		const videoFiles = files.filter(f => f.type.startsWith('video/'));
		if (videoFiles.length === 0) {
			toast.error('Please select a video file');
			return;
		}

		videoFile = videoFiles[0];
		if (videoUrl) URL.revokeObjectURL(videoUrl);
		videoUrl = URL.createObjectURL(videoFile);
		
		// Reset result
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		resultUrl = null;
		
		toast.success(`Loaded: ${videoFile.name}`);
	}

	function handleVideoLoaded() {
		if (videoElement) {
			duration = videoElement.duration;
			endTime = Math.min(duration, 10); // Default to first 10 seconds
		}
	}

	function togglePlayback() {
		if (!videoElement) return;
		if (isPlaying) {
			videoElement.pause();
		} else {
			videoElement.play();
		}
		isPlaying = !isPlaying;
	}

	function handleTimeUpdate() {
		if (videoElement) {
			currentTime = videoElement.currentTime;
		}
	}

	function seekTo(time: number) {
		if (videoElement) {
			videoElement.currentTime = time;
			currentTime = time;
		}
	}

	async function handleConvert() {
		if (!videoFile) return;
		
		isProcessing = true;
		progress = 0;
		
		// TODO: Implement actual conversion with WebCodecs + gifenc
		// This is a placeholder that simulates the conversion
		toast.info('Conversion starting...');
		
		for (let i = 0; i <= 100; i += 10) {
			await new Promise(r => setTimeout(r, 200));
			progress = i;
		}
		
		isProcessing = false;
		toast.success('Conversion complete!');
		
		// TODO: Set resultUrl to the actual converted file
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function clearVideo() {
		if (videoUrl) URL.revokeObjectURL(videoUrl);
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		videoFile = null;
		videoUrl = null;
		resultUrl = null;
		startTime = 0;
		endTime = 0;
	}
</script>

<svelte:head>
	<title>Video to GIF - Swirl</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />

	<!-- Background decoration -->
	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 blur-3xl"></div>
		<div class="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-rose-500/10 to-pink-500/10 blur-3xl"></div>
	</div>

	<main class="flex-1 px-4 sm:px-6 lg:px-8 pt-28 pb-12">
		<div class="mx-auto max-w-5xl">
			<!-- Header -->
			<div class="text-center mb-8" in:fade={{ duration: 200 }}>
				<div class="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-400 mb-4">
					<Film class="h-4 w-4" />
					Video to GIF
				</div>
				<h1 class="text-3xl font-bold text-surface-100">
					Convert video to <span class="gradient-text">animated GIF</span>
				</h1>
				<p class="mt-2 text-surface-500">
					Upload MP4, WebM, or MOV and convert to GIF, WebP, or APNG
				</p>
			</div>

			{#if !videoFile}
				<!-- Drop Zone -->
				<div in:fade={{ duration: 200 }}>
					<DropZone 
						accept=".mp4,.webm,.mov,.avi,.mkv,video/*"
						acceptLabel="MP4, WebM, MOV, AVI"
						onfiles={handleFiles}
					/>
				</div>
			{:else}
				<!-- Editor -->
				<div class="grid gap-6 lg:grid-cols-2" in:fly={{ y: 20, duration: 300 }}>
					<!-- Preview -->
					<div class="glass rounded-2xl p-4">
						<div class="aspect-video bg-surface-900 rounded-xl overflow-hidden relative">
							<video
								bind:this={videoElement}
								src={videoUrl}
								class="w-full h-full object-contain"
								onloadedmetadata={handleVideoLoaded}
								ontimeupdate={handleTimeUpdate}
								onended={() => isPlaying = false}
							></video>
							
							<!-- Play overlay -->
							<button
								onclick={togglePlayback}
								class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
							>
								<div class="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
									{#if isPlaying}
										<Pause class="h-8 w-8 text-white" />
									{:else}
										<Play class="h-8 w-8 text-white ml-1" />
									{/if}
								</div>
							</button>
						</div>

						<!-- Timeline -->
						<div class="mt-4">
							<div class="flex items-center gap-3 text-sm text-surface-400 mb-2">
								<span>{formatTime(currentTime)}</span>
								<div class="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden">
									<div 
										class="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all"
										style="width: {(currentTime / duration) * 100}%"
									></div>
								</div>
								<span>{formatTime(duration)}</span>
							</div>

							<!-- Trim controls -->
							<div class="flex items-center gap-4 text-sm">
								<label class="flex items-center gap-2">
									<span class="text-surface-500">Start:</span>
									<input
										type="number"
										bind:value={startTime}
										min="0"
										max={endTime}
										step="0.1"
										class="w-20 rounded-lg bg-surface-800 px-3 py-1.5 text-surface-100"
									/>
								</label>
								<label class="flex items-center gap-2">
									<span class="text-surface-500">End:</span>
									<input
										type="number"
										bind:value={endTime}
										min={startTime}
										max={duration}
										step="0.1"
										class="w-20 rounded-lg bg-surface-800 px-3 py-1.5 text-surface-100"
									/>
								</label>
								<span class="text-surface-600">
									Duration: {formatTime(endTime - startTime)}
								</span>
							</div>
						</div>

						<!-- File info -->
						<div class="mt-4 flex items-center justify-between text-sm text-surface-500">
							<span class="truncate">{videoFile.name}</span>
							<button
								onclick={clearVideo}
								class="flex items-center gap-1.5 text-surface-400 hover:text-red-400 transition-colors"
							>
								<RotateCcw class="h-4 w-4" />
								Clear
							</button>
						</div>
					</div>

					<!-- Settings -->
					<div class="glass rounded-2xl p-6">
						<h3 class="flex items-center gap-2 text-lg font-semibold text-surface-100 mb-6">
							<Settings class="h-5 w-5 text-accent-start" />
							Settings
						</h3>

						<div class="space-y-5">
							<!-- Output Format -->
							<div>
								<label class="block text-sm font-medium text-surface-300 mb-2">Output Format</label>
								<div class="flex gap-2">
									{#each ['gif', 'webp', 'apng'] as format}
										<button
											onclick={() => outputFormat = format as typeof outputFormat}
											class="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all {outputFormat === format
												? 'bg-gradient-to-r from-accent-start to-accent-end text-white'
												: 'bg-surface-800 text-surface-400 hover:text-surface-200'}"
										>
											{format.toUpperCase()}
										</button>
									{/each}
								</div>
							</div>

							<!-- FPS -->
							<div>
								<label class="block text-sm font-medium text-surface-300 mb-2">
									Frame Rate: <span class="text-accent-start">{fps} FPS</span>
								</label>
								<input
									type="range"
									bind:value={fps}
									min="5"
									max="30"
									class="w-full accent-accent-start"
								/>
								<div class="flex justify-between text-xs text-surface-500 mt-1">
									<span>5 fps (smaller)</span>
									<span>30 fps (smoother)</span>
								</div>
							</div>

							<!-- Width -->
							<div>
								<label class="block text-sm font-medium text-surface-300 mb-2">
									Width: <span class="text-accent-start">{width}px</span>
								</label>
								<input
									type="range"
									bind:value={width}
									min="240"
									max="1080"
									step="40"
									class="w-full accent-accent-start"
								/>
								<div class="flex justify-between text-xs text-surface-500 mt-1">
									<span>240px</span>
									<span>1080px</span>
								</div>
							</div>

							<!-- Quality -->
							<div>
								<label class="block text-sm font-medium text-surface-300 mb-2">
									Quality: <span class="text-accent-start">{quality}%</span>
								</label>
								<input
									type="range"
									bind:value={quality}
									min="10"
									max="100"
									class="w-full accent-accent-start"
								/>
								<div class="flex justify-between text-xs text-surface-500 mt-1">
									<span>Smaller file</span>
									<span>Better quality</span>
								</div>
							</div>

							<!-- Convert Button -->
							<button
								onclick={handleConvert}
								disabled={isProcessing}
								class="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-start/30 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isProcessing}
									<div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									Converting... {progress}%
								{:else}
									<Film class="h-5 w-5" />
									Convert to {outputFormat.toUpperCase()}
								{/if}
							</button>

							<!-- Progress -->
							{#if isProcessing}
								<div class="h-2 bg-surface-800 rounded-full overflow-hidden">
									<div 
										class="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-300"
										style="width: {progress}%"
									></div>
								</div>
							{/if}

							<!-- Result -->
							{#if resultUrl}
								<div class="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-green-400 font-medium">Conversion complete!</p>
											<p class="text-sm text-surface-500">Size: {formatBytes(resultSize)}</p>
										</div>
										<a
											href={resultUrl}
											download="converted.{outputFormat}"
											class="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
										>
											<Download class="h-4 w-4" />
											Download
										</a>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>
