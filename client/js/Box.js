class Box {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
  }
  drawMySelf(ctx, plr, canvas, img){
    ctx.beginPath();
    ctx.drawImage(img, (this.x + (canvas.width/2)) - plr.x, (this.y + (canvas.height/2)) - plr.y, this.size, this.size);
  }
}