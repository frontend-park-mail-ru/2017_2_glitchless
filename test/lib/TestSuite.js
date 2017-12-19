/**
 * Holds and runs tests.
 */
class TestSuite {
    constructor() {
        this.tests = [];
    }

    /**
     * Adds test to suite.
     *
     * @param name Test description
     * @param func Function to execute
     */
    addTest(name, func) {
        this.tests.push({name, func});
    }

    /**
     * Runs all tests.
     *
     * Spec of result:
     * {
     *   name: {String},
     *   ok: {Boolean},
     *   message: {String}
     * }
     *
     * @return {Array} Array of results
     */
    run() {
        return this.tests.map((test) => {
            let message = 'ok!';
            let ok = true;
            try {
                test.func();
            } catch (e) {
                message = `${e.message}\n\n${e.stack}`;
                ok = false;
            }
            return {name: test.name, ok, message};
        });
    }
}

module.exports = TestSuite;
