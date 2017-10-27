const toys = require('./toys/all');

function Toy(el) {
  this.el = el;
  this.box = null;
  this.toy = null;

  this.answerId = el.dataset.answer;
  this.answered = el.dataset.answered === "1";
  this.mode = el.dataset.mode;
  this.toyName = el.dataset.toy;

  this.init = () => {
    this.box = document.createElement('DIV');
    this.box.classList.add('box');
    this.el.appendChild(this.box);

    this.fetchToy();
    this.addPrefillAccess();
    this.indicateUntouched();
  };

  this.fetchToy = () => {
    switch (this.toyName) {
      case 'code':
      case 'css':
      case 'sql':
      case 'xml':
        this.toy = new toys.HighlightingToy(this, this.toyName);
        break;
      case 'livecss':
        this.toy = new toys.CssToy(this);
        break;
      case 'html':
        this.toy = new toys.HighlightingToy(this, 'htmlmixed');
        break;
      case 'markdown':
        this.toy = new toys.MarkdownToy(this);
        break;
      case 'javascript':
        this.toy = new toys.JavascriptToy(this);
        break;
      case 'turtle':
        this.toy = new toys.TurtleToy(this);
        break;
      case 'p5':
        this.toy = new toys.P5Toy(this);
        break;
      case 'plaintext':
        this.toy = new toys.PlaintextToy(this);
        break;
      default:
        console.log(`Toy "${this.toyName}" not found . Using plain.`);
    }
  };

  this.addPrefillAccess = () => {
    const prefill = this.el.querySelector('.prefill');

    if (prefill && prefill.querySelector('pre').innerHTML !== '') {
      const showPrefill = document.createElement('BUTTON');
      showPrefill.classList.add('showPrefill');
      showPrefill.classList.add('secondary');
      showPrefill.innerHTML = '{ }  Zobrazit předvyplněný kód'; // TRANSLATE _messages.solution.viewPrefill
      this.box.insertBefore(showPrefill, this.box.childNodes[0]);

      const hidePrefill = document.createElement('BUTTON');
      hidePrefill.classList.add('secondary');
      hidePrefill.innerHTML = '✕';
      prefill.appendChild(hidePrefill);

      showPrefill.addEventListener('click', (e) => {
        const pf = this.el.querySelector('.prefill');
        pf.style.display = 'block';

        e.target.style.display = 'none';

        e.preventDefault();
      });

      hidePrefill.addEventListener('click', (e) => {
        const pf = this.el.querySelector('.prefill');
        pf.style.display = 'none';

        const btn = this.el.querySelector('.showPrefill');
        btn.style.display = 'inline-block';

        e.preventDefault();
      });
    }
  };

  this.indicateUntouched = () => {
    if (this.mode === 'review' && !this.answered) {
      const untouched = document.createElement('DIV');
      untouched.classList.add('panel');
      untouched.classList.add('callout');
      untouched.innerHTML = '<p style="color: #aaa">U tohoto úkolu nebyly uloženy žádné změny.</p>'; // _messages.unit.notAnswered

      this.box.insertBefore(untouched, this.box.childNodes[0]);
    }
  };

  this.post = (path, params, target) => {
    const method = 'post';

    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);
    form.setAttribute('target', target);

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  };

  this.save = () => {
    if (this.toy) {
      this.toy.save();
    }
  };
}

module.exports = Toy;
