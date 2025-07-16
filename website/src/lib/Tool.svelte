<script>
    import LockableOutput from './LockableOutput.svelte';

    let {label='', desc='', inputs=[], runFunction=(x)=>x} = $props();

    let outputBlocks = $state([]);

    function getInputValues() {
      return inputs.map(input => parseInt(input.value));
    }

    function run() {
      const values = getInputValues();
      const results = runFunction(values) || [];

      outputBlocks = [
        ...outputBlocks.filter(o => o.locked),
        ...results.map(res => ({
          id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
          locked: false,
          content: res
        }))
      ];
    }

    function toggleLock(id) {
      outputBlocks = outputBlocks.map(o =>
        o.id === id ? { ...o, locked: !o.locked } : o
      );
    }
</script>
  
<div class="tool-container">
    <h1>{label}</h1>
    <p class="desc">{desc}</p>

    <section class="input-area">
      {#each inputs as input (input.label)}
        <div class="input-field">
          <span>{input.label}</span>
          <input type='text' bind:value={input.value} inputmode="numeric" />
        </div>
      {/each}
      <button onclick={run}>Generate</button>
    </section>

    <section class="output-area">
      <p class="lock-tip">Click on a clue to lock it, and click again to unlock. Locked clues are not cleared when you generate a new set of clues.</p>
      {#each outputBlocks as clue (clue.id)}
          <LockableOutput {clue} onToggleLock={toggleLock}/>
      {/each}
    </section>
</div>

<style>
  .tool-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-left: 5vw;
    padding-right: 5vw;
  }

  h1 {
    font-family: "Vina Sans";
    font-size: 4.5rem;
    color: var(--green);
    text-align: center;
    font-weight: normal;
    margin: 1rem;
  }

  input {
    font-family: "Lexend";
    outline: none;
    border-radius: 1000px; /*Large value gives perfectly rounded corners*/
    width: 2rem;
    text-align: center;
    appearance: none;
    background-color: var(--mint-white);
    color: var(--dark-green);
  }

  .input-field {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .input-area {
    text-align: center;
  }

  button {
    text-align: center;
    border-radius: 1000px;
  }

  p {
    font-family: "Lexend";
    color: var(--mint-white);
    text-align: center;
  }

  span {
    font-family: "Lexend";
    color: var(--mint-white);
  }

  .lock-tip {
    font-style: italic;
  }

  .output-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
</style>
  