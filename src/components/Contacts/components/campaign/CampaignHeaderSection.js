import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Tooltip } from '@material-ui/core';
import { Grid, TextField, Card, CardContent, Typography, Switch, FormControlLabel, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { useLazyQuery } from '@apollo/client';
import { get, isEqual } from 'lodash';
import moment from 'moment';

import CommonFieldList from 'components/Shared/Forms/Fields/CommonFieldList';
import UsersListWithIcon from 'components/Shared/UsersListWithIcon';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import { globalStateController } from 'stateManagement/globalStateController';

import MetaField from 'utils/MetaField';

import { headerStyles } from './styles';

const CampaignHeader = ({ campaign, updateCampaignInformation }) => {
	const { globalStateValues } = globalStateController.useState(['showFieldModal', 'user'], 'globalStateValues');
	const classes = headerStyles();

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	useEffect(() => {
		getMetaData({
			variables: {
				user: globalStateValues.user?.mongoId,
				category: 'Campaign Name',
			},
		});
	}, [getMetaData, globalStateValues.user?.mongoId]);

	const { control } = useForm();

	const offClickHandler = (key, value) => {
		if (!key) {
			return;
		}

		const oldCustomData = campaign.custom_data || {};
		const customData = {
			...oldCustomData,
			[key.replaceAll('custom_data.', '')]: value,
		};
		if (!isEqual(customData, oldCustomData)) {
			updateCampaignInformation('custom_data', customData);
		}
	};

	return (
		<Grid container display="flex" direction="column">
			<Grid container display="flex" justifyContent="space-between" alignItems="center">
				<Grid item md={4}>
					<Grid container display="flex" justifyContent="space-between" alignItems="center">
						<Grid item xs="12" md="12">
							<UsersListWithIcon
								label="Supervisor"
								placeholder="Assign Supervisor"
								selectedUserId={get(campaign, 'owner._id')}
								onChangeUser={user => updateCampaignInformation('owner', user.value)}
								fieldSize={8}
							/>
						</Grid>
						<Grid item container direction="row" display="flex" style={{ padding: '15px 0px 10px' }}>
							<Grid item md={3}>
								<label style={{ marginTop: '10px', padding: 0 }}>Created Date</label>
							</Grid>

							<Grid item md={8}>
								<TextField
									style={{ marginTop: 0 }}
									size="small"
									margin="dense"
									type="date"
									variant="outlined"
									placeholder="from"
									fullWidth
									value={moment(get(campaign, 'createdAt')).format('yyyy-MM-DD')}
									onChange={event => {
										updateCampaignInformation('createdAt', event ? String(event.target.value) : null);
									}}
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										classes: {
											root: classes.dateRoot,
											focused: classes.focused,
											notchedOutline: classes.notchedOutline,
										},
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item md={8}>
					<div className={classes.cardsWrapper}>
						<Card variant="outlined" className={`${classes.card} ${classes.leftCard}`}>
							<CardContent className={classes.cardContent}>
								<Tooltip title={'Status'}>
									<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
										Status
									</Typography>
								</Tooltip>
								<FormControlLabel
									label={get(campaign, 'status', 'Open')}
									labelPlacement="start"
									control={
										<Switch
											checked={get(campaign, 'status', 'Open') === 'Open'}
											onChange={({ target }) => updateCampaignInformation('status', target.checked ? 'Open' : 'Closed')}
											size="small"
										/>
									}
									className={classes.statusControl}
								/>
							</CardContent>
						</Card>
						<Card variant="outlined" className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Tooltip title={'Units'}>
									<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
										Units
									</Typography>
								</Tooltip>
								<Typography id="unitCounts" variant="h6" component="div" className={classes.cardNumberTypography}>
									{get(campaign, 'unitCount', 0)}
								</Typography>
							</CardContent>
						</Card>
						<Card variant="outlined" className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Tooltip title={'Tracts'}>
									<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
										Tracts
									</Typography>
								</Tooltip>
								<Typography id="unitCounts" variant="h6" component="div" className={classes.cardNumberTypography}>
									{get(campaign, 'tractCount', 0)}
								</Typography>
							</CardContent>
						</Card>
						<Card variant="outlined" className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Tooltip title={'Contacts'}>
									<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
										Contacts
									</Typography>
								</Tooltip>
								<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
									{get(campaign, 'contacts', 0)}
								</Typography>
							</CardContent>
						</Card>
						<Card variant="outlined" className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Tooltip title={'Total Unit NRA'}>
									<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
										Total Unit NRA
									</Typography>
								</Tooltip>
								<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
									{vf_number(Math.round(get(campaign, 'totalNra', 0)))}
								</Typography>
							</CardContent>
						</Card>
					</div>
				</Grid>
			</Grid>

			<Grid container style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
				<CommonFieldList
					data={campaign || {}}
					fields={metaDataRes?.getMetaData?.metaData || []}
					control={control}
					offClickHandler={offClickHandler}
				/>
			</Grid>

			<Grid>
				{globalStateValues.showFieldModal && (
					<MetaField
						customDataPrefix="custom_data"
						customDataPostfix=".keyword"
						columns={[]}
						category="Campaign Name"
					/>
				)}
				{globalStateValues.user?.rolePrivileges !== 'READ_ONLY' && (
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							className={classes.addDataButton}
							startIcon={<AddIcon />}
							onClick={() => globalStateController.updateState({ showFieldModal: true })}
						>
							Add Custom Data
						</Button>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
};

export default CampaignHeader;
