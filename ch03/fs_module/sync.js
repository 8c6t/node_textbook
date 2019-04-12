const fs = require('fs');

console.log('시작');

let data = fs.readFileSync('./readme2.txt');
console.log('1번', data.toString());
let data2 = fs.readFileSync('./readme2.txt');
console.log('2번', data2.toString());
let data3 = fs.readFileSync('./readme2.txt');
console.log('3번', data3.toString());

console.log('끝');