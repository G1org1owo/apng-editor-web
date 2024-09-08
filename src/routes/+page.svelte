<script lang="ts">
    import {createCheckersBackground} from "$lib/image";
	import { onMount } from "svelte";
	import Sidebar from "$lib/sidebar.svelte";
	import Canvas from "$lib/Canvas.svelte";

    let canvas: HTMLCanvasElement;

    let backgroundImage: ImageBitmap;
    let baseImage: ImageBitmap;

    let xOffset: number = 0;
    let yOffset: number = 0;
    let width: number = 0;
    let height: number = 0;
    let millisecondsPerFrame: number = 100;
    let frameCount: number = 0;

    let paintImage: () => void;

    const loadImage = async (event: CustomEvent) => {
        baseImage = await createImageBitmap(event.detail.file);
        paintImage();
    };

    onMount(async () => {
        backgroundImage = await createCheckersBackground(1280, 720);
    });

</script>

<div style="width: 100%; height: 100%;" class="dark content-container">
    <div class="dark canvas-container">
        <Canvas
            bind:canvas={canvas}
            {backgroundImage}
            {baseImage}
            bind:paintImage={paintImage}
        />
    </div>
    
    <div class="dark controls-container">
        <Sidebar
            bind:xOffset={xOffset}
            bind:yOffset={yOffset}
            bind:width={width}
            bind:height={height}
            bind:millisecondsPerFrame={millisecondsPerFrame}
            bind:frameCount={frameCount}
            on:fileSelected={loadImage}
        />
    </div>
</div>

<style>
    .canvas-container {
        width: fit-content;
        height: fit-content;

        flex-grow: 1;
        flex-shrink: 1;
    }

    .controls-container {
        flex-grow: 0;
        flex-shrink: 0;

        border: 1px solid var(--md-sys-color-outline-variant);
        padding: 10px;
    }

    .content-container {
        display: flex;
    }
</style>