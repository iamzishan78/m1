const CONTACTS = require("./CONTACTS").default;
const TRACTS = require("./TRACTS").default;
const UNITS = require("./UNITS").default;
const PARCELINTERESTS = require("./PARCELINTERESTS").default;
const SHAPEOWNER = require("./SHAPEOWNER").default;
const CHECKDETAILS = require("./CHECKDETAILS").default;
const PROPERTIES = require("./PROPERTIES").default;
const CONTACTS_WELL_INTEREST = require("./CONTACTS_WELL_INTEREST").default;
const AGREEMENT_SHAPE = require("./AGREEMENT_SHAPE").default;
const AGREEMENT_HEADER = require("./AGREEMENT_HEADER").default;

const eportData = { CONTACTS, TRACTS, UNITS, PARCELINTERESTS, SHAPEOWNER, CHECKDETAILS, PROPERTIES, CONTACTS_WELL_INTEREST, AGREEMENT_SHAPE, AGREEMENT_HEADER }
export default eportData

export const addAfterLabel = (data, label, insertData) => {
    const index = data.findIndex((row) => row.label === label)
    data.splice(index, 0, insertData);
}

export const removeByLabel = (data, label) => {
    return data.filter((row) => row.label !== label)
}