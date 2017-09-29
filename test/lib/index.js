const displayTests = require('./displayTests.js');
const suite = require('../tests.js');

displayTests(document.getElementById('tests-container'), suite.run());