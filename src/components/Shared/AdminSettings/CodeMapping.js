import React, { useState, useContext, useEffect } from 'react';

import { Grid, FormControl, TextField, Switch, FormControlLabel } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery, useMutation } from '@apollo/client';

import CustomFieldSelect from 'components/Shared/M1nTable/components/SubComponents/CustomFieldSelect';
import ReactSelectField from 'components/Shared/M1nTable/components/SubComponents/ReactSelectField';
import LongIcon from 'components/Shared/svgIcons/LongIcon';
import MetaField from 'utils/MetaField';

import { UPDATE_META_DATA } from 'graphQL/useMutationUpdateMetaData';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	actionBar: ({ isBackground }) => ({
		padding: '10px 25px',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: isBackground ? '#F2F2F2' : 'transparent',
		width: '100%',
		minHeight: '65px',

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
		},
	}),
	viewSwitcher: ({ isShrink }) => ({
		height: isShrink ? '40px' : '100%',
	}),
	container: {
		marginTop: 10,
		padding: '10px 30px',
		fontWeight: 'bold',
	},
	label: {
		fontSize: 13,
		fontWeight: 'bold',
	},
	headerText: {
		textTransform: 'uppercase',
		fontSize: 13,
		fontWeight: 'bold',
	},
	header: {
		marginTop: 20,
		backgroundColor: '#F2F2F2',
		padding: '5px 10px',
	},
	body: {
		padding: '5px 10px',
		borderBottom: '1px solid #d9d9d9',
	},
	spacing: {
		padding: '15px 0px',
	},
}));

const mappingTypeOptions = {
	land: [
		{
			value: 'Acreage Report Categories',
			esIndex: 'shapeowners_flat',
			key: 'tractStatus.keyword',
			heading: 'Map distinct tract status values from agreements to desired reporting category',
			name: 'Tract status',
			to: 'Reporting category',
			category: 'Agreement',
		},
		{
			value: 'Interest Types',
			heading: 'Map interest type values expected to show up for each agreement type',
			key: 'custom_data.interest_type',
			name: 'Interest type',
			to: 'Agreement type',
			codes: ['Mineral Interest', 'Royalty Interest', 'Overriding Royalty Interest (ORRI)', 'Working Interest'],
			category: 'Agreement',
		},
	],
	revenue: [
		{
			value: 'Interest Type',
			heading: 'Map distinct values from statements to desired reporting category',
			esIndex: 'checkdetails_flat',
			key: 'interestType.keyword',
			name: 'Interest type code',
			to: 'Reporting category',
			category: 'Check Details',
		},
		{
			value: 'Tax Type',
			heading: 'Map distinct values from statements to desired reporting category',
			esIndex: 'checkdetails_flat',
			key: 'taxType.keyword',
			name: 'Tax type code',
			to: 'Reporting category',
			category: 'Check Details',
		},
		{
			value: 'Deduction Type',
			heading: 'Map distinct values from statements to desired reporting category',
			esIndex: 'checkdetails_flat',
			key: 'deductType.keyword',
			name: 'Deduction type code',
			to: 'Reporting category',
			category: 'Check Details',
		},
		{
			value: 'Product Type',
			heading: 'Map distinct values from statements to desired reporting category',
			esIndex: 'checkdetails_flat',
			key: 'product.keyword',
			name: 'Product type code',
			to: 'Reporting category',
			category: 'Check Details',
		},
	],
};

