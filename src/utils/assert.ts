export default function(condition: boolean, message: string = 'Assertion error') {
    if (!condition) {
        throw new Error(message);
    }
}
