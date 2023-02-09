<script lang="ts">
	import Repl, {
		getPower,
		runLight,
		stopLight,
	} from "$lib/components/Repl.svelte";
	import { currentStateStore } from "$lib/stores/currentState";
	import { powerStore } from "$lib/stores/power";
	import { onMount } from "svelte";

	onMount(() => {
		const interval = setInterval(async () => {
			if ($currentStateStore === "IDLE") return;

			if (!getPower) return;

			if ($currentStateStore === "RUNNING") {
				powerStore.set({
					status: "successful",
					power:
						(await getPower()) ??
						($powerStore.status === "successful" ? $powerStore.power : -1),
				});
			}
		}, 10);

		return () => clearInterval(interval);
	});

	const toHSLLightness = () => {
		if ($powerStore.status === "error") return 20;

		return $powerStore.power * 50 + 20;
	};

	let hslLightness: number;

	powerStore.subscribe(() => {
		hslLightness = toHSLLightness();
		console.log(hslLightness);
	});
</script>

<svelte:head>
	<title>Light Effects</title>
	<meta
		name="description"
		content="Simple app to edit light effects in the browser"
	/>
</svelte:head>

<main class="flex flex-col sm:flex-row gap-4 p-4">
	<section
		class=" flex flex-col justify-center flex-shrink flex-grow items-center p-6 px-40 bg-stone-800 text-white rounded-lg "
	>
		<h1>Light Preview</h1>

		<div style="width: 150px;">
			<svg>
				<rect
					width="150"
					height="150"
					fill={`hsl(204 100% ${hslLightness.toFixed(0)}%)`}
				/>
			</svg>
		</div>

		{#if $powerStore.status === "error"}
			<pre class="border-black text-red">{$powerStore.reason}</pre>
		{:else if $powerStore.status === "successful"}
			<pre class="border-black text-red">Power: {$powerStore.power.toFixed(
					3,
				)}</pre>
		{/if}

		<button
			class="p-3 bg-stone-600 rounded-sm"
			on:click={$currentStateStore === "IDLE" ? runLight : stopLight}
			>{$currentStateStore === "IDLE" ? "run" : "stop"}</button
		>
	</section>

	<section
		class="grid place-content-center flex-shrink-0 bg-stone-800 text-white rounded-lg p-4"
	>
		<Repl />
	</section>
</main>
