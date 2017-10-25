require('codemirror/mode/markdown/markdown');
const CodeMirror = require('codemirror');
const marked = require('marked');

module.exports = function MarkdownToy(playground) {
  this.playground = playground;
  this.playground.el.classList.add('wide');
  this.source = playground.el.querySelector('textarea');
  this.source.style.display = 'none';
  this.marked = marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  this.playground.box.innerHTML =
    '<div class="row">' +
      '<div class="columns medium-6">' +
        '<div class="editor-wrapper"></div>' +
        '<div class="stats"></div>' +
      '</div>' +
      '<div class="columns medium-6 markdown-preview-wrapper preview-wrapper">' +
        '<p class="markdown-preview-header preview-header">Náhled:</p>' +
        '<div class="markdown-preview preview"></div>' +
      '</div>' +
    '</div>';

  this.preview = this.playground.box.querySelector('.markdown-preview');
  this.stats = this.playground.box.querySelector('.stats');

  this.editor = CodeMirror(
    this.playground.box.querySelector('.editor-wrapper'),
    {
      value: this.source.value,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'markdown',
      viewportMargin: Infinity,
      readOnly: this.playground.mode === 'review'
    }
  );

  this.updatePreview = () => {
    const val = this.editor.getValue();
    this.preview.innerHTML = this.marked(val);

    const len = this.preview.textContent.replace(/\s+/g, ' ').length;
    this.stats.innerHTML = `<p>Počet znaků: ${len}</p>`;
  };

  this.editor.on('change', this.updatePreview.bind(this));
  this.updatePreview();

  this.save = () => {
    this.source.value = this.editor.getValue();
  };
};
