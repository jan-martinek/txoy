const autosize = require('autosize');

module.exports = function PlaintextToy(playground) {
  this.playground = playground;
  this.source = playground.el.querySelector('textarea');
  this.source.classList.add('plaintext');
  autosize(this.source);

  this.playground.box.innerHTML = '<div class="stats"></div>';
  this.stats = this.playground.box.querySelector('.stats');
  this.statsCalcTimer = null;
  this.statsCalcInterval = 530;

  if (playground.mode === 'review') {
    this.source.setAttribute('readonly', 'true');
  }

  this.calcStats = () => {
    const len = this.source.value.replace(/\s+/g, ' ').length;
    this.stats.innerHTML = `<p>Počet znaků: ${len}</p>`;
  };

  this.calcStats();

  this.source.addEventListener('keyup', () => {
    this.statsCalcTimer = window.setTimeout(
      this.calcStats.bind(this),
      this.statsCalcInterval
    );
  });

  this.source.addEventListener('change', () => {
    this.statsCalcTimer = window.setTimeout(
      this.calcStats.bind(this),
      this.statsCalcInterval
    );
  });

  this.source.addEventListener('keydown', () => {
    window.clearTimeout(this.statsCalcTimer);
  });

  this.save = () => {};
};
