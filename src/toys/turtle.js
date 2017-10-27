require('codemirror/mode/javascript/javascript');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');
window.JSHINT = require('jshint').JSHINT;
const cm = require('codemirror');
const p5 = require('p5');
const Turtle = require('p.turtle');

const randomString = () => (Math.random() + 1).toString(36).substring(3);
let toy = null;

module.exports = function TurtleToy(playground) {
  toy = this;
  this.id = `turtle-${randomString()}`;
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
    const w = this.canvasBox.offsetWidth;
    const h = this.canvasBox.offsetHeight;
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
          console: false,
          p: false,
          toy: false,
          Turtle: false
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
    this.sketch = new p5(function UserCode(p) { eval(code); }, this.id);
    e.preventDefault();
    e.stopPropagation();
  });

  this.save = () => {
    this.source.value = this.editor.getValue();
  };
};

function defaultSketch(p) {
  let turtle;
  let run;
  const size = toy.measure();

  p.setup = () => {
    p.createCanvas(size.w, size.h);

    p.background(200);
    p.angleMode(p.DEGREES);
    p.strokeWeight(10);

    turtle = new Turtle(p);
    run = turtle.getRun();

    turtle.penDown = false;
    turtle.back(70);
    turtle.left(90);

    turtle.penDown = true;
    for (let i = 0; i < 60; i += 1) {
      turtle.color = p.color(`hsb(${i * 6}, 100%, 100%)`);
      turtle.forward(8);
      turtle.right(360 / 60);
    }
    turtle.right(360);

    run.print();
  };
}
