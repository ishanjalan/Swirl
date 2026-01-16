<script lang="ts">
	import { base } from '$app/paths';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { 
		Film, 
		Gauge, 
		Maximize2, 
		Zap, 
		Layers, 
		Shield, 
		Sparkles,
		ArrowRight,
		PlayCircle,
		Rewind,
		Images,
		Merge
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	const tools = [
		{
			id: 'video-to-gif',
			href: '/video-to-gif',
			title: 'Video to GIF',
			description: 'Convert MP4, WebM, MOV to animated GIF, WebP, or APNG',
			icon: Film,
			gradient: 'from-pink-500 to-rose-500',
			popular: true
		},
		{
			id: 'make',
			href: '/make',
			title: 'GIF Maker',
			description: 'Combine images into animated GIF with frame reordering',
			icon: Images,
			gradient: 'from-green-500 to-emerald-500',
			popular: true
		},
		{
			id: 'optimize',
			href: '/optimize',
			title: 'Optimize',
			description: 'Compress GIFs with smart presets for Discord, Twitter, Slack',
			icon: Gauge,
			gradient: 'from-violet-500 to-purple-500',
			popular: true
		},
		{
			id: 'combine',
			href: '/combine',
			title: 'Combine GIFs',
			description: 'Stitch multiple GIFs together sequentially or side-by-side',
			icon: Merge,
			gradient: 'from-cyan-500 to-blue-500',
			popular: false
		},
		{
			id: 'resize',
			href: '/resize',
			title: 'Resize & Crop',
			description: 'Change dimensions with visual crop tool and aspect presets',
			icon: Maximize2,
			gradient: 'from-blue-500 to-cyan-500',
			popular: false
		},
		{
			id: 'speed',
			href: '/speed',
			title: 'Speed & Reverse',
			description: 'Slow down, speed up, reverse, or create boomerang loops',
			icon: Rewind,
			gradient: 'from-amber-500 to-orange-500',
			popular: false
		},
		{
			id: 'split',
			href: '/split',
			title: 'Split Frames',
			description: 'Extract individual frames as PNG images with ZIP download',
			icon: Layers,
			gradient: 'from-emerald-500 to-teal-500',
			popular: false
		}
	];

	const features = [
		{
			icon: Zap,
			title: 'Instant Processing',
			description: 'WebCodecs + WebAssembly for blazing fast encoding'
		},
		{
			icon: Shield,
			title: '100% Private',
			description: 'Files never leave your device — zero uploads'
		},
		{
			icon: Sparkles,
			title: 'Modern Formats',
			description: 'GIF, WebP, APNG, and AVIF output support'
		}
	];

	const presets = [
		{ name: 'Discord', size: '8MB', icon: '💬' },
		{ name: 'Twitter', size: '15MB', icon: '𝕏' },
		{ name: 'Slack', size: '1MB', icon: '💼' },
		{ name: 'WhatsApp', size: '16MB', icon: '📱' }
	];
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<!-- Background decoration -->
	<div class="fixed inset-0 -z-10 overflow-hidden">
		<div
			class="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-accent-start/10 to-accent-end/10 blur-3xl"
		></div>
		<div
			class="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-accent-end/10 to-accent-start/10 blur-3xl"
		></div>
	</div>

	<main class="flex-1 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-12">
		<div class="mx-auto max-w-6xl">
			<!-- Hero Section -->
			<div class="text-center mb-16" in:fade={{ duration: 300 }}>
				<div
					class="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-start/10 px-4 py-1.5 text-sm font-medium text-accent-start"
				>
					<Sparkles class="h-4 w-4" />
					Free & Open Source • No Uploads Required
				</div>
				
				<h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
					<span class="gradient-text">GIF tools</span> that
					<br class="hidden sm:block" />
					<span class="text-surface-400">actually respect you</span>
				</h1>
				
				<p class="mx-auto max-w-2xl text-lg text-surface-500 leading-relaxed">
					Convert, optimize, resize, and transform GIFs entirely in your browser.
					<span class="font-medium text-surface-300">No server uploads</span> — your files stay private.
				</p>

				<!-- Smart presets pill -->
				<div class="mt-6 flex flex-wrap items-center justify-center gap-2">
					<span class="text-sm text-surface-500">Smart presets for:</span>
					{#each presets as preset}
						<span class="inline-flex items-center gap-1.5 rounded-full bg-surface-800 px-3 py-1 text-sm text-surface-300">
							<span>{preset.icon}</span>
							<span>{preset.name}</span>
							<span class="text-surface-500">{preset.size}</span>
						</span>
					{/each}
				</div>
			</div>

			<!-- Tool Cards -->
			<div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
				{#each tools as tool, i}
					<a
						href="{base}{tool.href}"
						class="group relative glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-start/10"
						in:fly={{ y: 30, delay: 100 * i, duration: 400 }}
					>
						<!-- Popular badge -->
						{#if tool.popular}
							<div class="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-accent-start to-accent-end px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
								Popular
							</div>
						{/if}

						<div class="flex items-start gap-4">
							<div
								class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br {tool.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
							>
								<tool.icon class="h-7 w-7 text-white" strokeWidth={2} />
							</div>
							
							<div class="flex-1 min-w-0">
								<h3 class="text-lg font-semibold text-surface-100 group-hover:text-white transition-colors flex items-center gap-2">
									{tool.title}
									<ArrowRight class="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent-start" />
								</h3>
								<p class="mt-1 text-sm text-surface-500 leading-relaxed">
									{tool.description}
								</p>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Features Section -->
			<div class="grid gap-6 sm:grid-cols-3 mb-16">
				{#each features as feature, i}
					<div
						class="text-center"
						in:fly={{ y: 20, delay: 400 + 100 * i, duration: 300 }}
					>
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-start/20 to-accent-end/20 text-accent-start"
						>
							<feature.icon class="h-6 w-6" />
						</div>
						<h3 class="text-base font-semibold text-surface-100">
							{feature.title}
						</h3>
						<p class="mt-1 text-sm text-surface-500">{feature.description}</p>
					</div>
				{/each}
			</div>

			<!-- Output formats -->
			<div class="glass rounded-2xl p-6 text-center" in:fade={{ delay: 600, duration: 300 }}>
				<h3 class="text-lg font-semibold text-surface-100 mb-4">Output Formats</h3>
				<div class="flex flex-wrap items-center justify-center gap-3">
					<span class="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
						GIF
					</span>
					<span class="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
						WebP
					</span>
					<span class="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
						APNG
					</span>
					<span class="rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
						AVIF
					</span>
				</div>
				<p class="mt-4 text-sm text-surface-500">
					Choose the best format for your use case — GIF for compatibility, WebP for smaller files, APNG for quality
				</p>
			</div>
		</div>
	</main>

	<Footer />
</div>
