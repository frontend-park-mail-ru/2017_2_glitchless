/**
 * Registers necessary listeners on form.
 *
 * @param form {Node} DOM node of form
 */
function initFormForDisplayErrors(form) {
    for (let i = 0; i < form.elements.length; i++) {
        const node = form.elements.item(i);
        node.oninput = (event) => {
	        event.target.setCustomValidity(''); 
	    };
    }
}

/**
 * Shows errors on form.
 *
 * Spec of error object:
 * {
 *   field: {String}
 *   message: {String}
 * }
 *
 * @param form {Node} DOM node of form
 * @param errors {Array} Array of error objects
 */
function displayErrors(form, errors) {
    errors.forEach((error) => {
        form.elements[error.field].setCustomValidity(error.message);
    });
}

module.exports = {
    initFormForDisplayErrors,
    displayErrors
};
