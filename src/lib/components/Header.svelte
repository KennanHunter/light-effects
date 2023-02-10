<script lang="ts">
	import { currentStateStore } from "$lib/stores/currentState";
	import { powerStore } from "$lib/stores/power";
	import { powerFunctionStore } from "$lib/stores/powerFunction";
	import { onMount } from "svelte";
	import GitHub from "../images/github.svg";

	let startTime: Date;

	const elapsedTime = (): number =>
		(new Date().getTime() - startTime.getTime()) / 1000;

	const updatePower = async () => {
		if (
			$currentStateStore === "IDLE" ||
			$powerFunctionStore.status === "error"
		) {
			startTime = new Date();

			if ($powerFunctionStore.status === "successful") {
				powerStore.set({
					status: "successful",
					power: 0,
				});
			} else {
				powerStore.set({
					status: "error",
					reason: $powerFunctionStore.reason,
				});
			}

			return;
		}

		let computedPower = await $powerFunctionStore
			.power(elapsedTime())
			.catch(() => {
				powerStore.set({
					status: "error",
					reason: "Function returned power that wasn't between 0.0 and 1.0",
				});
			});

		if (!computedPower) {
			powerStore.set({
				status: "error",
				reason: "Code returned a malformed value",
			});

			return;
		}

		powerStore.set({
			status: "successful",
			power: computedPower,
		});
	};

	const runFrame = async () => {
		window.requestAnimationFrame(runFrame);

		await updatePower();
	};

	let hsl: string;

	const fillHSLValues = () => {
		if ($powerStore.status === "error") {
			hsl = "hsl(0 100% 30%)";
			return;
		}

		hsl = `hsl(204 100% ${($powerStore.power * 50 + 20).toFixed(0)}%)`;
	};

	powerStore.subscribe(() => {
		fillHSLValues();
	});

	const runLight = async () => currentStateStore.set("RUNNING");
	const stopLight = async () => currentStateStore.set("IDLE");

	onMount(() => {
		startTime = new Date();

		window.requestAnimationFrame(runFrame);
	});
</script>

<header
	class="bg-stone-800 text-white flex justify-between items-center"
	style={`background-color: ${hsl};`}
>
	<div
		class="flex items-center bg-stone-800 px-4 md:rounded-r mb-8 md:mb-0 w-full md:w-auto"
	>
		<h1 class="m-2">11329 Effect Playground</h1>

		<button
			class="p-2 bg-stone-800 rounded mx-4"
			on:click={$currentStateStore === "IDLE" ? runLight : stopLight}
			>{$currentStateStore === "IDLE" ? "[run]" : "[stop]"}</button
		>

		<pre class="border-black text-red"> {$powerStore.status === "successful"
				? `Power: ${$powerStore.power.toFixed(3)}`
				: `Error: ${$powerStore.reason}`} </pre>

		<a class="ml-4" href="https://github.com/kennanHunter/light-effects"
			><img src={GitHub} width="32" alt="GitHub link" /></a
		>
	</div>
</header>
