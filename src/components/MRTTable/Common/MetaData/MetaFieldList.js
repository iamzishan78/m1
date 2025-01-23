import React, { memo } from 'react';

import {
	Grid,
	Dialog,
	Button,
	ButtonGroup,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	DialogTitle,
	DialogContent,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';

import { metaDataColumnStateController } from 'components/MRTTable/Common/MetaData/MetaDataColumnsController';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

const useStyles = makeStyles(() => ({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '15px 30px',
	},
	dialogActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			fill: '#d9d9d9',
			'&:hover': {
				fill: '#b5b2b2',
			},
		},
	},
	menu: {
		'& .MuiListItem-root': {
			height: '35px',
			'& .MuiListItemIcon-root': {
				minWidth: '30px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
	inputContainer: {
		backgroundColor: '#f0fbff',
		margin: '5px',
		padding: '0px',
		border: 1,
		borderRadius: 7,
	},
	inputLabel: {
		float: 'left',
		textAlign: 'center',
		padding: '1.5%',
		fontSize: '15px',
	},
	inputContent: {
		float: 'right',
		padding: '1%',
		fontSize: '15px',
	},
	dialog: {
		height: '58%',
		margin: 'auto',
		width: '50%',
	},
}));

function MetaFieldList({ tableKey }) {
	const classes = useStyles();
	const fieldState = metaDataColumnStateController(tableKey).useState(['metaColumns']);
	const fieldStateValues = fieldState.stateValues;
	const Controller = tableController(tableKey);

	const handleClose = () => {
		Controller.updateState({
			metaFieldList: false,
		});
	};

	const OpenFieldModelDialog = row => {
		globalStateController.updateState({
			showFieldModal: true,
		});
		if (row) {
			window.setStateApp(stateApp => ({
				...stateApp,
				selectedMeta: row,
			}));
		}
		handleClose();
	};

	return (
		<Dialog fullWidth maxWidth="md" open={true} onClose={handleClose} className={classes.dialog}>
			<DialogTitle id="customized-dialog-title" onClose={handleClose}>
				<Grid container justify="space-between" direction="row" display="flex" alignItems="center">
					<Grid item>
						<h3>List</h3>
					</Grid>
					<Grid item xs={6} className={classes.dialogActions}>
						<ButtonGroup variant="contained" style={{ height: '40px' }} color="primary" aria-label="split button">
							<Button
								id="addDocument"
								color="primary"
								size="small"
								aria-label="select merge strategy"
								aria-haspopup="menu"
								onClick={() => {
									handleClose();
									OpenFieldModelDialog();
								}}
							>
								Add Field
							</Button>
						</ButtonGroup>
						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</DialogTitle>
			<DialogContent dividers>
				<List>
					{fieldStateValues?.metaColumns.map(row => (
						<ListItem key={row.label || row.label}>
							<ListItemText primary={row.label} />
							<ListItemSecondaryAction>
								<IconButton edge="end" aria-label="edit" onClick={() => OpenFieldModelDialog(row)}>
									<EditIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</DialogContent>
		</Dialog>
	);
}

MetaFieldList.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(MetaFieldList);
