<script lang="ts" context="module">
	import { z } from "zod";
	import { EditorView, basicSetup } from "codemirror";
	import { javascript } from "@codemirror/lang-javascript";
	import { onMount } from "svelte";
	import { powerStore } from "$lib/stores/power";
	import * as ts from "typescript";
	import { currentStateStore } from "$lib/stores/currentState";

	let el: Element;
	export let source: string = `// All values will be cropped to be within 0 and 1.0
export default ((): number => {
    return 1.0
})
`;

	onMount(() => {
		let editor = new EditorView({
			extensions: [
				basicSetup,
				javascript({
					jsx: false,
					typescript: true,
				}),
			],
			parent: el,
			doc: source,
		});
	});

	export type GetPower = () => Promise<number | undefined>;
	export const getPower: GetPower = async () => {
		console.log("running");

		const transpiledCode = ts.transpile(
			`// All values will be cropped to be within 0 and 1.0
export default (): number => {
return 1.0;
};
`,
			{ target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
		);

		if (!transpiledCode) {
			console.error("Fuck");
			powerStore.set({
				status: "error",
				reason: "No code transpiled",
			});
		}

		console.dir({
			transpiledCode,
		});

		const dataUri =
			"data:text/javascript;charset=utf-8," +
			encodeURIComponent(transpiledCode);
		const module = await import(dataUri);
		console.dir(module);

		if (!module.default) {
			powerStore.set({
				status: "error",
				reason: "No Module exported",
			});
		}

		const rawPower = module.default();

		const power = await z
			.number()
			.min(0, "Number cannot be less than 0")
			.max(1, "Number cannot be more than 1")
			.parseAsync(rawPower)
			.catch((err) => {
				console.log(err ?? "Code did not return a number");

				powerStore.set({
					status: "error",
					reason: err ?? "Code did not return a number",
				});
			});

		return power ?? undefined;
	};

	export const run = async () => {
		currentStateStore.set("RUNNING");
	};
</script>

<div class="bg-stone-900 w-full">
	<div class="" bind:this={el} />
</div>
