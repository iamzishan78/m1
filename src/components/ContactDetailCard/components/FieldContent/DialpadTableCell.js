import React from 'react';
import { useDispatch } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcCallIcon from '@material-ui/icons/AddIcCall';

import { useMutation } from '@apollo/client';
import { globalStateController } from 'hookstate/globalStateController';
import PropTypes from 'prop-types';

import { FEATURES } from 'components/Shared/FeatureFlag/common';

import { INITIATE_DIALPAD_CALL } from 'graphQL/useMutationInitiateCall';

import { showErrorMessage, showInfoMessage, showSuccessMessage } from 'actions';

const useStyles = makeStyles(theme => ({
	phoneContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: theme.spacing(1),
		position: 'relative',
		'&:hover $callButton': {
			visibility: 'visible',
			opacity: 1,
		},
	},
	phoneNumber: {
		fontSize: '0.9rem',
		marginRight: theme.spacing(1),
	},
	callButton: {
		padding: theme.spacing(0.5),
		visibility: 'hidden',
		opacity: 0,
		transition: 'opacity 0.2s',
	},
}));

function triggerPhoneCall(phoneNumber) {
	const a = document.createElement('a');
	a.href = `tel:${phoneNumber}`;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export default function DialpadTableCell(props) {
	const classes = useStyles();

	const { globalState } = globalStateController.useState(['user'], 'globalState');
	const feature = globalState?.user?.features?.find(f => f.name === FEATURES.DIALPAD_INTEGRATION);
	const isDialPad = props.row?.original?.dialpadIds?.length && feature;

	const [initiateDialpadCall] = useMutation(INITIATE_DIALPAD_CALL);
	const dispatch = useDispatch();

	const handleCall = () => {
		if (isDialPad && globalState.user?.dialpad) {
			dispatch(showInfoMessage('Initiating call...'));
			initiateDialpadCall({
				variables: {
					phoneNumber: props.value,
					dialpadUserId: globalState?.user?.dialpad?.id,
					contactId: props.row?.original?._id,
				},
			}).then(({ data }) => {
				if (data?.initiateDialpadCall?.success) {
					dispatch(showSuccessMessage('Call initiated successfully'));
				} else {
					console.log(data?.initiateDialpadCall?.message);
					if (data?.initiateDialpadCall?.message?.includes('is not synced with dialpad')) {
						dispatch(showInfoMessage(data?.initiateDialpadCall?.message));
						triggerPhoneCall(props.value);
					} else {
						dispatch(showErrorMessage(data?.initiateDialpadCall?.message));
					}
				}
			});
		} else if (isDialPad && !globalState.user?.dialpad) {
			dispatch(showErrorMessage('User not found on Dialpad. Please Contact Admin.'));
		}
	};

	return (
		<>
			{props.value && (
				<div className={classes.phoneContainer}>
					<span className={classes.phoneNumber}>{props.value}</span>
					<Tooltip title="Call" placement="top">
						<IconButton size="small" className={classes.callButton} onClick={handleCall}>
							<AddIcCallIcon htmlColor="#757575" />
						</IconButton>
					</Tooltip>
				</div>
			)}
		</>
	);
}

DialpadTableCell.propTypes = {
	/** The phone number value to display and call */
	value: PropTypes.string,
	/** The row data containing contact information */
	row: PropTypes.shape({
		original: PropTypes.shape({
			_id: PropTypes.string,
			dialpadIds: PropTypes.arrayOf(PropTypes.string),
		}),
	}),
};
