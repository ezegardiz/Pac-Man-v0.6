import Direction from "./Movement.js";

export default class Enemy {
  constructor(color, x, y, tileSize, speed, tileMap) {
    this.color = color;
    console.log(this.color);
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.speed = speed;
    this.tileMap = tileMap;

    this.#loadImages(this.color);

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(Direction).length
    );

    this.directionTimerDefault = this.#random(10, 20);
    this.directionTimer = this.directionTimerDefault;

    this.scaredEndingTimerDefault = 10;
    this.scaredEndingTimer = this.scaredEndingTimerDefault;
  }

  draw(ctx, pause, pacman, color) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, pacman, color);
  }

  collideWith(pacman) {
    const size = this.tileSize / 2;
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  #setImage(ctx, pacman) {
    if (pacman.powerDotActive) {
      this.#setImagePowerDotActive(pacman);
    } else {
      this.image = this.ghost;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImagePowerDotActive(pacman) {
    if (pacman.powerDotEnding) {
      this.scaredEndingTimer--;
      if (this.scaredEndingTimer === 0) {
        this.scaredEndingTimer = this.scaredEndingTimerDefault;
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2;
        } else {
          this.image = this.scaredGhost;
        }
      }
    } else {
      this.image = this.scaredGhost;
    }
  }

  #move() {
    if (!this.tileMap.collisionHandler(this.x, this.y, this.movingDirection)) {
      switch (this.movingDirection) {
        case Direction.up:
          this.y -= this.speed;
          break;
        case Direction.down:
          this.y += this.speed;
          break;
        case Direction.left:
          this.x -= this.speed;
          break;
        case Direction.right:
          this.x += this.speed;
          break;
      }
    }

    // let comienzo = this.tileMap.enemyPos();
    // let fin = this.tileMap.pacmanPos();
    // //let finX = this.pacman.x;
    // //let finY = this.pacman.y;

    // astar.search(this.tileMap, comienzo, fin);
  }

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(Direction).length
      );
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (!this.tileMap.collisionHandler(this.x, this.y, newMoveDirection));
        this.movingDirection = newMoveDirection;
      }
    }
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #loadImages(color) {
    switch (color) {
      case "red":
        this.ghost = new Image();
        this.ghost.src = "img/red.png";
        console.log("Rojo cargado");
        break;
      case "orange":
        this.ghost = new Image();
        this.ghost.src = "img/orange.png";
        console.log("Naranja cargado");
        break;
      case "blue":
        this.ghost = new Image();
        this.ghost.src = "img/blue.png";
        console.log("Azul cargado");
        break;
      case "pink":
        this.ghost = new Image();
        this.ghost.src = "img/pink.png";
        console.log("Rosa cargado");
        break;
      default:
        this.ghost = new Image();
        this.ghost.src = "img/ghost.png";
    }

    this.scaredGhost = new Image();
    this.scaredGhost.src = "img/scared.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "img/scared2.png";

    this.image = this.ghost;
  }
}
