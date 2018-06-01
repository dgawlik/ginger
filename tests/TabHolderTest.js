const {assert} = require('chai');
const path = require('path');
const {TabHolder} = require('../src/TabHolder.js');

describe('TabHolder', function() {

  it('addTab() should get filename and read initial screen', function(done){
    let tabHolder = new TabHolder();
    tabHolder.addTab(path.resolve('resources/tab-holder-test1.log'), false)
      .then(() => tabHolder.addTab(path.resolve('resources/tab-holder-test2.log'), false))
      .then(() => {
        try {
          assert.equal(2, Object.keys(tabHolder.tabs).length);
          let tab1 = tabHolder.tabs['tab-holder-test1.log'];
          assert.equal(tab1.screen.lines[0], "22:09:45.039 [main] DEBUG i.n.u.i.l.InternalLoggerFactory - Using SLF4J as the default logging framework");
          let tab2 = tabHolder.tabs['tab-holder-test2.log'];
          assert.equal(tab2.screen.lines[0], "22:09:45.048 [main] DEBUG io.netty.util.ResourceLeakDetector - -Dio.netty.leakDetection.targetRecords: 4");
          done();
        }
        catch (err){
          done(err);
        }
      });
  });
});
