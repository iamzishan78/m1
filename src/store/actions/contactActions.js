import { GET_CONTACT_CAMPAIGN, CONVERT_TAX_OWNER_TO_CONTACT } from "store/type";

export const getContactCampaignAction = {
  STARTED: (payload) => ({ type: GET_CONTACT_CAMPAIGN.STARTED, payload }),
  FULLFILLED: (payload) => ({ type: GET_CONTACT_CAMPAIGN.FULLFILLED, payload }),
  REJECTED: () => ({ type: GET_CONTACT_CAMPAIGN.REJECTED }),
};

export const convertTaxOwnerToContactAction = {
  STARTED: (payload) => ({ type: CONVERT_TAX_OWNER_TO_CONTACT.STARTED, payload }),
  FULLFILLED: (payload) => ({ type: CONVERT_TAX_OWNER_TO_CONTACT.FULLFILLED, payload }),
  REJECTED: () => ({ type: CONVERT_TAX_OWNER_TO_CONTACT.REJECTED }),
};
