let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(json => json.forEach(toy => createToy(toy)));

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  document.querySelector('div.container form.add-toy-form').addEventListener('submit', e => {
    e.preventDefault();

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        'name': document.querySelectorAll('div.container input.input-text')[0].value,
        'image': document.querySelectorAll('div.container input.input-text')[1].value,
        'likes': 0
      })
    })
      .then(resp => resp.json())
      .then(json => createToy(json))
      .catch(e => console.log(e));

      e.target.reset();
  })
});

function createToy(toy) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  const p = document.createElement('p');
  const btn = document.createElement('button');

  div.classList.add('card');
  h2.textContent = toy.name;
  img.src = toy.image;
  img.classList.add('toy-avatar');
  p.textContent = `${toy.likes} Likes`;
  btn.textContent = 'Like';
  btn.classList.add('like-btn');
  btn.setAttribute('id', toy.id);
  btn.addEventListener('click', handleLike);

  div.appendChild(h2);
  div.appendChild(img);
  div.appendChild(p);
  div.appendChild(btn);
  document.querySelector('#toy-collection').appendChild(div);
}

function handleLike(e) {
  e.preventDefault();
  const newLikes = parseInt(e.target.previousElementSibling.textContent) + 1
  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
  .then(resp => resp.json())
  .then(json => {
    e.target.previousElementSibling.textContent = `${newLikes} Likes`
  })
  .catch(e => console.log(e));
}