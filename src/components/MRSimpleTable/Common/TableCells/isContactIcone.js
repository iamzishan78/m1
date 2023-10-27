import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import Contact_card from 'components/Shared/svgIcons/contact_card';
import { Link } from 'react-router-dom';

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

function IsContactCell({ contactId }) {
	const classes = useStyles();
	let history = useHistory();

	if (!!!contactId) {
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

	return (
		<Tooltip
			title={!contactId ? 'Convert To Contact' : 'Contact Details'}
			placement="top"
		>
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
					to={`/contact/details/${contactId}/?tenant=${window.sessionStorage.getItem(
						'tenantName'
					)}`}
					onClick={e => e.preventDefault()}
				>
					<Contact_card style={{ margin: '4px' }} />
				</Link>
			</IconButton>
		</Tooltip>
	);
}

export default memo(IsContactCell);
