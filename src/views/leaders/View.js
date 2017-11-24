import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';
import rowTemplate from './row-template.pug';

class LeadersModalView extends View {
    constructor(serviceLocator) {
        super(serviceLocator);
        this.pageId = 0;
        this.entriesPerPage = 4;
    }

    get template() {
        return template;
    }

    open(root) {
        this._fillEntries();
        this._setupPagination();
    }

    _fillEntries() {
        const entriesRoot = document.getElementById('leaders');

        entriesRoot.innerHTML = '';

        let i = 0;
        this.serviceLocator.leaderboard.scoresSorted.forEach((entry) => {
            const loopPageId = Math.floor(i / this.entriesPerPage);
            if (this.pageId !== loopPageId) {
                i++;
                return;
            }
            const newElem = document.createElement('div');
            entriesRoot.appendChild(newElem);
            newElem.outerHTML = rowTemplate({position: i + 1, nickname: entry.user, score: entry.score});
            i++;
        });
    }

    _setupPagination() {
        document.getElementById('leaders-pagination-prev').addEventListener('click', () => {
            if (this.pageId <= 0) {
                return;
            }
            this.pageId--;
            this._fillEntries();
        });

        document.getElementById('leaders-pagination-next').addEventListener('click', () => {
            if (this.pageId >= Math.floor(this.serviceLocator.leaderboard.scores.size / this.entriesPerPage) - 1) {
                return;
            }
            this.pageId++;
            this._fillEntries();
        });
    }
}

LeadersModalView = TemplatedViewMixin(RouterLinksViewMixin(LeadersModalView));

export default LeadersModalView;
