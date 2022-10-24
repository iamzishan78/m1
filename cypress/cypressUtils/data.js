export const loginCredential = {
    email: "support@m1neral.com",
    passsword: "M1neral2022!"
}

export const baseUrls = {
    enerx: "https://enerxgraphql.azurewebsites.net/api/m1graph?code=Rhr8LQFXNnl/TE26EVD296voKbGVWZQDupqWAAWMaZXjzvgdvktPqg==",
    localhost: "http://localhost:7071/api/m1graph"
}

export const basic_timeouts = {
    shorTimeout: 5000,
    longTimeout: 100000,
    extraTimeout: 500000
}

export const documentObj = {
    fileNumber: "99934034",
    fileName: "Cydoc et el",
    fileAddress: "cypress/files/sample.pdf"
}

// Contact Grid Cypress Data
export const contactObj = {
    name: { value: "Jacob Steave Kyle", id: "" },
    firstName: { value: "Jacob", id: "#field-1" },
    middleName: { value: "Steave", id: "#field-2" },
    lastName: { value: "Kyle", id: "#field-3" },

    enityType: { value: "individual", id: "" },

    mobilePhone: { value: "083822883392", id: "#field-12" },
    homePhone: { value: "084933994403", id: "#field-11" },

    primaryEmail: { value: "cyp@m1neral.com", id: "#field-15" },

    address1: { value: "minCity, address 1", id: "#field-4" },
    address2: { value: "minCity, address 2", id: "#field-5" },

    city: { value: "Ytic", id: "#field-6" },
    state: { value: "La", id: "#field-7" },
    zip: { value: "7323", id: "#field-8" },
    country: { value: "Yrtnuoc", id: "" },

    contactOwner: { value: "Jacob", id: "" },

    fileAddress: "cypress/files/sample.pdf"
}

export const associatedDataList = [
    { name: 'Unit Interests', operationName: "getESPaginatedList", verifyElementId: "unitInterestTable" },
    { name: 'Well Interests', operationName: "getPaginatedContactWellInterests", verifyElementId: "wellInterestsTable" },
    { name: 'Tract Interests', operationName: "getContactParcelInterest", verifyElementId: "tractInterestTable" },
    { name: 'Tax Roll Interests', operationName: "getContactTaxRollInterests", verifyElementId: "taxInterestsTable" },
    { name: 'Activities', operationName: "getESSimpleSearch", verifyElementId: "activitiesInterestsTable" },
    { name: 'Documents', operationName: "viewFiles", verifyElementId: "viewDocuments" }
]
