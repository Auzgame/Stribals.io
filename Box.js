module.exports = class Box {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
  }
  plrCollisionRight(plrX, plrY){
    if(plrX + 15 > this.x && plrX + 15 < this.x + this.size && plrY > this.y && plrY < this.y + this.size){
      return 'right';
    }
    else {
      return false;
    }
  }
  plrCollisionLeft(plrX, plrY){
    if(plrX - 15 > this.x && plrX - 15 < this.x + this.size && plrY > this.y && plrY < this.y + this.size){
      return 'left';
    }
    else {
      return false;
    }
  }
  plrCollisionBottom(plrX, plrY){
    if(plrX > this.x && plrX < this.x + this.size && plrY + 15 > this.y && plrY + 15 < this.y + this.size){
      return 'bottom';
    }
    else {
      return false;
    }
  }
  plrCollisionTop(plrX, plrY){
    if(plrX > this.x && plrX < this.x + this.size && plrY - 15 > this.y && plrY - 15 < this.y + this.size){
      return 'top';
    }
    else {
      return false;
    }
  }
}