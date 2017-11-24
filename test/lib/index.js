const displayTests = require('./displayTests.ts');
const suite = require('../tests');

displayTests(document.getElementById('tests-container'), suite.run());