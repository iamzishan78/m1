import React, { useEffect, useContext, useState } from 'react';
import { Container, Dialog } from '@material-ui/core';
import { debounce, get } from 'lodash';

// context
import { AppContext } from 'AppContext';
import TableESHOC from 'components/Table/TableESHOC';
import Table from 'components/Shared/M1nTable/components/Table';

// QUERIES
import { deepEqualObjects, copy } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/my-wells-grid-header-schema';

// Utilities
import { usetableStyles } from '../Styles';

// value formatters
import convert_date from 'components/Shared/valueformatters/convert_date.js';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import { REMOVE_AGREEMENTS } from 'graphQL/useMutationRemoveAgreements';
import { useMutation } from '@apollo/client';
import { REMOVE_WELLS } from 'graphQL/useMutationRemoveWells';

const startPaginationAt = 50;

function MyWellsGridTable(props) {
	const classes = usetableStyles();
	const [stateApp] = useContext(AppContext);

	const [resetSelectedRow, setResetSelectedRow] = useState(false);

	const [removeWells] = useMutation(REMOVE_WELLS, {
		refetchQueries: ['getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		setTableMeta({
			filters: props.filters,
			addBtnText: 'WELL',
			onClickAdd: () => props.setDialog(true),
			extendSearchQuery: stateApp.landSearchQuery,
			searchFields: ['wellData.wellName', 'wellData.api', 'wellData.WellName', 'wellData.ApiNumber'],
			TableHeader: copy(TableHeader),
			esIndex: 'mywells_flat',
			startPaginationAt,
			defaultSort: { field: 'lastUpdateAt', order: 'desc' },
			exportPx: '121px',
			formatHits,
		});
		// eslint-disable-next-line
	}, [stateApp.landSearchQuery, props.filters]);

	useEffect(() => {
		props.setSelectedWell(props.clickedRow);
	}, [props.clickedRow]);

	const deleteFunc = ids => {
		if (ids.length > 0) {
			props.setLoading(true);
			removeWells({
				variables: {
					wellIds: ids,
				},
			}).then(() => {
				props.setLoading(false);
				setResetSelectedRow(!resetSelectedRow);
			});
		}
	};

	const setTableMeta = React.useMemo(
		() =>
			debounce((request, top, callback) => {
				props.setTableMeta(request);
			}, 500),
		[]
	);

	const formatHits = hits => {
		hits = hits.map(hit => {
			const properties = get(hit, 'properties', []);
			const properttInterest = get(hit, 'propertyDescriptor', []);
			const propertiesKeys = {
				internalID: [],
				propertiesNames: [],
				prospectID: [],
				status: [],
				acquisitionID: [],
				internalCompany: [],
				divOrderStatus: [],
			};

			const propertyInterestKeys = {
				costFree: [],
				effectiveDate: [],
				interestAmount: [],
				interestType: [],
			};
			properties.forEach(property => {
				// pushing all the property keys to main object
				Object.keys(propertiesKeys).forEach(key => {
					const _key = key === 'propertiesNames' ? 'name' : key,
						_value = _key.includes('Date') ? convert_date(property[_key]) : property[_key];
					propertiesKeys[key].push(_value);
				});
			});

			properttInterest.forEach(propertyInterest => {
				Object.keys(propertyInterestKeys).forEach(key => {
					const _value = key.includes('Date') ? convert_date(propertyInterest[key]) : propertyInterest[key];
					propertyInterestKeys[key].push(_value);
				});
			});

			hit = {
				...hit,
				...hit.wellData,
				...propertiesKeys,
				...propertyInterestKeys,
				_id: hit._id,
				sort: hit.sort,
				permitApprovedDate: hit.wellData.permitApprovedDate ? convert_date(hit.wellData.permitApprovedDate) : null,
				spudDate: hit.wellData.spudDate ? convert_date(hit.wellData.spudDate) : null,
				completionDate: hit.wellData.completionDate ? convert_date(hit.wellData.completionDate) : null,
				firstProdDate: hit.wellData.FirstProdDate ? convert_date(hit.wellData.FirstProdDate) : null,
			};
			return hit;
		});
		return hits;
	};

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			<Dialog
				open={props.openDialog ? true : false}
				onClose={() => props.setOpenDialog(null)}
				fullWidth={true}
				maxWidth={'sm'}
			>
				{props.openDialog === 'delete' && (
					<DeleteConfirmationDialogContent
						header={`Delete Well(s)`}
						onClose={() => props.setOpenDialog(null)}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={props.selectedRows.map(sR => props.rows[sR.dataIndex].Id)}
						setM1nSelectedRowsIndexes={props.setSelectedRows}
					>
						{`Do you want to delete the selected Well${
							props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? 's' : ''
						}?`}
					</DeleteConfirmationDialogContent>
				)}
			</Dialog>
			<Table
				style={{ backgroundColor: '#fff' }}
				header={props.header}
				columns={props.columns}
				rows={props.rows}
				total={false}
				loading={props.loading}
				targetLabel={props.targetLabel}
				uploadIcon={null}
				dense={props.dense ? props.dense : undefined}
				orderByTracks={false}
				startPaginationAt={startPaginationAt}
				onTableChange={props.onTableChange}
				resetSelectedRow={resetSelectedRow}
				options={{
					...props.options,
					...props.customOptions,
				}}
				parent={props.parent}
				setColumnsBase={[]}
				{...props.esHocProps}
			/>
		</Container>
	);
}

export default React.memo(TableESHOC(MyWellsGridTable), deepEqualObjects);
