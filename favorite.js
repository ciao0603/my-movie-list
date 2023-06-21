// 先寫出靜態 HTML 架構。在開始寫 JS 做動態連動
const BASE_URL = 'https://webdev.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/movies/'
const POSTER_URL = BASE_URL + 'posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


renderMovieList(movies)

// 監聽more按鈕 -> 跳出介紹(函式 b)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const id = Number(event.target.dataset.id)
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(id)
    // 刪除最愛(函式d)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(id)
  } 
})




////////////////////// 函式區 //////////////////////

// a. 匯入電影封面
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// b. 匯入電影介紹
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then(response => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
    })
    .catch(error => console.log(error))
}

// d. 找到位置(index) => 刪除
function removeFromFavorite (id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  // 防止空陣列
  if (!movies || !(movies.length)) return
  // 當movieIndex找不到指定項目位置時會回傳-1
  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


