class healthBar {
  constructor(parent) {
    this.parent = parent;
  }
  drawUser(ctx, canvas) {
    this.health = this.parent.health; //Update Health

    //Back Drop
    ctx.beginPath();
    ctx.rect((canvas.width / 2) - 45, canvas.height / 2 - 50, 85, 25);
    ctx.fillStyle = '#C1bbb6';
    ctx.fill();

    //Health Bar
    this.hpLength = ((this.health / 100) * 75);
    ctx.beginPath();
    ctx.rect(((canvas.width / 2) - 45) + 5, ((canvas.height / 2) - 50) + 5, this.hpLength, 15)
    ctx.fillStyle = "#Da1414";
    ctx.fill();
  }
  drawMySelf(ctx, plr, canvas){
     this.health = this.parent.health; //Update Health
     this.offsetX = (this.parent.x + canvas.width/2) - plr.x;
     this.offsetY = (this.parent.y + canvas.height/2) - plr.y;

    //Back Drop
    ctx.beginPath();
    ctx.rect(this.offsetX - 45, this.offsetY - 50, 85, 25);
    ctx.fillStyle = '#C1bbb6';
    ctx.fill();

    //Health Bar
    this.hpLength = ((this.health / 100) * 75);
    ctx.beginPath();
    ctx.rect(this.offsetX - 40, this.offsetY - 45, this.hpLength, 15)
    ctx.fillStyle = "#Da1414";
    ctx.fill();
  }
}