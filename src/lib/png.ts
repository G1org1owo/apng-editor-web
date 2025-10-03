import { sequence } from "@sveltejs/kit/hooks";
import { calculateCRC32 } from "./crc";
import type { Frame } from "./frame";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export class PNGChunk {
    public buffer: ArrayBuffer;

    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer;
    }

    public static fromData(data: Uint8Array, name: string): PNGChunk {
        const buffer = new ArrayBuffer(data.length + 12);
        const chunk = new PNGChunk(buffer);
        chunk.name = name;
        chunk.data = data;

        return chunk;
    }

    public get totalLength(): number {
        return this.buffer.byteLength;
    }

    public get dataLength(): number {
        return bytesAsUint32(new Uint8Array(this.buffer).slice(0, 4));
    }

    private set dataLength(value: number) {
        const array = new Uint8Array(this.buffer);
        array[0] = (value >> 24) & 0xff;
        array[1] = (value >> 16) & 0xff;
        array[2] = (value >> 8) & 0xff;
        array[3] = (value) & 0xff;
    }

    public get name(): string {
        const name = new Uint8Array(this.buffer).slice(4, 8);

        return String.fromCharCode(name[0]) +
            String.fromCharCode(name[1]) + 
            String.fromCharCode(name[2]) + 
            String.fromCharCode(name[3]);
    }

    public set name(value: string) {
        const array = new Uint8Array(this.buffer);

        array[4] = value.charCodeAt(0);
        array[5] = value.charCodeAt(1);
        array[6] = value.charCodeAt(2);
        array[7] = value.charCodeAt(3);
    }

    public get data(): Uint8Array {
        return new Uint8Array(this.buffer).slice(8, this.buffer.byteLength-4);
    }

    public set data(value: Uint8Array) {
        const name = this.name;

        this.buffer = new ArrayBuffer(value.byteLength + 12);
        this.name = name;
        this.dataLength = value.byteLength;

        const array = new Uint8Array(this.buffer);
        for(let i=0, j=8; i<value.length; i++, j++) {
            array[j] = value[i];
        }

        this.calculateChecksum();
    }

    public get checksum(): number {
        return bytesAsUint32(
            new Uint8Array(this.buffer)
            .slice(this.buffer.byteLength-4, this.buffer.byteLength)
        );
    }

    private set checksum(value: number) {
        const array = new Uint8Array(this.buffer);

        array[array.byteLength - 4] = (value >> 24) & 0xff;
        array[array.byteLength - 3] = (value >> 16) & 0xff;
        array[array.byteLength - 2] = (value >> 8) & 0xff;
        array[array.byteLength - 1] = (value) & 0xff;
    }

    private calculateChecksum() {
        const array = new Uint8Array(this.buffer, 4, this.buffer.byteLength-8);
        this.checksum = calculateCRC32(array);
    }
}

export class PNGChunkArray {
    private chunks: PNGChunk[];

    public constructor(chunks: PNGChunk[]) {
        this.chunks = chunks;
    }

    public get(key: string): PNGChunk | null {
        if(this.chunks.length == 0) return null;

        return this.chunks.find(value => value.name == key) ?? null;
    }

    public get allChunks(): PNGChunk[] {
        return this.chunks;
    }
}

function bytesAsUint32(array: Uint8Array) {
    return new Uint32Array(array.reverse().buffer)[0];
}

function compareArrayContents(array1: Uint8Array | Array<number>, array2: Uint8Array | Array<number>) {
    return array1.every((value, index) => value == array2[index]);
}

export async function extractPNGChunks (frame: Frame) {
    const canvas: OffscreenCanvas = new OffscreenCanvas(frame.image.width, frame.image.height);
    const ctx = canvas.getContext("2d")!;

    ctx.reset();
    ctx.drawImage(frame.image, frame.image.width, frame.image.height);
    const pngData = new Uint8Array(await canvas.convertToBlob().then((blob) => {
        return blob.arrayBuffer()
    }) as ArrayBuffer);

    if(!compareArrayContents(pngData.slice(0, 8), PNG_SIGNATURE)) return null;

    const pngChunks: PNGChunk[] = [];

    for(let i=8; i<pngData.length; ) {
        let length = bytesAsUint32(pngData.slice(i, i+4));
        console.log(length);
        pngChunks.push(new PNGChunk(pngData.slice(i, i + 4 + 4 + length + 4).buffer));

        i += 4 + 4 + length + 4;
    }

    return new PNGChunkArray(pngChunks);
}

export function makeacTL(length: number, times: number) {
    const array = new Uint8Array(8);
    array[0] = (length >>> 24) & 0xff;
    array[1] = (length >>> 16) & 0xff;
    array[2] = (length >>> 8) & 0xff;
    array[3] = (length) & 0xff;
    array[4] = (times >>> 24) & 0xff;
    array[5] = (times >>> 16) & 0xff;
    array[6] = (times >>> 8) & 0xff;
    array[7] = (times) & 0xff;

    return array;
}

export function makefcTL(args: {sequenceNumber: number, frame: Frame, offset: {x: number, y: number}, dispose: number, blend: number}) {
    const array = new Uint8Array(26);
    array[0] = (args.sequenceNumber >>> 24) & 0xff;
    array[1] = (args.sequenceNumber >>> 16) & 0xff;
    array[2] = (args.sequenceNumber >>> 8) & 0xff;
    array[3] = (args.sequenceNumber) & 0xff;

    array[4] = (args.frame.image.width >>> 24) & 0xff;
    array[5] = (args.frame.image.width >>> 16) & 0xff;
    array[6] = (args.frame.image.width >>> 8) & 0xff;
    array[7] = (args.frame.image.width) & 0xff;
    
    array[8] = (args.frame.image.height >>> 24) & 0xff;
    array[9] = (args.frame.image.height >>> 16) & 0xff;
    array[10] = (args.frame.image.height >>> 8) & 0xff;
    array[11] = (args.frame.image.height) & 0xff;
    
    array[12] = (args.offset.x >>> 24) & 0xff;
    array[13] = (args.offset.x >>> 16) & 0xff;
    array[14] = (args.offset.x >>> 8) & 0xff;
    array[15] = (args.offset.x) & 0xff;
    
    array[16] = (args.offset.y >>> 24) & 0xff;
    array[17] = (args.offset.y >>> 16) & 0xff;
    array[18] = (args.offset.y >>> 8) & 0xff;
    array[19] = (args.offset.y) & 0xff;
}
