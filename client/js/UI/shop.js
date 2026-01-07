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
      let el = document.createElement("button");
      el.className = "SHOPBUTTONS";
      el.style.position = "absolute";
      el.style.left = curItem.x;
      el.style.top = curItem.y;
      el.style.width = curItem.width + "px";
      el.style.height = curItem.height + "px";
      el.style.visibility = "hidden";
      el.innerText = curItem.item + ": " + curItem.price;
      document.body.prepend(el);
    }
  }
  openShopButton() {
    let but = document.createElement("button");
    let isOpenShop = false;
    but.addEventListener("click", () => {
      for (let i = 0; i < $(".SHOPBUTTONS").length; i++) {
        if (isOpenShop == true) {
          $(".SHOPBUTTONS")[i].style.visibility = "hidden";
        } else {
          $(".SHOPBUTTONS")[i].style.visibility = "visible";
        }
      }
      isOpenShop = !isOpenShop;
    });
    but.style.position = "absolute";
    but.style.left = document.body.clientWidth / 2 - 50 + "px";
    but.style.top = document.body.clientHeight / 2 + 75 + "px";
    but.style.width = "200px";
    but.style.height = "100px";
    but.innerText = "TOGGLE SHOP";
    but.id = "shop";
    document.body.prepend(but);
  }
}
