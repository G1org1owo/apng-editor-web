<script lang="ts">
    import { clearCanvas } from "./image";
    import { Matrix3 } from './matrix';

    const scaleRatio: number = 0.1;

    let transformedImage: OffscreenCanvas;

    export let canvas: HTMLCanvasElement;
    export let backgroundImage: ImageBitmap;
    export let baseImage: ImageBitmap;

    let mouseDown: boolean = false;
    let origin: DOMPoint;

    let transform: Matrix3 = new Matrix3([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);

    export const paintImage = () => {
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

        transformedImage = new OffscreenCanvas(canvas.width, canvas.height);
        clearCanvas(transformedImage);
        const transformedImageContext = transformedImage.getContext("2d")!;

        transformedImageContext.setTransform(1, 0, 0, 1, baseImage.width/2, baseImage.height/2);
        transformedImageContext.transform(
            transform.m11, transform.m21,
            transform.m12, transform.m22,
            transform.m13, transform.m23
        );
        transformedImageContext.transform(1, 0, 0, 1, -baseImage.width/2, -baseImage.height/2);
        
        transformedImageContext.drawImage(baseImage, 0, 0);

        context.drawImage(backgroundImage, 0, 0);
        context.drawImage(transformedImage, 0, 0);
    }

    const handleZoom = (event: WheelEvent) => {
        const zoomDirection = event.deltaY / -100; 
        const zoomScale = 1 + scaleRatio * zoomDirection;
        const oldScale = transform.m11;
        const newScale = oldScale * zoomScale;

        transform.multiply(new Matrix3([
            [newScale/oldScale, 0, 0],
            [0, newScale/oldScale, 0],
            [0, 0, 1]
        ]));

        paintImage();
    }

    const handlePan = (event: MouseEvent) => {
        if(!mouseDown) return;

        transform.m13 += event.movementX;
        transform.m23 += event.movementY;

        paintImage();
    }

    const onMouseDown = (event: MouseEvent) => {
        if(event.button == 0) mouseDown = true;
        origin = new DOMPoint(event.offsetX, event.offsetY);
    }
</script>

<canvas 
    width=1080
    height=720
    bind:this={canvas}
    on:mousewheel={handleZoom}
    on:mousedown={onMouseDown}
    on:mouseup={() => mouseDown = false}
    on:mousemove={handlePan}
    class = "dark">
</canvas>

<style>
    canvas {
        border:3px solid;
        border-color: var(--md-sys-color-outline);
        border-radius: 10px;
    }
</style>