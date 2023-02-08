<script lang="ts">
	import Repl from "$lib/components/Repl.svelte";

	let startTime = new Date();
	let currentPower = 0;
	let source: string;

	/**
	 * Returns seconds
	 */
	const elapsedTime = (): number =>
		(new Date().getTime() - startTime.getTime()) / 1000;

	let currentState: "IDLE" | "RUNNING" = "IDLE";

	setInterval(() => {
		if (currentState === "IDLE") {
			currentPower = 0;
			return;
		}
		

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
	</section>
	<section
		class="grid place-content-center bg-stone-800 text-white rounded-lg p-4"
	>
		<Repl />
	</section>
</main>
