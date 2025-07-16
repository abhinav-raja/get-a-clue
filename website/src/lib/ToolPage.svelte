<script>
    import Navbar from "./Navbar.svelte";
    import Tool from "./Tool.svelte";

    let tool = $props();
</script>

<Navbar></Navbar>
<Tool {...tool}></Tool>

<style>
</style>
