<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import { toast } from '$lib/components/Toast.svelte';
	import { Gauge, Settings, Download, Trash2 } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let files = $state<File[]>([]);
	let isProcessing = $state(false);

	// Size presets
	const sizePresets = [
		{ id: 'discord', label: 'Discord', size: 8, icon: '💬' },
		{ id: 'discord-nitro', label: 'Discord Nitro', size: 50, icon: '✨' },
		{ id: 'twitter', label: 'Twitter/X', size: 15, icon: '𝕏' },
		{ id: 'slack', label: 'Slack', size: 1, icon: '💼' },
		{ id: 'email', label: 'Email', size: 2, icon: '📧' },
		{ id: 'whatsapp', label: 'WhatsApp', size: 16, icon: '📱' }
	];

	let selectedPreset = $state<string | null>('discord');
	let targetSizeMB = $state(8);
	let colorReduction = $state(256);
	let lossy = $state(true);

	function handleFiles(newFiles: File[]) {
		const gifFiles = newFiles.filter(f => f.type === 'image/gif' || f.name.endsWith('.gif'));
		if (gifFiles.length === 0) {
			toast.error('Please select GIF files');
			return;
		}
		files = [...files, ...gifFiles];
		toast.success(`Added ${gifFiles.length} GIF(s)`);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function selectPreset(presetId: string) {
		const preset = sizePresets.find(p => p.id === presetId);
		if (preset) {
			selectedPreset = presetId;
			targetSizeMB = preset.size;
		}
	}

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	async function handleOptimize() {
		if (files.length === 0) return;
		isProcessing = true;
		toast.info('Optimization coming soon!');
		await new Promise(r => setTimeout(r, 1000));
		isProcessing = false;
	}
</script>

<svelte:head>
	<title>Optimize GIF - Swirl</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-3xl"></div>
		<div class="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-purple-500/10 to-violet-500/10 blur-3xl"></div>
	</div>

	<main class="flex-1 px-4 sm:px-6 lg:px-8 pt-28 pb-12">
		<div class="mx-auto max-w-5xl">
			<!-- Header -->
			<div class="text-center mb-8" in:fade={{ duration: 200 }}>
				<div class="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-4">
					<Gauge class="h-4 w-4" />
					Optimize GIF
				</div>
				<h1 class="text-3xl font-bold text-surface-100">
					Compress GIFs for <span class="gradient-text">any platform</span>
				</h1>
				<p class="mt-2 text-surface-500">
					Smart presets for Discord, Twitter, Slack, and more
				</p>
			</div>

			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Left: Drop zone and file list -->
				<div>
					<DropZone 
						accept=".gif,image/gif"
						acceptLabel="GIF files only"
						onfiles={handleFiles}
						compact={files.length > 0}
					/>

					{#if files.length > 0}
						<div class="mt-4 space-y-2" in:fly={{ y: 20, duration: 200 }}>
							{#each files as file, i}
								<div class="glass rounded-xl p-3 flex items-center justify-between">
									<div class="flex items-center gap-3 min-w-0">
										<div class="h-10 w-10 rounded-lg bg-surface-800 flex items-center justify-center text-lg">
											🖼️
										</div>
										<div class="min-w-0">
											<p class="text-sm font-medium text-surface-200 truncate">{file.name}</p>
											<p class="text-xs text-surface-500">{formatBytes(file.size)}</p>
										</div>
									</div>
									<button
										onclick={() => removeFile(i)}
										class="p-2 text-surface-500 hover:text-red-400 transition-colors"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Right: Settings -->
				<div class="glass rounded-2xl p-6" in:fly={{ y: 20, delay: 100, duration: 200 }}>
					<h3 class="flex items-center gap-2 text-lg font-semibold text-surface-100 mb-6">
						<Settings class="h-5 w-5 text-accent-start" />
						Optimization Settings
					</h3>

					<!-- Platform Presets -->
					<div class="mb-6">
						<label class="block text-sm font-medium text-surface-300 mb-3">Target Platform</label>
						<div class="grid grid-cols-2 gap-2">
							{#each sizePresets as preset}
								<button
									onclick={() => selectPreset(preset.id)}
									class="flex items-center gap-2 rounded-xl px-4 py-3 text-left transition-all {selectedPreset === preset.id
										? 'bg-gradient-to-r from-accent-start/20 to-accent-end/20 border border-accent-start/50 text-surface-100'
										: 'bg-surface-800 text-surface-400 hover:bg-surface-700'}"
								>
									<span class="text-lg">{preset.icon}</span>
									<div>
										<p class="text-sm font-medium">{preset.label}</p>
										<p class="text-xs text-surface-500">{preset.size} MB max</p>
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- Custom Target Size -->
					<div class="mb-6">
						<label class="block text-sm font-medium text-surface-300 mb-2">
							Target Size: <span class="text-accent-start">{targetSizeMB} MB</span>
						</label>
						<input
							type="range"
							bind:value={targetSizeMB}
							min="0.5"
							max="100"
							step="0.5"
							class="w-full accent-accent-start"
							oninput={() => selectedPreset = null}
						/>
					</div>

					<!-- Color Reduction -->
					<div class="mb-6">
						<label class="block text-sm font-medium text-surface-300 mb-2">
							Colors: <span class="text-accent-start">{colorReduction}</span>
						</label>
						<input
							type="range"
							bind:value={colorReduction}
							min="16"
							max="256"
							step="16"
							class="w-full accent-accent-start"
						/>
						<div class="flex justify-between text-xs text-surface-500 mt-1">
							<span>16 (smaller)</span>
							<span>256 (better)</span>
						</div>
					</div>

					<!-- Lossy toggle -->
					<div class="mb-6">
						<label class="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								bind:checked={lossy}
								class="h-5 w-5 rounded border-surface-600 bg-surface-800 text-accent-start focus:ring-accent-start"
							/>
							<div>
								<p class="text-sm font-medium text-surface-300">Lossy compression</p>
								<p class="text-xs text-surface-500">Better compression, slight quality loss</p>
							</div>
						</label>
					</div>

					<!-- Optimize Button -->
					<button
						onclick={handleOptimize}
						disabled={files.length === 0 || isProcessing}
						class="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-start/30 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isProcessing}
							<div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
							Optimizing...
						{:else}
							<Gauge class="h-5 w-5" />
							Optimize {files.length} GIF{files.length !== 1 ? 's' : ''}
						{/if}
					</button>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>
