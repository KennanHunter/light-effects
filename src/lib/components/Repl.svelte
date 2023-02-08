<script lang="ts">
	import { EditorView, basicSetup } from "codemirror";
	import { javascript } from "@codemirror/lang-javascript";
	import { onMount } from "svelte";
	import "../../../node_modules/code-mirror-themes/themes/monokai.css";

	let el: Element;
	export let source: string = `// All values will be cropped to be within 0 and 1.0
export default (() => {
    return 1.0
})
`;

	onMount(() => {
		let editor = new EditorView({
			extensions: [basicSetup, javascript()],
			parent: el,
			doc: source,
		});
	});
</script>

<div class="bg-stone-900 w-full">
	<div class="" bind:this={el} />
</div>
