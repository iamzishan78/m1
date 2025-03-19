import React, { useState, useMemo } from 'react';

import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';

import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import ExpandableSearch from 'components/Shared/Forms/Fields/ExpandableSearch';

import { mapControlsController } from 'controllers/mapControlsController';

import { platformDataInitialData, userDefinedInitialData } from './data';

const StyledMenu = withStyles({
	paper: {
		minWidth: '420px',
		border: '1px solid #d3d4d5',
	},
})(props => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'left',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'left',
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles(theme => ({
	root: {
		color: '#757575',
		'&:focus': {
			color: '#757575',
			'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
				color: theme.palette.common.white,
			},
		},
	},
	selected: {
		color: '#757575  !important',
		'& .MuiListItemText-primary': {
			color: '#757575  !important',
		},
		backgroundColor: '#dfecf7 !important',
	},
}))(MenuItem);

const useStyles = makeStyles(theme => ({
	searchSelect: {
		width: '150px',
		'& .MuiFilledInput-root, & .MuiSelect-select.MuiSelect-select': {
			backgroundColor: props => `${props.backgroundColor}!important`,
		},
	},
	icon: {
		color: '#757575',
		fontSize: '26px',
		fill: '#bdc7d1',
	},
	menuButton: {
		color: '#757575 !important',
		backgroundColor: props => `${props.backgroundColor}!important`,
		borderRadius: '16px',
		padding: '6px 10px 6px 10px',
		borderRight: '25px',
		'& .MuiButton-startIcon': {
			color: props => `${props.color ? props.color : '#757575'}!important`,
			marginRight: '0 !important',
		},
		'& .MuiButton-endIcon': {
			color: props => `${props.color ? props.color : '#757575'}!important`,
			marginLeft: '0 !important',
		},
	},

	underlinedHeader: {
		paddingLeft: '16px',
		justifyContent: 'space-between',
		borderBottom: '0.5px solid #7575753d',
		'& .MuiTypography-h6': {
			fontWeight: 'bold',
			fontSize: '1.1rem',
		},
	},
}));

const SearchByTypeSelectField = ({ handleChange, value, backgroundColor, color, isShapeGridOnly, isLayerOnly }) => {
	const classes = useStyles({ backgroundColor, color });
	const [search, setSearch] = useState('');
	const [anchorEl, setAnchorEl] = React.useState(null);

	const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');

	const platformData = useMemo(() => {
		let data = platformDataInitialData
			.filter(data => !search || data.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
			.filter(data => (isShapeGridOnly ? (data.shapeGrid ? true : false) : true));
		return data.filter(data => {
			if (!data.isLayer) {
				return true;
			}
			if (data.isLayer && isLayerOnly) {
				data.label = isLayerOnly.name;
				return true;
			} else {
				return false;
			}
		});
	}, [search, isLayerOnly]);

	const userDefinedData = useMemo(() => {
		return userDefinedInitialData
			.filter(data => !search || data.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
			.filter(data => (isShapeGridOnly ? (data.shapeGrid ? true : false) : true));
	}, [search]);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				className={classes.menuButton}
				aria-controls="customized-menu"
				aria-haspopup="true"
				startIcon={<SearchIcon fontSize="25" color={color ? color : '#757575'} opacity={1} />}
				endIcon={<ArrowDropDownIcon fontSize="25" style={{ color: color ? color : '#757575' }} />}
				onClick={handleClick}
				id="dataNameSelect"
			></Button>

			<StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				<Grid>
					<Grid
						container
						className={platformData.length > 0 ? classes.underlinedHeader : ''}
						direction="row"
						justifyContent="space-between"
						alignItems="center"
					>
						<Grid item>{platformData.length > 0 && <Typography variant="h6">Platform Data</Typography>}</Grid>
						<Grid item>
							<ExpandableSearch setSearch={setSearch} search={search} />
						</Grid>
					</Grid>

					{platformData.map(icon => {
						if (mapControlsStateValues.mapGridCardActivated && !icon.shapeGrid) {
							return false;
						}
						const Icon = icon.Icon;
						return (
							<FeatureFlag feature={FEATURES[icon.featureFlag]} noCheck={!FEATURES[icon.featureFlag]}>
								<StyledMenuItem
									key={icon.index}
									selected={icon.value === value.value}
									onClick={() => {
										handleChange(icon);
										handleClose();
									}}
								>
									<ListItemIcon>
										<Icon className={classes.icon} fontSize="small" color="#bdc7d1" opacity="1" />
									</ListItemIcon>
									<ListItemText primary={icon.gridLabel || icon.label} />
								</StyledMenuItem>
							</FeatureFlag>
						);
					})}

					<Grid
						container
						className={classes.underlinedHeader}
						direction="row"
						justifyContent="space-between"
						alignItems="center"
					>
						<Grid item>
							<Typography variant="h6">User Defined Data</Typography>
						</Grid>
					</Grid>

					{userDefinedData.map(icon => {
						if (mapControlsStateValues.mapGridCardActivated && !icon.mapGrid) {
							return false;
						}
						const Icon = icon.Icon;
						return (
							<FeatureFlag feature={FEATURES[icon.featureFlag]} noCheck={!FEATURES[icon.featureFlag]}>
								<StyledMenuItem
									key={icon.index}
									selected={icon.value === value.value}
									onClick={() => {
										handleChange(icon);
										handleClose();
									}}
								>
									<ListItemIcon>
										<Icon className={classes.icon} fontSize="small" color="#bdc7d1" opacity="1" />
									</ListItemIcon>

									<ListItemText primary={icon.label} />
								</StyledMenuItem>
							</FeatureFlag>
						);
					})}
				</Grid>
			</StyledMenu>
		</>
	);
};

export default SearchByTypeSelectField;
