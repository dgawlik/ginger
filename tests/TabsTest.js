
require('browser-env')();

const Vue = require('vue/dist/vue.js');
const {assert} = require('chai');
const {tab} = require('../src/vue/components/tab.js');
const {tabs} = require('../src/vue/components/tabs.js');


describe('Tabs', function() {

  before(function() {
    let content = document.createElement('div');
    content.setAttribute("id", "content");
    document.body.appendChild(content);
  });

  after(function() {
    document.body.innerHTML = "";
  });

  it('<tabs> should create <tab> from props', function(){

    let toBeRendered = '<div class="tabs"><div class="tabOuterContainer"><div class="tabTextHolder">Green</div> <div class="tabCloseBtn"><!----></div></div><div class="tabOuterContainer"><div class="tabTextHolder">Blue</div> <div class="tabCloseBtn"><i class="fas fa-times-circle"></i></div></div></div>';

    let vm = new Vue(Object.assign(tabs, {
      el: '#content',
      data: {
        tabs : [
          {
            name: "Green",
            isActive: false
          },
          {
            name: "Blue",
            isActive: true
          }
        ]
      }
    }));
    assert.equal(vm.$el.outerHTML, toBeRendered);
  });

});
