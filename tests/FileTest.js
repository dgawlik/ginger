const {assert} = require('chai');
const {File, extractFullLines} = require('../src/File.js');
const {range, openFilePromise} = require('../src/util.js');
const path = require('path');
const fs = require('fs');


class ProgressSubscriber {
  constructor(){
    this.received = [];
  }

  progress(progress){
    this.received.push(progress);
  }
}

describe('File', function() {

  it('scanFile() should find correct line beginnings and endings', function(done){
    let filePath = path.resolve('resources/file-test.log');
    let RAW_BLOCK_SIZE = 120;
    let file;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(function(){
        try {
          assert.equal(3, file.lineBeginnings[0]);
          assert.equal(109, file.lineBeginnings[1]);
          assert.equal(212, file.lineBeginnings[2]);
          assert.equal(107, file.lineEndings[0]);
          assert.equal(210, file.lineEndings[1]);
          assert.equal(316, file.lineEndings[2]);
          done();
        }
        catch (err){
          done(err);
        }
      });
  });

  it('readLine() should return correct line', function(done){
    let filePath = path.resolve('resources/file-test.log');
    let RAW_BLOCK_SIZE = 120;
    let file;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(() => file.readLine(2))
      .then(line => {
        try {
          assert.equal('22:09:45.048 [main] DEBUG io.netty.util.ResourceLeakDetector - -Dio.netty.leakDetection.targetRecords: 4',
          line);
          done();
        }
        catch (err){
          done(err);
        }
      });
  });

  it('readLines() should pick correct lines', function(done){
    let filePath = path.resolve('resources/file-test.log');
    let RAW_BLOCK_SIZE = 120;
    let file;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(() => file.readLines(range(0,3)))
      .then(lines => {
        try {
          let verifyLines = [
            '22:09:45.039 [main] DEBUG i.n.u.i.l.InternalLoggerFactory - Using SLF4J as the default logging framework',
            '22:09:45.047 [main] DEBUG io.netty.util.ResourceLeakDetector - -Dio.netty.leakDetection.level: simple',
            '22:09:45.048 [main] DEBUG io.netty.util.ResourceLeakDetector - -Dio.netty.leakDetection.targetRecords: 4'
          ];
          assert.deepEqual(verifyLines, lines);
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });

  it('readLines() should filter undefined lines', function(done){
    let filePath = path.resolve('resources/file-test.log');
    let RAW_BLOCK_SIZE = 120;
    let file;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(() => file.readLines([0, undefined, undefined]))
      .then(lines => {
        try {
          let verifyLines = [
            '22:09:45.039 [main] DEBUG i.n.u.i.l.InternalLoggerFactory - Using SLF4J as the default logging framework',
            ];
          assert.deepEqual(verifyLines, lines);
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });

  it('scanFile() should detect line ending', function(done){
    let windowsFilePath = path.resolve('resources/windows_ending.log');
    let linuxFilePath = path.resolve('resources/linux_ending.log');
    let RAW_BLOCK_SIZE = 120;
    let windowsFile, linuxFile;
    let promiseWindows = openFilePromise(windowsFilePath, 'r')
      .then(fd => {
        windowsFile = new File(fd, windowsFilePath, RAW_BLOCK_SIZE);
        return windowsFile.scanFile();
      });
    let promiseLinux = openFilePromise(linuxFilePath, 'r')
      .then(fd => {
        linuxFile = new File(fd, linuxFilePath, RAW_BLOCK_SIZE);
        return linuxFile.scanFile();
      });
    Promise.all([promiseWindows, promiseLinux])
      .then(() => {
        try {
          assert.equal(windowsFile.ending, windowsFile.WINDOWS_ENDING);
          assert.equal(linuxFile.ending, linuxFile.LINUX_ENDING);
          done();
        }
        catch(ex){
          done(ex);
        }
      });
  });

  it('checkFileSize() should return file size in bytes', function(done){
    let filePath = path.resolve('resources/file-test.log');
    let RAW_BLOCK_SIZE = 120;
    let file;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(() => file.checkFileSize())
      .then(size => {
        try {
          assert.deepEqual(size, 318);
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });

  it('scanFile() should notify progress subscriber', function(done){
    let filePath = path.resolve('resources/file-test.log');
    let RAW_BLOCK_SIZE = 120;
    let file;
    let progressSubscriber = new ProgressSubscriber();
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile(progressSubscriber);
      })
      .then(() => {
        try {
          let validProgress = [100.0/3, 200.0/3, 100];
          assert.deepEqual(validProgress, progressSubscriber.received);
          done();
        }
        catch(ex){
          done(ex);
        }
      });
  });

  it('find() returns matches', function(done){
    let filePath = path.resolve('resources/find-test.log');
    let RAW_BLOCK_SIZE = 1000;
    let file;
    openFilePromise(filePath, 'r')
      .then(fd => {
        file = new File(fd, filePath, RAW_BLOCK_SIZE);
        return file.scanFile();
      })
      .then(() => file.find("match", null))
      .then(function(matches){
        try {
          assert.equal(matches.lines.length, 2);
          assert.equal(matches.lines[0], 0);
          assert.equal(matches.lines[1], 2);
          assert.equal(matches.positions[0], 9);
          assert.equal(matches.positions[1], 4);
          done();
        }
        catch (err){
          done(err);
        }
      });
  });
});
