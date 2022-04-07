
export const addAfterLabel = (data, label, insertData) => {
    const index = data.findIndex((row) => row.label === label)
    data.splice(index, 0, insertData);
}

export const removeByLabel = (data, label) => {
    return data.filter((row) => row.label !== label)
}