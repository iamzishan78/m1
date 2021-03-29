// this function is intended to help make address better formatted for FE  
import capitalizeFirstLetter from "./capitalize-first-letter.js";


export default function joinAddress(value) {

    const valueFormatter = (row) => {
        let rowData = {
            StreetAddress: row.StreetAddress || row.address1,
            City: row.City || row.city,
            State: row.State || row.state,
            Zip: row.Zip || row.zip,
            Country: row.Country || row.country,
        };

        let textArray = [];
        for (const key in rowData) {
            if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
                if (key === "Zip" || key === "Country" || key === "zip" || key === "country") {
                    textArray = [
                        [textArray.join(", "), capitalizeFirstLetter(rowData[key])].join(" "),
                    ];
                } else textArray.push(capitalizeFirstLetter(rowData[key]));
            }
        }

        return textArray.join(", ");
    };


    return valueFormatter(value)
}
