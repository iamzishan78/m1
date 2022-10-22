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

export const isArraysEqual = (array1, array2) => {
    array1 = Array.isArray(array1) ? array1 : [];
    array2 = Array.isArray(array2) ? array2 : [];
    return array1.length === array2.length && array1.every((el, ix) => el === array2[ix]);
}

export const isApiWithSearchString = (searchString, variables) => {
    const searchQuery = variables?.search?.query || variables?.search

    if (typeof searchQuery === 'string') {
        if (searchQuery.substring(1, 2) === '*')
            searchString = `"*${searchString}*"`

        return searchQuery === searchString
    }
}
