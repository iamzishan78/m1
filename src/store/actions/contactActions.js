import { GET_CONTACT_CAMPAIGN } from 'store/type';

export const getContactCampaignAction = {
    STARTED: (payload) => ({ type: GET_CONTACT_CAMPAIGN.STARTED, payload }),
    FULLFILLED: (payload) => ({ type: GET_CONTACT_CAMPAIGN.FULLFILLED, payload }),
    REJECTED: () => ({ type: GET_CONTACT_CAMPAIGN.REJECTED })
  };
  