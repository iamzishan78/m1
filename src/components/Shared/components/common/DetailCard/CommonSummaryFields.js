import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { useLazyQuery } from '@apollo/client';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';
import { popupController } from 'stateManagement/popupStateController';

import MetaField from 'utils/MetaField';

import { AppContext } from 'AppContext';

import GenericFields from './GenericFields';

const useStyles = makeStyles(theme => ({
	container: ({ isBasicInfo }) => ({
		padding: !isBasicInfo && '10px 30px 15px 5px',
		marginBottom: !isBasicInfo && '30px',
	}),
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	fieldLabel: {
		fontWeight: 'bold',
		fontSize: '15px',
	},
	addDataButton: {
		marginTop: '2rem',
		marginLeft: '1rem',
		backgroundColor: 'white',
		color: 'black',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: theme.palette.common.white,
			opacity: 0.15,
		},
	},
}));

export default function CommonSummaryFieldsComponent({ metaDataCategory, formFields, isBasicInfo = false }) {
	const classes = useStyles({ isBasicInfo });
	const [stateApp] = useContext(AppContext);

	const {
		stateValues: { expandedCard },
	} = popupController.useState(['expandedCard']);

	const { stateValues } = detailCardController.useState(['currentAssetRecord']);
	const {
		user,
		globalStateValues,
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['user', 'showFieldModal', 'currentAsset'], 'globalStateValues');

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	const [fields, setFields] = useState([]);

	useEffect(() => {
		if (!formFields) {
			return;
		}
		const role = stateApp.user?.roles?.[0]?.toLowerCase();

		const updatedFields = formFields
			.map(field => {
				if (field.accessControl?.[role] === 'Hidden') {
					return null;
				}
				return {
					...field,
					disabled: field.accessControl?.[role] === 'Readonly',
				};
			})
			.filter(Boolean);

		setFields(updatedFields);
	}, [formFields, setFields]);

	useEffect(() => {
		if (!metaDataCategory) {
			return;
		}

		getMetaData({
			variables: {
				user: globalStateValues?.user?.mongoId,
				category: metaDataCategory,
			},
		});
	}, [metaDataCategory, user, getMetaData, globalStateValues?.user?.mongoId]);

	useEffect(() => {
		if (!metaDataRes?.getMetaData?.metaData) {
			return;
		}

		setFields(fields => [...fields, ...(metaDataRes?.getMetaData?.metaData || [])]);
	}, [metaDataRes, currentAsset]);

	return (
		<Grid container spacing={isBasicInfo ? 0 : 2} alignItems="center" className={classes.container}>
			{fields?.map((field, key) => (
				<Grid xs={expandedCard || isBasicInfo ? 12 : 6} item key={key}>
					<Grid container className={classes.gridStyle}>
						<Grid item xs={4} style={{ display: 'flex' }}>
							<div id={field.label} className={classes.fieldLabel}>
								{field.label}
							</div>
						</Grid>
						<Grid item xs={8}>
							<Fragment>
								<GenericFields field={field} summaryDataValues={stateValues.currentAssetRecord} />
							</Fragment>
						</Grid>
					</Grid>
				</Grid>
			))}

			<Grid container>
				{globalStateValues.showFieldModal && (
					<MetaField
						customDataPrefix="custom_data"
						customDataPostfix=".keyword"
						columns={[]}
						category={metaDataCategory}
					/>
				)}
				{globalStateValues?.user?.rolePrivileges !== 'READ_ONLY' && metaDataCategory && (
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							className={classes.addDataButton}
							startIcon={<AddIcon />}
							onClick={() =>
								globalStateController.updateState({
									showFieldModal: true,
								})
							}
						>
							Add Custom Data
						</Button>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
}
