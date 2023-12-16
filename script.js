const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0aa7bf3cd83a95627438d27638d7505d';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=0aa7bf3cd83a95627438d27638d7505d&query="';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const sortDate = document.getElementById('sortDate');
const sortRate = document.getElementById('sortRate');

let moviesData = [];






// get initial movies
getMovies(API_URL);

async function getMovies(url) {
    const res= await fetch(url);
    const data = await res.json();

    showMovies(data.results);



    

}

function showMovies(movies) {
    moviesData = movies;
    MediaDeviceInfo.innerHTML = ''; // clear main
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, release_date, original_language} = movie; // destructuring the movie object
        const releaseYear = new Date(release_date).getFullYear(); // get the year from the release_date
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

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


// event listener on the form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm && searchTerm !== '') {
        main.innerHTML = '';
        getMovies(SEARCH_API + searchTerm);
        console.log(SEARCH_API + searchTerm)
        search.value = '';
    } else {
        window.location.reload();
    }
});


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
