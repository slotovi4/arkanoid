const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
};

const game = {
  running: true,
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  score: 0,
  rows: 4,
  cols: 8,
  width: 640,
  height: 395,
  sprites: {
    bg: null,
    ball: null,
    platform: null,
    block: null
  },
  sounds: {
    bump: null
  },

  init() {
    this.ctx = document.getElementById('game').getContext('2d');
    this.setEvents();
  },
  setEvents() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === KEYS.SPACE) {
        this.platform.fire();
      } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
        this.platform.start(e.keyCode);
      }
    });

    window.addEventListener('keyup', e => {
      this.platform.stop();
    });
  },
  create() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          x: 64 * col + 65,
          y: 24 * row + 35,
          width: 60,
          height: 20,
          active: true
        });
      }
    }
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;
    required += Object.keys(this.sounds).length;

    const onResourceLoad = () => {
      loaded++;
      if (loaded >= required) callback();
    };

    this.preloadSprites(onResourceLoad);
    this.preloadAudio(onResourceLoad);
  },
  preloadSprites(onResourceLoad) {
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `img/${key}.png`;
      this.sprites[key].addEventListener('load', onResourceLoad);
    }
  },
  preloadAudio(onResourceLoad) {
    for (let key in this.sounds) {
      this.sounds[key] = new Audio(`sounds/${key}.mp3`);
      this.sounds[key].addEventListener('canplaythrough', onResourceLoad, {
        once: true
      });
    }
  },
  update() {
    this.collideBlocks();
    this.collidePlatform();
    this.ball.collideWorldBounds();
    this.platform.collideWorldBounds();
    this.platform.move();
    this.ball.move();
  },
  addScore() {
    ++this.score;

    if (this.score >= this.blocks.length) {
      this.end('You win!');
    }
  },
  collideBlocks() {
    for (let block of this.blocks) {
      if (block.active && this.ball.collide(block)) {
        this.ball.bumpBlock(block);
        this.addScore();
        this.sounds.bump.play();
      }
    }
  },
  collidePlatform() {
    if (this.ball.collide(this.platform)) {
      this.ball.bumpPlatform(this.platform);
      this.sounds.bump.play();
    }
  },
  run() {
    if (this.running) {
      window.requestAnimationFrame(() => {
        this.update();
        this.render();
        this.run();
      });
    }
  },
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.bg, 0, 0);
    this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.renderBlocks();
  },
  renderBlocks() {
    for (let block of this.blocks) {
      if (block.active) {
        this.ctx.drawImage(this.sprites.block, block.x, block.y);
      }
    }
  },
  start() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  },
  end(message) {
    this.running = false;
    alert(message);
    window.location.reload();
  },
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};

game.ball = {
  velocity: 3,
  dx: 0,
  dy: 0,
  x: 308,
  y: 295,
  width: 25,
  height: 25,
  start() {
    this.dy = -this.velocity;
    this.dx = game.random(-this.velocity, this.velocity);
  },
  move() {
    if (this.dy) this.y += this.dy;
    if (this.dx) this.x += this.dx;
  },
  collide(element) {
    const x = this.x + this.dx;
    const y = this.y + this.dy;

    if (
      x + this.width > element.x &&
      x < element.x + element.width &&
      y + this.height > element.y &&
      y < element.y + element.height
    ) {
      return true;
    }
    return false;
  },
  collideWorldBounds() {
    const x = this.x + this.dx;
    const y = this.y + this.dy;

    const ballBottom = y + this.height;
    const ballRight = x + this.width;
    const ballLeft = x;
    const ballTop = y;

    const worldLeft = 0;
    const worldTop = 0;
    const worldRight = game.width;
    const worldBottom = game.height;

    if (ballLeft < worldLeft) {
      this.x = 0;
      this.dx = this.velocity;
      game.sounds.bump.play();
    } else if (ballRight > worldRight) {
      this.x = worldRight - this.width;
      this.dx = -this.velocity;
      game.sounds.bump.play();
    } else if (ballTop < worldTop) {
      this.y = 0;
      this.dy = this.velocity;
      game.sounds.bump.play();
    } else if (ballBottom > worldBottom) {
      game.end('Game over!');
    }
  },
  bumpBlock(block) {
    this.dy *= -1;
    block.active = false;
  },
  bumpPlatform(platform) {
    if (platform.dx) {
      this.x += platform.dx;
    }
    if (this.dy > 0) {
      const touchX = this.x + this.width / 2;

      this.dy = -this.velocity;
      this.dx = this.velocity * platform.getTouchOffset(touchX);
    }
  }
};

game.platform = {
  velocity: 6,
  dx: 0,
  x: 270,
  y: 320,
  width: 100,
  height: 14,
  ball: game.ball,
  fire() {
    if (this.ball) {
      this.ball.start();
      this.ball = null;
    }
  },
  start(direction) {
    if (direction === KEYS.LEFT) {
      this.dx = -this.velocity;
    } else if (direction === KEYS.RIGHT) {
      this.dx = this.velocity;
    }
  },
  stop() {
    this.dx = 0;
  },
  move() {
    if (this.dx) {
      this.x += this.dx;
      if (this.ball) this.ball.x += this.dx;
    }
  },
  getTouchOffset(x) {
    const diff = this.x + this.width - x;
    const offset = this.width - diff;
    const result = (offset * 2) / this.width;

    return result - 1;
  },
  collideWorldBounds() {
    const x = this.x + this.dx;
    const platformLeft = x;
    const platformRight = platformLeft + this.width;
    const worldLeft = 0;
    const worldRight = game.width;

    if (platformLeft < worldLeft || platformRight > worldRight) {
      this.dx = 0;
    }
  }
};

window.addEventListener('load', () => {
  game.start();
});
