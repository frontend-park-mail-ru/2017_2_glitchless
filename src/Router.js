/**
 * Changes the page according to url hash.
 */
class Router {
    /**
     * Setups listeners and initializes the page.
     */
    init() {
        this._initListener();
        this._changePage('login');
    }

    _initListener() {
        window.onhashchange = () => {
            const page = location.hash.slice(1);
            this._changePage(page);
        };
    }

    _changePage(page) {
        Array.from(document.getElementsByClassName('page_block')).forEach((el) => {
            el.style.display = 'none';
        });
        document.getElementById(`page_block_${page}`).style.display = 'block';
    }
}

module.exports = Router;
