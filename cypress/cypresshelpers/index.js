// This helper will match string with each key of object to check if string exists in object or not
export const findInObject = (obj, stringToCheck) => {
    const objectKeys = Object.keys(obj);

    // eslint-disable-next-line array-callback-return
    return objectKeys.some(function (key) {
        const objectValue = obj[key]

        if (typeof objectValue === 'string' && objectValue.toLowerCase().includes(stringToCheck))
            return true
        else if (typeof objectValue === 'object' && objectValue.length && findInObject(objectValue, stringToCheck))
            return true
        else if (Array.isArray(objectValue) && objectValue.some(data => findInObject(data, stringToCheck)))
            return true

    });
}

