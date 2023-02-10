import { defineConfig } from "vitest/config";
//import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
	plugins: [
		//monacoEditorPlugin({}), // was meant to fix errors with monaco in webpack, why the fuck does it break everything?????????????
		sveltekit(),
	],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
});
