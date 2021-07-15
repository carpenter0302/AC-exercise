const panel = document.querySelector('#data-panel')
const button = document.querySelector('button')

button.addEventListener('click', function(){
  axios.get('https://randomuser.me/api/')
  .then(function (response){
    console.log(response)

    let user = response.data.results[0]
    console.log(user)

    let name = user.name.first + user.name.last
    let avatar = user.picture.large
    let email = user.email

    panel.innerHTML = `
      <h3>${name}</h3>
      <img src="${avatar}">
      <p>${email}</p>
    `

  })
})
