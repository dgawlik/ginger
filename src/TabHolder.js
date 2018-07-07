const path = require('path');
const {File} = require('./File.js');
const {Screen} = require('./Screen.js');
const {openFilePromise} = require('./util.js');

class TabHolder {
  constructor () {
    this.tabs = {};
  }

  addTab (name, isVirtual, progressSubscriber) {
    return new Promise((function (resolve, reject) {
      if (!isVirtual) {
        let basename = path.basename(name);
        let file, screen;
        openFilePromise(name, 'r')
          .then(fd => {
            file = new File(fd, name, 10*1024*1024);
            return file.scanFile(progressSubscriber);
          })
          .then(() => {
            screen = new Screen(100, file);
            return screen.init();
          })
          .then(() => {
            this.tabs[basename] = {
              'name': basename,
              'path': name,
              'screen': screen,
              'offset': 0,
              'isVirtual': false
            };
            resolve(basename);
          })
          .catch(err => reject(err));
      }
      else {
        this.tabs[name] = {
          'name': name,
          'isVirtual': true
        };
        resolve(name);
      }
    }).bind(this));
  }

  removeTab (name) {
    delete this.tabs[name];
  }
}

module.exports = {
  'TabHolder': TabHolder
};
