const views = [
    require('./page_block_game/index.js'),
    require('./page_block_login/index.js'),
    require('./page_block_signup/index.js'),
    require('./menu/index.js')
];

/**
 * Setups all views.
 *
 * @param serviceLocator Instance of service locator.
 */
function init(serviceLocator) {
    views.forEach((initFunc) => initFunc(serviceLocator));
}

module.exports = init;