const CodeMapping = ({ settingsFor }) => {
	const classes = useStyles();
	const [codes, setCodes] = useState([]);
	const [metaData, setMetaData] = useState([]);
	const [showEmpty, setShowEmpty] = useState(false);
	const [mappingType, setMappingType] = useState(mappingTypeOptions[settingsFor][0]);

	const [updateMetaData, {}] = useMutation(UPDATE_META_DATA);
	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	const [getUniqueType, { data: uniqueType }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		if (metaDataRes?.getMetaData) {
			setMetaData(metaDataRes.getMetaData.metaData);
		}
	}, [metaDataRes]);

	useEffect(() => {
		getMetaData({
			variables: {
				category: mappingType?.category,
			},
		});
	}, [getMetaData]);

	useEffect(() => {
		if (uniqueType?.getESSimpleFilter) {
			const data = uniqueType?.getESSimpleFilter?.hits?.map(hit => hit.key)?.filter(data => data);
			setCodes(data);
		}
	}, [uniqueType]);

	useEffect(() => {
		if (mappingType?.codes) {
			setCodes(mappingType?.codes);
		} else if (mappingType) {
			getUniqueType({
				variables: {
					esIndex: mappingType?.esIndex,
					index: mappingType?.esIndex,
					filterKey: mappingType?.key,
					size: 50,
					filterAggs: {
						field: mappingType?.key,
						size: 50,
					},
					search: {
						fields: [mappingType?.key?.replace(/.keyword/, '')],
					},
				},
			});
		} else {
			setCodes([]);
		}
	}, [mappingType]);

	const onSelect = (value, selectedMeta, code) => {
		let mapping = JSON.parse(JSON.stringify(selectedMeta)).mapping;
		if (mapping) {
			const index = mapping.findIndex(data => data.from === code);
			if (index > -1) {
				mapping[index].to = value;
			} else {
				mapping.push({ from: code, to: value });
			}
		} else {
			mapping = [{ from: code, to: value }];
		}
		setMetaData(metaData =>
			metaData.map(meta => {
				if (meta._id !== selectedMeta._id) {
					return meta;
				}

				return { ...meta, mapping };
			})
		);
		updateMetaData({
			variables: {
				metaData: {
					_id: selectedMeta._id,
					mapping: mapping,
				},
			},
			awaitRefetchQueries: true,
		});
	};

	return (
		<>
			<CodeMappingHeader
				metaData={metaData}
				setMappingType={setMappingType}
				mappingType={mappingType}
				settingsFor={settingsFor}
			/>
			<div className={classes.container}>
				<label>{mappingType?.heading}</label>
				<div>
					<Grid container className={classes.header}>
						<Grid item xs={3}>
							<span className={classes.headerText}>{mappingType?.name}</span>
						</Grid>
						<Grid item xs={2}></Grid>
						<Grid item xs={4}>
							<span className={classes.headerText}>{mappingType?.to}</span>
						</Grid>
						<Grid item xs={3}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									float: 'right',
								}}
							>
								<FormControlLabel
									style={{ marginRight: 0 }}
									control={<Switch checked={showEmpty} onChange={() => setShowEmpty(!showEmpty)} size="small" />}
								/>
								<label style={{ fontSize: 12, marginTop: 4, marginRight: 10 }}>Show only empty fields</label>
							</div>
						</Grid>
					</Grid>
					{codes?.length > 0 && (
						<>
							{codes.map((code, index) => {
								const selectedMeta = metaData.find(meta => meta.esKey === mappingType?.key) || {};
								const value = selectedMeta?.mapping?.find(data => data.from === code);
								return (
									((showEmpty && (!value || !value?.to)) || !showEmpty) && (
										<Grid container className={classes.body}>
											<Grid item xs={3} className={classes.spacing}>
												<span>{code}</span>
											</Grid>
											<Grid item xs={2} className={classes.spacing}>
												<LongIcon />
											</Grid>
											<Grid item xs={4}>
												{selectedMeta.type === 'multiselect' ? (
													<ReactSelectField
														index={index}
														fullWidth
														variant="outlined"
														valueMarginLeft={5}
														isSingleSelect={false}
														dropdownOptions={selectedMeta?.dropdownOptions || []}
														column={selectedMeta}
														value={value ? value.to : ''}
														onCustomKeyChange={value => onSelect(value, selectedMeta, code)}
													/>
												) : (
													<CustomFieldSelect
														index={index}
														fullWidth
														variant="outlined"
														valueMarginLeft={5}
														dropdownOptions={selectedMeta?.dropdownOptions || []}
														column={selectedMeta}
														value={value ? value.to : ''}
														onCustomKeyChange={value => onSelect(value, selectedMeta, code)}
														isOptionsEditable={selectedMeta.name !== 'product_type'}
													/>
												)}
											</Grid>
										</Grid>
									)
								);
							})}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default CodeMapping;

const CodeMappingHeader = ({
	metaData,
	mappingType,
	setMappingType,
	isBackground = true,
	fullWidth = false,
	isShrink = false,
	settingsFor,
}) => {
	const classes = useStyles({ isBackground, isShrink });
	const [stateApp, setStateApp] = useContext(AppContext);

	return (
		<>
			<Grid container direction="row" display="flex" justify="space-between" className={classes.actionBar}>
				<Grid item xs={fullWidth ? 12 : 3} md={fullWidth ? 12 : 3}>
					<FormControl variant="outlined" fullWidth className={classes.formControl}>
						<Autocomplete
							id="activityFilterByType"
							options={mappingTypeOptions[settingsFor]}
							getOptionLabel={option => option.value}
							style={{ width: 300 }}
							size="small"
							defaultValue={mappingType}
							value={mappingType}
							onChange={(_, value) => {
								setMappingType(value);
							}}
							renderOption={option => {
								return (
									<Grid container spacing={0} onClick={() => setMappingType(option)}>
										<Grid container item xs={10} alignItems="center">
											<Grid item xs>
												<span style={{ fontWeight: 400 }}>{option.value}</span>
											</Grid>
										</Grid>
										<Grid container item xs={2} alignItems="center">
											<Grid item xs>
												<EditIcon
													onClick={() => {
														const selectedMeta = metaData.find(meta => meta.esKey === option.key);
														setStateApp(stateApp => ({
															...stateApp,
															showFieldModal: true,
															selectedMeta: selectedMeta,
														}));
													}}
													style={{
														alignSelf: 'center',
														fontSize: 18,
														marginRight: 5,
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
								);
							}}
							renderInput={params => (
								<TextField {...params} label="Mapping Type" variant="outlined" value={mappingType?.value} />
							)}
						/>
					</FormControl>
				</Grid>
			</Grid>
			{stateApp.showFieldModal && <MetaField columns={[]} category={mappingType?.category} esKey={mappingType?.key} />}
		</>
	);
};
