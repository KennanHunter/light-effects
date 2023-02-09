import { writable } from "svelte/store";

type PowerType =
	| { status: "successful"; power: number }
	| { status: "error"; reason: string };

export const powerStore = writable<PowerType>({
	status: "successful",
	power: 0,
});
