import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

import ConvertTaxOwnerToContact from 'components/MapControls/components/popup/ConvertTaxOwnerToContact';
import ExportWellsOwners from 'components/MapControls/components/popup/ExportWellsOwners';
import AssignOwnerToContactDrawer from 'components/MRTTable/Common/Components/AssignOwnerToContactDrawer';
import MultipleOwnerToContactDrawer from 'components/MRTTable/Common/Components/MultipleOwnerToContactDrawer';

import {
	getContactCampaignAction,
	convertTaxOwnerToContactAction,
	convertMultipleOwnerToContactAction,
} from 'store/actions/contactActions';
import {
	getShapeOwnersAndWellsAction,
	getShapeOwnersAndCountAction,
	getMapFilterShapeOwnersAndWellsAction,
	getMapFilterShapeOwnersAndCountAction,
	execAsyncExportJobAction,
} from 'store/actions/ownerActions';
import { getShapeOwnersSelectors } from 'store/selectors/index';

import { showSuccessMessage } from 'actions';

const AssignOwnerToContactDrawerProps = state => {
	const { campaignList } = state.contact;
	return {
		campaignList,
	};
};

const AssignOwnerToContactDrawerDispatch = dispatch => {
	return bindActionCreators(
		{
			showSuccessMessage,
			getContactCampaignAction: getContactCampaignAction.STARTED,
			convertMultipleOwnerToContactAction: convertMultipleOwnerToContactAction.STARTED,
		},
		dispatch
	);
};

export const AssignOwnerToContactDrawerContainer = connect(
	AssignOwnerToContactDrawerProps,
	AssignOwnerToContactDrawerDispatch
)(AssignOwnerToContactDrawer);

const MultipleOwnerToContactDrawerProps = state => {
	const { campaignList } = state.contact;
	return {
		campaignList,
	};
};

const MultipleOwnerToContactDrawerDispatch = dispatch => {
	return bindActionCreators(
		{
			getContactCampaignAction: getContactCampaignAction.STARTED,
			convertMultipleOwnerToContactAction: convertMultipleOwnerToContactAction.STARTED,
		},
		dispatch
	);
};

export const MultipleOwnerToContactDrawerContainer = connect(
	MultipleOwnerToContactDrawerProps,
	MultipleOwnerToContactDrawerDispatch
)(MultipleOwnerToContactDrawer);

const convertTaxOwnerProps = state => {
	const { campaignList } = state.contact;
	const { shapeCount, fetching } = state.owner;
	return {
		shapeOwners: getShapeOwnersSelectors(state),
		fetching,
		shapeCount,
		campaignList,
	};
};

const convertTaxOwnerDispatch = dispatch => {
	return bindActionCreators(
		{
			getMapFilterShapeOwnersAndCountAction: getMapFilterShapeOwnersAndCountAction.STARTED,
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

const exportWellsOwnersProps = state => {
	const { shapeCount, wellsCount, shapeOwners, wells, shapeOwnersInterest, shapeInterestCount, fetching } = state.owner;
	return {
		shapeOwnersInterest,
		shapeInterestCount,
		shapeOwners,
		shapeCount,
		wellsCount,
		fetching,
		wells,
	};
};

const exportWellsOwnersDispatch = dispatch => {
	return bindActionCreators(
		{
			getShapeOwnersAndWellsAction: getShapeOwnersAndWellsAction.STARTED,
			getMapFilterShapeOwnersAndWellsAction: getMapFilterShapeOwnersAndWellsAction.STARTED,
			execAsyncExportJobAction: execAsyncExportJobAction.STARTED,
		},
		dispatch
	);
};
export const ExportWellsOwnersContainer = connect(exportWellsOwnersProps, exportWellsOwnersDispatch)(ExportWellsOwners);
