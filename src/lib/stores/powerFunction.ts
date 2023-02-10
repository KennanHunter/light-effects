import { writable } from "svelte/store";

type PowerFunctionType =
	| { status: "successful"; power: (seconds: number) => Promise<number | undefined> }
	| { status: "error"; reason: string };

export const powerFunctionStore = writable<PowerFunctionType>({
	status: "successful",
	power: async () => 0,
});
