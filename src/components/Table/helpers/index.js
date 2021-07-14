export const handleTagColumn = (TableHeader, cleanAvailableTags) => {
    return (cleanAvailableTags.length > 0
        ? TableHeader.map((column) => {
            if (column.name === "tags") {
                return {
                    ...column,
                    options: {
                        ...column.options,
                        filterOptions: {
                            ...column.options.filterOptions,
                            names: cleanAvailableTags,
                        },
                    },
                };
            }
            return column;
        })
        : TableHeader.map((column) => {
            if (column.name === "tags") {
                return {
                    ...column,
                    options: {
                        ...column.options,
                        filter: false,
                    },
                };
            }
            return column;
        },
        ))
}

export const handleCustomFilterColumns = (TableHeader, filterObject) => {
    return (
        filterObject && Object.keys(filterObject)?.length > 0
        ? TableHeader.map((column) => {
            if (Object.keys(filterObject).includes(column.name)) {
                return {
                    ...column,
                    options: {
                        ...column.options,
                        filterOptions: {
                            ...column.options.filterOptions,
                            names: filterObject[column.name]?.map((el) => el._id),
                        },
                    },
                };
            }
            return column;
        })
        : TableHeader
    )
}