import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ConvertOwnerToContact from 'components/Revenue/components/Properties/DetailComponents/ConvertOwnerToContact';

import { getOwnerEntityDetailAction } from 'store/actions/entityActions';

const convertTaxOwnerProps = state => {
	const { ownerEntityDetail } = state.entity;
	return {
		ownerEntityDetail,
	};
};

const convertTaxOwnerDispatch = dispatch => {
	return bindActionCreators(
		{
			getOwnerEntityDetailAction: getOwnerEntityDetailAction.STARTED,
		},
		dispatch
	);
};
export const ConvertOwnerToContactContainer = connect(
	convertTaxOwnerProps,
	convertTaxOwnerDispatch
)(ConvertOwnerToContact);
