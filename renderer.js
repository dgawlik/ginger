// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const {dialog} = require('electron').remote
const {eventBus} = require('./src/vue/eventBus.js');
const dialog_ = require('./src/vue/dialogApp.js').dialog;

const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
           click () { onMenuOpenClick()}
        },
        {
          label: 'Settings',
           click () { onMenuSettingsClick()}
        },
        {
          label: 'Exit',
          click () { remote.getCurrentWindow().close()}
        }
      ]
    },
    {
      label: 'Actions',
      submenu: [
        {
          label: 'Colorize',
          click () { app.showColorize() }
        },
        {
          label: 'Find',
          click () { app.findKeyDown() }
        },
        {
          label: 'Go to line',
          click () { app.showGotoLine() }
        },
        {
          label: 'Bookmarks',
          click () { app.showBookmarks() }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'zoomin'},
        {role: 'zoomout'},
      ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

class $1{
  progress(val){
    eventBus.$emit('progressBar/updateProgress', val);
  }
}

function onMenuOpenClick(){
  let path = dialog.showOpenDialog({properties: ['openFile']});
  if(path && path[0]){
    window.dialog.show();
    dialog_.show('progress-component');
    tabManager.addTab(path[0], false, new $1())
      .then(name => {
        let tab = tabManager.tabs[name];
        dialog_.hide();
        eventBus.$emit('tabs/addTab', tab);
      });
  }
}
window.onOpen = onMenuOpenClick;

function onMenuSettingsClick(){
  tabManager.addTab("<Settings>", true)
    .then(name => {
      let tab = tabManager.tabs[name];
      eventBus.$emit('tabs/addTab', tab);
    });
}
window.onSettings = onMenuSettingsClick;
