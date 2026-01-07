class Bullet {
  constructor(x, y, rotation = 0, speed = 0, id = null, dx = null, dy = null) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.dx = dx ?? Math.cos(((rotation - 90) * Math.PI) / 180);
    this.dy = dy ?? Math.sin(((rotation - 90) * Math.PI) / 180);
    this.speed = speed;

    this.id = id;
    this.lastUpdate = performance.now();
    this.lastServerX = x;
    this.lastServerY = y;
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
  updatePosition(deltaTime) {
    // Move along velocity
    this.x += this.dx * this.speed * deltaTime;
    this.y += this.dy * this.speed * deltaTime;

    // Optional: smoothly correct to server position
    if (this.serverX !== undefined && this.serverY !== undefined) {
      const alpha = 0.1; // smoothing factor
      this.x += (this.serverX - this.x) * alpha;
      this.y += (this.serverY - this.y) * alpha;
    }
  }
  applyServerUpdate(sb) {
    // Smoothly interpolate to server position
    const now = performance.now();
    this.lastServerX = sb.x;
    this.lastServerY = sb.y;
    this.dx = sb.dx;
    this.dy = sb.dy;
    this.speed = sb.speed;
    this.lastUpdate = now;
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
