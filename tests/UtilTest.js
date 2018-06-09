const {assert} = require('chai');
const {findLargestSmallerIndex} = require('../src/util.js');


describe('util', function() {

  it('findLargestSmallerIndex finds correct index', function(){
    let arr = [1,2,3,4,5,6,7,8,10];
    let result = findLargestSmallerIndex(arr,0,arr.length-1,9);
    assert.equal(7, result);
    let arr2 = [ 0, 26, 47 ];
    let result2 = findLargestSmallerIndex(arr2,0,arr2.length-1,51);
    assert.equal(2, result2);
  });

});
