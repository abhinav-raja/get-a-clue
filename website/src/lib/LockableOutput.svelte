<script>
    let {clue, onToggleLock} = $props();
</script>

<button class={["clue", clue.locked && "locked"]} onclick={()=>onToggleLock(clue.id)}>
    <pre>{clue.content}</pre>
</button>
  
<style>
    .clue {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        border-radius: 5px;
        border: 2px solid var(--green);
        background-color: var(--dark-green);
        color: var(--mint-white);
        transition: all 0.3s;
        font-family: "Lexend";
        min-width: 50%;
    }

    .clue.locked{
        background-color: var(--green);
        color: var(--dark-green);
        border: none;
    }

    .clue:hover {
        background-color: color-mix(in srgb, var(--green) 70%, transparent 30%);
        color: var(--dark-green);
        border: none;
    }
</style>
  