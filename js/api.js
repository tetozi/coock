import { beginRequest, endRequest } from './notification.js'

function host(endpoint) {
  return `https://eu-api.backendless.com/B64FEDD7-16D9-4E08-B620-2B1EDC7E8156/8AD8D8DB-C555-4356-B867-D1AD525DB209/${endpoint}`;
}

const endpoints = {
  REGISTER: 'users/register',
  LOGIN: 'users/login',
  LOGOUT: 'users/logout',
  RECIPES: 'data/recipes',
  RECIPE_BY_ID: 'data/recipes/',
};

export async function register(email, password) {
  beginRequest();

  const result = (await fetch(host(endpoints.REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })).json();

  endRequest();

  return result;
}

export async function login(email, password) {
  beginRequest();

  const result = await (await fetch(host(endpoints.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: email,
      password
    })
  })).json();

  localStorage.setItem('userToken', result['user-token']);
  localStorage.setItem('email', result.email);
  localStorage.setItem('userId', result.objectId);

  endRequest();

  return result;
}

export async function apilogout() {
  beginRequest();

  const token = localStorage.getItem('userToken');

  localStorage.removeItem('userToken');

  const result = fetch(host(endpoints.LOGOUT), {
    headers: {
      'user-token': token
    }
  });

  endRequest();

  return result;
}



// get all recipes
export async function getRecipes() {
  beginRequest();

  const token = localStorage.getItem('userToken');

  const result = (await fetch(host(endpoints.RECIPES), {
    headers: {
      'user-token': token
    }
  })).json();

  endRequest();

  return result;
}

// create recipe
export async function createRecipe(recipe) {
  beginRequest();

   const token = localStorage.getItem('userToken');

  const result = (await fetch(host(endpoints.RECIPES), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       'user-token': token
    },
    body: JSON.stringify(recipe)
  })).json();

  endRequest();

  return result;
}

export function checkResult(result) {

  if (result.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, result);
    throw error;
  }
}

//get recipe by id
export async function getRecipeById(id) {
  beginRequest();

  const token = localStorage.getItem('userToken');

  const result = (await fetch(host(endpoints.RECIPE_BY_ID + id), {
      headers: {
          'user-token': token
      }
  })).json();

  endRequest();

  return result;
}
//delete recipe by id


//edit recipe  by id
export async function editRecipe(id, recipe) {
  beginRequest();

  const token = localStorage.getItem('userToken');

  const result = (await fetch(host(endpoints.RECIPE_BY_ID + id), {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'user-token': token
      },
      body: JSON.stringify(recipe)
  })).json();

  endRequest();

  return result;
}

//like
export async function likeRecipe( id) {

  const recipe = await getRecipeById(id)

  editRecipe(id , {likes: recipe.likes  + 1})
}


export async function apiDelete(id) {
  beginRequest();

  const token = localStorage.getItem('userToken');

  const result = (await fetch(host(endpoints.RECIPE_BY_ID  + id), {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'user-token': token
      }
  })).json();

  endRequest();

  return result;
}