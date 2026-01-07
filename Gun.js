module.exports = class Gun{
  constructor(parent, type, bulletType, fireRate, damage, maxAmmo){
    this.parent = parent;
    this.type = type;
    this.fireRate = fireRate; //5 Rounds Per Second
    this.bulletType = bulletType;
    this.damage = damage;
    this.maxAmmo = maxAmmo;
    this.ammo = maxAmmo;
    this.reloadTime = 2000;
  }
}