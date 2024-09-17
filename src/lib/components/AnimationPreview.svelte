<script lang="ts">
    import { Frame } from "$lib/image";

    let canvas: HTMLCanvasElement;

    export let frames: [Frame?];

    let index = 0;
    let timeout: number;

    export const reset = () => {
        canvas.getContext("2d")!.reset();
    }

    export const drawFrame = (frame: ImageBitmap) => {
        canvas.width = frame.width;
        canvas.height = frame.height;
        
        let context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        context.reset();
        context.drawImage(frame, 0, 0);
    };

    const nextFrame = (): number => {
        return setTimeout(() => {
            index = (index + 1) % frames.length;
            drawFrame(frames[index]!.image);
            timeout = nextFrame();
        }, frames[index]!.msPerFrame)
    };

    const startAnimating = () => {
        if(frames.length == 0) return;
        timeout = nextFrame();
    };

    const stopAnimating = () => {
        clearTimeout(timeout);
    };

    $: if(frames.length < index + 1) index = 0;
</script>

<canvas
    bind:this={canvas}
    on:mouseenter={startAnimating}
    on:mouseleave={stopAnimating}
/>