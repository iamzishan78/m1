import { makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React from 'react';

const useStyles = makeStyles(theme => ({
	popover: {
		'& .MuiPopover-paper': {
			color: 'rgb(59, 70, 99)',
			backgroundColor: '#1c2233',
			marginTop: '45px',
			marginLeft: '30px',
			// left: '10% !important',
		},
		'& .MuiTabs-indicator': {
			height: '4px',
			backgroundColor: 'rgba(23, 170, 221, 1)',
		},

		'& .MuiFilledInput-root': {
			backgroundColor: '#252d40',
		},
		'& .Mui-disabled': {
			paddingBottom: '10px',
			borderBottom: '1px solid lightgrey',
		},
		'& .MuiMenuItem-root': {
			'&:hover': {
				color: 'rgba(23, 170, 221, 1)',
			},
		},

		'& .MuiCircularProgress-colorPrimary': {
			color: 'rgba(23, 170, 221, 1)',
		},
		'& .menu': {
			paddingRight: '10px',
			color: '#ffff',
			'& .MuiTypography-body1': {
				fontWeight: 500,
			},
		},
	},
	inputField: {
		padding: '20px',
		'& .MuiInputLabel-filled': {
			color: 'grey',
		},
		'& .MuiFilledInput-input': {
			color: '#fff',
		},
	},
}));

export default function DatasetMenu({ dataset, handleRemove, handleTransfer, handleAddLayer }) {
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = event => {
		event.stopPropagation();
		setAnchorEl(null);
	};

	return (
		<div>
			<MoreVertIcon
				id={'dataset-morevert-' + dataset.sourceName}
				aria-controls={'dataset-menu ' + dataset.sourceName}
				className="actionIcon"
				onClick={handleClick}
			/>
			<Menu
				id={'dataset-menu ' + dataset.sourceName}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				className={classes.popover}
			>
				<div className={'menu'}>
					<List component="nav" aria-label="main mailbox folders" disablePadding>
						<ListItem
							button
							onClick={e => {
								handleClose(e);
								handleTransfer(dataset);
							}}
						>
							<ArrowForwardOutlinedIcon />
							<ListItemText primary="Transfer" style={{ marginLeft: '5px' }} />
						</ListItem>

						{dataset?.categories?.length > 0 && (
							<ListItem
								button
								onClick={e => {
									handleClose(e);
									handleAddLayer(dataset);
								}}
							>
								<AddCircleIcon />
								<ListItemText primary="Layers" style={{ marginLeft: '5px' }} />
							</ListItem>
						)}

						<ListItem
							id={'remove-source-' + dataset.sourceName}
							button
							onClick={e => {
								handleClose(e);
								handleRemove(dataset, false);
							}}
						>
							<VisibilityOffOutlinedIcon />
							<ListItemText primary="Hide" style={{ marginLeft: '5px' }} />
						</ListItem>
					</List>
				</div>
			</Menu>
		</div>
	);
}
