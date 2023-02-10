<script lang="ts">
	import Repl from "$lib/components/Repl.svelte";
	
	import Header from "../lib/components/Header.svelte";
</script>

<svelte:head>
	<title>Light Effects</title>
	<meta
		name="description"
		content="Simple app to edit light effects in the browser"
	/>
</svelte:head>

<main class="bg-stone-900 w-full h-full flex flex-col">
	<Header />
	<Repl />
</main>
