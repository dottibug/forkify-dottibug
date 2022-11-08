import * as model from './model.js'; // model.state, model.loadRecipe
import recipeView from './views/recipeView.js';
import bookmarksView from './views/bookmarksView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// import 'core-js/stable'; // polyfill async/await
// import 'regenerator-runtime/runtime'; // polyfill everything else

// https://forkify-api.herokuapp.com/v2

// Parcel HMR for dev purposes
// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    const recipeID = window.location.hash.slice(1);

    if (!recipeID) return;

    recipeView.renderSpinner();

    // Mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Loading Recipe
    // will have access to state.recipe once fulfilled
    await model.loadRecipe(recipeID);

    // Rendering Recipe
    recipeView.render(model.state.recipe);

    // Mark selected bookmark
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();

    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render search results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`⛔️ ${err}`);
    resultsView.renderError();
  }
}

function controlPagination(goToPage) {
  // Render search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render initial pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
}

function controlBookmarks(recipe) {
  // Add and Remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarksNav() {
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    if (!newRecipe) return;
    // Loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe
    await model.addRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Update hash (my first way)
    // window.location.hash = `#${model.state.recipe.id}`;

    // Update URL (using history API)
    // Doesn't reload the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`⛔️ ${err}`);
    addRecipeView.renderError(err.message);
  }
}

// CONTROLS events published (listened for) in the recipeView (Views) module
/**
 * The event (click, hashchange, load) is listened for in recipeView (because it is related to the UI/user interaction with the DOM)
 * The controller REACTS to that event (ie. it SUBSCRIBES to be notified every time that event happens (is PUBLISHED), then reacts to that event by controlling what should be done (fetch data and render the data));
 */

function init() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmarks);
  bookmarksView.addHandlerRender(controlBookmarksNav);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPage(controlPagination);
  addRecipeView.addHandlerModalWindow(controlAddRecipe);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
