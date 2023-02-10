<script lang="ts" context="module">
	import { currentStateStore } from "$lib/stores/currentState";
	import { powerStore } from "$lib/stores/power";
	import { powerFunctionStore } from "$lib/stores/powerFunction";
	import { onMount } from "svelte";
	import * as ts from "typescript";
	import { number, string, z, ZodError } from "zod";

	let el: HTMLElement;
	export let source: string = `// All values will be cropped to be within 0 and 1.0
export default (seconds: number): number => {
	return Math.abs(Math.sin(Math.PI * seconds));
};
`;
	let getRawPower: ((seconds: number, ...rest: unknown[]) => number) = () => 0;

	export const transpileCode = async () => {
		let transpiledCode: string = ts.transpile(source, {
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext,
			checkJs: true,
			alwaysStrict: true,
			strict: true,
        	strictFunctionTypes: true,
        	strictBindCallApply: true,
        	strictNullChecks: true,
        	strictPropertyInitialization: true,
		});

		if (!transpiledCode) {
			console.log(0)

			return Promise.reject("No code transpiled");
		}

		const dataUri = `data:text/javascript;charset=utf-8,"use strict";\n${encodeURIComponent(transpiledCode)}`;

		const module = await import(/* @vite-ignore */ dataUri).catch((err) => {
			console.log(1)
			return (err ?? "Code did not return a number");
		});

		console.log(typeof module);

		if (typeof module === "string") 
			return module;

		let importedDefault = await z
			.function()
			.args(z.number())
			.returns(z.number())
			.parseAsync(module.default)
			.catch((err) => {
				console.log(2)
				return ((err as ZodError).message ?? "Code did not return a number");
			});

console.log(typeof importedDefault);

		if (typeof importedDefault === "string") 
			return importedDefault;

		getRawPower = importedDefault;
		
		powerFunctionStore.set({
			status: "successful",
			power: getPower
		});
	}

	export const getPower = async (seconds: number): Promise<number | undefined> => {
		const power = await z
			.number()
			.min(0, "Number cannot be less than 0")
			.max(1, "Number cannot be more than 1")
			.parseAsync(getRawPower(seconds))
			.catch((err) => {
				Promise.reject((err as ZodError).message ?? "Code did not return a number");
			});

		return power ?? undefined;
	};
</script>

<script lang="ts">
	onMount(async () => {
		transpileCode().catch((err) => {
			console.log(err);

			powerFunctionStore.set({
				status: "error",
				reason: err,
			});
		});
		
		const monaco = await import("monaco-editor");

		if (location.hash) {
			source = decodeURIComponent(location.hash.slice(1));
		}

		let editor = monaco.editor.create(el, {
			value: source,
			language: "typescript",
			theme: "vs-dark",
			automaticLayout: true
		});

		editor.getModel()?.onDidChangeContent(async (e) => {
			source = editor.getValue();

			transpileCode();

			location.hash = encodeURIComponent(source);
		});
	});
	
</script>

<div class="w-full h-full" bind:this={el} />
