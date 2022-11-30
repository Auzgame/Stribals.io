const Player = require("./Player");
const Bullet = require("./Bullet");
module.exports = class Bot extends Player {
  constructor(x, y, power, id, rotation, name, selectedGun, health, boxes) {
    super(x, y, power, id, rotation, name, selectedGun, health);
    this.moveDelay = Date.now() + 100;
    this.needsMove = false;
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
    let openSet = []; //array containing unevaluated grid points
    let closedSet = clsedSet.slice(); //array containing completely evaluated grid points
    let start; //starting grid point
    let grid = grd;
    let end; // ending grid point (goal)
    let path = [];

    //heuristic we will be using - Manhattan distance
    //for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    function heuristic(position0, position1) {
      let d1 = Math.abs(position1.x - position0.x);
      let d2 = Math.abs(position1.y - position0.y);

      return d1 + d2;
    }
    //initializing the grid
    function init(x, y, dstX, dstY, Boxes) {
      start = grid[x][y];
      end = grid[dstX][dstY];

      while (!end) {
        console.log("Somtin Rong with end: ", grid[dstX][dstY]);
        let newX,
          newY = rePickPoint(Boxes);
        end = grid[newX][newY];
      }

      openSet.push(start);
    }

    //A star search implementation

    function search(x, y, dstX, dstY, Boxes) {
      init(x, y, dstX, dstY, Boxes);
      while (openSet.length > 0) {
        //assumption lowest index is the first one to begin with
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
          if (openSet[i].f < openSet[lowestIndex].f) {
            lowestIndex = i;
          }
        }
        let current = openSet[lowestIndex];

        if (current === end) {
          let temp = current;
          path.push(temp);
          while (temp.parent && !path.includes(temp.parent)) {
            path.push(temp.parent);
            temp = temp.parent;
          }
          // return the traced path
          return path.reverse();
        }

        //remove current from openSet
        openSet.splice(lowestIndex, 1);
        //add current to closedSet
        closedSet.push(current);

        let neighbors = current.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
          let neighbor = neighbors[i];

          if (!closedSet.includes(neighbor)) {
            let possibleG = current.g + 1;

            if (!openSet.includes(neighbor)) {
              openSet.push(neighbor);
            } else if (possibleG >= neighbor.g) {
              continue;
            }

            neighbor.g = possibleG;
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
          }
        }
      }

      //no solution by default
      return [];
    }
    this.needsMove = false;
    return search(
      Math.floor(this.x / 10),
      Math.floor(this.y / 10),
      Math.floor(this.dstX / 10),
      Math.floor(this.dstY / 10),
      Boxes
    );
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
