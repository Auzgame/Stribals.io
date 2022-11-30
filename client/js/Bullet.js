class Bullet{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  drawUser(ctx, canvas) {
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 2.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
  drawMySelf(ctx, plr, canvas){
    ctx.beginPath();
    ctx.arc((this.x + (canvas.width/2)) - plr.x, (this.y + (canvas.height/2)) - plr.y, 2.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
}