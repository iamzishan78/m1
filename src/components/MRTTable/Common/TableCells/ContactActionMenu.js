import React, { memo, useState, useContext } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import TextSMS from '@material-ui/icons/TextsmsOutlined';
import EmailIcon from '@material-ui/icons/Mail';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { makeStyles } from '@material-ui/core/styles';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import AddActivityDialog from 'components/ContactDetailCard/components/AddActivityDialog';
import { tableGlobalController } from 'hookstate/tableController';
import { AppContext } from 'AppContext';

const useStyles = makeStyles(() => ({
	actionMenuItem: {
		padding: 5,
		paddingLeft: 10,
		width: '260px',
		color: '#5a5a5a',
		'&  .MuiSvgIcon-root': {
			fill: '#5a5a5a',
		},
	},
	menuIcons: {
		marginRight: '8px',
	},
	link: {
		textDecoration: 'none',
		color: 'inherit',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
}));

function ContactActionMenu({ id, name, esIndex, dialogType }) {
	const [defaultActivityType, setDefaultAcitivityType] = useState('call');
	const [openActivityDialog, setOpenActivityDialog] = useState(false);
	const [stateApp] = useContext(AppContext);
	const classes = useStyles();
	const [actionState, setActionState] = useState({});

	const closeMenu = () => {
		setActionState({});
	};

	const handleActivity = activityType => {
		setOpenActivityDialog(true);
		setDefaultAcitivityType(activityType);
	};

	const handleDelete = id => {
		tableGlobalController.updateState({
			[dialogType]: {
				type: 'deleteGrid',
				contactId: [id],
				userId: stateApp.user.mongoId,
				deletedData: {
					mainRecord: [id],
				},
				tableKey: 'ContactTable',
				esIndex,
			},
		});
		setActionState({});
	};

	return (
		<>
			<Tooltip title="Actions" placement="top" style={{ marginRight: '10px' }}>
				<IconButton
					id={id}
					size="medium"
					onClick={e => {
						e.stopPropagation();
						setActionState({ open: true, event: e.currentTarget });
					}}
				>
					<MoreVertOutlinedIcon />
				</IconButton>
			</Tooltip>

			{actionState.open && (
				<Menu
					anchorEl={actionState.event}
					getContentAnchorEl={null}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					transformOrigin={{ vertical: 'top', horizontal: 'center' }}
					keepMounted
					id={id}
					open
					onClose={closeMenu}
				>
					<MenuItem className={classes.actionMenuItem}>
						<Link
							to={`/contact/details/${id}/?tenant=${window.sessionStorage.getItem('tenantName')}`}
							className={classes.link}
						>
							<ContactPageOutlinedIcon className={classes.menuIcons} />
							Contact Details
						</Link>
					</MenuItem>
					<MenuItem className={classes.actionMenuItem} onClick={() => handleActivity('call')}>
						<CallOutlinedIcon className={classes.menuIcons} />
						Add call log
					</MenuItem>
					<Divider />
					<MenuItem className={classes.actionMenuItem} onClick={() => handleActivity('text_message')}>
						<TextSMS className={classes.menuIcons} />
						Add text exchange
					</MenuItem>
					<MenuItem className={classes.actionMenuItem} onClick={() => handleActivity('email')}>
						<EmailIcon className={classes.menuIcons} />
						Add email exchange
					</MenuItem>
					<Divider />
					<MenuItem className={classes.actionMenuItem} onClick={() => handleActivity('meeting')}>
						<EventOutlinedIcon className={classes.menuIcons} />
						Add meeting notes
					</MenuItem>
					<Divider />
					<MenuItem className={classes.actionMenuItem} onClick={() => handleActivity('task')}>
						<AssignmentTurnedInOutlinedIcon className={classes.menuIcons} />
						Add new task
					</MenuItem>
					<Divider />
					<MenuItem className={classes.actionMenuItem} onClick={() => handleDelete(id)}>
						<DeleteOutlinedIcon className={classes.menuIcons} />
						Delete contact
					</MenuItem>
				</Menu>
			)}
			{openActivityDialog && (
				<RightDialog
					open={openActivityDialog}
					handleClickDialogClose={() => {
						setOpenActivityDialog(false);
						setActionState(false);
					}}
					width="700px"
				>
					<AddActivityDialog
						onClose={() => {
							setOpenActivityDialog(false);
							setActionState(false);
						}}
						id={id}
						// Need to pass id as _id key
						contactData={{ _id: id, name }}
						defaultActivityType={defaultActivityType}
					/>
				</RightDialog>
			)}
		</>
	);
}

export default memo(ContactActionMenu);
