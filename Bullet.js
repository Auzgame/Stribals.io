let bulletCounter = 0;
module.exports = class Bullet {
  constructor(x, y, owner, damage, rotation, alive, speed) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.dx = Math.cos(((this.rotation - 90) * Math.PI) / 180);
    this.dy = Math.sin(((this.rotation - 90) * Math.PI) / 180);
    this.size = 5;
    this.owner = owner;
    this.id = bulletCounter++;
    this.damage = damage;
    this.speed = speed;
    this.shouldDie = new Date().getTime() + alive;

    let [cx, cy] = Bullet.rotate(
      this.x,
      this.y,
      this.x - 12,
      this.y - 0,
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
  /*
  isCollidingWithPlayer(ox, oy){
    return !(
        ((oy + 15) < (this.y)) || //25 for Player size
        (oy > (this.y + this.size)) || 
        ((ox + 15) < this.x) ||
        (ox > (this.x + this.size))
    );
  }
  */
  isCollidingWithPlayer(ox, oy, radius = 20) {
    // Previous bullet position
    const x1 = this.x - this.dx * this.speed;
    const y1 = this.y - this.dy * this.speed;

    // Current bullet position
    const x2 = this.x;
    const y2 = this.y;

    // Player position
    const cx = ox;
    const cy = oy;

    // Vector AB
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Project point C onto AB (clamped 0–1)
    const t = Math.max(
      0,
      Math.min(
        1,
        ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy)
      )
    );

    // Closest point on segment
    const px = x1 + t * dx;
    const py = y1 + t * dy;

    // Distance from player to bullet path
    const distSq = (cx - px) ** 2 + (cy - py) ** 2;

    return distSq <= radius * radius;
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
  updatePosition() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
};
