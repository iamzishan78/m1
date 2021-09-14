import CircularProgress from "@material-ui/core/CircularProgress";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { LinkTypes } from "../ContactDetailCard/components/FieldContent/helper";

const getCreateByRow = (contactData) => {
    return contactData?.createBy && contactData?.createBy.name === null ? (
        <span>
          <CircularProgress size={22} color="secondary" />
        </span>
      ) : (contactData?.createBy && contactData?.createBy.name) ||
        contactData?.createAt ? (
        `${
          contactData?.createBy && contactData?.createBy.name
            ? contactData?.createBy.name
            : ""
        }
      ${
        contactData?.createAt
          ? " - " + anyToDate(contactData?.createAt).toLocaleString()
          : ""
      }`
      ) : (
        <p>Not Available</p>
      );      
}

const getLastUpdateByRow = (contactData) => {
    return contactData?.lastUpdateBy && contactData?.lastUpdateBy.name === null ? (
        <span>
          <CircularProgress size={22} color="secondary" />
        </span>
      ) : (contactData?.lastUpdateBy && contactData?.lastUpdateBy.name) ||
        contactData?.lastUpdateAt ? (
        `${
          contactData?.lastUpdateBy && contactData?.lastUpdateBy.name
            ? contactData?.lastUpdateBy.name
            : ""
        }
      ${
        contactData?.lastUpdateAt
          ? " - " + anyToDate(contactData?.lastUpdateAt).toLocaleString()
          : ""
      }`
      ) : (
        <p>Not Available</p>
      );
} 

export const getBasicInfoExpContent = (contactData) => {
  return {
    "Email 2": {
      data: { secondaryEmail: contactData?.secondaryEmail },
      linkType: LinkTypes.Mail,
    },
    "Email 3": {
      data: { email3: contactData?.email3 },
      linkType: LinkTypes.None,
    },
    "Mobile Phone 2": {
      data: { mobilephone2: contactData?.mobilephone2 },
      linkType: LinkTypes.None,
    },
    "Mobile Phone 3": {
      data: { mobilephone3: contactData?.mobilephone3 },
      linkType: LinkTypes.None,
    },
    Age: {
      data: { age: contactData?.age },
      linkType: LinkTypes.None,
    },
    "Relative Names": {
      data: { relatives: contactData?.relatives },
      linkType: LinkTypes.None,
    },
    "Home Phone 2": {
      data: { homePhone2: contactData?.homePhone2 },
      linkType: LinkTypes.None,
    },
    "Home Phone 3": {
      data: { homePhone3: contactData?.homePhone3 },
      linkType: LinkTypes.None,
    },
    "Work Phone 2": {
      data: { AltPhone2: contactData?.AltPhone2 },
      linkType: LinkTypes.None,
    },
    "Work Phone 3": {
      data: { AltPhone3: contactData?.AltPhone3 },
      linkType: LinkTypes.None,
    },
    "LinkedIn Profile": {
      data: { linkedIn: contactData?.linkedIn },
      linkType: LinkTypes.Simple,
    },
    "Facebook Profile": {
      data: { facebook: contactData?.facebook },
      linkType: LinkTypes.Simple,
    },
    "Twitter Profile": {
      data: { twitter: contactData?.twitter },
      linkType: LinkTypes.Simple,
    },
    Website: {
      data: { website: contactData?.website },
      linkType: LinkTypes.None,
    },
    "Industry Type": {
      data: { industryType: contactData?.industryType },
      linkType: LinkTypes.None,
    },

    "Campaign Name": {
      data: { campaignName: contactData?.campaignName },
      linkType: LinkTypes.None,
    },
    "Lead Source": {
      data: { leadSource: contactData?.leadSource },
      linkType: LinkTypes.None,
    },

    "Time Zone": {
      data: { timeZone: contactData?.timeZone },
      linkType: LinkTypes.None,
    },
    Territory: {
      data: { territory: contactData?.territory },
      linkType: LinkTypes.None,
    },
    Status: {
      data: { status: contactData?.status },
      linkType: LinkTypes.None,
    },
    "Contact Owner": {
      data: {
        contactOwner: contactData?.contactOwner,
        contactOwnerId: contactData?.contactOwnerId,
      },
      linkType: LinkTypes.None,
    },
    "Created By": {
      data: { createByRow: getCreateByRow(contactData) },
      linkType: LinkTypes.None,
      inner: getCreateByRow(contactData),
    },
    "Last Updated By": {
      data: { lastUpdateByRow: getLastUpdateByRow(contactData) },
      linkType: LinkTypes.None,
      inner: getLastUpdateByRow(contactData),
    },
  };
};

export const getBasicInfoContent = (contactData) => {
  return {
    "Primary Email": {
      data: { primaryEmail: contactData?.primaryEmail },
      linkType: LinkTypes.Mail,
    },
    "Primary Mobile Phone": {
      data: { mobilePhone: contactData?.mobilePhone },
      linkType: LinkTypes.None,
    },
    "Primary Home Phone": {
      data: { homePhone: contactData?.homePhone },
      linkType: LinkTypes.None,
    },
    "Primary Work Phone": {
      data: { AltPhone: contactData?.AltPhone },
      linkType: LinkTypes.None,
    },
    "Primary Address": {
      data: {
        address1: contactData?.address1,
        address2: contactData?.address2,
        city: contactData?.city,
        state: contactData?.state,
        zip: contactData?.zip,
        country: contactData?.country,
      },
      linkType: LinkTypes.None,
    },
    "Secondary Address": {
      data: {
        address1Alt: contactData?.address1Alt,
        address2Alt: contactData?.address2Alt,
        cityAlt: contactData?.cityAlt,
        stateAlt: contactData?.stateAlt,
        zipAlt: contactData?.zipAlt,
        countryAlt: contactData?.countryAlt,
      },
      linkType: LinkTypes.None,
    },
  };
};
