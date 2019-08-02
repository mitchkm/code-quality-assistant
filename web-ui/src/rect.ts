export class Rect {
    constructor (
        private x,
        private  y,
        private  h,
        private  w,
    ) {};

    public draw(ctx) {
        ctx.fillRect(this.x, this.y, this.h, this.w);
    }
}