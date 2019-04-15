const KEYS = {
  LEFT: 37,
  RIGHT: 39
};

const game = {
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  rows: 4,
  cols: 8,
  sprites: {
    bg: null,
    ball: null,
    platform: null,
    block: null
  },

  init() {
    this.ctx = document.getElementById('game').getContext('2d');
    this.setEvents();
  },
  setEvents() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
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
          y: 24 * row + 35
        });
      }
    }
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;
    const onImgLoad = () => {
      loaded++;
      if (loaded >= required) callback();
    };

    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `img/${key}.png`;
      this.sprites[key].onload = onImgLoad;
    }
  },
  update() {
    this.platform.move();
  },
  run() {
    window.requestAnimationFrame(() => {
      this.update();
      this.render();
      this.run();
    });
  },
  render() {
    this.ctx.drawImage(this.sprites.bg, 0, 0);
    this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.renderBlocks();
  },
  renderBlocks() {
    for (let block of this.blocks) {
      this.ctx.drawImage(this.sprites.block, block.x, block.y);
    }
  },
  start() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  }
};

game.ball = {
  x: 308,
  y: 296
};

game.platform = {
  velocity: 6,
  dx: 0,
  x: 270,
  y: 320,
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
      game.ball.x += this.dx;
    }
  }
};

window.addEventListener('load', () => {
  game.start();
});
