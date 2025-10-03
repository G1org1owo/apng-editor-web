import type { Frame } from "./frame";
import { makeacTL, PNGChunk, PNGChunkArray } from "./png";
import { extractPNGChunks } from "./png";

export async function createCheckersBackground(width: number, height: number) {
    let imageData: ImageData = new ImageData(width, height);

    const pixelsPerSquare = 10;

    for(let i=0; i<height; i++) {
        for(let j=0; j<width; j++) {
            const isOddRow = Math.floor(i/pixelsPerSquare) % 2 == 1;
            const isOddColumn = Math.floor(j/pixelsPerSquare) % 2 == 1;

            const color = (isOddRow && !isOddColumn) || (!isOddRow && isOddColumn) ? 0xffffffff : 0xccccccff;

            imageData.data[(i*width + j) * 4] = (color >> 24) & 0x000000ff;
            imageData.data[(i*width + j) * 4 + 1] = (color >> 16) & 0x000000ff;
            imageData.data[(i*width + j) * 4 + 2] = (color >> 8) & 0x000000ff;
            imageData.data[(i*width + j) * 4 + 3] = color & 0x000000ff;
        }
    }

    return await createImageBitmap(imageData);
}

export function clearCanvas(canvas: HTMLCanvasElement | OffscreenCanvas) {
    const context = canvas.getContext("2d")!;
    
    context.save();

    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.restore();
}

export async function framesToAPNG(frames: [Frame]) {
    const apngChunks: PNGChunk[] = [];

    let png: PNGChunkArray | null = await extractPNGChunks(frames[0]);
    console.log(png);

    /*
    let a = document.createElement('a');
    let url = URL.createObjectURL(new Blob([png]));
    a.href = url;
    document.body.append(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
    */

    const acTLData = new Uint8Array(new Uint32Array(
        [frames.length, 0]
    ).buffer);
    const acTL = PNGChunk.fromData(acTLData, "acTL");

    console.log(makeacTL(frames.length, 0));

    // Insert acTL after IHDR
    // Insert fcTL before IDAT
    apngChunks.push(...png!.allChunks);
    const iend = png?.get("IEND");

    for(let i=1; i<frames.length; i++) {
        const frame = frames[i];
        png = await extractPNGChunks(frame);

        // Construct fcTL
        // Construct fdAT

        // apngChunks.push(fctl);
        // apngChunks.push(fdat);
    }

    // apngChunks.push(iend);
}