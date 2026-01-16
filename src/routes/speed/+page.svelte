<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import { toast } from '$lib/components/Toast.svelte';
	import { Rewind, FastForward, RotateCcw, Repeat, Download } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let file = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isProcessing = $state(false);

	let speed = $state(1);
	let reverse = $state(false);
	let loopMode = $state<'normal' | 'reverse' | 'boomerang'>('normal');

	const speedPresets = [
		{ label: '0.25×', value: 0.25, desc: 'Very slow' },
		{ label: '0.5×', value: 0.5, desc: 'Slow motion' },
		{ label: '1×', value: 1, desc: 'Normal' },
		{ label: '1.5×', value: 1.5, desc: 'Fast' },
		{ label: '2×', value: 2, desc: 'Very fast' },
		{ label: '4×', value: 4, desc: 'Ultra fast' }
	];

	const loopModes = [
		{ id: 'normal', label: 'Normal', icon: Repeat, desc: 'Play forward, repeat' },
		{ id: 'reverse', label: 'Reverse', icon: RotateCcw, desc: 'Play backward' },
		{ id: 'boomerang', label: 'Boomerang', icon: Rewind, desc: 'Forward then backward' }
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

	async function handleApply() {
		if (!file) return;
		isProcessing = true;
		toast.info('Speed change coming soon!');
		await new Promise(r => setTimeout(r, 1000));
		isProcessing = false;
	}
</script>

<svelte:head>
	<title>Speed & Reverse - Swirl</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-3xl"></div>
		<div class="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-orange-500/10 to-amber-500/10 blur-3xl"></div>
	</div>

	<main class="flex-1 px-4 sm:px-6 lg:px-8 pt-28 pb-12">
		<div class="mx-auto max-w-5xl">
			<!-- Header -->
			<div class="text-center mb-8" in:fade={{ duration: 200 }}>
				<div class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400 mb-4">
					<Rewind class="h-4 w-4" />
					Speed & Reverse
				</div>
				<h1 class="text-3xl font-bold text-surface-100">
					Change GIF <span class="gradient-text">playback speed</span>
				</h1>
				<p class="mt-2 text-surface-500">
					Slow motion, speed up, reverse, or create boomerang loops
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
						<div class="mt-3 flex items-center justify-between text-sm">
							<span class="text-surface-500 truncate">{file.name}</span>
							<span class="text-accent-start font-medium">{speed}× speed</span>
						</div>
					</div>

					<!-- Settings -->
					<div class="glass rounded-2xl p-6">
						<h3 class="text-lg font-semibold text-surface-100 mb-6">Speed Settings</h3>

						<!-- Speed Slider -->
						<div class="mb-6">
							<label class="block text-sm font-medium text-surface-300 mb-2">
								Speed: <span class="text-accent-start">{speed}×</span>
							</label>
							<input
								type="range"
								bind:value={speed}
								min="0.1"
								max="4"
								step="0.1"
								class="w-full accent-accent-start"
							/>
							<div class="flex justify-between text-xs text-surface-500 mt-1">
								<span>0.1× (slowest)</span>
								<span>4× (fastest)</span>
							</div>
						</div>

						<!-- Speed Presets -->
						<div class="mb-6">
							<label class="block text-sm font-medium text-surface-300 mb-2">Quick Presets</label>
							<div class="grid grid-cols-3 gap-2">
								{#each speedPresets as preset}
									<button
										onclick={() => speed = preset.value}
										class="rounded-lg px-3 py-2 text-sm transition-all {speed === preset.value
											? 'bg-gradient-to-r from-accent-start to-accent-end text-white'
											: 'bg-surface-800 text-surface-400 hover:bg-surface-700'}"
									>
										<div class="font-medium">{preset.label}</div>
										<div class="text-xs opacity-70">{preset.desc}</div>
									</button>
								{/each}
							</div>
						</div>

						<!-- Loop Mode -->
						<div class="mb-6">
							<label class="block text-sm font-medium text-surface-300 mb-2">Loop Mode</label>
							<div class="space-y-2">
								{#each loopModes as mode}
									<button
										onclick={() => loopMode = mode.id as typeof loopMode}
										class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all {loopMode === mode.id
											? 'bg-gradient-to-r from-accent-start/20 to-accent-end/20 border border-accent-start/50'
											: 'bg-surface-800 hover:bg-surface-700'}"
									>
										<mode.icon class="h-5 w-5 {loopMode === mode.id ? 'text-accent-start' : 'text-surface-400'}" />
										<div>
											<p class="text-sm font-medium {loopMode === mode.id ? 'text-surface-100' : 'text-surface-300'}">{mode.label}</p>
											<p class="text-xs text-surface-500">{mode.desc}</p>
										</div>
									</button>
								{/each}
							</div>
						</div>

						<!-- Apply Button -->
						<button
							onclick={handleApply}
							disabled={isProcessing}
							class="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-start/30 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isProcessing}
								<div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								Processing...
							{:else}
								<FastForward class="h-5 w-5" />
								Apply Changes
							{/if}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>
