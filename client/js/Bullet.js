class Bullet {
  constructor(x, y, rotation, speed, alive) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.dx = Math.cos(((this.rotation - 90) * Math.PI) / 180);
    this.dy = Math.sin(((this.rotation - 90) * Math.PI) / 180);
    this.speed = speed;
    this.shouldDie = new Date().getTime() + alive;

    let [cx, cy] = Bullet.rotate(
      this.x,
      this.y,
      this.x - 12,
      this.y - 90,
      this.rotation
    );
    this.x = cx;
    this.y = cy;
  }

  static rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) - sin * (y - cy) + cx,
      ny = cos * (y - cy) + sin * (x - cx) + cy;
    return [nx, ny];
  }

  drawUser(ctx, canvas) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 2.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
  }
  drawMySelf(ctx, plr, canvas) {
    ctx.beginPath();
    ctx.arc(
      this.x + canvas.width / 2 - plr.x,
      this.y + canvas.height / 2 - plr.y,
      2.5,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "black";
    ctx.fill();
  }
  updatePosition() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
  isCollidingWithPlayer(ox, oy) {
    if (this.y + 4 > oy - 15 && this.y < oy + 15) {
      if (this.x + 4 > ox - 15 && this.x < ox + 15) {
        return true;
      }
    } else {
      return false;
    }
  }
  isCollidingWithBox(ox, oy) {
    let futY = this.y + this.dy * this.speed;
    let futX = this.x + this.dx * this.speed;
    if (futY > oy && futY < oy + 90) {
      if (futX > ox && futX < ox + 90) {
        return true;
      }
    } else {
      return false;
    }
  }
}
