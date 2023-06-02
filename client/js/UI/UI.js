class UI {
  constuctor() {
    this.leaders = [];
  }
  healthBar(ctx, canvas, health) {
    this.x = 0;
    this.y = canvas.height - 30;
    this.w = canvas.width / 3;
    this.h = 40;
    this.health = health;

    //console.log(`X: ${this.x} Y: ${this.y} W: ${this.w} H: ${this.h}`)
    // Background
    ctx.beginPath();
    ctx.save();
    ctx.rect(this.x, this.y, canvas.width - 20, this.h);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#807E7E";
    ctx.fill();
    ctx.restore();
    ctx.closePath();
    // HP
    ctx.beginPath();
    ctx.save();
    this.newW = (this.health / 100) * this.w - 10;
    ctx.rect(this.x + 5, this.y + 5, this.newW, this.h - 27);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore();

    // Text
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillText("HP: " + this.health, this.x + 20, this.y + 15);
    ctx.restore();
  }
  deathScreen(ctx, canvas) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "red";
    ctx.font = "50px serif";
    ctx.fillText("You Died!", canvas.width / 2 - 50, canvas.height / 2 - 50);
    ctx.fill();
    ctx.restore();
  }
  drawLeaderBoard(ctx, canvas) {
    this.leaders = this.leaders.sort(function (a, b) {
      return parseInt(b.kills) - parseInt(a.kills);
    });

    ctx.beginPath();
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "black";
    ctx.rect(canvas.width - 200, 0, 190, 400);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    let offsetX = canvas.width - 100;
    window.leads = this.leaders;
    for (let i = 0; i < this.leaders.length; i++) {
      let item = this.leaders[i];
      ctx.beginPath();
      ctx.font = "14px serif";
      ctx.fillStyle = "white";
      ctx.fillText(`${item.name}   Kills: ${item.kills}`, offsetX, i * 20 + 20);
      ctx.fill();
    }
  }
  drawAmmoCount(ctx, canvas, plr) {
    ctx.beginPath();
    ctx.save();
    ctx.font = "32px serif";
    ctx.fillStyle = "white";
    if (plr.isReloading == null) {
      ctx.fillText(
        `${plr.selectedGun.maxAmmo}/${plr.selectedGun.ammo}`,
        50,
        canvas.height - 100
      );
    } else {
      ctx.fillText(`Reloading...`, 100, canvas.height - 100);
    }
    ctx.fill();
    ctx.restore();
  }
  drawPing(ctx, ping) {
    ctx.beginPath();
    ctx.save();
    ctx.font = "24px serif";
    ctx.fillStyle = "#0DA711";
    ctx.fillText(`Ping: ${ping}`, 60, 40);
    ctx.fill();
    ctx.restore();
  }
  drawHealthGradiant(ctx, canvas, health) {
    let healthFactor = 400 - health * 4;
    //beginGradient
    ctx.beginPath();
    ctx.arc(0, 0, healthFactor, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, healthFactor);
    grd.addColorStop(1, "transparent");
    grd.addColorStop(0.1, "rgba(255, 0, 0, 1");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();

    // Create gradient
    ctx.beginPath();
    ctx.arc(canvas.width, 0, healthFactor, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(
      canvas.width,
      0,
      0,
      canvas.width,
      0,
      healthFactor
    );
    grd.addColorStop(1, "transparent");
    grd.addColorStop(0.1, "rgba(255, 0, 0, 1");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();

    // Create gradient
    ctx.beginPath();
    ctx.arc(canvas.width, canvas.height, healthFactor, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(
      canvas.width,
      canvas.height,
      0,
      canvas.width,
      canvas.height,
      healthFactor
    );
    grd.addColorStop(1, "transparent");
    grd.addColorStop(0.1, "rgba(255, 0, 0, 1");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();

    // Create gradient
    ctx.beginPath();
    ctx.arc(0, canvas.height, healthFactor, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(
      0,
      canvas.height,
      0,
      0,
      canvas.height,
      healthFactor
    );
    grd.addColorStop(1, "transparent");
    grd.addColorStop(0.1, "rgba(255, 0, 0, 1");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();
  }
}
