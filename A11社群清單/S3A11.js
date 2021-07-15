const base_URL = "https://lighthouse-user-api.herokuapp.com"
const index_URL = base_URL + "/api/v1/users/"


const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const USER_PER_PAGE = 16


//把資料放進網頁
const users = []
axios.get(index_URL).then((response) => {
  for (const user of response.data.results) {
    users.push(user)
  }
  renderUserList(getUsersByPage(1))
  renderPaginator(users.length)
})


//讓HTML結構已js來修改
function renderUserList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="card" style="width: 15rem;">
        <img src="${item.avatar}" class="card-img-top" alt="..." data-toggle="modal" data-target="#user-Modal"  data-id="${item.id}">
        <div class="card-body">
          <h5 class="card-title" style="font-size:14px;">${item.name + " " + item.surname}</h5>
        </div>
      </div>
   </div>`
  })
  dataPanel.innerHTML = rawHTML
}


function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / USER_PER_PAGE )

  let rawHTML=''
  for (let i = 0; i < numberOfPage; i++){
    rawHTML+=`
    <li class="page-item"><a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a></li>
   `
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked(event){
  renderUserList(getUsersByPage(event.target.dataset.page))
})



function showUserModal(id) {
  const modalUserDescription = document.querySelector("#user-modal-description")
  const modalUserName = document.querySelector("#user-modal-name")
  const modalUserEmail = document.querySelector("#user-modal-email")
  const modalUserGender = document.querySelector("#user-modal-gender")
  const modalUserAge = document.querySelector("#user-modal-age")
  const modalUserRegion = document.querySelector("#user-modal-region")
  const modalUserBirthday = document.querySelector("#user-modal-birthday")

  axios.get(index_URL + id).then((response) => {
    const data = response.data

    modalUserDescription.innerText = `${data.surname} Profile`;
    modalUserName.innerText = `Name :${data.name}  ${data.surname}`;
    modalUserEmail.innerText = `Email:${data.email}`;
    modalUserGender.innerText = `Gender:${data.gender}`;
    modalUserAge.innerText = `Age:${data.age}`;
    modalUserRegion.innerText = `Region:${data.region}`;
    modalUserBirthday.innerText = `HBB:${data.birthday}`;

  })

}

dataPanel.addEventListener('click', function openClickModal(event) {
  if (event.target.matches('.card-img-top')) {
    console.log(event.target.dataset.id)
    showUserModal(Number(event.target.dataset.id))
  }
})

//搜尋
searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
  event.preventDefault()
  const keyword = searchInput.value.toLowerCase().trim()
  let filteredUser = []

  for (const user of users) {
    if (user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)){
      filteredUser.push(user)
    }
  } 

  if (filteredUser.length === 0){
    alert("未找出符合條件")
  }
  renderUserList(filteredUser)
})



function getUsersByPage(page){
  const startIndex = ( page - 1 ) * USER_PER_PAGE
  return users.slice(startIndex, startIndex + USER_PER_PAGE)
}