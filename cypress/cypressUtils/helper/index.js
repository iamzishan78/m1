import _ from "underscore";

// This helper will match string with each key of object to check if string exists in object or not
export const findInObject = (obj, stringToCheck) => {
    const objectKeys = Object.keys(obj);
    // eslint-disable-next-line array-callback-return
    return objectKeys.some(function (key) {

        const objectValue = obj[key]
        if (objectValue) {
            if (typeof objectValue === 'string' && objectValue.toLowerCase().includes(stringToCheck.toLowerCase()))
                return true
            else if (typeof objectValue === 'object' && !_.isEmpty(objectValue) && findInObject(objectValue, stringToCheck))
                return true
            else if (Array.isArray(objectValue) && objectValue.some(data => findInObject(data, stringToCheck)))
                return true
        }
    });
}

