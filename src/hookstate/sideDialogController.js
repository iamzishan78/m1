import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

export const initialState = {
  newOwner: false,
  surface_interest: null,
  ownerType: null,
  cost_bearing: null,
  cost_bearing_high_value: null,
  cost_free_high_value: null,
  mineral_interest: null,
  royalty_interest: null,
  orri: null,
  unknown_interest: null,
  record_title: null,
  operating_rights: null,
  nri: null,
  net_acres: null,
  company_net_acres: null,
  depthFrom: "All depths",
  depthTo: "All depths",
  nra: null,
  qtr: [
    null,
    null,
    null,
    null
  ],
  customLayer: null,
  deals: [],
  nonExecRightsOnly: null,
  offer_price_nma: null,
  max_offer_price_nma: null,
  offer_price: null,
  max_offer_price: null,
  seller_asking_price: null,
  competitor_offer_price: null,
  actual_offer_price: null,
  contactStatus: null,
  status: null,
  campaignName: [],
  campaignPriority: null,
  leaseStatus: null,
  ownerEntity: null,
  name: null,
  relatedObject: null,
  working_interest: null,
  unitTractId: null,
  tractAcres: null,
  dataSource: null,
};

export const sideDialogState = hookstate(copy(initialState));

const sideDialogStateControllerHandler = () => ({

});

export const sideDialogController = {
  ...sideDialogStateControllerHandler(sideDialogState),
  ...hookStateController(sideDialogState, initialState),
};
