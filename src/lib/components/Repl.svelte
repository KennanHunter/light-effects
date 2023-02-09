<script lang="ts" context="module">
	import { currentStateStore } from "$lib/stores/currentState";
	import { powerStore } from "$lib/stores/power";
	import * as monaco from "monaco-editor";
	import { onMount } from "svelte";
	import * as ts from "typescript";
	import { z, ZodError } from "zod";

	let el: HTMLElement;
	export let source: string = `// All values will be cropped to be within 0 and 1.0
export default (seconds: number): number => {
	return Math.abs(Math.sin(Math.PI * seconds));
};
`;

	let startTime: Date;

	const elapsedTime = (): number =>
		(new Date().getTime() - startTime.getTime()) / 1000;

	export type GetPower = () => Promise<number | undefined>;
	export const getPower: GetPower = async () => {
		const transpiledCode = ts.transpile(source, {
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext,
		});

		if (!transpiledCode) {
			console.error("Fuck");
			powerStore.set({
				status: "error",
				reason: "No code transpiled",
			});
		}

		const dataUri =
			"data:text/javascript;charset=utf-8," +
			encodeURIComponent(transpiledCode);

		const module = await import(/* @vite-ignore */ dataUri);

		const getRawPower = await z
			.function()
			.args(z.number())
			.returns(z.number())
			.parseAsync(module.default)
			.catch(() => {
				console.log("Code does not follow schema");

				powerStore.set({
					status: "error",
					reason: "Code doe does not follow schema",
				});
			});

		if (!getRawPower) return;

		const power = await z
			.number()
			.min(0, "Number cannot be less than 0")
			.max(1, "Number cannot be more than 1")
			.parseAsync(getRawPower(elapsedTime()))
			.catch((err) => {
				console.log(err ?? "Code did not return a number");

				powerStore.set({
					status: "error",
					reason: (err as ZodError).message ?? "Code did not return a number",
				});
			});

		return power ?? undefined;
	};

	export const runLight = async () => {
		currentStateStore.set("RUNNING");
	};

	export const stopLight = async () => {
		currentStateStore.set("IDLE");
	};
</script>

<script lang="ts">
	onMount(() => {
		startTime = new Date();

		let editor = monaco.editor.create(el, {
			value: source,
			language: "typescript",
			theme: "vs-dark",
		});

		editor.onDidChangeModelContent((e) => {
			source = editor.getValue();
		});
	});
</script>

<div class="bg-stone-900 w-full">
	<div style="width: 600px; height: 300px" bind:this={el} />
</div>
