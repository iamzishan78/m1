// this function is intended to help make address better formatted for FE  
import capitalizeFirstLetter from "./capitalize-first-letter.js";


export default function joinAddress(value) {

    const valueFormatter = (row) => {
    let rowData = {
        StreetAddress: row.StreetAddress,
        City: row.City,
        State: row.State,
        Zip: row.Zip,
        Country: row.Country,
    };
    
    let textArray = [];
    for (const key in rowData) {
        if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
        if (key === "Zip" || key === "Country") {
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
