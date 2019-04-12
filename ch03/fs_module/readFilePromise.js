const fs = require('fs');

new Promise((resolve, reject) => {
  fs.readFile('./readme.txt', (err, data) => {
    err ? reject(err) : resolve(data);
  });
}).then(data => {
  console.log(data);
  console.log(data.toString());
}).catch(error => {
  console.error(error);
});