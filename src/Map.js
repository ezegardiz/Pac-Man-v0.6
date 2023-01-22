import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import Direction from "./Movement.js";

//VARIABLES DECLARACIÓN ELEMENTOS

let wallsID = 24;
let pacmanID = 25;
let dotID = 26;
let powerDotID = 27;
let enemyID = 28;
let hollowID = 29;
let fruitID = 30;

export default class Map {
  constructor(tileSize) {
    this.tileSize = tileSize;

    this.yellowDot = new Image();
    this.yellowDot.src = "../img/yellowDot.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "../img/pinkDot.png";

    this.fruit = new Image();
    this.fruit.src = "../img/fruit.png";

    this.wall = [];

    let imgSrc = "../img/Wall0";
    for (let i = 0; i <= wallsID; i++) {
      this.wallImg = new Image();
      this.wallImg.src = imgSrc + i + ".png";
      this.wall[i] = this.wallImg;
    }

    this.powerDot = this.pinkDot;
    this.powerDotAnimationTimerDefault = 30;
    this.pinkWallAnimationTimer = 200;
    this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;

    this.dotsForFruit = 35;

    this.freeGhostTimer;
  }

  //0-3 - Esquinas vacías
  //4-7 - Esquinas con borde
  //8-11 - Rectas con borde
  //12-15 Rectas vacías
  //16-23 Rectas cerradas
  //24 - Muro Destructible
  //25 - Pac-Man
  //26 - bola
  //27 - boloncho
  //28 - enemigo
  //29 - hueco
  //30 - cereza
  map = [
    [4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 7],
    [10, 27, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 8],
    [10, 26, 0, 3, 26, 0, 13, 13, 13, 13, 13, 3, 26, 0, 3, 26, 8],
    [10, 26, 14, 12, 26, 1, 15, 15, 15, 15, 15, 2, 26, 14, 12, 26, 8],
    [10, 26, 1, 2, 26, 26, 26, 26, 26, 26, 26, 26, 26, 1, 2, 26, 8],
    [10, 26, 26, 26, 26, 26, 22, 24, 24, 24, 16, 26, 26, 26, 26, 26, 8],
    [10, 26, 0, 13, 3, 26, 10, 28, 29, 28, 8, 26, 0, 13, 3, 26, 8],
    [10, 26, 14, 29, 12, 26, 10, 28, 29, 28, 8, 26, 14, 29, 12, 26, 8],
    [10, 26, 1, 15, 2, 26, 5, 11, 11, 11, 6, 26, 1, 15, 2, 26, 8],
    [10, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 8],
    [10, 26, 0, 3, 26, 16, 26, 0, 13, 3, 26, 22, 26, 0, 3, 26, 8],
    [10, 26, 1, 2, 26, 8, 26, 14, 29, 12, 26, 10, 26, 1, 2, 26, 8],
    [10, 26, 26, 26, 26, 8, 26, 14, 29, 12, 26, 10, 26, 26, 26, 26, 8],
    [10, 26, 23, 11, 11, 6, 26, 1, 15, 2, 26, 5, 11, 11, 19, 26, 8],
    [10, 26, 26, 26, 26, 26, 26, 26, 25, 26, 26, 26, 26, 26, 26, 26, 8],
    [10, 26, 0, 3, 26, 23, 11, 19, 26, 23, 11, 19, 26, 0, 3, 26, 8],
    [10, 26, 14, 12, 26, 26, 26, 26, 26, 26, 26, 26, 26, 14, 12, 26, 8],
    [10, 26, 1, 2, 26, 27, 26, 22, 26, 16, 26, 27, 26, 1, 2, 26, 8],
    [10, 26, 26, 26, 26, 26, 26, 18, 26, 20, 26, 26, 26, 26, 26, 26, 8],
    [5, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 6],
  ];

  draw(ctx) {
    //console.log("Mapa dibujado");
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile <= wallsID) {
          this.#drawWall(ctx, column, row, this.tileSize, tile);
        } else if (tile === dotID) {
          this.#drawDot(ctx, column, row, this.tileSize);
        } else if (tile === powerDotID) {
          this.#drawPowerDot(ctx, column, row, this.tileSize);
        } else if (tile === fruitID) {
          this.#drawFruit(ctx, column, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, column, row, this.tileSize);
        }
      }
    }
  }

  #drawDot(ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnimationTimer--;
    if (this.powerDotAnimationTimer === 0) {
      this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot;
      } else {
        this.powerDot = this.pinkDot;
      }
    }
    ctx.drawImage(this.powerDot, column * size, row * size, size, size);
  }

  #drawWall(ctx, column, row, size, tile) {
    ctx.drawImage(
      this.wall[tile],
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "Black";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  #drawFruit(ctx, column, row, size) {
    if (this.#dotsLeft() <= this.dotsForFruit) {
      ctx.drawImage(this.fruit, column * size, row * size, size, size);
      console.log("Fruta dibujada");
    } else {
      this.#drawBlank(ctx, column, row, size);
    }
  }

  getPacman(speed) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === pacmanID) {
          this.map[row][column] = fruitID;
          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            speed,
            this
          );
        }
      }
    }
  }

  getEnemies(speed) {
    const enemies = [];
    const colores = ["red", "blue", "orange", "pink"];
    let i = 0;
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == enemyID) {
          this.map[row][column] = hollowID;
          enemies.push(
            new Enemy(
              colores[i],
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              speed,
              this
            )
          );
          console.log(colores[i]);
          i++;
          console.log(i);
        }
      }
    }
    return enemies;
  }

  enemyPos() {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == enemyID) {
          return this.map[row][column];
        }
      }
    }
  }

  pacmanPos() {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == pacmanID) {
          return this.map[row][column];
        }
      }
    }
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  collisionHandler(x, y, direction) {
    if (direction == null) return;

    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let column = 0,
        row = 0;
      let nextColumn = 0,
        nextRow = 0;

      switch (direction) {
        case Direction.right:
          nextColumn = x + this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case Direction.left:
          nextColumn = x - this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case Direction.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case Direction.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
      }

      const tile = this.map[row][column];

      if (tile <= wallsID) {
        return true;
      }
    }
    return false;
  }

  didWin() {
    return this.#dotsLeft() === 0;
  }

  #dotsLeft() {
    return this.map
      .flat()
      .filter((tile) => tile === dotID || tile === powerDotID).length;
  }

  eatDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === dotID) {
        this.map[row][column] = hollowID;
        console.log("Dots left: " + this.#dotsLeft());
        return true;
      }
    }
    return false;
  }

  eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];
      if (tile === powerDotID) {
        this.map[row][column] = hollowID;
        return true;
      }
    }
    return false;
  }

  eatFruit(x, y) {
    if (this.#dotsLeft() <= this.dotsForFruit) {
      const row = y / this.tileSize;
      const column = x / this.tileSize;
      if (Number.isInteger(row) && Number.isInteger(column)) {
        const tile = this.map[row][column];
        if (tile === fruitID) {
          this.map[row][column] = hollowID;
          console.log("Fruta comida");
          return true;
        }
      }
      return false;
    }
  }

  openWall() {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile == wallsID) {
          this.map[row][column] = hollowID;
        }
      }
    }
  }

  freeGhost(pause) {
    if (!pause) {
      this.pinkWallAnimationTimer--;
      if (this.pinkWallAnimationTimer === 0) {
        this.openWall();
      }
    }
  }
}
