import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded!';

  toggleModal() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerModalWindow(handler) {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
    this._btnClose.addEventListener('click', this.toggleModal.bind(this));
    this._overlay.addEventListener('click', this.toggleModal.bind(this));
    handler();
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      handler(dataArr);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
