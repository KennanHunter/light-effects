<script lang="ts">
	import GitHub from "../images/github.svg";
	import Repl, {
		getPower,
		runLight,
		stopLight,
	} from "$lib/components/Repl.svelte";
	import { currentStateStore } from "$lib/stores/currentState";
	import { powerStore } from "$lib/stores/power";
	import { onMount } from "svelte";
	
	import Header from "../../lib/components/Header.svelte";

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

<header class="pr-4 bg-stone-800 text-white flex justify-between" style={`align-items: center; background-color: hsl(204 100% ${hslLightness.toFixed(0)}%);`}>
	<div class="bg-stone-800 px-4">
		<h1 class="inline">Kennan's Effect Playground</h1>

		<button
			class="p-2 bg-stone-800 rounded mx-4 "
			on:click={$currentStateStore === "IDLE" ? runLight : stopLight}
			>{$currentStateStore === "IDLE" ? "[run]" : "[stop]"}</button
		>
	
		{#if $powerStore.status === "error"}
			<pre class="border-black text-red">{$powerStore.reason}</pre>
		{:else if $powerStore.status === "successful"}
			<pre class="border-black text-red inline">Power: {$powerStore.power.toFixed(
					3,
				)}</pre>
		{/if}
	</div>

	<a href="https://github.com/kennanHunter/light-effects"
		><img src={GitHub} width="32" alt="Github link" /></a
	>
</header>
