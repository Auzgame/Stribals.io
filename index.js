const jwt_decode = require("jwt-decode");
const Player = require("./Player");
const Box = require("./Box");
const Bot = require("./Bot");
const Shop = require("./Shop");
const msgpack = require("@msgpack/msgpack");
let Coder = require("./Coder");
Coder = new Coder();
var express = require("express");

var app = express({ logger: true });
var serv = require("http").Server(app);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});
app.use(express.static("client"));
serv.listen(3000);
console.log("server started");
var SOCKET_LIST = {};
var Players = {};
var Bullets = [];
var Boxes = [];
const botCount = 2;

const io = require("socket.io")(serv, {});
const admin = require("firebase-admin");
const credentials = require("./terrible-shooters-firebase-adminsdk-cirkf-e9a7798540.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://terrible-shooters-default-rtdb.firebaseio.com",
});

var db = admin.database();
var userRef = db.ref("users");

function addUser(cred) {
  userRef.child(cred.sub).set({
    name: cred.name,
    email: cred.email,
    kills: 0,
    gold: 0,
  });
}
function setUserData(cred, stat, value) {
  dec = jwt_decode(cred);
  userRef.child(dec["sub"]).child(stat).set(value);
}

async function getUserDB() {
  let data = await userRef.once("value");
  data = data.val();
  return data;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function getUser(credential) {
  let decoded = jwt_decode(credential);
  if (!decoded) {
    return;
  }
  var data = await getUserDB();
  if (data == undefined) {
    addUser(decoded);
  } else if (!data[decoded.sub.toString()]) {
    addUser(decoded);
  }
  data = await getUserDB();
  return data[decoded.sub.toString()];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playerCollidesWithBox(x, y) {
  let result = [];
  for (var i in Boxes) {
    let bx = Boxes[i];
    let resRight = bx.plrCollisionRight(x, y);
    let resLeft = bx.plrCollisionLeft(x, y);
    let resTop = bx.plrCollisionTop(x, y);
    let resBottom = bx.plrCollisionBottom(x, y);

    if (resRight != false) {
      result.push(resRight);
    }
    if (resLeft != false) {
      result.push(resLeft);
    }
    if (resTop != false) {
      result.push(resTop);
    }
    if (resBottom != false) {
      result.push(resBottom);
    }
  }
  return result;
}

io.on("connection", function (socket) {
  let name = socket.handshake.query.name;
  let gun = socket.handshake.query.gun;
  if (!gun) {
    gun = "AT48";
  }
  console.log("connection: " + socket.id + "\nName: " + name);
  SOCKET_LIST[socket.id] = socket;
  let ranX = getRandomInt(0, 2000);
  let ranY = getRandomInt(0, 2000);
  let canPlace = false;

  while (canPlace == false) {
    if (isBoxValid(ranX, ranY) == false) {
      ranX = getRandomInt(0, 1410);
      ranY = getRandomInt(0, 1410);
    } else {
      canPlace = true;
    }
  }
  Players[socket.id] = new Player(ranX, ranY, 0, socket.id, 0, name, gun, 100);
  let pack = [
    Players[socket.id].id,
    Players[socket.id].x,
    Players[socket.id].y,
    Players[socket.id].rotation,
    Players[socket.id].kills,
    Players[socket.id].health,
    Players[socket.id].name,
    Players[socket.id].selectedGun,
    Players[socket.id].isReloading,
  ];
  io.sockets.emit("UpdatedPlr", msgpack.encode(pack));

  socket.on("credential", (data) => {
    Players[socket.id].setId(data);
  });
  socket.emit("boxes", Boxes);
  socket.on("plrUpdate", (data) => {
    let plr = Players[socket.id];
    if (!plr) {
      return;
    }
    if (
      data[0].keys.w == true &&
      plr.y > 0 &&
      !playerCollidesWithBox(plr.x, plr.y).includes("top")
    ) {
      plr.y -= 8;
    }
    if (
      data[0].keys.a == true &&
      plr.x > 0 &&
      !playerCollidesWithBox(plr.x - 8, plr.y).includes("left")
    ) {
      plr.x -= 8;
    }
    if (
      data[0].keys.s == true &&
      plr.y < 2000 &&
      !playerCollidesWithBox(plr.x, plr.y + 8).includes("bottom")
    ) {
      plr.y += 8;
    }
    if (
      data[0].keys.d == true &&
      plr.x < 2000 &&
      !playerCollidesWithBox(plr.x + 8, plr.y).includes("right")
    ) {
      plr.x += 8;
    }

    if (data[0].keys.r == true && plr.isReloading == null) {
      Players[socket.id].isReloading = Date.now() + plr.selectedGun.reloadTime;
    }

    //console.log(data[1].rotation);
    plr.rotation = data[1].rotation;

    if (data[2].mouseClick.left == true) {
      plr.isShooting = true;
    } else {
      plr.isShooting = false;
    }
    let pack = [
      plr.id,
      plr.x,
      plr.y,
      plr.rotation,
      plr.kills,
      plr.health,
      plr.name,
      plr.selectedGun,
      plr.isReloading,
    ];
    io.sockets.emit("UpdatedPlr", msgpack.encode(pack));
  });

  socket.on("disconnect", function () {
    delete SOCKET_LIST[socket.id];
    delete Players[socket.id];
    console.log("disconnection");
  });
});

function playerActions() {
  for (i in Players) {
    let plr = Players[i];
    //console.log(plr);
    let bullet = plr.fire();
    if (bullet && Array.isArray(bullet)) {
      for (i in bullet) {
        Bullets.push(bullet[i]);
      }
    } else if (bullet) {
      //console.log(bullet)
      Bullets.push(bullet);
    }
    //regen
    if (
      plr.canRegenAt <= Date.now() &&
      plr.health < 100 &&
      plr.regenCoolDown <= Date.now()
    ) {
      Players[i].health += 2;
      Players[i].regenCoolDown = Date.now() + 500;
    }
    if (plr.cred) {
      let decoded = jwt_decode(plr.cred);
      /*if (decoded.sub == 113776749929294759250) {
        plr.coolDown = 0;
        plr.selectedGun.ammo = plr.selectedGun.maxAmmo;
      }*/
    }
    plr.tickCooldown();
  }
}

async function updateDBKills(cred) {
  let plrData = await getUser(cred);
  setUserData(cred, "kills", plrData["kills"] + 1);
  setUserData(cred, "gold", plrData["gold"] + 10);
}

function bulletCollidedWithPlayer() {
  for (i in Bullets) {
    let bul = Bullets[i];
    for (j in Players) {
      let plr = Players[j];
      if (bul.isCollidingWithPlayer(plr.x, plr.y) && plr.id != bul.owner) {
        plr.health -= bul.damage;
        //deleteBullet(bul);
        let index = Bullets.indexOf(Bullets[i]);
        Bullets.splice(index, 1);
        if (plr.health <= 0) {
          try {
            if (Players[bul.owner]) {
              Players[bul.owner].kills++;
              if (Players[bul.owner].getId() != null) {
                updateDBKills(Players[bul.owner].getId());
              }
              try {
                SOCKET_LIST[Players[j].id].emit("dead", Shop.items);
              } catch (err) {}
              delete Players[j];
            }
          } catch (er) {
            console.log("BULLET ER: ", er);
          }
        }
      }
    }
  }
}

function bulletCollidedWithBox() {
  for (i in Bullets) {
    let bul = Bullets[i];
    for (j in Boxes) {
      let bx = Boxes[j];
      if (bul.isCollidingWithBox(bx.x, bx.y)) {
        let index = Bullets.indexOf(Bullets[i]);
        Bullets.splice(index, 1);
      }
    }
  }
}

function sendBullets() {
  let pack = ["1b"];
  for (i in Bullets) {
    let bul = Bullets[i];
    pack.push(bul.x);
    pack.push(bul.y);
  }

  if (pack.length > 1) {
    io.sockets.emit("UpdatedPlr", msgpack.encode(pack));
  }
}

function bulletActions() {
  bulletCollidedWithPlayer();
  bulletCollidedWithBox();
  for (i in Bullets) {
    let bul = Bullets[i];
    if (!bul) {
      break;
    }
    if (bul.shouldDie <= new Date().getTime()) {
      //deleteBullet(Bullets[i]);
      let index = Bullets.indexOf(Bullets[i]);
      Bullets.splice(index, 1);
    }
    bul.updatePosition();
  }
  sendBullets();
}

function isBoxValid(x, y) {
  for (var j in Boxes) {
    let bx = Boxes[j];
    if (bx) {
      //top left
      if (x > bx.x && x < bx.x + bx.size && y > bx.y && y < bx.y + bx.size) {
        return false;
      }
      //bottom left
      if (
        x > bx.x &&
        x < bx.x + bx.size &&
        y + 90 > bx.y &&
        y + 90 < bx.y + bx.size
      ) {
        return false;
      }
      // top right
      if (
        x + 90 > bx.x &&
        x + 90 < bx.x + bx.size &&
        y > bx.y &&
        y < bx.y + bx.size
      ) {
        return false;
      }
      // bottom right
      if (
        x + 90 > bx.x &&
        x + 90 < bx.x + bx.size &&
        y + 90 > bx.y &&
        y + 90 < bx.y + bx.size
      ) {
        return false;
      }
    }
  }
  return true;
}

for (var i = 0; i < 15; i++) {
  let thisX = getRandomInt(0, 1410);
  let thisY = getRandomInt(0, 1410);
  let canPlace = false;

  while (canPlace == false) {
    if (isBoxValid(thisX, thisY) == false) {
      thisX = getRandomInt(0, 1410);
      thisY = getRandomInt(0, 1410);
    } else {
      canPlace = true;
    }
  }

  Boxes.push(new Box(thisX, thisY, 90));
}

let cols = 150; //columns in the grid
let rows = 150; //rows in the grid

var grid = new Array(cols); //array of all the grid points

let closedSet = [];

//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y) {
  this.x = x; //x location of the grid point
  this.y = y; //y location of the grid point
  this.f = 0; //total cost function
  this.g = 0; //cost function from start to the current grid point
  this.h = 0; //heuristic estimated cost function from current grid point to the goal
  this.neighbors = []; // neighbors of the current grid point
  this.parent = undefined; // immediate source of the current grid point

  // update neighbors array for a given grid point
  this.updateNeighbors = function (grid) {
    let i = this.x;
    let j = this.y;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
  };
}

//initializing the grid
function init(boxes) {
  //making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new GridPoint(i, j);
      for (var k in boxes) {
        if (
          i > boxes[k].x / 10 &&
          i < boxes[k].x / 10 + 9 &&
          j > boxes[k].y / 10 &&
          j < boxes[k].y / 10 + 9
        ) {
          closedSet.push(grid[i][j]);
        }
      }
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateNeighbors(grid);
    }
  }
}

