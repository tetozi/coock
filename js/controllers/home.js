import { apiDelete, checkResult, createRecipe, editRecipe, getRecipeById, getRecipes, likeRecipe } from '../api.js'
import { showInfo, showError } from '../notification.js'


export default async function home() {
  this.partials = {
    header: await this.load('./view/common/header.hbs'),
    footer: await this.load('./view/common/footer.hbs'),
    catalog: await this.load('./view/recipes/catalog.hbs'),
    recipe: await this.load('./view/recipes/recipe.hbs')
  };

  const context = Object.assign({}, this.app.userData);
  if (this.app.userData.email) {
    const recipes = await getRecipes();
    context.recipes = recipes;
  }


  this.partial('./view/home.hbs', context);
}


export async function getRecipe() {
  this.partials = {
    header: await this.load('./view/common/header.hbs'),
    footer: await this.load('./view/common/footer.hbs'),

  };
  this.partial('./view/recipes/create.hbs', this.app.userData);
}

export async function detailsPage() {
  this.partials = {
    header: await this.load('./view/common/header.hbs'),
    footer: await this.load('./view/common/footer.hbs'),

  };

  const recipe = await getRecipeById(this.params.id)
  const context = Object.assign({ recipe }, this.app.userData);
  if (recipe.ownerId === this.app.userData.userId) {
    recipe.canEdit = true
  }
  this.partial('./view/recipes/details.hbs', context);


}

export async function editPage() {
  this.partials = {
    header: await this.load('./view/common/header.hbs'),
    footer: await this.load('./view/common/footer.hbs'),

  };


  const recipe = await getRecipeById(this.params.id)
  recipe.ingredients = recipe.ingredients.join(', ')
  const context = Object.assign({ recipe }, this.app.userData)
  await this.partial('./view/recipes/edit.hbs', context);

  document.querySelectorAll('select[name=category]>option').forEach(o => {
    if (o.textContent == recipe.category) {
      o.selected = true;
    }
  })

}




export async function createPost() {

  const recipe = {
    meal: this.params.meal,
    ingredients: this.params.ingredients.split(', ').map(i => i.trim()),
    prepMethod: this.params.prepMethod,
    description: this.params.description,
    foodImageURL: this.params.foodImageURL,
    category: this.params.category,
    categoryImageUrl: 'https://images.all-free-download.com/images/graphicthumb/food_picture_02_hd_pictures_167557.jpg',
    likes: 0
  }
  try {
    if (recipe.meal.length < 4) {
      throw new Error('Meal must be at least 4 characters long');
    }
    if (recipe.ingredients.length < 4) {
      throw new Error('There  must be at least 2 ingredients');
    }
    if (recipe.prepMethod.length < 10) {
      throw new Error('Preperation method  must be at least 10 characters long');
    }
    if (recipe.description.length < 10) {
      throw new Error('Description  must be at least 10 characters long');
    }
    if (recipe.foodImageURL.slice(0, 7) !== 'http://' && recipe.foodImageURL.slice(0, 8) !== 'https://') {
      throw new Error('Invalid image URl');
    }
    if (recipe.category == 'Select category...') {
      throw new Error('category');
    }


    const result = await createRecipe(
      recipe
    );

    checkResult(result)

    showInfo('Successfully recipe created');
    this.redirect('#/home');

  } catch (err) {

    showError(err.message);
  }
}

export async function editPost() {

  const id = this.params.id
  const recipe = await getRecipeById(id)


  recipe.meal = this.params.meal;
  recipe.ingredients = this.params.ingredients.split(', ').map(i => i.trim());
  recipe.prepMethod = this.params.prepMethod;
  recipe.description = this.params.description;
  recipe.foodImageURL = this.params.foodImageURL;
  recipe.category = this.params.category;


  try {
    if (recipe.meal.length < 4) {
      throw new Error('Meal must be at least 4 characters long');
    }
    if (recipe.ingredients.length < 4) {
      throw new Error('There  must be at least 2 ingredients');
    }
    if (recipe.prepMethod.length < 10) {
      throw new Error('Preperation method  must be at least 10 characters long');
    }
    if (recipe.description.length < 10) {
      throw new Error('Description  must be at least 10 characters long');
    }
    if (recipe.foodImageURL.slice(0, 7) !== 'http://' && recipe.foodImageURL.slice(0, 8) !== 'https://') {
      throw new Error('Invalid image URl');
    }
    if (recipe.category == 'Select category...') {
      throw new Error('category');
    }


    const result = await editRecipe(id,
      recipe
    );

    checkResult(result)

    showInfo('Successfully recipe edited');
    this.redirect('#/home');

  } catch (err) {

    showError(err.message);
  }
}


export async function like() {
  const id = this.params.id
  try {
    const result = await likeRecipe(id)
    checkResult(result)
    showInfo('Recipe liked')
    this.redirect('#/home')
  } catch (err) {
    showError(err.message)
  }
}

export async function deleteRecipe() {
  const id = this.params.id
  try {
    const result = await apiDelete(id)
    checkResult(result)
    showInfo('Recipe was archived');
    this.redirect('#/home')
  } catch (err) {
    showError(err.message)
  }
}