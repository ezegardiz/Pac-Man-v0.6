import Map from "./Map.js";

const tileSize = 32;
const speed = 2;

window.addEventListener("click", startGame);

const text = document.getElementById("comienzo");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new Map(tileSize);
const pacman = tileMap.getPacman(speed);
const enemies = tileMap.getEnemies(speed);

let gameOver = false;
let gameWin = false;
const titleScreen = new Image();
titleScreen.src = "img/title.png";
const gameOverSound = new Audio("sfx/gameOver.wav");
const gameWinSound = new Audio("sfx/gameWin.wav");
const gameStartSound = new Audio("sfx/gameStart.wav");

let gameStart = false;
let startInterval;

function play() {
  if (gameStart) {
    function gameLoop() {
      drawGame();
      tileMap.freeGhost(pause());
      checkGameOver();
      checkGameWin();
      if (pacman.madeFirstMove) text.innerHTML = "Puntuacion: " + pacman.score;
    }

    function checkGameWin() {
      if (!gameWin) {
        gameWin = tileMap.didWin();
        if (gameWin) {
          gameWinSound.play();
          setInterval(function () {
            checkSounds(gameWinSound);
          }, 100);
        }
      }
    }

    function checkGameOver() {
      if (!gameOver) {
        gameOver = isGameOver();
        if (gameOver) {
          gameOverSound.play();
          setInterval(function () {
            checkSounds(gameOverSound);
          }, 100);
        }
      }
    }

    function checkSounds(audio) {
      console.log("checking audio");
      if (!isPlaying(audio)) {
        console.log("audio pausado: refrescando ventana");
        window.location.reload();
      }
    }

    function isGameOver() {
      return enemies.some(
        (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
      );
    }

    tileMap.setCanvasSize(canvas);
    setInterval(gameLoop, 1000 / 75);
  }
}

function startGame() {
  if (!gameStart) {
    console.log("comienzo");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStartSound.play();
    text.innerHTML = "";
    drawGame();
    startInterval = setInterval(function () {
      checkStart(gameStartSound);
    }, 100);
  }
}

function drawGame() {
  tileMap.draw(ctx);
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function isPlaying(audioElement) {
  return !audioElement.paused;
}

function checkStart() {
  pacman.madeFirstMove = false;
  if (!isPlaying(gameStartSound)) {
    clearInterval(startInterval);
    text.innerHTML = "¡Pulsa cualquier tecla para comenzar!";
    gameStart = true;
    play();
  }
}

window.onload = (event) => {
  tileMap.setCanvasSize(canvas);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    titleScreen,
    canvas.width / 2 - titleScreen.width / 2,
    canvas.height / 2 - titleScreen.height / 2
  );
  console.log("Página cargada");
};
