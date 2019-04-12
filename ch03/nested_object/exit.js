let i = 1;
setInterval(() => {
  if(i === 6) {
    console.log('종료');
    process.exit();
  }
  console.log(i);
  i++;
}, 1000);