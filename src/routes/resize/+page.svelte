<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import { toast } from '$lib/components/Toast.svelte';
	import { Maximize2, Lock, Unlock, Download } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let file = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isProcessing = $state(false);

	let width = $state(480);
	let height = $state(270);
	let maintainAspect = $state(true);
	let aspectRatio = $state(16/9);

	const aspectPresets = [
		{ label: '1:1', value: 1, desc: 'Square' },
		{ label: '16:9', value: 16/9, desc: 'Widescreen' },
		{ label: '9:16', value: 9/16, desc: 'Portrait' },
		{ label: '4:3', value: 4/3, desc: 'Classic' }
	];

	const sizePresets = [
		{ label: '240p', width: 426, height: 240 },
		{ label: '360p', width: 640, height: 360 },
		{ label: '480p', width: 854, height: 480 },
		{ label: '720p', width: 1280, height: 720 }
	];

	function handleFiles(files: File[]) {
		const gifFile = files.find(f => f.type === 'image/gif' || f.name.endsWith('.gif'));
		if (!gifFile) {
			toast.error('Please select a GIF file');
			return;
		}
		file = gifFile;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = URL.createObjectURL(gifFile);
		toast.success(`Loaded: ${gifFile.name}`);
	}

	function updateWidth(newWidth: number) {
		width = newWidth;
		if (maintainAspect) {
			height = Math.round(newWidth / aspectRatio);
		}
	}

	function updateHeight(newHeight: number) {
		height = newHeight;
		if (maintainAspect) {
			width = Math.round(newHeight * aspectRatio);
		}
	}

	function applyPreset(preset: typeof sizePresets[0]) {
		width = preset.width;
		height = preset.height;
		aspectRatio = preset.width / preset.height;
	}

	async function handleResize() {
		if (!file) return;
		isProcessing = true;
		toast.info('Resize coming soon!');
		await new Promise(r => setTimeout(r, 1000));
		isProcessing = false;
	}
</script>

<svelte:head>
	<title>Resize GIF - Swirl</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
		<div class="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 blur-3xl"></div>
	</div>

	<main class="flex-1 px-4 sm:px-6 lg:px-8 pt-28 pb-12">
		<div class="mx-auto max-w-5xl">
			<!-- Header -->
			<div class="text-center mb-8" in:fade={{ duration: 200 }}>
				<div class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-4">
					<Maximize2 class="h-4 w-4" />
					Resize & Crop
				</div>
				<h1 class="text-3xl font-bold text-surface-100">
					Resize GIFs to <span class="gradient-text">any dimension</span>
				</h1>
				<p class="mt-2 text-surface-500">
					Change dimensions with aspect ratio presets and visual controls
				</p>
			</div>

			{#if !file}
				<DropZone 
					accept=".gif,image/gif"
					acceptLabel="GIF files only"
					onfiles={handleFiles}
				/>
			{:else}
				<div class="grid gap-6 lg:grid-cols-2" in:fly={{ y: 20, duration: 200 }}>
					<!-- Preview -->
					<div class="glass rounded-2xl p-4">
						<div class="aspect-video bg-surface-900 rounded-xl overflow-hidden flex items-center justify-center">
							<img src={previewUrl} alt="Preview" class="max-w-full max-h-full object-contain" />
						</div>
						<p class="mt-3 text-sm text-surface-500 text-center truncate">{file.name}</p>
					</div>

					<!-- Settings -->
					<div class="glass rounded-2xl p-6">
						<h3 class="text-lg font-semibold text-surface-100 mb-6">Resize Options</h3>

						<!-- Size Presets -->
						<div class="mb-6">
							<label class="block text-sm font-medium text-surface-300 mb-2">Quick Presets</label>
							<div class="flex flex-wrap gap-2">
								{#each sizePresets as preset}
									<button
										onclick={() => applyPreset(preset)}
										class="rounded-lg bg-surface-800 px-3 py-2 text-sm text-surface-400 hover:bg-surface-700 hover:text-surface-200 transition-colors"
									>
										{preset.label}
									</button>
								{/each}
							</div>
						</div>

						<!-- Dimensions -->
						<div class="mb-6">
							<label class="block text-sm font-medium text-surface-300 mb-2">Dimensions</label>
							<div class="flex items-center gap-3">
								<div class="flex-1">
									<label class="text-xs text-surface-500">Width</label>
									<input
										type="number"
										value={width}
										oninput={(e) => updateWidth(parseInt(e.currentTarget.value) || 0)}
										class="w-full rounded-lg bg-surface-800 px-3 py-2 text-surface-100"
									/>
								</div>
								<button
									onclick={() => maintainAspect = !maintainAspect}
									class="mt-5 p-2 rounded-lg bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
									title={maintainAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
								>
									{#if maintainAspect}
										<Lock class="h-5 w-5" />
									{:else}
										<Unlock class="h-5 w-5" />
									{/if}
								</button>
								<div class="flex-1">
									<label class="text-xs text-surface-500">Height</label>
									<input
										type="number"
										value={height}
										oninput={(e) => updateHeight(parseInt(e.currentTarget.value) || 0)}
										class="w-full rounded-lg bg-surface-800 px-3 py-2 text-surface-100"
									/>
								</div>
							</div>
						</div>

						<!-- Aspect Ratio Presets -->
						<div class="mb-6">
							<label class="block text-sm font-medium text-surface-300 mb-2">Aspect Ratio</label>
							<div class="flex gap-2">
								{#each aspectPresets as preset}
									<button
										onclick={() => { aspectRatio = preset.value; if (maintainAspect) height = Math.round(width / aspectRatio); }}
										class="flex-1 rounded-lg bg-surface-800 px-3 py-2 text-sm text-surface-400 hover:bg-surface-700 hover:text-surface-200 transition-colors"
									>
										<div class="font-medium">{preset.label}</div>
										<div class="text-xs text-surface-500">{preset.desc}</div>
									</button>
								{/each}
							</div>
						</div>

						<!-- Resize Button -->
						<button
							onclick={handleResize}
							disabled={isProcessing}
							class="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-start/30 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isProcessing}
								<div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								Resizing...
							{:else}
								<Maximize2 class="h-5 w-5" />
								Resize to {width} × {height}
							{/if}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>
