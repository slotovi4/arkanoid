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
  run() {
    window.requestAnimationFrame(() => {
      this.render();
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
  x: 270,
  y: 320
};

window.addEventListener('load', () => {
  game.start();
});
