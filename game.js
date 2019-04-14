const game = {
  start() {
    this.ctx = document.getElementById('game').getContext('2d');

    const bg = new Image();
    bg.src = 'img/bg.jpg';

    bg.onload = () =>
      window.requestAnimationFrame(() => {
        this.ctx.drawImage(bg, 0, 0);
      });
  }
};

window.addEventListener('load', () => {
  game.start();
});
