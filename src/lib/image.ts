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