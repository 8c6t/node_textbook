const condition = true;
const promise = new Promise((resolve, reject) => {
  if(condition) resolve('성공');
  else          reject('실패');
});

promise
  .then((message) => { console.log(message) })
  .catch((error) => { console.error(error) });

/* function findAndSaveUser(User) {
  Users.findOne({})
    .then((user) => {
      user.name = 'zero';
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ gender : 'm' });
    })
    .then((user) => {})
    .catch(err => console.error(err));
} */

const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
Promise.all([promise1, promise2])
  .then(result => console.log(result))
  .catch(error => console.error(error));