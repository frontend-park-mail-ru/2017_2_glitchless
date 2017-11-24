export function objToMap(obj, map = null) {
    if (map === null) {
        map = new Map();
    }
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            map.set(k, obj[k]);
        }
    }
    return map;
}

export function mapToObj(map, obj = null) {
    if (obj === null) {
        obj = {};
    }
    map.forEach((k, v) => {
        obj[k] = v;
    });
    return obj;
}
