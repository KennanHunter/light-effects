import { writable } from "svelte/store";

export const currentStateStore = writable<"IDLE" | "RUNNING">("IDLE");
