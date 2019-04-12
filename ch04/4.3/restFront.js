const getUser = () => {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if(xhr.status === 200) {
      let users = JSON.parse(xhr.responseText);
      let list = document.getElementById('list');
      list.innerHTML = '';

      Object.keys(users).map((key) => {
        let userDiv = document.createElement('div');
        let span = document.createElement('span');
        span.textContent = users[key];

        let edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', () => {
          let name = prompt('바꿀 이름을 입력하세요');
          if(!name) {
            return alert('이름을 반드시 입력해야 합니다');
          }
          
          let xhr = new XMLHttpRequest();
          xhr.onload = () => {
            if(xhr.status === 200) {
              console.log(xhr.responseText);
              getUser();
            } else {
              console.error(xhr.responseText);
            }
          };

          xhr.open('PUT', '/users/' + key);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({ name : name }));
        });

        let remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', () => {
          let xhr = new XMLHttpRequest();
          xhr.onload = () => {
            if(xhr.status === 200) {
              console.log(xhr.responseText);
              getUser();
            } else {
              console.error(xhr.responseText);
            }
          };
          xhr.open('DELETE', '/users/' + key);
          xhr.send();
        });

        userDiv.appendChild(span);
        userDiv.appendChild(edit);
        userDiv.appendChild(remove);
        list.appendChild(userDiv);
      });
    } else {
      console.error(xhr.responseText);
    }
  };
  xhr.open('GET', '/users');
  xhr.send();
}

window.onload = getUser;

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  let name = e.target.username.value;
  if(!name) {
    return alert('이름을 입력하세요');
  }
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if(xhr.status === 201) {
      console.log(xhr.responseText);
      getUser();
    } else {
      console.error(xhr.responseText);
    }
  };

  xhr.open('POST', '/users');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ name : name }));
  e.target.username.value = '';
});