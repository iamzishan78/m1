import React, { useEffect, useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppContext } from 'AppContext';
import Tags from 'components/Shared/Tagger';
import { getMapFilters } from 'utils/helper';
import ContactAutoComplete from 'components/Shared/ContactAutoComplete';
import CloseIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';

import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { drawController } from 'hookstate/drawStateController';

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
	const [searchCampaign, setSearchCampaign] = useState('');
	const [includeFilter, setIncludeFilter] = useState(true);
	const [campaigns, setCampaigns] = useState([]);
	const { control, getValues, watch } = useForm();

	const { selectedPolygonString } = drawController.useState(['selectedPolygonString'], 'drawStateValues');

	const contactStatus = watch('contactStatus', contactStatusOptions[0].value);
	const contactOwner = watch('contactOwner', null);
	const userId = stateApp.user.mongoId;

	useEffect(() => {
		getContactCampaignAction({
			search: searchCampaign ? `${searchCampaign}*` : '*',
		});
		// eslint-disable-next-line
	}, [searchCampaign]);

	useEffect(() => {
		if (!includeFilter) {
			getShapeOwnersAndCountAction({
				currentFeature: drawController.getValue('currentFeature'),
				userId: user.mongoId,
			});
		}
		// eslint-disable-next-line
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
		// eslint-disable-next-line
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
						name="campaignNames"
						render={params => (
							<CampaignNameField
								{...params}
								value={params.value}
								className={classes.maxWidth}
								onChange={(values, id) => {
									const _campaigns = [...campaigns, { id, name: values[values.length - 1] }];
									params.onChange(values);
									setCampaigns(_campaigns);
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
