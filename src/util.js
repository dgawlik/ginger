const fs = require('fs');

function range (begin, end) {
  let lst = [];
  for (let i=begin;i<end;i++) {
    lst.push(i);
  }
  return lst;
}

function openFilePromise (filePath, mode) {
  return new Promise(function (resolve, reject) {
    fs.open(filePath, mode, function (err, fd) {
      if (err) {
        reject(err);
      }
      resolve(fd);
    });
  });
}

function findLargestSmallerIndex (arr, start, end, val) {
  if (end-start===1) {
    return arr[end] < val ? end : start;
  }
  let middle = Math.floor((end+start)/2);
  if (val < arr[middle]) {
    return findLargestSmallerIndex(arr, start, middle, val);
  }
  else {
    return findLargestSmallerIndex(arr, middle, end, val);
  }
}

function delayed (timeout) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), timeout);
  });
}

function dispatchEvent (el, evt) {
  let evObj = document.createEvent('Events');
  evObj.initEvent(evt, true, false);
  el.dispatchEvent(evObj);
}

function hashCode (...args) {
  args = args.map(v => String(v));
  args = args.reduce((a,v) => a+v, '');

  let hash = 0;
  if (args.length === 0) return hash;
  for (let i = 0; i < args.length; i++) {
    let chr   = args.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

module.exports = {
  range,
  openFilePromise,
  findLargestSmallerIndex,
  delayed,
  dispatchEvent,
  hashCode
};
