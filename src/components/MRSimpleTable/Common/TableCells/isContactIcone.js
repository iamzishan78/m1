import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import ContactCard from 'components/Shared/svgIcons/contact_card';
import { Link } from 'react-router-dom';
import ConvertContact from 'components/Shared/svgIcons/convert_contact';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

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

	if (contactId === 'false')
		return (
			<Tooltip title="Convert To Contact" placement="top">
				<IconButton
					size={'medium'}
					color="primary"
					className={`${classes.icons} ${classes.noCommentsIcon}`}
					onClick={e => {
						simpleTableGlobalController.updateState({
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

	return (
		<Tooltip title="Contact Details" placement="top">
			<IconButton
				size={'medium'}
				color="primary"
				className={classes.icons}
				onClick={e => {
					e.stopPropagation();
					history.push(`/contact/details/${contactId}`);
				}}
				aria-label="show contact"
				target="_blank"
			>
				<Link
					to={`/contact/details/${contactId}/?tenant=${window.sessionStorage.getItem(
						'tenantName'
					)}`}
					onClick={e => e.preventDefault()}
				>
					<ContactCard style={{ margin: '4px' }} />
				</Link>
			</IconButton>
		</Tooltip>
	);
}

export default memo(IsContactCell);
