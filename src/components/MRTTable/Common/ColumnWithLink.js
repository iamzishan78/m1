import { Box, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import GlobalStyles from 'GlobalStyles';
import { history } from 'store';

const commonLinkStyles = {
	maxWidth: '380px',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	display: 'flow-root',
	p: 2,
	textDecoration: 'none',
	'&:hover': {
		textDecoration: 'underline !important',
		fontWeight: GlobalStyles.font.boldFontWeight,
	},
};

const useStyles = makeStyles(() => ({
	root: {
		color: `${GlobalStyles.colors.lightBlue} !important`,
		cursor: 'pointer',
	},
	link: {
		color: `${GlobalStyles.colors.lightBlue} !important`,
		...commonLinkStyles,
	},
	mutedLink: {
		color: `${GlobalStyles.colors.mutedGrey} !important`,
		...commonLinkStyles,
	},
}));

const ColumnWithLink = ({ value, link, ...rest }) => {
	const classes = useStyles();
	return (
		<Box
			{...rest}
			onClick={
				rest.onClick
					? rest.onClick
					: e => {
							e.stopPropagation();
							history.push(link);
						}
			}
			data-testid="column-with-link"
		>
			{!rest.disabled ? (
				<div className={classes.root}>
					{link ? (
						<Tooltip title={value || ''} arrow>
							<RouterLink
								to={`${link}/?tenant=${window.sessionStorage.getItem('tenantName')}`}
								className={rest.muted ? classes.mutedLink : classes.link}
							>
								{value}
							</RouterLink>
						</Tooltip>
					) : (
						value
					)}
				</div>
			) : (
				value
			)}
		</Box>
	);
};

export default ColumnWithLink;
