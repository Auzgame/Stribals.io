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
class shop {
  constructor() {
    this.Items = [];
  }
  createButtons(canvas, items) {
    for (var i in items) {
      let curItem = items[i];
      let canvasOffset = canvas.width - 1200;
      let xPlace = canvasOffset * ((this.Items.length % 5) + 1 / 5);
      let yPlace = Math.floor(this.Items.length / 3) + 200;
      let but = new Button(xPlace, yPlace, curItem);
      this.Items.push(but);
    }
    console.log(this.Items);
  }
  drawButtons() {
    for (var i in this.Items) {
      let curItem = this.Items[i];
      let el = document.createElement('id');
      el.style.position = 'absolute';
      el.style.left = curItem.x;
      el.style.up = curItem.y;
    }
  }
}
