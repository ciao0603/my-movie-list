// 先寫出靜態 HTML 架構。在開始寫 JS 做動態連動
////////////////////// 宣告變數 //////////////////////
const BASE_URL = 'https://webdev.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/movies/'
const POSTER_URL = BASE_URL + 'posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

////////////////////// 主CODE //////////////////////

// 1. 串接電影API(函式 a)  => 分頁(函式e)
axios
  .get(INDEX_URL)
  .then(response => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch(error => console.log(error))

// 2. 監聽more按鈕 -> 跳出介紹(函式 b)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const id = Number(event.target.dataset.id)
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(id)
    // 收藏功能 - 加上監聽器 => 放到收藏清單(函式 c)
  } else if (event.target.matches('.btn-ad-favorite')) {
    addToFavorite(id)
  }
})

// 關鍵字功能 - 根據keyword篩選(filter)出電影 =>匯入畫面
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const input = searchInput.value
  const keyword = input.trim().toLowerCase()

  // 寫法1 - for-of迴圈
  // for(const movie of movies){
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }
  // 寫法2 - filter(篩選)
  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  // 設定條件避免搜尋欄為空白
  // 寫法1
  // if(keyword.length === 0){
  //   return alert('no value!')
  // }
  // 寫法2
  if (filteredMovies.length === 0) {
    return alert(`查無關鍵字${input}`)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

// 分頁器功能
paginator.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return

  const page = event.target.dataset.page
  renderMovieList(getMoviesByPage(page))
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
              <button class="btn btn-info btn-ad-favorite" data-id="${item.id}">+</button>
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

// c. 收藏至本地清單
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies',JSON.stringify(list))
}

// e. 切割出當頁所需電影
function getMoviesByPage(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  // 分辨(?)要從filteredMovies還是movies中切割電影
  const data = filteredMovies.length ? filteredMovies : movies
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// f. 製作分頁器
function renderPaginator(amount) {
  const totalPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ``
  for (let page = 1; page <= totalPages; page ++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}