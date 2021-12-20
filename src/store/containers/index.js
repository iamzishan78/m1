import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ConvertTaxOwnerToContact from "components/MapControls/components/popup/ConvertTaxOwnerToContact";
import ExportWellsOwners from "components/MapControls/components/popup/ExportWellsOwners";
import {
  getShapeOwnersAndCountAction,
  getMapFilterShapeOwnersAndCountAction,
} from "store/actions/ownerActions";
import {
  getContactCampaignAction,
  convertTaxOwnerToContactAction,
} from "store/actions/contactActions";
import { getShapeOwnersSelectors } from "store/selectors/index";

const convertTaxOwnerProps = (state) => {
  const { campaignList } = state.contact;
  const { shapeCount } = state.owner;
  return {
    shapeOwners: getShapeOwnersSelectors(state),
    shapeCount,
    campaignList,
  };
};

const convertTaxOwnerDispatch = (dispatch) => {
  return bindActionCreators(
    {
      getMapFilterShapeOwnersAndCountAction:
        getMapFilterShapeOwnersAndCountAction.STARTED,
      convertTaxOwnerToContactAction: convertTaxOwnerToContactAction.STARTED,
      getShapeOwnersAndCountAction: getShapeOwnersAndCountAction.STARTED,
      getContactCampaignAction: getContactCampaignAction.STARTED,
    },
    dispatch
  );
};
export const ConvertTaxOwnerToContactContainer = connect(
  convertTaxOwnerProps,
  convertTaxOwnerDispatch
)(ConvertTaxOwnerToContact);

const exportWellsOwnersProps = (state) => {
  const { campaignList } = state.contact;
  const { shapeCount } = state.owner;
  return {
    shapeCount,
    campaignList,
  };
};

const exportWellsOwnersDispatch = (dispatch) => {
  return bindActionCreators(
    {
      getShapeOwnersAndCountAction: getShapeOwnersAndCountAction.STARTED,
      getContactCampaignAction: getContactCampaignAction.STARTED,
    },
    dispatch
  );
};
export const ExportWellsOwnersContainer = connect(
  exportWellsOwnersProps,
  exportWellsOwnersDispatch
)(ExportWellsOwners);
