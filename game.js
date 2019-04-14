const game = {
  ctx: null,
  platform: null,
  ball: null,
  sprites: {
    bg: null,
    ball: null,
    platform: null
  },

  init() {
    this.ctx = document.getElementById('game').getContext('2d');
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;

    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `img/${key}.png`;
      this.sprites[key].onerror = () => required--;
      this.sprites[key].onload = () => {
        loaded++;
        if (loaded >= required) callback();
      };
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
  },
  start() {
    this.init();
    this.preload(() => this.run());
  }
};

game.ball = {
  x: 320,
  y: 276
};

game.platform = {
  x: 280,
  y: 300
};

window.addEventListener('load', () => {
  game.start();
});
