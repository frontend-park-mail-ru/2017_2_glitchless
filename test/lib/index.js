const displayTests = require('./displayTests');
const suite = require('../tests');

displayTests(document.getElementById('tests-container'), suite.run());
