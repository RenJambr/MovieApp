let currentPage = 1;
const API_URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=8ed5231966b6de8289a5866d56757e21&page=1&page=${currentPage}`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=8ed5231966b6de8289a5866d56757e21&query="';
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=8ed5231966b6de8289a5866d56757e21&query="`;
let divForMovies = document.querySelector('#main');
let form = document.querySelector('#form');
let search = document.querySelector('#search');
let prev = document.querySelector('#prev');
let next = document.querySelector('#next');
let homePage = document.querySelector('.logo');
let openNav = document.querySelector('.open-nav');
let closeNav = document.querySelector('.close-nav');
let blackNav = document.querySelector('.nav-yellow');
let redNav = document.querySelector('.nav-darkBlue');
let whiteNav = document.querySelector('.nav-lighterBlue');
let divForGenresInMenu = document.querySelector('.menu')
let urlArray = [];
document.querySelector('#pageNum').innerText = currentPage;

//get movies
getMovies(API_URL)

//get all genres
async function fetchGenres(){
    let response = await fetch(GENRE_URL);
    let data = await response.json();
    let genres = data.genres;

    return genres;
}

async function getMovies(url){
    let response = await fetch(url);
    let data = await response.json();
    let movies = data.results;
    let genres = await fetchGenres();

    getURL(url)

    movies.forEach(movie => {
        divForMovies.innerHTML += `
        <div class = "movie">
            <img src = "${IMG_PATH + movie.poster_path}" alt = "" id = "movie-img">
            <div class = "movie-info">
                <div>
                    <h3 id = "movie-title">${movie.original_title}</h3>
                    <span class = "movie-genre">${getGenre(movie, genres)}</span>
                </div>
                <span class = "${voteAverage(movie.vote_average)}" id = "grade">${movie.vote_average}</span>
            </div>
            <div class = "overview" id = "movie-overview">
                <h3>Overview</h3>
                ${movie.overview}
            </div>                
        </div>
        `
    })

}

//here I want to get url for paginate movies, like when I click next currentPage variable will increase for one or decrease if I click prev
function getURL(url){
    urlArray[0] = url
}

//this function is for print movie genre
function getGenre(movie, genres){

    let genreId = movie.genre_ids[0];
    let genresArray = [];

    genres.forEach(genre => {
        if(genre.id === genreId){
            genresArray.push(genre.name)
        }
    })

    return genresArray
}

//this is coloring the grade of movie
function voteAverage(grade){

    if(grade >= 8){
        return 'green';
    } else if(grade >= 5){
        return 'orange';
    } else{
        return 'red';
    }
}
//function for search movies by input value
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm && searchTerm !== ''){
        divForMovies.innerHTML = "";

        currentPage = 1
        document.querySelector('#pageNum').innerText = currentPage

        getMovies(SEARCH_URL + searchTerm)

        search.value = ''
    } else{
        window.location.reload()
    }

})

//when you click logo it will load movies from home page
homePage.addEventListener('click', () => {

    divForMovies.innerHTML = "";

    currentPage = 1
    document.querySelector('#pageNum').innerText = currentPage
    
    getMovies(API_URL)
})

//make buttons for each genre on load window

window.addEventListener('load', async (e) => {
    let genres = await fetchGenres();

    genres.forEach(genre => {
        let li = document.createElement('li');
        li.innerText = genre.name;
        li.setAttribute('data_id', genre.id);
        li.addEventListener('click', selectMovieByGenre)

        divForGenresInMenu.appendChild(li)
    })

})

function selectMovieByGenre(){
    let genreId = this.getAttribute("data_id");
    let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=8ed5231966b6de8289a5866d56757e21&with_genres=${genreId}&page=1&page=${currentPage}`
    
    divForMovies.innerHTML = "";
    closingNav()

    currentPage = 1
    document.querySelector('#pageNum').innerText = currentPage

    getMovies(url)
}

prev.addEventListener('click', () => {
    if(currentPage === 1){
        currentPage = 1
    } else {
        currentPage--;
        divForMovies.innerHTML = '';
        document.querySelector('#pageNum').innerText = currentPage

        if(/[0-9]+$/.test(urlArray[0])){
            let pageNum = urlArray[0].slice(-1);
            let text = urlArray[0].slice(0, urlArray[0].length - 1)
    
            parseInt(pageNum);
            pageNum--;
    
            urlArray[0] = text + pageNum;
    
            getMovies(urlArray[0])
            
        } else{
            urlArray[0] = urlArray[0] + `&page=1&page=${currentPage}`;
    
            getMovies(urlArray[0])
        }
    }
})

next.addEventListener('click', () => {
    currentPage++;
    divForMovies.innerHTML = '';
    document.querySelector('#pageNum').innerText = currentPage

    if(/[0-9]+$/.test(urlArray[0])){
        let pageNum = urlArray[0].slice(-1);
        let text = urlArray[0].slice(0, urlArray[0].length - 1)

        parseInt(pageNum);
        pageNum++;

        urlArray[0] = text + pageNum;

        getMovies(urlArray[0])

    } else{
        urlArray[0] = urlArray[0] + `&page=1&page=${currentPage}`;

        getMovies(urlArray[0])
    }
})

openNav.addEventListener('click', e => {
    openNav.style.display = "none";
    blackNav.style.animation = "openNav 0.5s";
    blackNav.style.transform = "translateX(0%)";
    redNav.style.animation = "openNav 0.7s";
    redNav.style.transform = "translateX(0%)";
    whiteNav.style.animation = "openNav 0.9s";
    whiteNav.style.transform = "translateX(0%)";
})
closeNav.addEventListener('click', closingNav)

function closingNav(){
    whiteNav.style.animation = "closeNav 0.5s";
    whiteNav.style.transform = "translateX(-100%)";
    redNav.style.animation = "closeNav 0.7s";
    redNav.style.transform = "translateX(-100%)";
    blackNav.style.animation = "closeNav 0.9s";
    blackNav.style.transform = "translateX(-100%)";
    openNav.style.display = "block";
}
