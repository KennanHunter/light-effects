<script lang="ts">
	import "../app.css";
	import Header from "../lib/components/Header.svelte";
</script>

<div class="grid-rows-2 bg-stone-900 h-screen">
	<Header />
	<slot />
</div>
