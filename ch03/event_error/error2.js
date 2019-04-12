const fs = require('fs');

// try...catch가 아니더라도 노드 자체에서 에러를 잡아준다
setInterval(() => {
  fs.unlink('./abcdefg.js', (err) => {
    if(err) { console.error(err); }
  });
}, 1000);