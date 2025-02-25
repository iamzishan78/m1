import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import ContactCard from 'components/Shared/svgIcons/contact_card';
import ConvertContact from 'components/Shared/svgIcons/convert_contact';

import { tableGlobalController } from 'stateManagement/tableController';

import { UserSession } from 'utils/user';

const useStyles = makeStyles(() => ({
	icons: {
		marginLeft: 'auto',
		'&:hover': {
			backgroundColor: 'transparent !important',
		},
	},

	noCommentsIcon: {
		color: 'darkgrey',
	},
}));

function IsContactCell({ contactId, rows }) {
	const classes = useStyles();
	let history = useHistory();

	if (!contactId) {
		return (
			<p
				style={{
					color: '#B3B3B3',
					padding: '10px',
					margin: '0',
				}}
			>
				--
			</p>
		);
	}

	if (contactId === 'false') {
		return (
			<Tooltip title="Convert To Contact" placement="top">
				<IconButton
					size={'medium'}
					color="primary"
					className={`${classes.icons} ${classes.noCommentsIcon}`}
					onClick={e => {
						tableGlobalController.updateState({
							dialog: {
								type: 'multipleOwnerToContact',
								rows,
							},
						});
					}}
					aria-label="create contact"
				>
					<ConvertContact style={{ margin: '4px' }} />
				</IconButton>
			</Tooltip>
		);
	}

	return (
		<Tooltip title={!contactId ? 'Convert To Contact' : 'Contact Details'} placement="top">
			<IconButton
				size={'medium'}
				color="primary"
				className={`${classes.icons} ${!contactId ? classes.noCommentsIcon : ''}`}
				onClick={e => {
					e.stopPropagation();
					history.push(`/contact/details/${contactId}`);
				}}
				aria-label="show contact"
				target="_blank"
			>
				<Link
					to={`/contact/details/${contactId}/?tenant=${UserSession.getStorageItem('tenantName')}`}
					onClick={e => e.preventDefault()}
				>
					<ContactCard style={{ margin: '4px' }} />
				</Link>
			</IconButton>
		</Tooltip>
	);
}

export default memo(IsContactCell);
