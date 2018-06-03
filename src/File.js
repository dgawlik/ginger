const fs = require('fs');
const os = require('os');

class File {

  constructor(file, path, RAW_BLOCK_SIZE){
    this.file = file;
    this.path = path;
    this.RAW_BLOCK_SIZE = RAW_BLOCK_SIZE;
    this.block = Buffer.alloc(RAW_BLOCK_SIZE);

    this.LINUX_ENDING = "\n";
    this.WINDOWS_ENDING = "\r\n";
  }

  readLines(lines){
    let promises = lines.filter(i => this.lineBeginnings[i] !== undefined).map(i => this.readLine(i));
    return Promise.all(promises);
  }

  readLine(index){
    function promise(resolve, reject){
      let lineDescriptor = {
        'start': this.lineBeginnings[index],
        'end': this.lineEndings[index]
      };
      let length = lineDescriptor.end-lineDescriptor.start;
      let buffer = Buffer.alloc(length);
      fs.read(this.file, buffer, 0, length, lineDescriptor.start, (err, bytesRead, buffer) => {
        resolve(buffer.toString('utf8'));
      });
    }
    return new Promise(promise.bind(this));
  }

  checkFileSize(){
    function promise(resolve, reject){
      fs.stat(this.path, (err, stat) => {
        if(err){
          reject(err);
        }
        resolve(stat.size);
      });
    }
    return new Promise(promise.bind(this));
  }

  detectBom(){
    return new Promise((function(resolve, reject){
      let buffer = Buffer.alloc(3);
      fs.read(this.file, buffer, 0, 3, 0, (err, bytesRead, buffer) => {
        if(err || bytesRead < 3){
          resolve(false);
        }
        if(buffer.readUInt8(0) == parseInt("ef", 16)
          && buffer.readUInt8(1) == parseInt("bb", 16)
          && buffer.readUInt8(2) == parseInt("bf", 16)){
            resolve(true);
        }
        else {
          resolve(false);
        }
      });
    }).bind(this));
  }

  find(onFinish, match, progressSubscriber, fullSearch){
    function promise(resolve, reject){
      let marks = [];
      let pages = 0;
      function onRead(err, bytesRead, buffer){
        let totalPages = Math.ceil(this.fileSize / this.RAW_BLOCK_SIZE);
        if(bytesRead == 0){
          onFinish(marks);
          resolve();
          return;
        }
        let index = match(buffer, 0);
        if(index != -1 && !fullSearch){
          resolve();
          return;
        }

        while(index != -1){
          if(pages >= 1){
            marks.push(index + this.RAW_BLOCK_SIZE - this.BOM + (pages-1)*this.RAW_BLOCK_SIZE);
          }
          else{
            marks.push(index);
          }
          index = match(buffer, index+1);
        }

        this.block.fill(0);
        if(progressSubscriber){
          progressSubscriber.progress(100.0*(pages+1)/totalPages);
        }
        fs.read(this.file, this.block, 0, this.RAW_BLOCK_SIZE, this.RAW_BLOCK_SIZE*(++pages), onRead.bind(this));
      }
      this.checkFileSize()
        .then(size => {
          this.fileSize = size;
          return this.detectBom();
      }).then(isBom => {
          this.BOM = isBom ? 3 : 0;
          fs.read(this.file, this.block, 0, this.RAW_BLOCK_SIZE, this.BOM, onRead.bind(this));
        });
    }
    return new Promise(promise.bind(this));
  }

  scanFile(progressSubscriber){
    let matches = [-2];
    this.lineBeginnings = [];
    this.lineEndings = [];
    function onFinish(marks){
      matches = matches.concat(marks);
      for(let i=0;i<matches.length-1;i++){
        this.lineBeginnings.push(matches[i]+this.ending.length + this.BOM);
        this.lineEndings.push(matches[i+1] + this.BOM);
      }
    }

    function detectNewlines(buffer, start){
      let index = -1;
      if((index = buffer.indexOf("\r\n", 0)) != -1){
        this.ending = this.WINDOWS_ENDING;
      }
      else if((index = buffer.indexOf("\n", 0)) != -1){
        this.ending = this.LINUX_ENDING;
      }
      return index;
    }

    function matchNewlines(buffer, start){
      return buffer.indexOf(this.ending, start);
    }

    let that = this;
    function promise(resolve, reject){
      this.find(() => {}, detectNewlines.bind(that), null, false)
        .then(() => {
          return this.find(onFinish.bind(that), matchNewlines.bind(that), progressSubscriber, true)
        })
        .then(() => { resolve(); });
    }
    return new Promise(promise.bind(this));
  }
}


module.exports = {
  'File': File,
};
