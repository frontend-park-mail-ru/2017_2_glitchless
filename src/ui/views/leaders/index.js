import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../../mixins/ModalShadeViewMixin';
import template from './template.pug';
import rowTemplate from './row-template.pug';
import './style.scss'

class LeadersModalView extends View {
    constructor(serviceLocator) {
        super(serviceLocator);
        this.leaderboard = this.serviceLocator.leaderboard;
        this.pageId = 0;
        this.entriesPerPage = 4;
    }

    get template() {
        return template;
    }

    open(root) {
        this._doWhenLoaded(() => {
            this._fillEntries();
            this._setupOfflineNotice();
            this._setupPagination();
        });
    }

    _doWhenLoaded(func) {
        if (this.leaderboard.isLoading) {
            setTimeout(this._doWhenLoaded.bind(this, func), 100);
            return;
        }
        func();
    }

    _fillEntries() {
        const entriesRoot = document.getElementById('leaders');

        entriesRoot.innerHTML = '';

        let i = 0;
        this.leaderboard.scoresSorted.forEach((entry) => {
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
            if (this.pageId >= Math.floor(this.leaderboard.scores.size / this.entriesPerPage) - 1) {
                return;
            }
            this.pageId++;
            this._fillEntries();
        });
    }

    _setupOfflineNotice() {
        const offlineElem = this.root.getElementsByClassName('leaders-controls__offline')[0];
        offlineElem.classList.toggle('hidden', !this.leaderboard.isOffline);
    }
}

LeadersModalView = TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(LeadersModalView)));

export default LeadersModalView;
