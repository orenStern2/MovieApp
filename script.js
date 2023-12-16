var allMovies = [];
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0aa7bf3cd83a95627438d27638d7505d&page=${i}';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=0aa7bf3cd83a95627438d27638d7505d';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const sortDate = document.getElementById('sortDate');
const sortRate = document.getElementById('sortRate');

let moviesData = [];



getAllMovies(API_URL);

async function getTotalPages(url, searchTerm = '') {
    const res = await fetch(`${url}&query=${searchTerm}`);
    const data = await res.json();
    const total_pages = data.total_pages;
    return total_pages;
}



async function getAllMovies(url, searchTerm = '') {
    const total_pages = await getTotalPages(url, searchTerm);
    let limit = Math.min(total_pages, 10); // limit to 10 pages or less if total_pages < 10
    for (let i = 1; i <= limit; i++) {
        const url_page = `${url}&page=${i}&query=${searchTerm}`;
        console.log(url_page);
        const res = await fetch(url_page);
        const data = await res.json();
        allMovies = allMovies.concat(data.results);
    }
    
    showMovies(allMovies)
}

// event listener on the form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm && searchTerm !== '') {
        main.innerHTML = '';
        allMovies = []; // clear allMovies array
        getAllMovies(SEARCH_API, searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

function showMovies(movies) {
    moviesData = movies;
    MediaDeviceInfo.innerHTML = ''; // clear main
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, release_date, original_language} = movie; // destructuring the movie object
        const releaseYear = new Date(release_date).getFullYear(); // get the year from the release_date
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        if (poster_path != null) {
        movieEl.innerHTML = `
        <img translate="no" src="${IMG_PATH + poster_path}" alt="${title}">
        <div class="movie-info">
            <span translate="no" id="info-row" class="${getClassByRate(vote_average)} ">${vote_average}</span>
            <i style="padding: 1px"></i><span class="notranslate" translate="no">${original_language}</span>
        </div>
     
        <span translate="no" id="year">${title} [${releaseYear}]</span>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
            </div>
        `
        main.appendChild(movieEl);
        }
    })

}

function getClassByRate(vote){
    if(vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
};

sortDate.addEventListener('click', () => {
    main.innerHTML = '';
    const sortedMovies = [...moviesData].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    showMovies(sortedMovies);
});

sortRate.addEventListener('click', () => {
    main.innerHTML = '';
    const sortedMovies = [...moviesData].sort((a, b) => b.vote_average - a.vote_average);
    showMovies(sortedMovies);
});
