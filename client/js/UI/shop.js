class Button {
  constructor(x, y, item) {
    this.x = x;
    this.y = y;
    this.item = item.name;
    this.price = item.price;
    this.width = 200;
    this.height = 100;
  }
  collision(ObjX, ObjY) {
    return (
      ObjX > this.x &&
      ObjX < this.x + this.width &&
      ObjY > this.y &&
      ObjY < this.y + this.height
    );
  }
}
class Shop {
  constructor() {
    this.Items = [];
  }
  createButtons(canvas, items) {
    for (var i in items) {
      let curItem = items[i];
      let xPlace = canvas.width * ((this.Items % 3) + 1 / 3);
      let yPlace = Math.floor(this.Items / 3);
      let but = new Button(xPlace, yPlace, curItem);
      this.Items.push(but);
    }
  }
  drawButtons(ctx) {
    for (var i in this.Items) {
      let curItem = this.Items[i];
      ctx.beginPath();
      ctx.fillStyle = "#0D9DD3";
      ctx.fillRect(curItem.x, curItem.y, curItem.width, curItem.height);
      ctx.fill();
      ctx.closePath();
    }
  }
}
