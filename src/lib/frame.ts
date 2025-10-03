export class Frame {
    public image: ImageBitmap;
    public msPerFrame: number;

    public constructor(image: ImageBitmap, msPerFrame: number) {
        this.image = image;
        this.msPerFrame = msPerFrame;
    }
}