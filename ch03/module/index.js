const { odd, even } = require('./var');
const checkNum = require('./func');

function checkStringOddOrEven(str) {
  if(str.length % 2) {
    return odd;
  } else {
    return even;
  }
}

console.log(checkNum(10));
console.log(checkStringOddOrEven("hello"));