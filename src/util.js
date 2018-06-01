let fs = require('fs');

function range(begin, end){
  let lst = [];
  for(let i=begin;i<end;i++){
    lst.push(i);
  }
  return lst;
}

function openFilePromise(filePath, mode){
  return new Promise(function(resolve, reject){
    fs.open(filePath, mode, function(err, fd){
      if(err){
        reject(err);
      }
      resolve(fd);
    });
  });
}

function elementOuterHeight(el) {
  let css = window.getComputedStyle(el);
  let marginTop = parseInt(css.marginTop.replace('px', '')) || 0;
  let marginBottom = parseInt(css.marginBottom.replace('px', '')) || 0;
  let height = parseInt(css.height.replace('px', '')) || 0;
  return marginTop + height + marginBottom;
}

module.exports = {
  'range': range,
  'openFilePromise': openFilePromise,
  'elementOuterHeight': elementOuterHeight
};
