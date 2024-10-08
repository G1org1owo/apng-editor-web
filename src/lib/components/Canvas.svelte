<script lang="ts">
	import { clearCanvas } from '../image';
    import { Matrix3 } from '../matrix';

    const scaleRatio: number = 0.1;

    let transformedImage: OffscreenCanvas;

    let canvas: HTMLCanvasElement;
    export let backgroundImage: ImageBitmap;
    export let baseImage: ImageBitmap;
    export let selection: {x: number, y: number, w: number, h: number, frames: number, msPerFrame: number, horizontal: boolean};

    let mouseDown: boolean = false;
    let origin: DOMPoint;

    let transform: Matrix3 = new Matrix3([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);

    export const reset = () => {
        transform = new Matrix3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    };

    export const paintImage = (image: ImageBitmap, selection: any = null) => {
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

        transformedImage ??= new OffscreenCanvas(canvas.width, canvas.height);
        clearCanvas(transformedImage);
        const transformedImageContext = transformedImage.getContext("2d")!;

        transformedImageContext.strokeStyle = "#ff0000"
        transformedImageContext.imageSmoothingEnabled = false;
        transformedImageContext.setTransform(1, 0, 0, 1, image.width/2, image.height/2);
        transformedImageContext.transform(
            transform.m11, transform.m21,
            transform.m12, transform.m22,
            transform.m13, transform.m23
        );
        transformedImageContext.transform(1, 0, 0, 1, -image.width/2, -image.height/2);
        
        transformedImageContext.drawImage(image, 0, 0);
        let frameWidth = selection.horizontal? selection.w/selection.frames : selection.w;
        let frameHeight = selection.horizontal? selection.h : selection.h/selection.frames;
        for(let i=0; i<selection.frames; i++) {
            let frameOffsetX = selection.horizontal? selection.x + frameWidth * i : selection.x;
            let frameOffsetY = selection.horizontal? selection.y : selection.y + frameHeight * i;
            transformedImageContext.strokeRect(
                frameOffsetX, frameOffsetY,
                frameWidth, frameHeight
            );
        }

        context.drawImage(backgroundImage, 0, 0);
        context.drawImage(transformedImage, 0, 0);
    }

    const handleZoom = (event: WheelEvent) => {
        if(!baseImage) return;

        const zoomDirection = event.deltaY / -100; 
        const zoomScale = 1 + scaleRatio * zoomDirection;
        const oldScale = transform.m11;
        const newScale = oldScale * zoomScale;

        transform.multiply(new Matrix3([
            [newScale/oldScale, 0, 0],
            [0, newScale/oldScale, 0],
            [0, 0, 1]
        ]));

        paintImage(baseImage, selection);
    }

    const handlePan = (event: MouseEvent) => {
        if(!mouseDown || !baseImage) return;

        transform.m13 += event.movementX;
        transform.m23 += event.movementY;

        paintImage(baseImage, selection);
    }

    const onMouseDown = (event: MouseEvent) => {
        if(event.button == 0) mouseDown = true;
        origin = new DOMPoint(event.offsetX, event.offsetY);
    }

    $: if(baseImage && selection) paintImage(baseImage, selection);
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