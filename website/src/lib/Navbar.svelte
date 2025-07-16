<script>
    import {toolInfo as tools} from '../tools.js'
  
    let isOpen = $state(false);
  
    const links = tools.map(({ name, label }) => ({
      //incorporate the vite base url here
      href: `${import.meta.env.BASE_URL}tools/${name}.html`,
      label
    }));
  
    function toggleClueDropdown() {
      isOpen = !isOpen;
    }
</script>

<link href="./app.css" rel="stylesheet"> 
<nav class="navbar-container">
    <a href={`${import.meta.env.BASE_URL}index.html`} class="navbar-content" aria-label="home">
        <span class="home-icon"></span>
    </a>
    <button onclick={toggleClueDropdown} class="navbar-content" aria-label="clue types">
        <span class="menu-icon"></span>
        
    </button>
	<div class={["dropdown", isOpen && "active"]}>
            {#each links as {href, label}}
                <a {href} class="dropdown-content">{label}</a>
            {/each}
        </div>
</nav>


<style>
    .navbar-container {
				position: sticky;
				top: 0;
				padding-top: 0.5rem;
        background-color: var(--green);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
    }

    .navbar-content {
				padding: 0rem 0.5rem;
        position: relative;
				background-color: inherit;
    }

		button {
			background-color: var(--green);
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;
			outline: inherit;
		}

		.navbar-content > span {
				transition: background-color 0.2s;
				background-color: var(--dark-green);
		}

    .navbar-content > span:hover {
        background-color: var(--mint-white);
    }

    .dropdown {
        position: absolute;
        right: 0;
				top: 2.8rem;
        display: none;
				flex-direction: column;
				align-content: center;
				background-color: var(--green);
				padding: 3px;
				padding-top: 0px;
    }
	
		@media (max-width: 600px) {
				.dropdown {
					 width: calc(100% - 6px);
				}
		}
	
    .dropdown.active {
        display: flex;
    }

		.dropdown-content {
				font-family: "Lexend";
				text-align: center;
				padding: 0.5rem 1rem 0.5rem 1rem;
				background-color: var(--green);
				transition: all 0.2s;
				text-decoration: none;
				color: var(--dark-green);
		}

		.dropdown-content:hover {
				background-color: var(--dark-green);
				color: var(--mint-white);
		}

    .home-icon {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5 19v-8.692q0-.384.172-.727t.474-.565l5.385-4.078q.423-.323.966-.323t.972.323l5.385 4.077q.303.222.474.566q.172.343.172.727V19q0 .402-.299.701T18 20h-3.384q-.344 0-.576-.232q-.232-.233-.232-.576v-4.769q0-.343-.232-.575q-.233-.233-.576-.233h-2q-.343 0-.575.233q-.233.232-.233.575v4.77q0 .343-.232.575T9.385 20H6q-.402 0-.701-.299T5 19'/%3E%3C/svg%3E");
        mask-image: var(--svg);
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
    }

    .menu-icon {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z'/%3E%3C/svg%3E");
        mask-image: var(--svg);
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
    }
</style>

  