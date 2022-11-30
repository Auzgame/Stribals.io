class AT48{
  constructor(parent){
    this.parent = parent;
    this.type = "AT48";
    
    this.imgURL = './images/at48.png';
    this.Img = new Image();
    this.Img.src = this.imgURL;
  }

  static rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
    return [nx, ny];
  }
  drawUser(ctx, canvas){
    let [cx, cy] = AT48.rotate(0, 0, 0, -20, this.parent.rotation - 40);
    let tx = cx + (canvas.width)/2;
    let ty = cy + (canvas.height)/2;

    ctx.save();
    ctx.translate(tx, ty)
    ctx.rotate((this.parent.rotation - 90) * Math.PI/180)
    ctx.drawImage(this.Img, 0, -5, 80, 10);
    ctx.restore();
  }
  drawMySelf(ctx, plr, canvas){
    let [cx, cy] = AT48.rotate(this.parent.x, this.parent.y, this.parent.x, this.parent.y - 20, this.parent.rotation - 40);
    let tx = (cx + (canvas.width/2)) - plr.x;
    let ty = (cy + (canvas.height/2)) - plr.y;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((this.parent.rotation - 90) * Math.PI/180);
    ctx.drawImage(this.Img, 0, 0, 80, 10);
    ctx.restore();
  }
}