import Direction from "./Movement.js";
export default class Pacman {
  constructor(x, y, tileSize, speed, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.speed = speed;
    this.tileMap = tileMap;

    this.madeFirstMove = false;
    this.currentDirection = null;
    this.requestedDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.score = 0;

    this.pacmanRotation = this.Rotation.right;
    this.wakaSound = new Audio("../sfx/waka.wav");

    this.powerDotSound = new Audio("../sfx/power_dot.wav");
    this.powerDotActive = false;
    this.powerDotEnding = false;
    this.timers = [];

    this.eatGhostSound = new Audio("../sfx/eat_ghost.wav");

    this.eatFruit = new Audio("../sfx/eat_fruit.wav");

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }
    this.#eatDot();
    this.#eatPowerDot();
    this.#eatFruit();
    this.#eatGhost(enemies);

    const size = this.tileSize / 2;
    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );

    ctx.restore();
  }

  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "../img/pacman0.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "../img/pacman1.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "../img/pacman2.png";

    const pacmanImage4 = new Image();
    pacmanImage4.src = "../img/pacman1.png";

    this.pacmanImages = [
      pacmanImage1,
      pacmanImage2,
      pacmanImage3,
      pacmanImage4,
    ];

    this.pacmanImageIndex = 0;
  }

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  #keydown = (event) => {
    if (!this.madeFirstMove) document.getElementById("comienzo").innerHTML = "";

    this.madeFirstMove = true;
    //Up
    if (event.keyCode == 38) {
      if (this.currentDirection == Direction.down)
        this.currentDirection = Direction.up;
      this.requestedDirection = Direction.up;
    }
    //Down
    if (event.keyCode == 40) {
      if (this.currentDirection == Direction.up)
        this.currentDirection = Direction.down;
      this.requestedDirection = Direction.down;
    }
    //Left
    if (event.keyCode == 37) {
      if (this.currentDirection == Direction.right)
        this.currentDirection = Direction.left;
      this.requestedDirection = Direction.left;
    }
    //Right
    if (event.keyCode == 39) {
      if (this.currentDirection == Direction.left)
        this.currentDirection = Direction.right;
      this.requestedDirection = Direction.right;
    }
  };

  #move() {
    if (this.currentDirection !== this.requestedDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.collisionHandler(
            this.x,
            this.y,
            this.requestedDirection
          )
        )
          this.currentDirection = this.requestedDirection;
      }
    }

    if (this.tileMap.collisionHandler(this.x, this.y, this.currentDirection)) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 0;
      return;
    } else if (
      this.currentDirection != null &&
      this.pacmanAnimationTimer == null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentDirection) {
      case Direction.up:
        this.y -= this.speed;
        this.pacmanRotation = this.Rotation.up;
        break;
      case Direction.down:
        this.y += this.speed;
        this.pacmanRotation = this.Rotation.down;
        break;
      case Direction.left:
        this.x -= this.speed;
        this.pacmanRotation = this.Rotation.left;
        break;
      case Direction.right:
        this.x += this.speed;
        this.pacmanRotation = this.Rotation.right;
        break;
    }
  }

  #animate() {
    if (this.pacmanAnimationTimer == null) {
      return;
    }

    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer == 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;
      if (this.pacmanImageIndex == this.pacmanImages.length)
        this.pacmanImageIndex = 0;
    }
  }

  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
      //Play Sound & Add Score
      this.wakaSound.play();
      this.score += 10;
    }
  }

  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      //Play Sound & Add Score & Activate PowerUp
      this.powerDotSound.play();
      this.score += 20;
      this.powerDotActive = true;
      this.powerDotEnding = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotEnding = false;
      }, 1000 * 6);

      this.timers.push(powerDotTimer);

      let powerDotEndingTimer = setTimeout(() => {
        this.powerDotEnding = true;
      }, 1000 * 3);

      this.timers.push(powerDotEndingTimer);
    }
  }

  #eatFruit() {
    if (this.tileMap.eatFruit(this.x, this.y) && this.madeFirstMove) {
      //Play Sound & Add Score
      this.eatFruit.play();
      this.score += 200;
    }
  }

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        //Play Sound & Add Score
        this.eatGhostSound.play();
        this.score += 100;
      });
    }
  }
}
