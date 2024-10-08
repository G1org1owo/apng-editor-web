<script lang="ts">
    import "@material/web/textfield/outlined-text-field";
    import "@material/web/select/outlined-select";
    import "@material/web/button/elevated-button";
    import "@material/web/button/filled-tonal-button";
    import "@material/web/checkbox/checkbox";

    import { createEventDispatcher } from 'svelte';
	import type { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";

	const dispatch = createEventDispatcher();

    export let selection;

    let xOffset: number = 0;
    let yOffset: number = 0;
    let width: number = 100;
    let height: number = 100;
    let frameCount: number = 1;
    let millisecondsPerFrame: number = 100;
    let horizontal: boolean = true;

    const onTextUpdate = (e: InputEvent, updateValue: (n: number) => void) => {
        let textField: MdOutlinedTextField = e.target as MdOutlinedTextField;

        if(e.data != null && isNaN(+e.data)) {
            console.log(e.data);
            textField.value = textField.value.replace(e.data, "");
        }

        updateValue(+textField.value);
    };

    const extractFrames = () => {
        dispatch('extractFrames');
    }

    const deleteLastFrame = () => {
        dispatch('deleteLastFrame');
    }

    const clearFrames = () => {
        dispatch('clearFrames');
    }

    $: selection = {x: xOffset, y:yOffset, w:width, h:height, frames: frameCount, msPerFrame: millisecondsPerFrame, horizontal: horizontal};
</script>

<div class="dark input-sizes">
    <md-outlined-text-field class="dark"
        on:input={(e) => onTextUpdate(e, (v) => xOffset = v)}
        label="Horizontal offset" value={xOffset}/>
    <md-outlined-text-field class="dark"
        on:input={(e) => onTextUpdate(e, (v) => yOffset = v)}
        label="Vertical offset" value={yOffset}/>
    <md-outlined-text-field class="dark"
        on:input={(e) => onTextUpdate(e, (v) => width = v)}
        label="Width" value={width}/>
    <md-outlined-text-field class="dark"
        on:input={(e) => onTextUpdate(e, (v) => height = v)}
        label="Height" value={height}/>
</div>

<div class="dark input-meta">
    <md-outlined-text-field class="dark"
        on:input={(e) => onTextUpdate(e, (v) => frameCount = v)}
        label="Frame count" value={frameCount}/>
    <md-outlined-text-field class="dark"
        on:input={(e) => onTextUpdate(e, (v) => millisecondsPerFrame = v)}
        label="Milliseconds per frame" value={millisecondsPerFrame}/>
</div>

<div class="dark checkbox-container">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="dark">
        <md-checkbox class="dark" checked
            on:change={(e) => horizontal = e.target.checked}
        />
        Horizontal
    </label>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="dark buttons-container">
    <md-filled-tonal-button on:click={extractFrames}>Add frame(s)</md-filled-tonal-button>
    <md-filled-tonal-button on:click={deleteLastFrame}>Delete last frame</md-filled-tonal-button>
    <md-filled-tonal-button on:click={clearFrames}>Clear frames</md-filled-tonal-button>
</div>

<style>
    label {
        font-family: "Roboto", roboto;
        color: var(--md-sys-color-on-background);
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