
require('browser-env')();

const Vue = require('vue/dist/vue.js');
const {assert} = require('chai');
const {tab} = require('../src/vue/components/tab.js');
const {tabs} = require('../src/vue/components/tabs.js');
const {TabHolder} = require('../src/TabHolder.js');
const {delayed, dispatchEvent} = require('../src/util.js');
const {mainApp} = require('../src/vue/mainApp.js');
const path = require('path');


describe('Tabs', function() {

  let tabManager;
  let vm;

  function applicationWithOpenTwoTabs(){
    return new Promise(function(resolve, reject){
      global.tabManager = tabManager = new TabHolder();
      tabManager.addTab(path.resolve('./resources/apple.txt'), false)
        .then(() => {
          return tabManager.addTab(path.resolve('./resources/microsoft.txt'), false);
        })
        .then(() => {
          document.getElementById('content').innerHTML = `
          <tabs></tabs>
          <keep-alive>
            <component v-bind:is="display"></component>
          </keep-alive>
          <scrollbar></scrollbar>`;

          vm = new Vue(Object.assign({}, mainApp, {
            el: '#content'
          }));
          global.app = vm;

          vm.tabs.addTab(tabManager.tabs['apple.txt']);
          vm.tabs.addTab(tabManager.tabs['microsoft.txt']);

          delayed(10).then(() => resolve());
        });
    });
  }

  beforeEach(function() {
    let content = document.createElement('div');
    content.setAttribute("id", "content");
    document.body.appendChild(content);
    global.Vue = Vue;
  });

  afterEach(function() {
    vm.$destroy();
    document.body.innerHTML = "";
  });

  it('<tabs> should create <tab> from props', function(){

    let toBeRendered = '<div class="tabs"><div class="tabOuterContainer"><div class="tabTextHolder">Green</div> <div class="tabCloseBtn"><!----></div></div><div class="tabOuterContainer"><div class="tabTextHolder">Blue</div> <div class="tabCloseBtn"><i class="fas fa-times-circle"></i></div></div></div>';

    vm = new Vue(Object.assign({}, tabs, {
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

  it('switching non-virtual tab should update buffer', function(done){
    applicationWithOpenTwoTabs()
      .then(() => {
        assert.isOk(vm.$el.outerHTML.includes("Redmond"));
        dispatchEvent(document.querySelectorAll('.tabOuterContainer')[0], 'click');
        return delayed(10);
      })
      .then(() => {
        assert.isOk(vm.$el.outerHTML.includes("Cupertino, California"));
        done();
      });
  });

  it('closing tabs leaves empty buffer', function(done){
    applicationWithOpenTwoTabs()
      .then(() => {
        app.tabs.closeTab('apple.txt');
        app.tabs.closeTab('microsoft.txt');
        return delayed(10);
      })
      .then(() => {
        let toBeRendered = '<div id="content"><div class="tabs"></div> <div id="textBuffer"><div id="linesWrapper" style="top: 0px;"></div></div> <div class="scrollbar"><div class="thumb"></div></div></div>';
        assert.equal(toBeRendered, app.$el.outerHTML);
        done();
      });
  });

  it('settings tab displays valid page', function(done){
    applicationWithOpenTwoTabs()
      .then(() => {
        return tabManager.addTab('<Settings>', true)
          .then(() => {
            app.tabs.addTab(tabManager.tabs['<Settings>']);
            return delayed(10);
          });
      })
      .then(() => {
        assert.isOk(app.$el.outerHTML.includes('input-group'));
        done();
      })
      .catch(function(err){
        done(err);
      });
  });
});
