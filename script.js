var allMovies = [];
const API_URL = 'https://api.themoviedb.org/3/discover/movie?&adult=false&api_key=0aa7bf3cd83a95627438d27638d7505d&page=${i}&sort_by=primary_release_date.asc';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?&adult=false&api_key=0aa7bf3cd83a95627438d27638d7505d';
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

var now = new Date();
var year = now.getFullYear();
var month = String(now.getMonth() + 1).padStart(2, '0');
var day = String(now.getDate()).padStart(2, '0');
var currentDate = `${year}-${month}-${day}`;

async function getAllMovies(url, searchTerm = '') {
    const total_pages = await getTotalPages(url, searchTerm);
    let limit = Math.min(total_pages, 20); // limit to 10 pages or less if total_pages < 10
    for (let i = 1; i <= limit; i++) {
        const url_page = `${url}&page=${i}&query=${searchTerm}&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`;
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


const genresData = {
    "genres": [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 16,
            "name": "Animation"
        },
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentary"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Family"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 36,
            "name": "History"
        },
        {
            "id": 27,
            "name": "Horror"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 9648,
            "name": "Mystery"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Science Fiction"
        },
        {
            "id": 10770,
            "name": "TV Movie"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
            "name": "War"
        },
        {
            "id": 37,
            "name": "Western"
        }
    ]
};

const genresMap = genresData.genres.reduce((map, genre) => {
    map.set(genre.id, genre.name);
    return map;
}, new Map());



function showMovies(movies) {
    moviesData = movies;
    MediaDeviceInfo.innerHTML = ''; // clear main
    movies.forEach((movie) => {
        const { genre_ids, title, poster_path, vote_average, overview, release_date, original_language} = movie; // destructuring the movie object
        const releaseYear = new Date(release_date).getFullYear(); // get the year from the release_date
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        if (poster_path != null && genre_ids.length > 0) {
            const genreNames = genre_ids.map((genreId) => genresMap.get(genreId)).join(', '); // get genre names from genre_ids using genresMap
            movieEl.innerHTML = `
            <img translate="no" src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <span translate="no" id="info-row" class="${getClassByRate(vote_average)} ">${vote_average}</span>
                <i style="padding: 1px"></i><span class="notranslate" translate="no">${original_language}</span>
                <i style="padding: 1px"></i><span class="notranslate" translate="no">${genreNames}</span>
            </div>
            <span translate="no" id="year">${title} [${releaseYear}]</span>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
            `;
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


