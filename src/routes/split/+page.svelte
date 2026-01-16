<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import { toast } from '$lib/components/Toast.svelte';
	import { Layers, Download, Check, Image } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let file = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isProcessing = $state(false);
	let frames = $state<{ url: string; delay: number; selected: boolean }[]>([]);

	function handleFiles(files: File[]) {
		const gifFile = files.find(f => f.type === 'image/gif' || f.name.endsWith('.gif'));
		if (!gifFile) {
			toast.error('Please select a GIF file');
			return;
		}
		file = gifFile;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = URL.createObjectURL(gifFile);
		
		// TODO: Actually extract frames
		// For now, simulate some frames
		frames = Array.from({ length: 12 }, (_, i) => ({
			url: previewUrl!,
			delay: 100,
			selected: true
		}));
		
		toast.success(`Loaded: ${gifFile.name}`);
	}

	function toggleFrame(index: number) {
		frames[index].selected = !frames[index].selected;
	}

	function selectAll() {
		frames = frames.map(f => ({ ...f, selected: true }));
	}

	function selectNone() {
		frames = frames.map(f => ({ ...f, selected: false }));
	}

	const selectedCount = $derived(frames.filter(f => f.selected).length);

	async function handleExport() {
		if (selectedCount === 0) {
			toast.error('Please select at least one frame');
			return;
		}
		isProcessing = true;
		toast.info('Frame export coming soon!');
		await new Promise(r => setTimeout(r, 1000));
		isProcessing = false;
	}
</script>

<svelte:head>
	<title>Split Frames - Swirl</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl"></div>
		<div class="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 blur-3xl"></div>
	</div>

	<main class="flex-1 px-4 sm:px-6 lg:px-8 pt-28 pb-12">
		<div class="mx-auto max-w-6xl">
			<!-- Header -->
			<div class="text-center mb-8" in:fade={{ duration: 200 }}>
				<div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-4">
					<Layers class="h-4 w-4" />
					Split Frames
				</div>
				<h1 class="text-3xl font-bold text-surface-100">
					Extract GIF frames as <span class="gradient-text">PNG images</span>
				</h1>
				<p class="mt-2 text-surface-500">
					Select individual frames or download all as a ZIP
				</p>
			</div>

			{#if !file}
				<DropZone 
					accept=".gif,image/gif"
					acceptLabel="GIF files only"
					onfiles={handleFiles}
				/>
			{:else}
				<div in:fly={{ y: 20, duration: 200 }}>
					<!-- Controls -->
					<div class="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
						<div class="flex items-center gap-4">
							<span class="text-surface-300">
								<span class="font-semibold text-surface-100">{selectedCount}</span> of {frames.length} frames selected
							</span>
							<div class="flex gap-2">
								<button
									onclick={selectAll}
									class="rounded-lg bg-surface-800 px-3 py-1.5 text-sm text-surface-400 hover:bg-surface-700 hover:text-surface-200 transition-colors"
								>
									Select All
								</button>
								<button
									onclick={selectNone}
									class="rounded-lg bg-surface-800 px-3 py-1.5 text-sm text-surface-400 hover:bg-surface-700 hover:text-surface-200 transition-colors"
								>
									Select None
								</button>
							</div>
						</div>

						<button
							onclick={handleExport}
							disabled={selectedCount === 0 || isProcessing}
							class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-start/30 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isProcessing}
								<div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								Exporting...
							{:else}
								<Download class="h-4 w-4" />
								Download {selectedCount > 1 ? 'as ZIP' : 'Frame'}
							{/if}
						</button>
					</div>

					<!-- Frame Grid -->
					<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
						{#each frames as frame, i}
							<button
								onclick={() => toggleFrame(i)}
								class="group relative aspect-square rounded-xl overflow-hidden border-2 transition-all {frame.selected
									? 'border-accent-start shadow-lg shadow-accent-start/20'
									: 'border-surface-700 hover:border-surface-600'}"
							>
								<img src={frame.url} alt="Frame {i + 1}" class="w-full h-full object-cover" />
								
								<!-- Frame number -->
								<div class="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
									#{i + 1}
								</div>

								<!-- Delay -->
								<div class="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
									{frame.delay}ms
								</div>

								<!-- Selection indicator -->
								<div class="absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-all {frame.selected
									? 'bg-accent-start'
									: 'bg-surface-800/80 group-hover:bg-surface-700'}"
								>
									{#if frame.selected}
										<Check class="h-4 w-4 text-white" />
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>
