import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ConvertTaxOwnerToContact from "components/MapControls/components/popup/ConvertTaxOwnerToContact"
import { getShapeOwnersAndCountAction } from 'store/actions/ownerActions';
import { getContactCampaignAction } from 'store/actions/contactActions';

const convertTaxOwnerProps = state => {
  const { campaignList } = state.contact;
  const { shapeCount, shapeOwners } = state.owner;
  return {
    shapeCount,
    shapeOwners,
    campaignList
  }
};

const convertTaxOwnerDispatch = (dispatch) => {
  return bindActionCreators(
    {
        getShapeOwnersAndCountAction: getShapeOwnersAndCountAction.STARTED,
        getContactCampaignAction: getContactCampaignAction.STARTED
    },
    dispatch
  );
};
export const ConvertTaxOwnerToContactContainer = connect(convertTaxOwnerProps, convertTaxOwnerDispatch)(ConvertTaxOwnerToContact);