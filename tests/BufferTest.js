
require('browser-env')();

const Vue = require('vue/dist/vue.js');
const {assert} = require('chai');
const {buffer} = require('../src/vue/components/buffer.js');
const {Screen} = require('../src/Screen.js');


describe('Buffer', function() {

  before(function() {
    let content = document.createElement('div');
    content.setAttribute("id", "content");
    document.body.appendChild(content);
  });

  after(function() {
    document.body.innerHTML = "";
  });

  it('<buffer> should render lines', function(){

    let toBeRendered = `<div id="textBuffer"><div id="linesWrapper"><p class="textBufferLine"><span class="lineNumber">0</span>
    Line 1
  </p><p class="textBufferLine"><span class="lineNumber">1</span>
    Line 2
  </p></div></div>`;

    let screen = new Screen();
    screen.boundaryLow = 0;
    screen.boundaryHigh = 2;
    screen.lines = ['Line 1', 'Line 2'];

    let vm = new Vue(Object.assign({}, buffer, {
      el: '#content',
      data: {
        screen,
        lineWraps: true
      }
    }));
    assert.equal(vm.$el.outerHTML, toBeRendered);
  });

});
