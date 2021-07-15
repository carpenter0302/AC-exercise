const base_URL = "https://movie-list.alphacamp.io"
const index_URL = base_URL + "/api/v1/movies/"
const poster_URL = base_URL + "/posters/"

const movies = []
let filteredMovies = [] //搜尋的資料放在這裡

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data){
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML+=`
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${poster_URL + item.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">更多</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  });

  dataPanel.innerHTML = rawHTML
}

//分頁
function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let i = 0; i < numberOfPage; i++){
    rawHTML+=`
    <li class="page-item"><a class="page-link"  href="#"  data-page="${i+1}" >${i+1}</a></li>
    ` 
  }
  paginator.innerHTML = rawHTML
}




function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(index_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${poster_URL + data.image}" alt="movie-poster" class="img-fluid"></img>`
  })
}

//將使用者點擊到的那一部電影送進 local storage 儲存起來
function addToFavorite(id) {  

function isMovieIdMatched(movie) {
   return movie.id === id
 }
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] // list 是收藏清單，null值會被 OR 判斷為 false
  const movie = movies.find(isMovieIdMatched) //更新收藏清單，請find 去電影總表中查看，找出 id 相同的電影物件回傳，暫存在 movie

  if (list.some(isMovieIdMatched)) { //some 陣列裡有沒有通過檢查條件
    return alert('此電影已加入清單中!')
  }
  list.push(movie) //把 movie 推進收藏清單
  localStorage.setItem('favoriteMovies', JSON.stringify(list))//呼叫 localStorage.setItem，把更新後的收藏清單同步到 local stroage
  console.log(list)
}


dataPanel.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  }
  else if (event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }
})


paginator.addEventListener('click', function onPaginatorClicked(event){
  if(event.target.tagName !== 'A') return   //不是標籤<a>
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})


searchForm.addEventListener('submit', function onSearchFormSubmitted (event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  for(const movie of movies){
    if (movie.title.toLowerCase().includes(keyword)){
      filteredMovies.push(movie)
    }
  }
  
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})



axios.get(index_URL).then((response) =>{ 
  for(const movie of response.data.results){
    movies.push(movie)
  }
  renderMovieList(getMoviesByPage(1))
  renderPaginator(movies.length)
 })



const MOVIES_PER_PAGE = 12

function getMoviesByPage(page){
  const data = filteredMovies.length ? filteredMovies : movies 
  const startIndex = (page - 1)*12
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

