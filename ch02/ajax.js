var xhr = new XMLHttpRequest();

// GET
xhr.onreadystatechange = function() {
  if(xhr.readyState === xhr.DONE) {
    if(xhr.status === 200 || xhr.status === 201) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.responseText);
    }
  }
};

xhr.onload = function() {
  if(xhr.status === 200 || xhr.satus === 201) {
    console.log(xhr.responseText);
  } 
}

xhr.onerror = function() {
  console.error(xhr.responseText);
}

xhr.open('GET', 'https://www.zerocho.com/api/get');
xhr.send();


// POST
var data = {
  name: 'zerocho',
  birth: 1994,
};

xhr.onreadystatechange = function() {
  if(xhr.readyState === xhr.DONE) {
    if(xhr.status === 200 || xhr.stauts == 201) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.responseText);
    }
  }
}

xhr.open('POST', 'https://www.zerocho.com/api/post/json');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(data));

// FORM DATA METHOD
var formData = new FormData();
formData.append('name', 'zerocho');
formData.append('item', 'orange');
formData.append('item', 'melon');
formData.has('item');  // true
formData.has('money'); // false
formData.get('item');  // orange
formData.getAll('item');  // ['orange', 'melon']
formData.append('test', ['hi', 'zero']);
formData.get('test'); // hi, zero
formData.delete('test');
formData.get('test'); // null
formData.set('item', 'apple');
formData.getAll('item'); // ['apple']

// FORM DATA
var formData2 = new FormData();
formData2.append('name', 'zerocho');
formData2.append('birth', 1994);

xhr.onreadystatechange = function() {
  if(xhr.readyState === xhr.DONE) {
    if(xhr.status === 200 || xhr.status === 201) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.responseText);
    }
  }
};

xhr.open('POST', 'https://www.zerocho.com/api/post/formdata');
xhr.send(formData2);