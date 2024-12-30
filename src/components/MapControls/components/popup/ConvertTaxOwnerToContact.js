import React, { useEffect, useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import ContactAutoComplete from 'components/Shared/ContactAutoComplete';
import CloseIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import Tags from 'components/Shared/Tagger';

import { drawController } from 'hookstate/drawStateController';

import { getMapFilters } from 'utils/helper';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		width: '557px',
		padding: '10px 30px',
	},
	title: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center',
		padding: '0px 0px',
		'& svg': {
			fill: '#757575 !important',
		},
	},
	fullWidth: {
		width: '100%',
	},
	field: {
		marginTop: 30,
		fontSize: '16px',
	},
	tags: {
		marginTop: 20,
	},
	bold: {
		fontWeight: 'bold',
	},
}));

const ConvertTaxOwnerToContact = ({
	getMapFilterShapeOwnersAndCountAction,
	convertTaxOwnerToContactAction,
	getShapeOwnersAndCountAction,
	getContactCampaignAction,
	campaignList,
	shapeCount,
	fetching,
	onClose,
	open,
}) => {
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const [stateNav] = useContext(NavigationContext);
	const { user } = stateApp;
	const [newTagsIds, setNewTagsIds] = useState([]);
	const [includeFilter, setIncludeFilter] = useState(true);
	const [campaigns, setCampaigns] = useState([]);
	const { control, getValues, watch } = useForm();

	const { selectedPolygonString } = drawController.useState(['selectedPolygonString'], 'drawStateValues');

	const contactStatus = watch('contactStatus', contactStatusOptions[0].value);
	const contactOwner = watch('contactOwner', null);
	const userId = stateApp.user.mongoId;

	useEffect(() => {
		getContactCampaignAction({
			search: '*',
		});
	}, [getContactCampaignAction]);

	useEffect(() => {
		if (!includeFilter) {
			getShapeOwnersAndCountAction({
				currentFeature: drawController.getValue('currentFeature'),
				userId: user.mongoId,
			});
		}
	}, [includeFilter]);

	useEffect(() => {
		if (includeFilter) {
			const { filters, search } = getMapFilters(stateNav, '', '');
			getMapFilterShapeOwnersAndCountAction({
				currentFeature: drawController.getValue('currentFeature'),
				userId: user.mongoId,
				filters,
				search,
			});
		}
	}, [
		includeFilter,
		stateNav.operatorName,
		stateNav.typeName,
		stateNav.profileName,
		stateNav.statusName,
		stateNav.statusName,
		stateNav.spudDateFrom,
		stateNav.spudDateTo,
		stateNav.permitDateFrom,
		stateNav.permitDateTo,
		stateNav.completetionDateFrom,
		stateNav.completetionDateTo,
		stateNav.firstProdDateFrom,
		stateNav.firstProdDateTo,
		selectedPolygonString,
	]);

	const setTagId = id => {
		const ids = JSON.parse(JSON.stringify(newTagsIds));
		ids.push(id);
		setNewTagsIds(ids);
	};

	const removeTagId = id => {
		const ids = JSON.parse(JSON.stringify(newTagsIds));
		const index = ids.findIndex(e => e === id);
		if (index > -1) {
			ids.splice(index, 1);
		}
		setNewTagsIds(ids);
	};

	const onConvert = () => {
		const values = getValues();
		convertTaxOwnerToContactAction({ ...values, campaigns, tags: newTagsIds, userId });
		onClose();
	};

	return (
		<Drawer anchor="right" open={open}>
			<div className={classes.root}>
				<div className={classes.title}>
					<h1>Convert to Contact</h1>
					<div style={{ cursor: 'pointer' }}>
						<IconButton size="small" onClick={onClose}>
							<CloseIcon />
						</IconButton>
					</div>
				</div>
				<div className={classes.title}>
					<h3>Tax Roll Owners</h3>
					<div>{shapeCount} selected</div>
				</div>
				<div className={classes.title}>
					<h3>Include map filters</h3>
					<div>
						<Switch checked={!!includeFilter} onChange={() => setIncludeFilter(!includeFilter)} name="includeFilter" />
					</div>
				</div>

				<div className={classes.field}>
					<label className={classes.bold}>Contact Stage</label>
					<Controller
						control={control}
						name="contactStatus"
						defaultValue={contactStatusOptions[0].value}
						render={props => (
							<Select
								styles={{
									menu: provided => ({ ...provided, zIndex: 9999 }),
								}}
								value={contactStatus}
								menuPlacement="auto"
								onChange={e => {
									props.onChange(e.target.value);
								}}
								className={classes.fullWidth}
								isDisabled={stateApp.selectedMeta}
							>
								<MenuItem value="Lead"> Lead </MenuItem>
								<MenuItem value="Prospect"> Prospect</MenuItem>
								<MenuItem value="Deal Contact"> Contact </MenuItem>
							</Select>
						)}
					/>
				</div>
				<div className={classes.field}>
					<label className={classes.bold}>Contact Owner</label>
					<Controller
						control={control}
						name="contactOwner"
						render={props => (
							<ContactAutoComplete
								value={contactOwner}
								contactValue="email"
								onChange={(e, user) => {
									props.onChange(user.value);
								}}
							/>
						)}
					/>
				</div>
				<div className={classes.field}>
					<label className={classes.bold}>Campaign Names</label>
					<Controller
						control={control}
						name="campaigns"
						render={params => (
							<CampaignField
								{...params}
								value={params.value}
								className={classes.maxWidth}
								onChange={values => {
									params.onChange(values);
									setCampaigns(values.map(val => ({ ...val, id: val._id })));
								}}
								fullWidth
								targetLabel="Shape"
								simpleChips
							/>
						)}
					/>
				</div>
				<div className={classes.tags}>
					<Tags
						variant="standard"
						setTagId={setTagId}
						removeTagId={removeTagId}
						targetLabel="contact"
						targetSourceId="new"
						hidePlusIcon
						shareable={false}
					/>
				</div>
				<Box pt={6} mt={6} mb={6} mr={2}>
					<Grid container direction="row" justify="flex-end" alignItems="flex-end">
						<Grid item>
							<Button onClick={onClose}>Cancel</Button>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								component="span"
								style={{ backgroundColor: '#00abed', color: 'white' }}
								onClick={onConvert}
							>
								{fetching ? <CircularProgress size={14} /> : 'Convert'}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</div>
		</Drawer>
	);
};

export default ConvertTaxOwnerToContact;
