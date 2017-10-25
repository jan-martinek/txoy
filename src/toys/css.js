require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
const CodeMirror = require('codemirror');

module.exports = function CssToy(playground) {
  this.playground = playground;
  this.playground.el.classList.add('wide');

  this.source = playground.el.querySelector('textarea');
  this.source.style.display = 'none';

  this.separator = '\n\n###css###\n\n';
  this.previewId = `css-preview-${Math.round(Math.random() * 1000000)}`;

  this.playground.box.innerHTML =
    '<div class="row">' +
      '<div class="columns medium-4">' +
        '<p><span class="preview-header">HTML</span></p>' +
        '<div class="html-editor-wrapper editor-wrapper"></div>' +
      '</div>' +
      '<div class="columns medium-4">' +
        '<p><span class="preview-header">CSS</span></p>' +
        '<div class="css-editor-wrapper editor-wrapper"></div>' +
      '</div>' +
      '<div class="columns medium-4">' +
        '<p><span class="preview-header">Náhled</span></p>' +
        '<div class="css-preview preview"><style></style><div class="css-preview-wrapper"></div></div>' +
      '</div>' +
      '<div class="columns stats"></div>' +
    '</div>';


  this.preview = this.playground.box.querySelector('.css-preview');

  this.preview.setAttribute('id', this.previewId);
  this.previewStyle = this.preview.querySelector('style');
  this.previewHtml = this.preview.querySelector('div');


  this.initEditors = function initEditors() {
    let html;
    let css;

    if (this.source.value.match(this.separator)) {
      const source = this.source.value.split(this.separator);
      [html, css] = source;
    } else {
      html = this.source.value;
      css = '';
    }

    this.htmlEditor = CodeMirror(
      this.playground.box.querySelector('.html-editor-wrapper'),
      {
        value: html,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'htmlmixed',
        viewportMargin: Infinity,
        readOnly: this.playground.mode === 'review'
      }
    );

    this.cssEditor = CodeMirror(
      this.playground.box.querySelector('.css-editor-wrapper'),
      {
        value: css,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'css',
        viewportMargin: Infinity,
        readOnly: this.playground.mode === 'review'
      }
    );
  };

  this.initEditors();

  this.updatePreview = () => {
    this.previewHtml.innerHTML = this.htmlEditor.getValue();

    const css = this.cssEditor.getValue();
    this.previewStyle.innerHTML = css.replace(/(([^\r\n,{}]+)(,(?=[^}]*{)|\s*{))/g, `#${this.previewId} $1`);
  };

  this.htmlEditor.on('change', this.updatePreview.bind(this));
  this.cssEditor.on('change', this.updatePreview.bind(this));
  this.updatePreview();

  this.save = () => {
    this.source.value = this.htmlEditor.getValue() + this.separator + this.cssEditor.getValue();
  };
};
