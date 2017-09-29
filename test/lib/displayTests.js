function displayTests(rootEl, results) {
    const templateEl = document.getElementById('template-test').firstElementChild;

    results.forEach((result) => {
        const testEl = templateEl.cloneNode(true);

        const header = testEl.getElementsByClassName('test__header')[0];
        header.innerText = result.name;
        header.classList.add(result.ok ? 'test__header--success' : 'test__header--fail');

        const message = testEl.getElementsByClassName('test__message')[0];
        message.innerText = result.message;

        rootEl.appendChild(testEl);
    });
}

module.exports = displayTests;