const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

class PNGChunk {
    public buffer: ArrayBuffer;

    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer;
    }
}

export class Frame {
    public image: ImageBitmap;
    public msPerFrame: number;

    public constructor(image: ImageBitmap, msPerFrame: number) {
        this.image = image;
        this.msPerFrame = msPerFrame;
    }
}

function compareArrayContents(array1: Uint8Array | Array<number>, array2: Uint8Array | Array<number>) {
    return array1.every((value, index) => value == array2[index]);
}

function getChunkLength(array: Uint8Array) {
    return new Uint32Array(array.reverse().buffer)[0];
} 

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
    const canvas: OffscreenCanvas = new OffscreenCanvas(frames[0].image.width, frames[0].image.height);
    const ctx = canvas.getContext("2d")!;

    const extractPNGChunks = async (frame: Frame) => {
        ctx.reset();
        ctx.drawImage(frame.image, frame.image.width, frame.image.height);
        const pngData = new Uint8Array(await canvas.convertToBlob().then((blob) => {
            return blob.arrayBuffer()
        }) as ArrayBuffer);

        if(!compareArrayContents(pngData.slice(0, 8), PNG_SIGNATURE)) return null;

        const pngChunks = [];

        for(let i=8; i<pngData.length; ) {
            let length = getChunkLength(pngData.slice(i, i+4));
            console.log(length);
            pngChunks.push(new PNGChunk(pngData.slice(i, i + 4 + 4 + length + 4).buffer));

            i += 4 + 4 + length + 4;
        }

        return pngChunks;
    }

    const apngChunks: [PNGChunk?] = [];

    let png = await extractPNGChunks(frames[0]);
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


    // Insert acTL after IHDR
    // Insert fcTL before IDAT
    // apngChunks.push(png.allFrames);
    // const iend = png["IEND"];

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