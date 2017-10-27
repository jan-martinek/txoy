require('codemirror/mode/javascript/javascript');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');
window.JSHINT = require('jshint').JSHINT;
const CodeMirror = require('codemirror');

module.exports = function JavasriptToy(playground) {
  this.playground = playground;
  this.source = playground.el.querySelector('textarea');
  this.source.style.display = 'none';

  this.playground.box.innerHTML =
    '<div class="editor-wrapper"></div>' +
    '<button type="button" class="button">&#9654; Spustit kód</button>';

  this.editor = CodeMirror(
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
          toy: false
        }
      },
      gutters: ['CodeMirror-lint-markers'],
      viewportMargin: Infinity,
      readOnly: this.playground.mode === 'review'
    }
  );

  this.code = null;

  this.playground.box.querySelector('button').addEventListener('click', (e) => {
    const code = this.editor.getValue();
    this.code = function UserCode() { eval(code); };
    this.code();
    e.preventDefault();
    e.stopPropagation();
  });

  this.save = () => {
    this.source.value = this.editor.getValue();
  };
};
