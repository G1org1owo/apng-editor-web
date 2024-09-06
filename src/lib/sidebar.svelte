<script lang="ts">
    import "@material/web/textfield/outlined-text-field";
    import "@material/web/select/outlined-select";
    import "@material/web/button/elevated-button";
    import "@material/web/button/filled-button";
    import "@material/web/button/filled-tonal-button";
    import "@material/web/button/outlined-button";
    import "@material/web/checkbox/checkbox";

    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let xOffset: number;
    export let yOffset: number;
    export let width: number;
    export let height: number;
    export let frameCount: number;
    export let millisecondsPerFrame: number;

    let fileInput: HTMLInputElement;

    const onChange = (event: Event) => {
        let file: File = fileInput.files![0];
        dispatch('fileSelected', {file: file});
    }
</script>

<div class="dark input-sizes">
    <md-outlined-text-field class="dark"
        label="Horizontal offset" type="number" value={xOffset}/>
    <md-outlined-text-field class="dark"
        label="Vertical offset" type="number" value={yOffset}/>
    <md-outlined-text-field class="dark"
        label="Width" type="number" value={width}/>
    <md-outlined-text-field class="dark"
        label="Height" type="number" value={height}/>
</div>

<div class="dark input-meta">
    <md-outlined-text-field class="dark"
        label="Frame count" value={frameCount}/>
    <md-outlined-text-field class="dark"
        label="Milliseconds per frame" value={millisecondsPerFrame}/>
</div>

<div class="dark checkbox-container">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="dark">
        <md-checkbox class="dark" checked></md-checkbox>
        Horizontal
    </label>
</div>

<div class="dark buttons-container">
    <md-filled-tonal-button>Add frame(s)</md-filled-tonal-button>
    <md-filled-tonal-button>Delete last frame</md-filled-tonal-button>
    <md-filled-tonal-button>Clear frames</md-filled-tonal-button>
</div>

<div class="dark input-file-container">
    <input hidden type="file" accept="image/*"
        bind:this={fileInput}
        on:change={onChange}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <md-elevated-button class="dark" on:click={fileInput.click()}>
        Upload file
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
    </md-elevated-button>
</div>

<style>
    label {
        font-family: "Roboto", roboto;
        color: var(--md-sys-color-on-background);
    }

    .input-file-container {
        display: flex;
        justify-content: right;
    }

    .input-sizes {
        display: grid;
        grid-template-columns: auto auto;
        gap: 10px;
        padding: 0 0 10px 0;
    }

    .input-meta {
        display: grid;
        grid-template-columns: auto auto;
        gap: 10px;
        padding: 10px 0;
        margin-top: 10px;
    }

    .checkbox-container {
        padding: 10px 0;
    }

    .buttons-container {
        display: grid;
        grid-template-columns: auto auto auto;
        gap: 10px;
        padding: 10px 0;
    }
</style>