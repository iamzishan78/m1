import CircularProgress from "@material-ui/core/CircularProgress";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { LinkTypes } from "../ContactDetailCard/components/FieldContent/helper";
import moment from "moment";

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
    "Full Name": {
      data: { name: contactData?.name },
      linkType: LinkTypes.None,
    },
    "First Name": {
      data: { firstName: contactData?.firstName },
      linkType: LinkTypes.None,
    },
    "Middle Name": {
      data: { middleName: contactData?.middleName },
      linkType: LinkTypes.None,
    },
    "Last Name": {
      data: { lastName: contactData?.lastName },
      linkType: LinkTypes.None,
    },

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

export const getBasicPurchaseInfoExpContent = (contactData) => {
  return {
    "Full Name": {
      data: { fullName: contactData?.fullName },
      linkType: LinkTypes.None,
    },
    "First Name": {
      data: { firstName: contactData?.firstName },
      linkType: LinkTypes.None,
    },
    "Last Name": {
      data: { lastName: contactData?.lastName },
      linkType: LinkTypes.None,
    },
    "Age": {
      data: { age: contactData?.age },
      linkType: LinkTypes.None,
    },
    "Deceased": {
      data: { age: contactData?.deceased },
      linkType: LinkTypes.None,
    },
    "Bankruptcy": {
      data: { age: contactData?.bankruptcy },
      linkType: LinkTypes.None,
    },
    "Lien": {
      data: { age: contactData?.lien },
      linkType: LinkTypes.None,
    },
    "Current Address": {
      data: { currentAddress: contactData?.currentAddress },
      linkType: LinkTypes.None,
    },
    "Current Address Date Range": {
      data: { currentAddressDateRange: contactData?.currentAddressDateRange },
      linkType: LinkTypes.None,
    },
    "Previous Address 1": {
      data: { previousAddress1: contactData?.previousAddress1 },
      linkType: LinkTypes.None,
    },
    "Previous Address 1 Date Range": {
      data: { previousAddress1DateRange: contactData?.previousAddress1DateRange },
      linkType: LinkTypes.None,
    },
    "Previous Address 2": {
      data: { previousAddress2: contactData?.previousAddress2 },
      linkType: LinkTypes.None,
    },
    "Previous Address 2 Date Range": {
      data: { previousAddress2DateRange: contactData?.previousAddress2DateRange },
      linkType: LinkTypes.None,
    },
    "Previous Address 3": {
      data: { previousAddress3: contactData?.previousAddress3 },
      linkType: LinkTypes.None,
    },
    "Previous Address 3 Date Range": {
      data: { previousAddress3DateRange: contactData?.previousAddress3DateRange },
      linkType: LinkTypes.None,
    },
    "Phone 1": {
      data: { phone1: contactData?.phone1 },
      linkType: LinkTypes.None,
    },
    "Phone 1 Type": {
      data: { phone1Type: contactData?.phone1Type },
      linkType: LinkTypes.None,
    },
    "Phone 1 Last Seen": {
      data: { phone1LastSeen: contactData?.phone1LastSeen ? moment(contactData.phone1LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Phone 2": {
      data: { phone2: contactData?.phone2 },
      linkType: LinkTypes.None,
    },
    "Phone 2 Type": {
      data: { phone2Type: contactData?.phone2Type },
      linkType: LinkTypes.None,
    },
    "Phone 2 Last Seen": {
      data: { phone2LastSeen: contactData?.phone2LastSeen ? moment(contactData.phone2LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Phone 3": {
      data: { phone3: contactData?.phone3 },
      linkType: LinkTypes.None,
    },
    "Phone 3 Type": {
      data: { phone3Type: contactData?.phone3Type },
      linkType: LinkTypes.None,
    },
    "Phone 3 Last Seen": {
      data: { phone3LastSeen: contactData?.phone3LastSeen ? moment(contactData.phone3LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Phone 4": {
      data: { phone4: contactData?.phone4 },
      linkType: LinkTypes.None,
    },
    "Phone 4 Type": {
      data: { phone4Type: contactData?.phone4Type },
      linkType: LinkTypes.None,
    },
    "Phone 4 Last Seen": {
      data: { phone4LastSeen: contactData?.phone4LastSeen ? moment(contactData.phone4LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Phone 5": {
      data: { phone5: contactData?.phone5 },
      linkType: LinkTypes.None,
    },
    "Phone 5 Type": {
      data: { phone5Type: contactData?.phone5Type },
      linkType: LinkTypes.None,
    },
    "Phone 5 Last Seen": {
      data: { phone5LastSeen: contactData?.phone5LastSeen ? moment(contactData.phone5LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Email 1": {
      data: { email1: contactData?.email1 },
      linkType: LinkTypes.None,
    },
    "Email 1 Last Seen": {
      data: { email1LastSeen: contactData?.email1LastSeen ? moment(contactData.email1LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Email 2": {
      data: { email2: contactData?.email2 },
      linkType: LinkTypes.None,
    },
    "Email 2 Last Seen": {
      data: { email2LastSeen: contactData?.email2LastSeen ? moment(contactData.email2LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Email 3": {
      data: { email3: contactData?.email3 },
      linkType: LinkTypes.None,
    },
    "Email 3 Last Seen": {
      data: { email3LastSeen: contactData?.email3LastSeen ? moment(contactData.email3LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Email 4": {
      data: { email4: contactData?.email4 },
      linkType: LinkTypes.None,
    },
    "Email 4 Last Seen": {
      data: { email4LastSeen: contactData?.email4LastSeen ? moment(contactData.email4LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Email 5": {
      data: { email5: contactData?.email5 },
      linkType: LinkTypes.None,
    },
    "Email 5 Last Seen": {
      data: { email5LastSeen: contactData?.email5LastSeen ? moment(contactData.email5LastSeen).format('MM/DD/YYYY'): null },
      linkType: LinkTypes.None,
    },
    "Relative 1 First Name": {
      data: { relative1FirstName: contactData?.relative1FirstName },
      linkType: LinkTypes.None,
    },
    "Relative 1 Last Name": {
      data: { relative1LastName: contactData?.relative1LastName },
      linkType: LinkTypes.None,
    },
    "Relative 1 Age": {
      data: { relative1Age: contactData?.relative1Age },
      linkType: LinkTypes.None,
    },
    "Relative 1 Phone 1": {
      data: { relative1Phone1: contactData?.relative1Phone1 },
      linkType: LinkTypes.None,
    },
    "Relative 1 Phone 2": {
      data: { relative1Phone2: contactData?.relative1Phone2 },
      linkType: LinkTypes.None,
    },
    "Relative 1 Phone 3": {
      data: { relative1Phone3: contactData?.relative1Phone3 },
      linkType: LinkTypes.None,
    },
    "Relative 2 First Name": {
      data: { relative2FirstName: contactData?.relative2FirstName },
      linkType: LinkTypes.None,
    },
    "Relative 2 Last Name": {
      data: { relative2LastName: contactData?.relative2LastName },
      linkType: LinkTypes.None,
    },
    "Relative 2 Age": {
      data: { relative2Age: contactData?.relative2Age },
      linkType: LinkTypes.None,
    },
    "Relative 2 Phone 1": {
      data: { relative2Phone1: contactData?.relative2Phone1 },
      linkType: LinkTypes.None,
    },
    "Relative 2 Phone 2": {
      data: { relative2Phone2: contactData?.relative2Phone2 },
      linkType: LinkTypes.None,
    },
    "Relative 2 Phone 3": {
      data: { relative2Phone3: contactData?.relative2Phone3 },
      linkType: LinkTypes.None,
    },
    "Relative 3 First Name": {
      data: { relative3FirstName: contactData?.relative3FirstName },
      linkType: LinkTypes.None,
    },
    "Relative 3 Last Name": {
      data: { relative3LastName: contactData?.relative3LastName },
      linkType: LinkTypes.None,
    },
    "Relative 3 Age": {
      data: { relative3Age: contactData?.relative3Age },
      linkType: LinkTypes.None,
    },
    "Relative 3 Phone 1": {
      data: { relative3Phone1: contactData?.relative3Phone1 },
      linkType: LinkTypes.None,
    },
    "Relative 3 Phone 2": {
      data: { relative3Phone2: contactData?.relative3Phone2 },
      linkType: LinkTypes.None,
    },
    "Relative 3 Phone 3": {
      data: { relative3Phone3: contactData?.relative3Phone3 },
      linkType: LinkTypes.None,
    },
    "Relative 4 First Name": {
      data: { relative4FirstName: contactData?.relative4FirstName },
      linkType: LinkTypes.None,
    },
    "Relative 4 Last Name": {
      data: { relative4LastName: contactData?.relative4LastName },
      linkType: LinkTypes.None,
    },
    "Relative 4 Age": {
      data: { relative4Age: contactData?.relative4Age },
      linkType: LinkTypes.None,
    },
    "Relative 4 Phone 1": {
      data: { relative4Phone1: contactData?.relative4Phone1 },
      linkType: LinkTypes.None,
    },
    "Relative 4 Phone 2": {
      data: { relative4Phone2: contactData?.relative4Phone2 },
      linkType: LinkTypes.None,
    },
    "Relative 4 Phone 3": {
      data: { relative4Phone3: contactData?.relative4Phone3 },
      linkType: LinkTypes.None,
    },
    "Relative 5 First Name": {
      data: { relative5FirstName: contactData?.relative5FirstName },
      linkType: LinkTypes.None,
    },
    "Relative 5 Last Name": {
      data: { relative5LastName: contactData?.relative5LastName },
      linkType: LinkTypes.None,
    },
    "Relative 5 Age": {
      data: { relative5Age: contactData?.relative5Age },
      linkType: LinkTypes.None,
    },
    "Relative 5 Phone 1": {
      data: { relative5Phone1: contactData?.relative5Phone1 },
      linkType: LinkTypes.None,
    },
    "Relative 5 Phone 2": {
      data: { relative5Phone2: contactData?.relative5Phone2 },
      linkType: LinkTypes.None,
    },
    "Relative 5 Phone 3": {
      data: { relative5Phone3: contactData?.relative5Phone3 },
      linkType: LinkTypes.None,
    },
  };
};

export const getBasicPurchaseInfoContent = (contactData) => {
  return {
    "Full Name": {
      data: { fullName: contactData?.fullName },
      linkType: LinkTypes.None,
    },
    "Age": {
      data: { age: contactData?.age },
      linkType: LinkTypes.None,
    },
    "Deceased": {
      data: { age: contactData?.deceased },
      linkType: LinkTypes.None,
    },
    "Bankruptcy": {
      data: { age: contactData?.bankruptcy },
      linkType: LinkTypes.None,
    },
    "Lien": {
      data: { age: contactData?.lien },
      linkType: LinkTypes.None,
    },
    "Current Address": {
      data: { currentAddress: contactData?.currentAddress },
      linkType: LinkTypes.None,
    },
    "Phone 1": {
      data: { phone1: contactData?.phone1 },
      linkType: LinkTypes.None,
    },
    "Email 1": {
      data: { email1: contactData?.email1 },
      linkType: LinkTypes.None,
    }
  };
};
