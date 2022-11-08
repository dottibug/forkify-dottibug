// parent view
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (ex. recipe)
   * @this {Object} View instance
   * @returns
   * @author Tanya Woodside
   * @todo Finish implementation
   */
  render(data) {
    this._data = data;

    // check if no data
    // check if data is an empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   *
   * @param {*} data
   */
  update(data) {
    this._data = data;
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    const newMarkup = this._generateMarkup();

    // Virtual DOM in memory (to compare changes for update DOM algorithm)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElems = Array.from(newDOM.querySelectorAll('*'));
    const curElems = Array.from(this._parentElement.querySelectorAll('*'));

    // Compare
    newElems.forEach((newElem, i) => {
      // Replace text nodes (servings and ingredients quantity)
      if (
        !newElem.isEqualNode(curElems[i]) &&
        newElem.firstChild?.nodeValue.trim() !== ''
      )
        curElems[i].textContent = newElem.textContent;

      // Replace attributes (dataset-update-to)
      if (!newElem.isEqualNode(curElems[i])) {
        Array.from(newElem.attributes).forEach(attr =>
          curElems[i].setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const spinnerMarkup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const errorMarkup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  renderMessage(message = this._message) {
    const msgMarkup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', msgMarkup);
  }
}
