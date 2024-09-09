<script lang="ts">
    import {createCheckersBackground} from "$lib/image";
	import { onMount } from "svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import Canvas from "$lib/components/Canvas.svelte";

    let backgroundImage: ImageBitmap;
    let baseImage: ImageBitmap;

    let selection: {x: number, y: number, w: number, h:number, frames: number, msPerFrame: number, horizontal: boolean};

    let paintImage: (image: ImageBitmap, selection: any) => void;
    let resetCanvas: () => void;

    const loadImage = async (event: CustomEvent) => {
        baseImage = await createImageBitmap(event.detail.file);
        resetCanvas();
        paintImage(baseImage, selection);
    };

    onMount(async () => {
        backgroundImage = await createCheckersBackground(1280, 720);
    });
</script>

<div style="width: 100%; height: 100%;" class="dark content-container">
    <div class="dark canvas-container">
        <Canvas
            {backgroundImage}
            {baseImage}
            bind:paintImage={paintImage}
            bind:reset={resetCanvas}
            {selection}
        />
    </div>
    
    <div class="dark controls-container">
        <Sidebar
            bind:selection={selection}
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