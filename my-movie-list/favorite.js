const base_URL = "https://movie-list.alphacamp.io"
const index_URL = base_URL + "/api/v1/movies/"
const poster_URL = base_URL + "/posters/"

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


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
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">移除</button>
            </div>
          </div>
        </div>
      </div>`
  });

  dataPanel.innerHTML = rawHTML
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

function removeFromFavorite(id){
  if (!movies) return  //收藏清單是空的，結束這個函式
  function isMovieIdMatched(movie) {
    return movie.id === id
  }
  const movieIndex = movies.findIndex(isMovieIdMatched) 
  if (movieIndex === -1) return  //傳入的 id 在收藏清單中不存在，就結束這個函式
  movies.splice(movieIndex,1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)

}


dataPanel.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  }
  else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)
