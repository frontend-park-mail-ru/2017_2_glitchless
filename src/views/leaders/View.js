import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';
import rowTemplate from './row-template.pug';
import assert from '../../utils/assert';

class LeadersModalView extends View {
    get template() {
        return template;
    }

    open(root) {
        const modals = root.getElementsByClassName('modal__body');
        assert(modals.length === 1);
        const entriesRoot = modals[0];

        let i = 0;
        this.serviceLocator.leaderboard.scores.forEach((nickname, score) => {
            const newElem = document.createElement('div');
            const position = i++;
            newElem.innerHTML = rowTemplate({position, nickname, score});
            entriesRoot.appendChild(newElem);
        });
    }
}

LeadersModalView = TemplatedViewMixin(RouterLinksViewMixin(LeadersModalView));

export default LeadersModalView;
