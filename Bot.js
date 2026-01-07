const Player = require("./Player");
const Bullet = require("./Bullet");
const { Worker } = require("worker_threads");
module.exports = class Bot extends Player {
  constructor(x, y, power, id, rotation, name, selectedGun, health, boxes) {
    super(x, y, power, id, rotation, name, selectedGun, health);
    this.moveDelay = Date.now() + 100;
    this.needsMove = false;
    this.isPathFinding = false;
  }
  fire() {
    let ran = Math.floor(Math.random() * (20 - -20 + 1)) + -20;
    this.regenTime = 4000;
    if (this.isShooting && this.canShoot) {
      //console.log("Plr Shooting");
      if (this.selectedGun == "AT48" || this.selectedGun.type == "AT48") {
        //console.log("Shooting");
        if (this.selectedGun.ammo > 0 && this.isReloading == null) {
          this.selectedGun.ammo -= 1;
          this.canShoot = false;
          this.coolDown = Date.now() + this.selectedGun.fireRate;
          this.canRegenAt = Date.now() + this.regenTime;
          let Bul = new Bullet(
            this.x,
            this.y,
            this.id,
            this.selectedGun.damage,
            this.rotation + ran,
            1000,
            20
          );
          //console.log(Bul);
          return Bul;
        } else if (this.isReloading == null) {
          this.isReloading = Date.now() + this.selectedGun.reloadTime;
        }
      } else if (
        this.selectedGun == "StreetSweeper" ||
        this.selectedGun.type == "StreetSweeper"
      ) {
        if (this.selectedGun.ammo > 0 && this.isReloading == null) {
          this.selectedGun.ammo -= 5;
          this.canShoot = false;
          this.coolDown = Date.now() + this.selectedGun.fireRate;
          this.canRegenAt = Date.now() + this.regenTime;
          let Bul = [];
          Bul.push(
            new Bullet(
              this.x,
              this.y,
              this.id,
              this.selectedGun.damage,
              this.rotation + ran,
              350,
              40
            )
          );
          Bul.push(
            new Bullet(
              this.x,
              this.y,
              this.id,
              this.selectedGun.damage,
              this.rotation - 2 + ran,
              350,
              40
            )
          );
          Bul.push(
            new Bullet(
              this.x,
              this.y,
              this.id,
              this.selectedGun.damage,
              this.rotation - 4 + ran,
              350,
              40
            )
          );
          Bul.push(
            new Bullet(
              this.x,
              this.y,
              this.id,
              this.selectedGun.damage,
              this.rotation + 2 + ran,
              350,
              40
            )
          );
          Bul.push(
            new Bullet(
              this.x,
              this.y,
              this.id,
              this.selectedGun.damage,
              this.rotation + 4 + ran,
              350,
              40
            )
          );
          //console.log(Bul);
          return Bul;
        } else if (this.isReloading == null) {
          this.isReloading = Date.now() + this.selectedGun.reloadTime;
        }
      }
    }
  }

  validPoint(x, y, Boxes) {
    for (var i in Boxes) {
      if (x > Boxes[i].x && x < Boxes[i].x + Boxes[i].size) {
        if (y > Boxes[i].y && x < Boxes[i].y + Boxes[i].size) {
          return false;
        }
      }
    }
    return true;
  }

  pickPoint(Boxes) {
    this.dstX = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;
    this.dstY = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;

    while (!this.validPoint(this.dstX, this.dstY, Boxes)) {
      this.dstX = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;
      this.dstY = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;
    }
  }
  rePickPoint(Boxes) {
    let dstX = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;
    let dstY = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;

    while (!this.validPoint(dstX, dstY, Boxes)) {
      dstX = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;
      dstY = Math.floor(Math.random() * (1500 - 0 + 1)) + 0;
    }
    return dstX, dstY;
  }

  pathFinding(Boxes, grd, clsedSet) {
    return new Promise((resolve, reject) => {
      const worker = new Worker("./pathFindingWorker.js");

      // Send data to the worker
      worker.postMessage({
        boxes: Boxes.map(b => ({ x: b.x, y: b.y, size: b.size })),
        start: { x: Math.floor(this.x / 10), y: Math.floor(this.y / 10) },
        end: { x: Math.floor(this.dstX / 10), y: Math.floor(this.dstY / 10) }
      });

      // Listen for the result
      worker.on("message", (path) => {
        resolve(path);
        worker.terminate();
      });

      // Handle errors
      worker.on("error", (err) => {
        reject(err);
        worker.terminate();
      });

      // Handle worker exit
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  nextMove(moves) {
    var run = setInterval(() => {
      if (moves.length > 1) {
        if (this.moveDelay < Date.now()) {
          var pos = moves.shift();
          var x = pos["x"];
          var y = pos["y"];

          this.x = x * 10;
          this.y = y * 10;
          this.moveDelay = Date.now() + 100;
        }
      } else {
        clearInterval(run);
        this.needsMove = true;
      }
    }, 10);
    //console.log('Finished moving');
  }

  faceDirection(plr) {
    let distX = Math.pow(plr.x - this.x, 2);
    let distY = Math.pow(plr.y - this.y, 2);
    let radius = Math.pow(500, 2);
    if (distX + distY < radius) {
      let angle =
        Math.atan2(plr.x - this.x, -(plr.y - this.y)) * (180 / Math.PI);
      this.rotation = angle;
      this.isShooting = true;
    } else {
      this.radius += 10;
    }
  }
};
