import kt from 'kotlinApp';

/**
 * Requires kotlin package.
 * Allows to omit TypeScript type checking.
 *
 * @param name {String} Example: ru.glitchless.game
 */
export default function ktRequire(name) {
    let module = kt;
    name.split('.').forEach((part) => {
        module = module[part];
    });
    return module;
}
