<script lang="ts">
	import '../app.css';
	import Toast from '$lib/components/Toast.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Swirl - Modern GIF Tools</title>
	<meta property="og:title" content="Swirl - Modern GIF Tools" />
	<meta property="og:description" content="Convert videos to GIF, optimize, resize, reverse, and split animations. 100% private, runs in your browser." />
	<meta property="og:type" content="website" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

{@render children()}
<Toast />
