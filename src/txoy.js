const Toy = require('./toy.js');

function Txoy() {
  this.instances = [];

  Array.prototype.slice.call(document.querySelectorAll('.toy')).forEach((el) => {
    const p = new Toy(el);
    p.init();
    this.instances.push(p);
  });

  this.save = () => {
    this.instances.forEach((i) => {
      if (i) i.save();
    });
  };
}

module.exports = Txoy;
