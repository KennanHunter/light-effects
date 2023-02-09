<script lang="ts">
	import Repl, { getPower, run } from "$lib/components/Repl.svelte";
	import { currentStateStore } from "$lib/stores/currentState";
	import { powerStore } from "$lib/stores/power";
	import { onMount } from "svelte";

	let startTime = new Date();

	/**
	 * Returns seconds
	 */
	const elapsedTime = (): number =>
		(new Date().getTime() - startTime.getTime()) / 1000;

	onMount(() => {
		setInterval(async () => {
			if ($currentStateStore === "IDLE") return;

			if ($currentStateStore === "RUNNING") {
				powerStore.set({
					status: "successful",
					power:
						(await getPower()) ??
						($powerStore.status === "successful" ? $powerStore.power : 0),
				});
			}
		}, 10);
	});
</script>

<svelte:head>
	<title>Light Effects</title>
	<meta
		name="description"
		content="Simple app to edit light effects in the browser"
	/>
</svelte:head>

<main class="grid grid-cols-2 gap-4 p-4">
	<section
		class="grid place-content-center bg-stone-800 text-white rounded-lg p-4"
	>
		<h1>Light Preview</h1>

		{#if $powerStore.status === "error"}
			<pre class="border-black text-red">{$powerStore.reason}</pre>
		{:else if $powerStore.status === "successful"}
			<pre class="border-black text-red">{$powerStore.power}</pre>
		{/if}

		<button on:click={run}>Run</button>
	</section>

	<section
		class="grid place-content-center bg-stone-800 text-white rounded-lg p-4"
	>
		<Repl />
	</section>
</main>
