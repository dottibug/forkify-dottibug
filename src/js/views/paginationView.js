// pagination of search results
import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this.#generateNextBtn(curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this.#generatePrevBtn(curPage);
    }

    // Middle pages
    if (curPage > 1 && curPage < numPages) {
      return this.#generatePrevBtn(curPage) + this.#generateNextBtn(curPage);
    }
    // Only 1 page of results
    return '';
  }

  #generatePrevBtn(curPage) {
    // prettier-ignore
    return ` 
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
  }

  #generateNextBtn(curPage) {
    // prettier-ignore
    return `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }

  addHandlerPage(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      // Event delegation
      if (!btn) return;

      // Parse destination page number from button span
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
