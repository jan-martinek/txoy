require('codemirror/mode/xml/xml');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/css/css');
require('codemirror/mode/sql/sql');

const CodeMirror = require('codemirror');

module.exports = function HighlightingToy(playground, lang) {
  this.playground = playground;
  this.source = playground.el.querySelector('textarea');
  this.source.style.display = 'none';

  this.lang = lang;
  this.editor = CodeMirror(this.playground.box, {
    value: this.source.value,
    lineNumbers: true,
    lineWrapping: true,
    mode: this.lang,
    viewportMargin: Infinity,
    readOnly: this.playground.mode === 'review'
  });

  this.save = () => {
    this.source.value = this.editor.getValue();
  };
};
