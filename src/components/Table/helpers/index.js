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
                        filter: true,
                    },
                };
            }
            return column;
        },
        ))
}