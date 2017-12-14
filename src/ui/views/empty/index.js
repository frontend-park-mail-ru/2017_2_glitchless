import View from '../View';

export default class EmptyView extends View {
    open(root, data) {
        root.innerHTML = '';
    }
}
