let {range} = require('./util.js');

class Screen {

  constructor(pageSize, file){
    this.pageSize = pageSize;
    this.file = file;
  }

  init(){
    return this.readRandomAt(0);
  }

  update(newCursorPos){
    return new Promise((function(resolve, reject){
      if(newCursorPos < this.boundaryLow){
        //boundaryLow should be 0 at minimum
        if(this.boundaryLow > 0){
          this.readPrevPage()
            .then(() => {
              this.cursor = newCursorPos;
              resolve('loaded');
            })
        }
        else {
          resolve('no');
        }
      }
      else if(newCursorPos + this.pageSize > this.boundaryHigh){
        if(this.boundaryHigh < this.file.lineBeginnings.length){
          this.readNextPage()
            .then(() => {
              this.cursor = newCursorPos;
              resolve('loaded');
            })
        }
        else if(newCursorPos < this.boundaryHigh){
          this.cursor = newCursorPos;
          resolve('cursor-moved');
        }
        else {
          resolve('no');
        }
      }
      else {
        this.cursor = newCursorPos;
        resolve('cursor-moved');
      }
    }).bind(this));
  }

  readRandomAt(beginning){
    return new Promise((function(resolve, reject){
      this.boundaryLow = beginning;
      this.cursor = beginning;

      if(beginning + this.pageSize > this.file.lineBeginnings.length){
        this.boundaryHigh = this.file.lineBeginnings.length;
      }
      else {
        this.boundaryHigh = beginning + this.pageSize;
      }

      this.file.readLines(range(this.boundaryLow, this.boundaryHigh))
        .then(lines => {
          this.lines = lines;
          resolve();
        })
    }).bind(this));
  }

  readNextPage(){
    return new Promise((function(resolve, reject){
      if(this.boundaryHigh - this.boundaryLow+1 >= 2*this.pageSize){
        this.lines = this.lines.slice(this.pageSize);
        this.boundaryLow += this.pageSize;
      }
      this.file.readLines(range(this.boundaryHigh, this.boundaryHigh+this.pageSize))
        .then(lines => {
          if(lines.length != this.pageSize){
            this.boundaryHigh = this.boundaryHigh + lines.length;
          }
          else {
            this.boundaryHigh = this.boundaryHigh + this.pageSize;
          }

          this.lines = this.lines.concat(lines);
          let isNew = lines.length == 0;
          resolve(isNew);
        })
    }).bind(this));
  }

  readPrevPage(){
    return new Promise((function(resolve, reject){
      if(this.boundaryHigh - this.boundaryLow >= 2*this.pageSize){
        this.lines = this.lines.slice(0,this.pageSize);
        this.boundaryHigh -= this.pageSize;
      }
      this.file.readLines(range(this.boundaryLow-this.pageSize, this.boundaryLow))
        .then(lines => {
          if(lines.length != this.pageSize){
            this.boundaryLow = 0;
          }
          else {
            this.boundaryLow -= this.pageSize;
          }
          this.lines = lines.concat(this.lines);
          let isNew = lines.length == 0;
          resolve(isNew);
        });
    }).bind(this));
  }
}

module.exports = {
  'Screen' : Screen
}
