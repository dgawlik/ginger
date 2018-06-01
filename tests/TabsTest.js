
const Vue = require('vue/dist/vue.js');
const {assert} = require('chai');
const {tab} = require('../src/vue/components/tab.js');
const {tabs} = require('../src/vue/components/tabs.js');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

global.window = dom.window;
global.document = dom.window.document;

describe('Tabs', function() {

  it('<tabs> should create <tab> from props', function(done){

    const Constructor = Vue.extend(tabs)
    const vm = new Constructor({ propsData: {
      'tabs': [
        {name: "Tab 1", isActive: true},
        {name: "Tab 2", isActive: false}
      ]
    } });
    const renderer = require('vue-server-renderer').createRenderer();
    renderer.renderToString(vm).then(html => {
      try {
        let occ = html.match(/data-tabs/g);
        let occ2 = html.match(/data-tab(?!s)/g);
        assert.equal(occ.length, 1);
        assert.equal(occ2.length, 2);
        done();
      }
      catch (err){
        done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('<tab> should respond on hover', function(done){
    const Constructor = Vue.extend(tab)
    const vm = new Constructor({ propsData: {
      'name': 'Tab 1',
      'isActive': false
    } });
    vm.$mount();
    vm.onMouseEnter();
    const renderer = require('vue-server-renderer').createRenderer();
    renderer.renderToString(vm).then(html => {
      try {
        let occ = html.match(/fa-times-circle/g).length;
        assert.equal(1, occ);
        done();
      }
      catch (err){
        done(err);
      }
    }).catch(err => {
      done(err);
    });
  });
});
