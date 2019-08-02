import { Rect } from "./rect";


const r = new Rect(5, 5, 50, 50);  

document.body.onload = (event) => {
    const canvas: any =  document.getElementById("canvas");

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        r.draw(ctx);
    }
}