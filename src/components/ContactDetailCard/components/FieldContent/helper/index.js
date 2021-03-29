export const LinkTypes = Object.freeze({
    None: 0,
    Mail: 1,
    Simple: 2,
});

export const FieldTypes = Object.freeze({
    Contact: 0,
    MelissaAddressRecord: 1,
    MelissaRecord: 2,
});

export const ConditionalWrap = ({ condition, wrap, children }) =>
    condition ? wrap(children) : children;


export const textFieldLabels = (field) => {
    const fieldsOpt = [
        "companyName",
        "jobTitle",
        "address2Alt",
        "address1Alt",
        "cityAlt",
        "stateAlt",
        "zipAlt",
        "countryAlt",
        "zip",
    ];
    const labelsOpt = [
        "Company Name",
        "Job Title",
        "Address2",
        "Address1",
        "City",
        "State",
        "ZipCode",
        "Country",
        "ZipCode",
    ];

    if (fieldsOpt.indexOf(field) !== -1) {
        return labelsOpt[fieldsOpt.indexOf(field)];
    }

    return field.charAt(0).toUpperCase() + field.slice(1);
};

export const getHrefValue = (linkValue, linkType) => {
    if (linkType == LinkTypes.Mail) return `mailto:${linkValue}`;
    if (linkType == LinkTypes.Simple)
        return `${!linkValue.startsWith("http") && !linkValue.startsWith("//") ? "//" : ""
            }${linkValue}`;
    else return linkValue;
};
