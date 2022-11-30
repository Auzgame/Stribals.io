const Gun = require("./Gun");
const Bullet = require("./Bullet");
module.exports = class Player {
  constructor(x, y, power, id, rotation, name, selectedGun, health) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.strength = power;
    this.id = id;
    this.rotation = rotation;
    this.name = name;
    this.isShooting = false;
    this.canShoot = true;
    this.coolDown = 0;
    this.selectedGun = selectedGun;
    this.canRegenAt = 0;
    this.regenCoolDown = 0;
    this.kills = 0;
    if (selectedGun == "StreetSweeper") {
      this.selectedGun = new Gun(
        this.id,
        "StreetSweeper",
        "Normal",
        1000 / 2,
        20,
        20
      );
    } else if (selectedGun == "AT48") {
      this.selectedGun = new Gun(this.id, "AT48", "Normal", 1000 / 30, 10, 30);
    } else {
      this.selectedGun = new Gun(this.id, "AT48", "Normal", 1000 / 30, 10, 30);
    }
    this.isReloading = null;
  }
  fire() {
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
            this.rotation,
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
              this.rotation,
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
              this.rotation - 2,
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
              this.rotation - 4,
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
              this.rotation + 2,
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
              this.rotation + 4,
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
  tickCooldown() {
    if (this.coolDown <= Date.now()) {
      this.canShoot = true;
    }
    if (this.isReloading != null) {
      if (this.isReloading <= Date.now()) {
        this.selectedGun.ammo = this.selectedGun.maxAmmo;
        this.isReloading = null;
      }
    }
  }
  setId(cred) {
    this.cred = cred;
  }
  getId() {
    return this.cred;
  }
  toString() {
    return `\n  X: ${this.x}, \n  Y: ${this.y}, \n  Health: ${this.health}, \n  Id: ${this.id}, \n  Name: ${this.name}, \n  Kills: ${this.kills}, \n  Selected Gun: ${this.selectedGun}`;
  }
};
