import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',

		borderRadius: theme.shape.borderRadius,
		'&:hover': {
			backgroundColor: props => (props.hoverColor ? props.hoverColor : theme.palette.common.white),
			// opacity: 0.15,
		},
		'&:focus-within': {
			width: '100% !important',
		},

		marginLeft: 0,
		width: '100%',
		float: 'right',

		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(1),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		// pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		cursor: 'pointer',
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		// transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: props => (props.search.length > 0 ? '100%' : '0.1px'),
			'&:focus': {
				backgroundColor: props => (props.focusColor ? props.focusColor : theme.palette.common.white),
				opacity: 0.75,
				width: '100%',
			},
		},
	},
}));

export default function ExpandableSearch({ search, setSearch, setClicked, focusColor, hoverColor }) {
	const classes = useStyles({ search, focusColor, hoverColor });

	return (
		<div className={classes.search}>
			<div
				className={classes.searchIcon}
				onClick={() => (setClicked ? setClicked(true) : () => {})}
				onBlur={() => setClicked && setClicked(false)}
			>
				<SearchIcon />
			</div>
			<InputBase
				placeholder="Search…"
				value={search}
				fullWidth={true}
				onBlur={() => setClicked && setClicked(false)}
				onFocus={() => (setClicked ? setClicked(true) : () => {})}
				onChange={e => setSearch(e.target.value)}
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput,
				}}
				inputProps={{ 'aria-label': 'search' }}
			/>
		</div>
	);
}