init(Boxes);

for (let b = 1; b < 3; b++) {
  let canPlace = false;
  let ranX = getRandomInt(0, 1499);
  let ranY = getRandomInt(0, 1499);

  while (canPlace == false) {
    if (isBoxValid(ranX, ranY) == false) {
      ranX = getRandomInt(0, 1499);
      ranY = getRandomInt(0, 1499);
    } else {
      canPlace = true;
      break;
    }
  }

  Players["Bot" + b] = new Bot(
    ranX,
    ranY,
    0,
    "Bot" + b,
    90,
    "Bot",
    "StreetSweeper",
    100,
    Boxes
  );
  Players["Bot" + b].selectedGun.ammo = 0;
  Players["Bot" + b].needsMove = true;
}
//Players['Bot1'].findPathToPoint(29, 29);
//console.log(bot1.matrix);

function botStuff() {
  try {
    for (let b = 1; b < 3; b++) {
      if (!Players["Bot" + b]) {
        let canPlace = false;
        let ranX = getRandomInt(0, 1499);
        let ranY = getRandomInt(0, 1499);

        while (canPlace == false) {
          if (isBoxValid(ranX, ranY) == false) {
            ranX = getRandomInt(0, 1499);
            ranY = getRandomInt(0, 1499);
          } else {
            canPlace = true;
            break;
          }
        }

        Players["Bot" + b] = new Bot(
          ranX,
          ranY,
          0,
          "Bot" + b,
          90,
          "Bot",
          "StreetSweeper",
          100,
          Boxes
        );
        Players["Bot" + b].selectedGun.ammo = 0;
        Players["Bot" + b].needsMove = true;
      }
      if (Players["Bot" + b] && Players["Bot" + b].needsMove == true) {
        Players["Bot" + b].pickPoint(Boxes);
        moves = Players["Bot" + b].pathFinding(Boxes, grid, closedSet);
        //console.log("PATHFINDING COMPLETE");
        Players["Bot" + b].needsMove = false;
        Players["Bot" + b].nextMove(moves);
      }
    }
    botRotate();
    sendBots();
  } catch (er) {
    console.log("Bot error code: ", er);
  }
}

