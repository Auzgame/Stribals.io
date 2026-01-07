(function () {
  window.debug = false;
  const canvas = document.getElementById("game");
  canvas.width = window.screen.width;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const myName = window.name;
  console.log(`Name: ${myName}`);

  if ($("#remove")[0]) {
    $("#remove")[0].remove();
  }
  if ($("#SignInDiv")[0]) {
    $("#SignInDiv")[0].remove();
  }

  $("#main")[0].remove();
  const socket = io.connect("", {
    query: "name=" + myName + "&gun=" + window.selection,
  });
  if ($("#Username")[0]) {
    $("#Username")[0].remove();
  }
  const backgroundImageURL = "./images/background.svg";
  const bgImage = new Image();
  bgImage.src = backgroundImageURL;

  const crateImgURL = "./images/crate.png";
  const crateImg = new Image();
  crateImg.src = crateImgURL;

  var Players = [];
  var Bullets = [];
  var Boxes = [];
  var isDead = false;
  var Rotation = 0;

  const keyHandler = new keyboardHandler();
  keyHandler.keyLoader();

  const msClick = new mouseClick();
  msClick.mouseLoader();

  const WepAT48 = new AT48(null);
  const Ui = new UI();
  const Shop = new shop();
  Ui.leaders = [];

  function playerUpdate(Data) {
    window.Players = Players;

    if(Players[Data[0]] instanceof Player == false){
      Players[Data[0]] = new Player(
        Data[1], //X
        Data[2], //Y
        0, //Power
        Data[0], // ID
        Data[3], // Rotation
        Data[6], // Name
        Data[5], // Health
        Data[8], //isReloading
        Data[7], //SelectedGun
        Data[4], //kills
        Data[9] // isShooting
      );
    } else {
      if(isNaN(Players[Data[0]].x) || isNaN(Players[Data[0]].y) || isNaN(Players[Data[0]].rotation)) {
        Players[Data[0]].x = Data[1];
        Players[Data[0]].y = Data[2];
        Players[Data[0]].rotation = Data[3];
      };
      Players[Data[0]].updatePos(Data[1], Data[2], Data[3]);
      Players[Data[0]].health = Data[5];
      Players[Data[0]].isReloading = Data[8];
      Players[Data[0]].selectedGun = Data[7];
      Players[Data[0]].kills = Data[4];
      Players[Data[0]].isShooting = Data[9];
    }

    let tmpArr = [];
    for (let i in Players) {
      tmpArr.push(Players[i]);
    }
    Ui.leaders = tmpArr;
  }


  function drawBullets() {
    for (var i in Bullets) {
      Bullets[i].drawMySelf(ctx, Players[socket.id], canvas);
    }
  }

  function drawBoxes(Data) {
    for (var i in Data) {
      let mark = Data[i];
      if (mark) {
        new Box(mark.x, mark.y, mark.size).drawMySelf(
          ctx,
          Players[socket.id],
          canvas,
          crateImg
        );
      }
    }
  }

  var hpBar;

  function drawPlayers() {
    for (var i in Players) {
      if (Players[i].id == socket.id) {
        Players[i].drawUser(ctx, canvas);

        if (Players[i].Gun == null) {
          Players[i].Gun = WepAT48;
        }
        Players[i].Gun.parent = Players[i];
        Players[i].Gun.drawUser(ctx, canvas);
      } else if (Players[i].id !== socket.id) {
        //console.log(Players[i]);
        Players[i].drawMySelf(ctx, Players[socket.id], canvas);

        if (Players[i].Gun == null) {
          Players[i].Gun = WepAT48;
        }
        Players[i].setBar(new healthBar(Players[i]));
        Players[i].hpBar.parent = Players[i];
        Players[i].hpBar.drawMySelf(ctx, Players[socket.id], canvas);

        Players[i].Gun.parent = Players[i];
        Players[i].Gun.drawMySelf(ctx, Players[socket.id], canvas);
      }
    }
  }

  function drawLayout() {
    var pat = ctx.createPattern(bgImage, "repeat"); // repeat the image as a pattern
    ctx.save();
    ctx.translate(
      -Players[socket.id].x + canvas.width / 2,
      -Players[socket.id].y + canvas.height / 2
    );
    ctx.fillStyle = pat; // set the fill style
    ctx.rect(0, 0, 2000, 2000); // create a rectangle
    ctx.fill(); // fill it with the pattern
    ctx.restore();
  }

  function drawUI() {
    Ui.drawHealthGradiant(ctx, canvas, Players[socket.id].health);
    Ui.healthBar(ctx, canvas, Players[socket.id].health);
    Ui.drawLeaderBoard(ctx, canvas);
    Ui.drawAmmoCount(ctx, canvas, Players[socket.id]);
    Ui.drawPing(ctx, lastPingTime);
  }

  var items;
  socket.on("dead", (data) => {
    items = data;
    window.items = items;
    isDead = true;
  });

  function deathScreen() {
    Ui.deathScreen(ctx, canvas);
    Shop.createButtons(canvas, items);
    Shop.drawButtons();
    Shop.openShopButton();
    $("#respawn")[0].style.visibility = "visible";
    socket.off("update");
    socket.close();
    return;
  }

  socket.on("boxes", (data) => {
    Boxes = data;
  });

  ABToStr = (ab) =>
    new Uint8Array(ab).reduce((p, c) => p + String.fromCharCode(c), "");

  socket.emit("credential", window.credential || null);

  var lastPingTime = "Awaiting Ping";

  setInterval(() => {
    const start = Date.now();

    socket.emit("ping", () => {
      const duration = Date.now() - start;
      lastPingTime = duration;
    });
  }, 1000);

  socket.on("update", () => {
    if (isDead) {
      deathScreen();
      return;
    }
    var pack = [
      {
        keys: keyHandler.keys,
      },
      {
        rotation: Rotation,
      },
      {
        mouseClick: msClick.click,
      },
    ];
    socket.emit("plrUpdate", pack);
  });

  socket.on("UpdatedPlr", (data) => {
    data = MessagePack.decode(data);
    window.socketId = socket.id;
    window.data = data;

    playerUpdate(data);
  });

  
  socket.on("updateBullets", (serverBullets) => {
    const now = performance.now();

    for (const sb of serverBullets) {
      let bullet = Bullets.find(b => b.id === sb.id);

      if (!bullet) {
        bullet = new Bullet(sb.x, sb.y, 0, sb.speed, sb.id, sb.dx, sb.dy);
        bullet.lastServerUpdate = now;
        Bullets.push(bullet);
      } else {
          bullet.serverX = sb.x;
          bullet.serverY = sb.y;
          bullet.dx = sb.dx;
          bullet.dy = sb.dy;
          bullet.speed = sb.speed;
          bullet.lastServerUpdate = now;
        bullet.applyServerUpdate(sb);
      }
    }

    // Optionally remove bullets that are dead on server
    Bullets = Bullets.filter(b => serverBullets.find(sb => sb.id === b.id));
  });



  

  let lastUpdateTime = performance.now();
  function render(){
    const now = performance.now();
    const deltaTime = (now - lastUpdateTime)/1000;
    lastUpdateTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(!Players[socket.id]){
      requestAnimationFrame(render);
      return;
    }
    drawLayout();
    drawBoxes(Boxes);

    for(let i in Players){
      Players[i].interpolatePosition(deltaTime);
    }
    
    drawPlayers();

    Bullets.forEach(b => b.updatePosition(deltaTime));
    drawBullets();

    drawUI();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  document.addEventListener("mousemove", (e) => {
    let dx = e.clientX - canvas.width / 2;
    let dy = e.clientY - canvas.height / 2;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    Rotation = angle;
    //console.log(Rotation)
  });

})();