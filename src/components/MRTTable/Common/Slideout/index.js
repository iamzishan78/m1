import React, { memo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';

import { slidoutStateController } from 'stateManagement/slidoutStateController';
import { tableGlobalController } from 'stateManagement/tableController';

import Dialog from './Dialog';
import DialogHeader from './DialogHeader';

import 'components/Transact/components/DealDialog/dialog.css';

const useStyles = makeStyles(() => ({
	dealDetailRoot: {
		'& .MuiDialog-paper': {
			overflowY: 'hidden',
		},
	},
	dialog: {
		zIndex: '9999999999 !important',
	},
}));

function Slideout({ show, deleteFunc }) {
	const classes = useStyles();

	const handleClose = async () => {
		tableGlobalController.updateState({
			documentDialog: {
				type: {},
			},
		});
	};

	if (!show) {
		return null;
	}

	const { stateValues } = slidoutStateController.useState(['view']);

	return (
		<>
			<div className={classes.dealDetailRoot}>
				<RightDialog
					open={true}
					handleClickDialogClose={handleClose}
					width={stateValues.view?.width || '28vw'}
					hiddenOverflow
					noBorder
					hideBackdrop={true}
				>
					<DialogHeader handleClickDialogClose={handleClose} deleteFunc={deleteFunc} />
					<Dialog />
				</RightDialog>
			</div>
		</>
	);
}

Slideout.propTypes = {
	show: PropTypes.bool,
	deleteFunc: PropTypes.func.isRequired,
};

export default memo(Slideout);
