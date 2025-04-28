export function fixBigInt(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(fixBigInt);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'bigint') {
                newObj[key] = value.toString();
            } else if (typeof value === 'object') {
                newObj[key] = fixBigInt(value);
            } else {
                newObj[key] = value;
            }
        }
        return newObj;
    }
    return obj;
}
