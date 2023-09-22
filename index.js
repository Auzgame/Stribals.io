var express = require("express");

var app = express({ logger: true });
var serv = require("http").Server(app);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});
app.use(express.static("client"));
serv.listen(3000);
console.log("server started");
var SOCKET_LIST = [];
var Players = {};
var Bullets = [];

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

io.on("connection", function (socket) {
  console.log("connection: " + socket.id);
  SOCKET_LIST.push(socket);

  socket.on("disconnection", function () {
    console.log("disconnection: " + socket.id);
    let x = SOCKET_LIST.indexOf(socket);
    SOCKET_LIST.splice(x, 1);
  });
});

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
