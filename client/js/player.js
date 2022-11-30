class Player {
  constructor(
    x,
    y,
    power,
    id,
    rotation,
    name,
    health,
    isReloading,
    selectedGun,
    Kills
  ) {
    this.x = x;
    this.y = y;
    this.strength = power;
    this.id = id;
    this.rotation = rotation;
    this.name = name;
    this.health = health;
    this.Gun = null;
    this.isReloading = isReloading;
    this.selectedGun = selectedGun;
    this.kills = Kills || 0;
  }
  static rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) - sin * (y - cy) + cx,
      ny = cos * (y - cy) + sin * (x - cx) + cy;
    return [nx, ny];
  }
  setBar(bar) {
    this.hpBar = bar;
  }
  getBar() {
    return this.hpBar;
  }
  drawUser(ctx, canvas) {
    //BODY
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 15, 0, 2 * Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003300";
    ctx.stroke();

    //ARMS
    let [tx, ty] = Player.rotate(0, 0, 0, -20, this.rotation - 40);
    ctx.beginPath();
    ctx.arc(
      tx + canvas.width / 2,
      ty + canvas.height / 2,
      10,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "#eab676";
    ctx.fill();

    [tx, ty] = Player.rotate(0, 0, 0, -20, this.rotation + 40);
    ctx.beginPath();
    ctx.arc(
      tx + canvas.width / 2,
      ty + canvas.height / 2,
      10,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "#eab676";
    ctx.fill();

    //NAME (NO DRAW BECAUSE MAIN PLAYER)
  }
  drawMySelf(ctx, plr, canvas) {
    //BODY
    ctx.beginPath();
    ctx.arc(
      this.x + canvas.width / 2 - plr.x,
      this.y + canvas.height / 2 - plr.y,
      15,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003300";
    ctx.stroke();

    //ARMS
    let [tx, ty] = Player.rotate(
      this.x,
      this.y,
      this.x,
      this.y - 20,
      this.rotation - 40
    );
    ctx.beginPath();
    ctx.arc(
      tx + canvas.width / 2 - plr.x,
      ty + canvas.height / 2 - plr.y,
      10,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "#eab676";
    ctx.fill();

    [tx, ty] = Player.rotate(
      this.x,
      this.y,
      this.x,
      this.y - 20,
      this.rotation + 40
    );
    ctx.beginPath();
    ctx.arc(
      tx + canvas.width / 2 - plr.x,
      ty + canvas.height / 2 - plr.y,
      10,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "#eab676";
    ctx.fill();

    //NAME
    ctx.beginPath();
    ctx.font = "red 14px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      this.name,
      this.x + canvas.width / 2 - plr.x,
      this.y + canvas.height / 2 - plr.y + 25
    );
  }
}
