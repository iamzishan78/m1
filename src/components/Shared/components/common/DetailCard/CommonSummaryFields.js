import React, { Fragment, memo, useEffect, useState } from 'react';

import { useLazyQuery } from '@apollo/client';

import { get } from 'lodash';
import { copy } from 'utils/helper';
import { getAssetFields } from './helpers';

import AddIcon from '@material-ui/icons/Add';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import { globalStateController } from 'hookstate/globalStateController';
import { detailCardController } from 'hookstate/detailCardController';

import DateField from './Fields/DateField';
import OwnerField from './Fields/OwnerField';
import SummaryDropdown from './Fields/SummaryDropdown';
import SummaryTextField from './Fields/SummaryTextField';
import SummaryUsersList from './Fields/SummaryUsersList';
import ShapeAutoComplete from './Fields/shapeAutoComplete';
import SummaryAutoComplete from './Fields/SummaryAutoComplete';
import MetaField from 'components/Table/helpers/MetaField';
import SimpleSelectField from 'components/Shared/components/common/DetailCard/Fields/SimpleSelectFIeld';
import { popupController } from 'hookstate/popupStateController';

const useStyles = makeStyles(theme => ({
	container: {
		height: '100%',
		padding: '10px 30px 15px 5px',
		marginBottom: '30px',
	},
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
	datePicker: {
		'& .MuiIconButton-root': {
			padding: '12px 0px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
	},
	field: {
		'& .MuiAutocomplete-clearIndicator': {
			marginRight: '10px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
		'& .MuiInputBase-root': {
			borderRadius: '7px',
		},
	},
	emailAdornment: {
		cursor: 'pointer',
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
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

const RenderFieldComponent = memo(({ field: fieldObj, summaryDataValues }) => {
	const field = copy(fieldObj);
	const isMetaField = field._id && field.category;

	field.key = (field.mappingKey || field.key)?.replaceAll('.keyword', '');
	field.type = field.keyType || field.type;

	switch (field.keyType) {
		case 'text':
		case 'string':
		case 'textarea':
		case 'email':
		case 'currency':
		case 'number':
			return (
				<SummaryTextField
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					summaryData={summaryDataValues}
					isMetaField={isMetaField}
				/>
			);

		case 'autocomplete':
			return (
				<SummaryAutoComplete
					fieldData={get(summaryDataValues, field.key)}
					fieldKey={field.key}
					defaultOptions={field.options || []}
					payload={field.payload}
					variant="outlined"
				/>
			);

		case 'date':
			return (
				<DateField
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					// Add date-specific props here
				/>
			);

		case 'simpleSelect':
			return (
				<SimpleSelectField
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					// Add simple select-specific props here
				/>
			);

		case 'owner':
			return <OwnerField fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'user':
			return <SummaryUsersList fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'dropdown':
		case 'multiselect':
			return (
				<SummaryDropdown
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					summaryData={summaryDataValues}
					isMetaField={isMetaField}
				/>
			);

		case 'shapeautocomplete':
			return (
				<ShapeAutoComplete
					fieldData={get(summaryDataValues, field.key)}
					fieldKey={field.key}
					shapeType={field.shapeType}
					variant="outlined"
				/>
			);

		// Add more cases for other field types

		default:
			// You can provide a default component or handle unknown field types
			return <div>{`Unsupported Field Type : ${field.type}`}</div>;
	}
});

export default function CommonSummaryFieldsComponent({ metaDataCategory }) {
	const classes = useStyles();

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
		const summaryFields = getAssetFields(currentAsset, true);
		setFields(summaryFields);
	}, [currentAsset, setFields]);

	useEffect(() => {
		if (!metaDataCategory) return;

		getMetaData({
			variables: {
				user: globalStateValues?.user?.mongoId,
				category: metaDataCategory,
			},
		});
	}, [metaDataCategory, user, getMetaData, globalStateValues?.user?.mongoId]);

	useEffect(() => {
		if (!metaDataRes?.getMetaData?.metaData) return;

		setFields(fields => [...fields, ...metaDataRes?.getMetaData?.metaData]);
	}, [metaDataRes, currentAsset]);

	return (
		<Grid container spacing={2} alignItems="center" className={classes.container}>
			{fields.map((field, key) => (
				<Grid xs={expandedCard ? 12 : 6} item key={key}>
					<Grid container className={classes.gridStyle}>
						<Grid item xs={4} style={{ display: 'flex' }}>
							<div id={field.label} className={classes.fieldLabel}>
								{field.label}
							</div>
						</Grid>
						<Grid item xs={8}>
							<Fragment>
								<RenderFieldComponent field={field} summaryDataValues={stateValues.currentAssetRecord} />
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
