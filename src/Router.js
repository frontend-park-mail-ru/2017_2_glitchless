/**
 * Changes the page according to url hash.
 */
class Router {
    /**
     * Setups listeners and initializes the page.
     */
    init() {
        this._initListener();
        this._setPageFromLocationHash();
    }

    /**
     * Changes page block.
     *
     * @param page Name of page block
     */
    changePage(page) {
        location.hash = '#' + page;
    }

    _initListener() {
        window.onhashchange = () => {
            this._setPageFromLocationHash();
        };
    }

    _setPageFromLocationHash() {
        let page = location.hash.slice(1);
        if (page === '') {
            page = null;
        }
        this._showCurrentBlock(page);
    }

    _showCurrentBlock(page) {
        Array.from(document.getElementsByClassName('page_block')).forEach((el) => {
            el.style.display = 'none';
        });
        if (page !== null) {
            document.getElementById(`page_block_${page}`).style.display = 'block';
        }
    }
}

module.exports = Router;
