const {assert} = require('chai');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');

const {Screen} = require('../src/Screen.js');
const {File} = require('../src/File.js');
const {range, openFilePromise} = require('../src/util.js');


describe('Screen', function() {

  it('init() should should read first page', function(done){
    let filePath = path.resolve('resources/screen-test.log');
    let RAW_BLOCK_SIZE = 10000;
    let LINES_PAGE = 10;
    let file, screen;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(function(){
        screen = new Screen(LINES_PAGE, file);
        return screen.init();
      })
      .then(function(){
        try{
          assert.equal(10, screen.lines.length);
          done();
        }
        catch(err){
          done(err);
        }
      })

  });


    it('readNextPage() should append page for the first time', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.init();
        })
        .then(() => screen.readNextPage())
        .then(function(){
          try{
            assert.equal(20, screen.lines.length);
            assert.equal(0, screen.boundaryLow);
            assert.equal(20, screen.boundaryHigh);
            done();
          }
          catch(err){
            done(err);
          }
        })

    });

    it('readNextPage() should append last page and remove heading page', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.init();
        })
        .then(() => screen.readNextPage())
        .then(() => screen.readNextPage())
        .then(function(){
          try{
            assert.equal(20, screen.lines.length);
            assert.equal(10, screen.boundaryLow);
            assert.equal(30, screen.boundaryHigh);
            assert.equal("22:09:45.084 [main] DEBUG i.n.util.internal.PlatformDependent0 - java.nio.Bits.unaligned: available, true",
                        screen.lines[0]);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('readPrevPage() should append first page and remove last page', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.init();
        })
        .then(() => screen.readNextPage())
        .then(() => screen.readNextPage())
        .then(() => screen.readPrevPage())
        .then(function(){
          try{
            assert.equal(20, screen.lines.length);
            assert.equal(0, screen.boundaryLow);
            assert.equal(20, screen.boundaryHigh);
            assert.equal("22:09:45.039 [main] DEBUG i.n.u.i.l.InternalLoggerFactory - Using SLF4J as the default logging framework",
                        screen.lines[0]);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('readRandomAt() should should read page from offset', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.readRandomAt(1);
        })
        .then(function(){
          try{
            assert.equal(10, screen.lines.length);
            assert.equal(1, screen.boundaryLow);
            assert.equal(11, screen.boundaryHigh);
            assert.equal("22:09:45.047 [main] DEBUG io.netty.util.ResourceLeakDetector - -Dio.netty.leakDetection.level: simple",
                        screen.lines[0]);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('readRandomAt() should should read page from offset', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.readRandomAt(1);
        })
        .then(function(){
          try{
            assert.equal(10, screen.lines.length);
            assert.equal(1, screen.boundaryLow);
            assert.equal(11, screen.boundaryHigh);
            assert.equal("22:09:45.047 [main] DEBUG io.netty.util.ResourceLeakDetector - -Dio.netty.leakDetection.level: simple",
                        screen.lines[0]);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });


    it('readRandomAt() should trim buffer at line ending', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.readRandomAt(206);
        })
        .then(function(){
          try{
            assert.equal(5, screen.lines.length);
            assert.equal(206, screen.boundaryLow);
            assert.equal(211, screen.boundaryHigh);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('readPrevPage() shouldn\'t read past beginning of file', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.readRandomAt(3);
        })
        .then(() => screen.readPrevPage())
        .then(function(){
          try{
            assert.equal(13, screen.lines.length);
            assert.equal(0, screen.boundaryLow);
            assert.equal(13, screen.boundaryHigh);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('readNextPage() shouldn\'t read past end of file', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.readRandomAt(205);
        })
        .then(() => screen.readNextPage())
        .then(function(){
          try{
            assert.equal(6, screen.lines.length);
            assert.equal(205, screen.boundaryLow);
            assert.equal(211, screen.boundaryHigh);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('update() cursor passing boundaryHigh should trigger loading new page', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen, spy;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          spy = sinon.spy(screen, 'readNextPage');
          return screen.readRandomAt(0);
        })
        .then(() => {
          screen.cursor = 0;
          return screen.update(1);
        })
        .then(function(){
          try{
            assert.isTrue(spy.called);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('update() cursor passing boundaryLow should trigger loading new page', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen, spy;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          spy = sinon.spy(screen, 'readPrevPage');
          return screen.readRandomAt(30);
        })
        .then(() => {
          screen.cursor = 30;
          return screen.update(29);
        })
        .then(function(){
          try{
            assert.isTrue(spy.called);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });

    it('update() cursor inside boundaryLow and boundaryHigh will not trigger loading new page', function(done){
      let filePath = path.resolve('resources/screen-test.log');
      let RAW_BLOCK_SIZE = 10000;
      let LINES_PAGE = 10;
      let file, screen, spy, spy2;
      openFilePromise(filePath, 'r')
        .then(fd => {
          file = new File(fd, filePath, RAW_BLOCK_SIZE);
          return file.scanFile();
        })
        .then(function(){
          screen = new Screen(LINES_PAGE, file);
          return screen.readRandomAt(30);
        })
        .then(() => {
          return screen.update(31);
        })
        .then(() => {
          spy = sinon.spy(screen, 'readPrevPage');
          spy2 = sinon.spy(screen, 'readNextPage');
          return screen.update();
        })
        .then(function(){
          try{
            assert.isFalse(spy.called);
            assert.isFalse(spy2.called);
            done();
          }
          catch(err){
            done(err);
          }
        })
    });
});
