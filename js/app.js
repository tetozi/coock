/* globals Sammy */


import home, {  getRecipe, createPost, detailsPage, editPage,editPost, like, deleteRecipe } from './controllers/home.js';
import { loginPage, loginPost, registerPage, registerPost, logout} from './controllers/user.js'

window.addEventListener('load' , () => {


const app = Sammy('#rooter', function () {
  this.use("Handlebars", "hbs");

  this.userData = {
    email: localStorage.getItem('email') || '',
    userId: localStorage.getItem('userId') || '',
    recpies: []
  };


  this.get('/', home);
  this.get('index.html', home);
  this.get('#/home', home);

  this.get('#/register', registerPage)
  this.get('#/login', loginPage)
  this.get('#/logout', logout)
  

  this.get('#/create', getRecipe)
  this.get('#/edit/:id', editPage)
  this.get('#/details/:id', detailsPage)
  this.get('#/likes/:id', like)
  this.get('#/delete/:id', deleteRecipe)

  this.post('#/register', ctx => { registerPost.call(ctx); });
  this.post('#/login', ctx => { loginPost.call(ctx); });

  this.post('#/create', ctx => { createPost.call(ctx); });
  this.post('#/edit/:id', ctx => { editPost.call(ctx); });
});

app.run('#/home');
});