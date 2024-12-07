import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import set from 'lodash/set';

// context
import { AppContext } from 'AppContext';

import { Container } from '@material-ui/core';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHOC from 'components/Table/TableHOC';

// QUERIES
import { getParcelOriginalProperties } from 'components/ParcelsDetailCard/utils/GetParcelOriginalProps';
import { useLazyQuery, useMutation } from '@apollo/client';
import { UPDATEWELLINTEREST } from 'graphQL/useMutationUpdateWellInterest';
import { CONTACT_PARCEL_INTERESTS } from 'graphQL/useQueryContactParcelInterest';

import { deepEqualObjects, setStateIfDeepEqual, addTrailingZeros } from 'components/Shared/functions';
import AddWellInterestDialog from 'components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog';

// Header Schemas
import TableHeader from 'components/Shared/constants/associate-contact-parcel-header-schema.js';
import { handleTagColumn } from '../helpers';
import vf_currency from 'components/Shared/valueformatters/vf_currency';

const useStyles = makeStyles(theme => ({
	container: {
		padding: '0 !important',
	},
}));

function ContactParcelInterestTable(props) {
	const classes = useStyles();
	let history = useHistory();
	// contexts
	const [stateApp, setStateApp] = useContext(AppContext);

	// function states
	const [columns, Columns] = useState([]);
	const setColumns = newState => {
		setStateIfDeepEqual(Columns, newState);
	};
	const [searchedRows, setSearchedRows] = useState([]);
	const [selectedYear, setSelectedYear] = useState(2023); // production selected year state

	// queries
	const [getContactParcelInterests, { data: dataContactParcels, loading }] = useLazyQuery(CONTACT_PARCEL_INTERESTS, {
		fetchPolicy: 'cache-and-network',
		skip: true,
	});
	const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, {
		refetchQueries: ['getContactWells', 'getContactParcelInterests'],
		awaitRefetchQueries: true,
	});
	const tableData = dataContactParcels?.contactParcelInterest;

	const addAble = { type: 'TractInterests' };
	const total = false;
	const orderByTracks = false;

	useEffect(() => {
		setSearchedRows(props.rows);
	}, [props.rows]);

	useEffect(() => {
		// if (props.parent && props.parent === "assocTaxRollInterests") {
		const payload = {
			filters: [{ field: 'contact._id', value: props.contactId }],
		};

		if (typeof props.contactId === 'object' && Array.isArray(props.contactId)) {
			payload.contactIds = props.contactId;
		} else {
			payload.contactId = props.contactId;
		}
		payload.dealId = props.dealId;
		getContactParcelInterests({
			variables: payload,
		});
		// }
	}, [getContactParcelInterests, props.contactId, props.parent]);

	useEffect(() => {
		if (tableData?.length > 0) {
			let wells = tableData;
			const objectsIdsArray = wells.map(well => well.parcel._id);
			props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
		}
	}, [tableData]);

	useEffect(() => {
		if (dataContactParcels?.contactParcelInterest?.length > 0) {
			let wells = dataContactParcels.contactParcelInterest;

			wells = wells.map(w => {
				let well = { ...w };
				const parcel = JSON.parse(well.parcel.shape).properties;
				const original_properties = getParcelOriginalProperties(parcel);
				well.parcelName = well.parcel.name;
				well.cost_bearing_high_value = well?.cost_bearing_high_value
					? vf_currency(well.cost_bearing_high_value)
					: undefined;
				well.cost_free_high_value = well?.cost_free_high_value ? vf_currency(well.cost_free_high_value) : undefined;
				well.state = original_properties.state;
				well.county = original_properties.county;
				well.survey = original_properties.state === 'TX' ? original_properties.survey : original_properties.meridian;
				well.block = original_properties.state === 'TX' ? original_properties.block : original_properties.township;
				well.section = original_properties.state === 'TX' ? original_properties.section : original_properties.range;
				well.abstract = original_properties.state === 'TX' ? original_properties.abstract : original_properties.section;
				well.grantee = original_properties.altSurvey;
				if (well.qtr) {
					well.qtr_calls = `${well.qtr[0] ? well.qtr[0] : ''} ${well.qtr[1] ? well.qtr[1] : ''} ${well.qtr[2] ? well.qtr[2] : ''} ${well.qtr[3] ? well.qtr[3] : ''}`;
				}
				well.detailCard = well.wellId;
				well.isTracked = false;
				well.commentsCounter = 0;
				well.tags = [[], 0];
				well.parcelId = well.parcel._id;

				well = props.setGenricData(well, well.parcel._id, ['comments', 'tracks', 'tags']);

				const interestKeys = [
					'nra',
					'surface_interest',
					'mineral_interest',
					'royalty_interest',
					'orri',
					'record_title',
					'operating_rights',
					'nri',
					'net_acres',
					'unknown_interest',
				];

				Object.keys(well).forEach(key => {
					if (interestKeys.includes(key)) {
						if (typeof well[key] === 'number') well[key] = addTrailingZeros(well[key]);
						else if (well[key]?.['$numberDecimal']) {
							well[key] = addTrailingZeros(Number(well[key]['$numberDecimal']));
						}
					}
				});

				return well;
			});
			props.setRows(wells);
			const cleanAvailableTags = []; // get from backend
			const columns = handleTagColumn(TableHeader, cleanAvailableTags);
			let tenantName = window.sessionStorage.getItem('tenantName');
			if (tenantName !== 'Providence' && columns.length > 0) {
				let index = columns.findIndex(col => col.name === 'cost_bearing');
				set(columns, `[${index}].options.display`, false);
				set(columns, `[${index}].options.filter`, false);
				set(columns, `[${index}].options.viewColumns`, false);
				index = columns.findIndex(col => col.name === 'cost_free_high_value');
				set(columns, `[${index}].options.display`, false);
				set(columns, `[${index}].options.filter`, false);
				set(columns, `[${index}].options.viewColumns`, false);
				index = columns.findIndex(col => col.name === 'cost_bearing_high_value');
				set(columns, `[${index}].options.display`, false);
				set(columns, `[${index}].options.filter`, false);
				set(columns, `[${index}].options.viewColumns`, false);
			}
			setColumns(columns);
			props.setLoading(false);
		} else if (tableData?.edges?.length === 0) {
			props.setLoading(false);
		}
	}, [tableData, props.dependencyUpdate]);

	const count = dataContactParcels?.paginatedContactWellInterests?.totalCount || 0;
	const options = {
		rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
		count: count,
		serverSide: true,
	};
	////////////-----Add your code section here-----///////////////////////
	const getWellOwnersByYear = selectedYear => {
		setSelectedYear(selectedYear);
	};

	const deleteFunc = ids => {
		for (let i = 0; i < ids.length; i++) {
			updateWellInterest({
				variables: {
					wellInterest: {
						id: ids[i],
						isDeleted: true,
					},
				},
				refetchQueries: ['getContactWells', 'getContactParcelInterests'],
				awaitRefetchQueries: true,
			});
		}
	};

	const showParcelDetails = parcel => {
		history.push(`/contact/details/${props.contactId}/parcels/${parcel.descriptorObject}`);
	};

	const searchData = searchText => {
		const rows = [];
		if (searchText) {
			for (let i = 0; i < props.rows.length; i++) {
				for (const key of Object.keys(props.rows[i])) {
					const col = columns.find(column => column.name === key);
					if (col && (!col.options || col.options.searchable !== false)) {
						if (typeof props.rows[i][key] === 'string') {
							const value = props.rows[i][key].toLowerCase();
							if (value.includes(searchText.toLowerCase())) {
								rows.push(props.rows[i]);
								break;
							}
						}
					}
				}
			}
			setSearchedRows(rows);
		} else {
			setSearchedRows(props.rows);
		}
	};

	const onTableChange = (action, tableState, rows, meta) => {
		switch (action) {
			case 'search':
				searchData(tableState.searchText);
				break;
			case 'onSearchClose':
				break;
			default:
		}
	};

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			{props.parent && props.parent === 'assocTaxRollInterests' && (
				<AddWellInterestDialog
					open={stateApp.wellInterestDialog ? true : false}
					width="450px"
					onClose={() =>
						setStateApp(stateApp => ({
							...stateApp,
							wellInterestDialog: false,
						}))
					}
					contactId={props.contactId}
				/>
			)}

			<Table
				style={{ backgroundColor: '#fff' }}
				header={props.header}
				columns={columns}
				rows={searchedRows}
				total={total}
				loading={loading}
				addAble={addAble}
				targetLabel={props.targetLabel}
				deleteFunc={deleteFunc}
				uploadIcon={null}
				showParcelDetails={showParcelDetails}
				dense={props.dense ? props.dense : undefined}
				orderByTracks={orderByTracks}
				startPaginationAt={null}
				contactId={props.contactId}
				options={options}
				parent={props.parent}
				setColumnsBase={[]}
				onTableChange={onTableChange}
				getWellOwnersByYear={getWellOwnersByYear}
			/>
		</Container>
	);
}

export default React.memo(TableHOC(ContactParcelInterestTable), deepEqualObjects);
