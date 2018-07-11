const fs = require('fs');
const {findLargestSmallerIndex} = require('./util.js');

class File {

  constructor (file, path, RAW_BLOCK_SIZE) {
    this.file = file;
    this.path = path;
    this.RAW_BLOCK_SIZE = RAW_BLOCK_SIZE;
    this.block = Buffer.alloc(RAW_BLOCK_SIZE);
    this.LINUX_ENDING = '\n';
    this.WINDOWS_ENDING = '\r\n';
  }

  readLines (lines) {
    let promises = lines.map(i => this.readLine(i));
    return Promise
      .all(promises)
      .then(lst => lst.filter(l => l !== undefined));
  }

  readLine (index) {
    function promise (resolve, reject) {
      if (
        index < 0 ||
        index >= this.lineBeginnings.length
      ) {
        resolve(undefined);
      }

      let lineStart = this.lineBeginnings[index],
        lineEnd = this.lineEndings[index],
        length = lineEnd - lineStart,
        buffer = Buffer.alloc(length);

      fs.read(this.file, buffer, 0, length, lineStart, (err, bytesRead, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString('utf8'));
      });
    }
    return new Promise(promise.bind(this));
  }

  checkFileSize () {
    function promise (resolve, reject) {
      fs.stat(this.path, (err, stat) => {
        if (err) {
          reject(err);
        }

        resolve(stat.size);
      });
    }
    return new Promise(promise.bind(this));
  }

  detectBom () {
    return new Promise((function (resolve) {
      let buffer = Buffer.alloc(3);
      fs.read(this.file, buffer, 0, 3, 0, (err, bytesRead, buffer) => {
        if (err || bytesRead < 3) {
          resolve(false);
        }

        return resolve(
          buffer.readUInt8(0) === parseInt('ef', 16) &&
          buffer.readUInt8(1) === parseInt('bb', 16) &&
          buffer.readUInt8(2) === parseInt('bf', 16)
        );
      });
    }).bind(this));
  }

  find (text, progressSubscriber) {

    function match (buffer, offset) {
      return buffer.indexOf(text, offset);
    }

    function promise (resolve) {
      this
        .findMarks(match.bind(this), true, progressSubscriber)
        .then(marks => {
          let lines = [],
            positions = [],
            lineToIndex = new Map(),
            it = 0;

          for (let mark of marks) {
            let lineIndex = findLargestSmallerIndex(this.lineBeginnings,
                0, this.lineBeginnings.length-1, mark),
              position = mark - this.lineBeginnings[lineIndex];

            lines.push(lineIndex);
            positions.push(position);
            if (!lineToIndex.has(lineIndex)) {
              lineToIndex.set(lineIndex, it);
            }

            it++;
          }
          this.matches = {lines, positions, lineToIndex};
          resolve({lines, positions, lineToIndex});
        });
    }
    return new Promise(promise.bind(this));
  }

  findMarks (match, fullSearch, progressSubscriber) {
    function promise (resolve, reject) {
      let marks = [],
        pages = 0;

      function onRead (err, bytesRead, buffer) {
        if (err) {
          reject(err);
        }

        let totalPages = Math.ceil(this.fileSize / this.RAW_BLOCK_SIZE),
          index = match(buffer, 0);

        if (bytesRead === 0) {
          resolve(marks);
          return;
        }

        if (index !== -1 && !fullSearch) {
          resolve(marks);
          return;
        }

        while (index !== -1) {
          if (pages >= 1) {
            marks.push(index + pages*this.RAW_BLOCK_SIZE);
          }
          else {
            marks.push(index + this.BOM);
          }

          index = match(buffer, index+1);
        }

        if (progressSubscriber) {
          progressSubscriber.progress(100.0*(pages+1)/totalPages);
        }

        this.block.fill(0);
        fs.read(this.file, this.block, 0, this.RAW_BLOCK_SIZE,
          this.RAW_BLOCK_SIZE*(++pages), onRead.bind(this));
      }

      this.checkFileSize()
        .then(size => {
          this.fileSize = size;
          return this.detectBom();
        })
        .then(isBom => {
          this.BOM = isBom ? 3 : 0;
          fs.read(this.file, this.block, 0, this.RAW_BLOCK_SIZE, this.BOM, onRead.bind(this));
        });
    }
    return new Promise(promise.bind(this));
  }

  scanFile (progressSubscriber) {
    function detectNewlines (buffer) {
      let index = -1;
      if ((index = buffer.indexOf('\r\n', 0)) !== -1) {
        this.ending = this.WINDOWS_ENDING;
      }
      else if ((index = buffer.indexOf('\n', 0)) !== -1) {
        this.ending = this.LINUX_ENDING;
      }
      return index;
    }

    function matchNewlines (buffer, start) {
      return buffer.indexOf(this.ending, start);
    }

    let that = this;
    function promise (resolve) {
      this
        .findMarks(detectNewlines.bind(that), false)
        .then(() => {
          return this.findMarks(matchNewlines.bind(that), true, progressSubscriber);
        })
        .then(marks => {
          let matches = [-this.ending.length+this.BOM].concat(marks),
            endingLength = this.ending.length,
            lineBeginnings = [],
            lineEndings = [];

          for (let i=0;i<matches.length-1;i++) {
            lineBeginnings.push(matches[i]+endingLength);
            lineEndings.push(matches[i+1]);
          }

          this.lineBeginnings = lineBeginnings;
          this.lineEndings = lineEndings;

          resolve();
        });
    }
    return new Promise(promise.bind(this));
  }
}


module.exports = {
  File
};
