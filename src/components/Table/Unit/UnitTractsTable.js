import React, { useState, useEffect } from 'react';
// context

import { Container, Button, Dialog, Tooltip, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHOC from 'components/Table/TableHOC';

// QUERIES
import { useLazyQuery, useMutation } from '@apollo/client';
import { UPDATE_SHAPE_TRACTS } from 'graphQL/useMutationUpdateShapeTracts';

import { setStateIfDeepEqual, deepEqualObjects, copy } from 'components/Shared/functions';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

// Header Schemas
import TableHeader from 'components/Table/constants/unit-tracts-header-schema.js';

// Utilities
import { usetableStyles } from '../Styles';
import AddUnitTractDialog from 'components/Shared/M1nTable/components/SubComponents/AddUnitTractDialog';
import { GET_ES_PAGINATED_LIST } from 'graphQL/useQueryESPaginatedList';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import { AutoCompleteFilter } from '../AutoCompleteFilter';

function UnitTractsTable(props) {
	const classes = usetableStyles();
	const [addToTable, setAddToTable] = useState(false);
	const [openDialog, setOpenDialog] = useState(null);

	// function states
	const [columns, Columns] = useState([]);
	const [selectedRow, selectRow] = useState();
	const [selectedRows, setSelectedRows] = useState([]);

	const setColumns = newState => {
		setStateIfDeepEqual(Columns, newState);
	};

	// queries

	const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			props.setLoading(false);
		},
	});

	const [updateShapeTract] = useMutation(UPDATE_SHAPE_TRACTS, {
		onCompleted: () => {
			props.setLoading(false);
			setSelectedRows([]);
		},

		onError: err => {},
		refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	const tableData = elasticData?.getESPaginatedList;

	const addAble = {
		type: 'wellInterest',
		customLayer: props.customLayer,
		customLayerId: props.customLayer._id,
	};

	const startPaginationAt = 25;
	const extendSearchQuery = `shape._id:${props.customLayer._id}`;
	const esIndex = 'shapetracts_flat';

	////////////Contact Wells begin///////////////////////////////////////////////
	useEffect(() => {
		getESPaginatedList({
			variables: {
				esIndex,
				pagination: {
					first: startPaginationAt,
					keep_alive: '1micros',
				},
				search: `shape._id:${props.customLayer._id}`,
			},
		});
	}, [props.parent]);

	useEffect(() => {
		if (tableData?.hits?.length > 0) {
			const objectsIdsArray = tableData?.hits?.map(hit => hit._id);
			props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
		}
	}, [tableData]);

	useEffect(() => {
		if (tableData?.hits?.length > 0) {
			let hits = tableData?.hits;
			const isStateTx = !!hits.find(hit => hit.state === 'TX');

			props.setRows(hits);
			let headers = copy(TableHeader);

			if (isStateTx) {
				headers.forEach(header => {
					if (header.name === 'meridian') {
						header.name = 'survey';
						header.label = 'Survey';
						header.esKey = 'survey.keyword';
					} else if (header.name === 'township') {
						header.name = 'block';
						header.label = 'Block';
						header.esKey = 'block.keyword';
					} else if (header.name === 'section') {
						header.name = 'abstract';
						header.label = 'Abstract';
						header.esKey = 'abstract.keyword';
					} else if (header.name === 'range') {
						header.name = 'section';
						header.label = 'Section';
						header.esKey = 'section.keyword';
					}
				});
			}

			headers.forEach(column => {
				if (column?.options?.filter) {
					column.options = {
						...column.options,
						filter: true,
						filterType: 'custom',
						filterOptions: {
							display: (filterList, onChange, index, column) => {
								column.filterKey = headers.find(el => el.name === column.name)?.esKey;
								return (
									<AutoCompleteFilter
										filterList={filterList}
										column={column}
										index={index}
										onChange={onChange}
										extendSearchQuery={extendSearchQuery}
										query={GET_ES_FILTER_LIST}
										esIndex={esIndex}
									/>
								);
							},
						},
					};
				}
			});

			setColumns(headers);
			props.setLoading(false);
		} else if (tableData?.hits?.length === 0) {
			props.setRows([]);
			props.setLoading(false);
		}
	}, [tableData, props.dependencyUpdate]);

	////////////Contact Wells end///////////////////////////////////////////////

	const onTableChange = (action, tableState, rows, meta) => {
		tableState.esIndex = esIndex;
		const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESPaginatedList);
		switch (action) {
			case 'search':
			case 'sort':
			case 'filterChange':
			case 'resetFilters':
			case 'changeRowsPerPage':
				tableActions.extendSearchQuery(extendSearchQuery);
				tableActions.genericESAction();
				break;
			case 'rowSelectionChange':
				setSelectedRows(tableState.selectedRows.data);
				break;
			case 'changePage':
				tableActions.extendSearchQuery(extendSearchQuery);
				tableActions.changeESPage();
				break;
			default:
		}
	};

	const count = tableData?.total || 0;
	const options = {
		rowsPerPageOptions: [10, 25, 50, 100],
		count: count,
		serverSide: true,
		searchable: true,
		rowsSelected: selectedRows.map(sR => sR.dataIndex),
		filter: true,
		customToolbar: () => {
			return (
				<div style={{ display: 'inline', float: 'left', marginRight: '15px', marginTop: '5px' }}>
					<Button
						color="secondary"
						className={classes.multiSelectionTopBarButtons}
						onClick={() => {
							setAddToTable(true);
							selectRow(null);
						}}
					>
						+ ADD Tract To {props.shapeType?.toUpperCase()}
					</Button>
				</div>
			);
		},
		customToolbarSelect: ({ data }) => {
			return (
				<div style={{ height: '48px', display: 'flex' }}>
					<div style={{ marginTop: '6px', height: '35px', display: 'flex' }}>
						<Tooltip title={'Delete'}>
							<IconButton
								size="medium"
								style={{ margin: '0 5px' }}
								aria-label="delete"
								onClick={e => {
									setOpenDialog('delete');
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</div>
				</div>
			);
		},
		onRowClick: (rowData, { dataIndex, rowIndex }) => {
			setAddToTable(true);
			selectRow({ ...props.rows[dataIndex] });
		},
	};

	const deleteFunc = ids => {
		if (ids.length > 0) {
			props.setLoading(true);
			updateShapeTract({
				variables: {
					shapeTracts: ids.map(_id => ({ _id, isDeleted: true })),
				},
			});
		}
	};

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			{addToTable && (
				<AddUnitTractDialog
					open={addToTable}
					width="450px"
					shapeId={props.customLayer._id}
					shapeType={props.shapeType}
					seletedTract={selectedRow}
					onClose={() => setAddToTable(false)}
				/>
			)}

			<Dialog open={openDialog ? true : false} onClose={() => setOpenDialog(null)} fullWidth={true} maxWidth={'sm'}>
				{openDialog === 'delete' && (
					<DeleteConfirmationDialogContent
						header="Delete Tracts(s)"
						onClose={() => setOpenDialog(null)}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={selectedRows.map(sR => props.rows[sR.dataIndex]?._id)}
						setM1nSelectedRowsIndexes={setSelectedRows}
					>
						{`Do you want to permanently delete the tracts${
							selectedRows && selectedRows.length > 1 && selectedRows.length > 1 ? 's' : ''
						} from  this Unit?`}
					</DeleteConfirmationDialogContent>
				)}
			</Dialog>

			<Table
				style={{ backgroundColor: '#fff' }}
				header={props.header}
				columns={columns}
				rows={props.rows}
				total={false}
				loading={props.loading}
				addAble={addAble}
				targetLabel={props.targetLabel}
				uploadIcon={null}
				dense={props.dense ? props.dense : undefined}
				orderByTracks={false}
				startPaginationAt={null}
				onTableChange={onTableChange}
				options={options}
				parent={props.parent}
				setColumnsBase={[]}
			/>
		</Container>
	);
}

export default React.memo(TableHOC(UnitTractsTable), deepEqualObjects);
