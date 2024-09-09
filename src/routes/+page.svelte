<script lang="ts">
    import {createCheckersBackground} from "$lib/image";
	import { onMount } from "svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import Canvas from "$lib/components/Canvas.svelte";
	import AnimationPreview from "$lib/components/AnimationPreview.svelte";

    let backgroundImage: ImageBitmap;
    let baseImage: ImageBitmap;

    let selection: {x: number, y: number, w: number, h:number, frames: number, msPerFrame: number, horizontal: boolean};
    let frames: [{frame: ImageBitmap, msPerFrame: number}?] = [];

    let paintImage: (image: ImageBitmap, selection: any) => void;
    let resetCanvas: () => void;
    let drawPreviewFrame: (frame: ImageBitmap) => void;
    let resetPreview: () => void;

    const loadImage = async (event: CustomEvent) => {
        baseImage = await createImageBitmap(event.detail.file);
        resetCanvas();
        paintImage(baseImage, selection);
    };

    const extractFrames = async () => {
        if(!baseImage || selection.frames == 0) return;

        let canvas: OffscreenCanvas = new OffscreenCanvas(baseImage.width, baseImage.height);
        let context: OffscreenCanvasRenderingContext2D = canvas.getContext("2d", {willReadFrequently: true})!;
        context.drawImage(baseImage, 0, 0);

        let frameWidth = selection.horizontal? selection.w/selection.frames : selection.w;
        let frameHeight = selection.horizontal? selection.h : selection.h/selection.frames;
        for(let i=0; i<selection.frames; i++) {
            let frameOffsetX = selection.horizontal? selection.x + frameWidth * i : selection.x;
            let frameOffsetY = selection.horizontal? selection.y : selection.y + frameHeight * i;
            let data = context.getImageData(frameOffsetX, frameOffsetY, frameWidth, frameHeight);

            frames.push({
                frame: await createImageBitmap(data),
                msPerFrame: selection.msPerFrame
            });
        }

        frames = frames;
        drawPreviewFrame(frames[0]!.frame);
    }

    const deleteLastFrame = () => {
        frames.pop();
        frames = frames;
        
        if(frames.length == 0) resetPreview();
    }

    const clearFrames = () => {
        frames.splice(0);
        frames = frames;
        resetPreview();
    }

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
    
    <div class="dark right-panel">
        <div class="dark controls-container">
            <Sidebar
                bind:selection={selection}
                on:fileSelected={loadImage}
                on:extractFrames={extractFrames}
                on:deleteLastFrame={deleteLastFrame}
                on:clearFrames={clearFrames}
            />
        </div>
        <div class="dark preview-container">
            <AnimationPreview
                {frames}
                bind:drawFrame={drawPreviewFrame}
                bind:reset={resetPreview}
            />
        </div>
    </div>
</div>

<style>
    .content-container {
        display: flex;
    }

    .canvas-container {
        width: fit-content;
        height: fit-content;

        flex-grow: 1;
        flex-shrink: 1;

        padding: 10px;
    }

    .right-panel {
        flex-grow: 0;
        flex-shrink: 0;

        display: flex;
        flex-direction: column;
    }

    .controls-container {
        flex-grow: 0;
        flex-shrink: 0;

        padding: 10px;
    }

    .preview-container {
        flex-grow: 1;
        flex-shrink: 1;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 10px;
    }
</style>