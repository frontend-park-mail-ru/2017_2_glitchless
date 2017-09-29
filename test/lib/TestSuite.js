class TestSuite {
    constructor() {
        this.tests = [];
    }

    addTest(name, func) {
        this.tests.push({name, func});
    }

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