import { beginRequest, endRequest } from './notification.js';
import API from './api.js'



const endpoints = {

  MOVIE_BY_ID: 'data/movies/',
  MOVIE_COUNT: 'data/movies/count'
};

const api = new API(
  "B64FEDD7-16D9-4E08-B620-2B1EDC7E8156",
  "8AD8D8DB-C555-4356-B867-D1AD525DB209",
  beginRequest,
  endRequest
)

export const login = api.login.bind(api)
export const register = api.register.bind(api)
export const logout = api.logout.bind(api)


// get movie count
export async function getMovieCount(search) {
  if (!search) {
    return api.get(endpoints.MOVIES)
  } else {
    return api.get(endpoints.MOVIE_COUNT + `?where=${escape(`genres LIKE '%${search}%'`)}`)

  }
}

// get all movies
export async function getMovies(search, page) {
  beginRequest();

  const token = localStorage.getItem('userToken');

  let result;
  const pagingQuery = `pageSize=9&offset=${(page - 1) * 9}`;

  if (!search) {
    result = (await fetch(host(endpoints.MOVIES + '?' + pagingQuery), {
      headers: {
        'user-token': token
      }
    })).json();
  } else {
    result = (await fetch(host(endpoints.MOVIES + `?where=${escape(`genres LIKE '%${search}%'`)}` + '&' + pagingQuery), {
      headers: {
        'user-token': token
      }
    })).json();
  }

  endRequest();

  return result;
}

// get movie by ID
export async function getMovieById(id) {
  return api.get(endpoints.MOVIE_BY_ID + id)
}

// create movie
export async function createMovie(movie) {
  return api.post(endpoints.MOVIES, movie)

}

// edit movie
export async function updateMovie(id, updatedProps) {
  return api.put(endpoints.MOVIE_BY_ID + id, updatedProps)

}

// delete movie
export async function deleteMovie(id) {
  return api.delete(endpoints.MOVIE_BY_ID + id)
}

// get movies by user ID
export async function getMovieByOwner() {
  const ownerId = localStorage.getItem('userId');

  return api.get(endpoints.MOVIES + `?where=ownerId%3D%27${ownerId}%27`)

}

// buy ticket
export async function buyTicket(movie) {
  const newTickets = movie.tickets - 1;
  const movieId = movie.objectId;

  return updateMovie(movieId, { tickets: newTickets });
}