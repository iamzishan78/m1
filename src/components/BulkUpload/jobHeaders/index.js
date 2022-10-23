const UNITS = require("./UNITS").default;
const TRACTS = require("./TRACTS").default;
const CONTACTS = require("./CONTACTS").default;
const SHAPEOWNER = require("./SHAPEOWNER").default;
const PROPERTIES = require("./PROPERTIES").default;
const CHECKDETAILS = require("./CHECKDETAILS").default;
const PARCELINTERESTS = require("./PARCELINTERESTS").default;
const AGREEMENT_SHAPE = require("./AGREEMENT_SHAPE").default;
const AGREEMENT_HEADER = require("./AGREEMENT_HEADER").default;
const AGREEMENT_PROVISIONS = require("./AGREEMENT_PROVISIONS").default;
const CONTACTS_WELL_INTEREST = require("./CONTACTS_WELL_INTEREST").default;
const AGREEMENT_RELATED_WELLS = require("./AGREEMENT_RELATED_WELLS").default;
const AGREEMENT_RELATED_TRACTS = require("./AGREEMENT_RELATED_TRACTS").default;

const exportData = { 
    UNITS,
    TRACTS,
    CONTACTS, 
    PROPERTIES,
    SHAPEOWNER,
    CHECKDETAILS,
    AGREEMENT_SHAPE,
    PARCELINTERESTS, 
    AGREEMENT_HEADER,
    AGREEMENT_PROVISIONS,
    CONTACTS_WELL_INTEREST,
    AGREEMENT_RELATED_WELLS, 
    AGREEMENT_RELATED_TRACTS
}
export default exportData

export const addAfterLabel = (data, label, insertData) => {
    const index = data.findIndex((row) => row.label === label)
    data.splice(index, 0, insertData);
}

export const removeByLabel = (data, label) => {
    return data.filter((row) => row.label !== label)
}