function botRotate() {
  for (let b = 1; b < 3; b++) {
    if (!Players["Bot" + b]) {
      continue;
    }
    let current;
    let currentD;
    for (let i in Players) {
      if (Players["Bot" + b] != Players[i]) {
        let distX = Math.pow(Players[i].x - Players["Bot" + b].x, 2);
        let distY = Math.pow(Players[i].y - Players["Bot" + b].y, 2);
        if (distX + distY < currentD || currentD == undefined) {
          currentD = distX + distY;
          current = Players[i];
        }
      }
    }
    Players["Bot" + b].faceDirection(Players[current.id]);
  }
}
function sendBots() {
  for (let b = 1; b < 3; b++) {
    if (!Players["Bot" + b]) {
      continue;
    }
    let plr = Players["Bot" + b];
    let pack = [
      plr.id,
      plr.x,
      plr.y,
      plr.rotation,
      plr.kills,
      plr.health,
      plr.name,
      plr.selectedGun,
      plr.isReloading,
    ];
    io.sockets.emit("UpdatedPlr", msgpack.encode(pack));
  }
}

io.on("connection", (socket) => {
  socket.on("ping", (callback) => {
    callback();
  });
});

var update = setInterval(function () {
  playerActions();
  bulletActions();
  botStuff();
  //console.log("Updated");
}, 1000 / 60);

