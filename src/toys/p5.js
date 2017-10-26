require('codemirror/mode/javascript/javascript');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');
window.JSHINT = require('jshint').JSHINT;
const cm = require('codemirror');
const p5 = require('p5');

const randomString = () => (Math.random() + 1).toString(36).substring(3);
let toy = null;

module.exports = function P5Toy(playground) {
  toy = this;
  this.id = `p5-${randomString()}`;
  this.playground = playground;
  this.source = playground.el.querySelector('textarea');
  this.source.style.display = 'none';
  this.playground.box.innerHTML =
    `<div class="row">
      <div class="editor-wrapper columns medium-6"></div>
      <div class="columns medium-6">
        <div id="${this.id}" class="p5js-preview" style="height: 400px; background: #eee"></div>
        <button class="button">&#9654; Spustit kód</button>
      </div>
    </div>`;
  this.canvasBox = this.playground.box.querySelector(`#${this.id}`);

  this.measure = () => {
    const w = this.playground.box.querySelector(`#${this.id}`).offsetWidth;
    const h = this.playground.box.querySelector(`#${this.id}`).offsetHeight;
    return { w, h };
  };

  this.sketch = new p5(defaultSketch, this.id);

  this.editor = cm(
    this.playground.box.querySelector('.editor-wrapper'),
    {
      value: this.source.value,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      lint: {
        strict: 'implied',
        globals: {
          window: false,
          document: false,
          p: false,
          toy: false
        }
      },
      gutters: ['CodeMirror-lint-markers'],
      viewportMargin: Infinity,
      readOnly: this.playground.mode === 'review'
    }
  );

  this.playground.box.querySelector('button').addEventListener('click', (e) => {
    const code = this.editor.getValue();
    this.sketch.remove();
    this.canvasBox.innerHTML = '';
    this.sketch = new p5((p) => { eval(code); }, this.id);
    e.preventDefault();
  });

  this.save = () => {
    this.source.value = this.editor.getValue();
  };
};

function defaultSketch(p) {
  p.setup = () => {
    const size = toy.measure();
    p.createCanvas(size.w, size.h);

    p.background(200);
    p.fill(100);
    p.noStroke();

    p.translate(p.width / 2, p.height / 2);
    p.triangle(30, 0, -30, 30, -30, -30);
  };
}
