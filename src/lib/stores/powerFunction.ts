import { writable } from "svelte/store";

type PowerFunctionType =
	| { status: "successful"; power: (seconds: number) => Promise<number> }
	| { status: "error"; reason: string };

export const powerFunctionStore = writable<PowerFunctionType>({
	status: "successful",
	power: async () => 0,
});