var updateClients = setInterval(() => {
  io.local.emit("update");
}, 1000 / 30);
/*(async function () {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function prompt(message) {
    return new Promise((resolve, reject) => {
      rl.question(message, (answer) => {
        resolve(answer);
      });
    });
  }

  const availableCmd = ["getPlayers", "modifyPlayers"];
  function listCommands() {
    console.log("All Commands: ");
    for (i in availableCmd) {
      console.log(availableCmd[i]);
    }
  }
  function getPlayers() {
    console.log("Players: ");
    for (let i = 0; i < Object.keys(Players).length; i++) {
      console.log(
        `\n [${i}] ${Object.keys(Players)[i]}: ${Players[
          Object.keys(Players)[i]
        ].toString()}`
      );
    }
  }
  async function modifyPlayer() {
    let id = await prompt(
      "Enter Player id to modify (getPlayers finds that): "
    );
    let stat = await prompt(
      "Enter Stat to modify getPlayers lists all stats: "
    );
    var shouldGo = true;
    if (!Players[id]) {
      console.log("Player Not Found!");
      shouldGo = false;
    }
    if (Players[id]) {
      if (!Players[id][stat]) {
        console.log("Stat Not Found!");
        shouldGo = false;
      }
      if (shouldGo == true) {
        let mod = await prompt("Enter New Value: ");
        Players[id][stat] = mod;
      }
    }
  }
  async function evalCommand() {
    let cmd = await prompt("Enter Command to eval: ");
    eval(cmd);
  }
  while (true) {
    var cmd = await prompt("");
    switch (cmd) {
      case "help":
        listCommands();
        break;
      case "getPlayers":
        getPlayers();
        break;
      case "modifyPlayer":
        await modifyPlayer();
        break;
      case "eval":
        await evalCommand();
        break;
      default:
        console.log("Run help for a list of commands");
    }
  }
})();*/

// Import the functions you need from the SDKs you need
/*
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDILeKwGIXxnvCApp8jmE_UcsmleWkKnRI",
  authDomain: "terrible-shooters.firebaseapp.com",
  projectId: "terrible-shooters",
  storageBucket: "terrible-shooters.appspot.com",
  messagingSenderId: "984189853873",
  appId: "1:984189853873:web:7cf85cbcbd4c0614100290",
  measurementId: "G-JHVJCDW93Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/
