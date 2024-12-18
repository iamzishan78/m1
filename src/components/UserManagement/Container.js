import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import MRTTable from 'components/MRTTable';
import { userManagementTableKey } from 'components/MRTTable/Schema';
import { NavigationContext } from '../Navigation/NavigationContext';
import { Modals } from '../../styles/Modal';

const useStyles = makeStyles(theme => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto',
		width: 'fit-content',
	},
	formControl: {
		marginTop: theme.spacing(2),
		minWidth: 120,
	},
	formControlLabel: {
		marginTop: theme.spacing(1),
	},
	header: {
		backgroundColor: theme.palette.primary.main,
	},
	dialog: {
		'& .MuiDialogContent-root': {
			height: 'auto !important',
			padding: '30px 24px !important',
		},
	},
}));

export default function UserManagementContainer() {
	const classes = useStyles();
	const modalClass = Modals();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { isUserManagementOpen } = stateNav;
	const windowsHeight = window.innerHeight;

	const handleClose = () => {
		setStateNav({ ...stateNav, isUserManagementOpen: false });
	};

	return (
		<Fragment>
			<Dialog fullWidth maxWidth="xl" className={classes.dialog} open={isUserManagementOpen} onClose={handleClose}>
				<DialogTitle className={modalClass.title} id="customized-dialog-title">
					User Management
					<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={handleClose} />
				</DialogTitle>
				<DialogContent style={{ height: windowsHeight }}>
					<MRTTable name={userManagementTableKey} />
				</DialogContent>
			</Dialog>
		</Fragment>
	);
}
