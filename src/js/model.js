// Model handles the DATA of the application
// import { async } from 'regenerator-runtime';
// import * as config from './config.js';

import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// state contains all information about the current state of the application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(recipeData) {
  return {
    id: recipeData.data.recipe.id,
    title: recipeData.data.recipe.title,
    publisher: recipeData.data.recipe.publisher,
    sourceURL: recipeData.data.recipe.source_url,
    image: recipeData.data.recipe.image_url,
    servings: recipeData.data.recipe.servings,
    cookingTime: recipeData.data.recipe.cooking_time,
    ingredients: recipeData.data.recipe.ingredients,
    // conditionally add properties to an object
    ...(recipeData.data.recipe.key && { key: recipeData.data.recipe.key }),
  };
}

export async function loadRecipe(id) {
  try {
    const recipeData = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(recipeData);

    // Check if recipe is in bookmarks array
    // If so, add bookmarked true so the bookmark icon renders as filled
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
}

// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const searchData = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(searchData);

    state.search.results = searchData.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = 1) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  const ingredients = state.recipe.ingredients;

  state.recipe.ingredients = ingredients.map(ing => {
    return {
      ...ing,
      quantity: ing.quantity * (newServings / state.recipe.servings),
    };
  });

  state.recipe.servings = newServings;

  return state.recipe.ingredients;
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  state.recipe.bookmarked = true;

  // Store bookmarks
  persistBookmarks();
}

export function removeBookmark(id) {
  // Find in bookmarks array
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;

  // Store bookmarks
  persistBookmarks();
}

function init() {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));

  if (storage) state.bookmarks = storage;
}

init();

// For dev purposes
function clearBookmarks() {
  localStorage.clear('bookmarks');
}
// clearBookmarks();

export async function addRecipe(newRecipe) {
  try {
    // Other Recipe Data
    const recipeArr = newRecipe.filter(
      entry => !entry[0].startsWith('ingredient')
    );

    const recipeData = Object.fromEntries(recipeArr);

    // Ingredient data
    const ingredients = newRecipe
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const ingArr = entry[1].split(',').map(el => el.trim());
        const [quantity, unit, description] = ingArr;

        if (ingArr.length !== 3) throw new Error(`Wrong ingredient format.`);
        return {
          quantity: quantity ? +quantity : null,
          unit: unit,
          description: description.toLowerCase(),
        };
      });

    // Format recipe object for API
    const recipe = {
      title: recipeData.title,
      source_url: recipeData.sourceUrl,
      image_url: recipeData.image,
      publisher: recipeData.publisher,
      cooking_time: +recipeData.cookingTime,
      servings: +recipeData.servings,
      ingredients,
    };

    // Prior to re-formatting for API
    // const recipe = {
    //   ingredients: ingredients,
    //   ...Object.fromEntries(recipeData),
    // };

    const postedRecipe = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(postedRecipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}
