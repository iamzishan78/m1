import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

// context
import { AppContext } from 'AppContext';

import { Container, Button } from '@material-ui/core';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHOC from 'components/Table/TableHOC';

// QUERIES
import { useLazyQuery, useMutation } from '@apollo/client';
import { SHAPEWELLS } from 'graphQL/useQueryPaginatedShapeWells';

import { deepEqualObjects, setStateIfDeepEqual } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/well-header-schema.js';

// Utilities
import isEmpty from 'lodash/isEmpty';
import ticksToDateString from '../../Shared/valueformatters/ticks-to-string.js';
import { getPolygonString } from 'components/Shared/functions';
import { handleTagColumn } from '../helpers/index.js';
import { SHAPEWELLSCOUNT } from 'graphQL/useQueryShapeWellsCount.js';
import { ADD_MULTI_WELLINTEREST_TO_SHAPE } from 'graphQL/useMutationAddMultiWellInterestToShape.js';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from 'actions/Notifications.js';
import { usetableStyles } from '../Styles/index.js';

function AssociatedWellsShapeTable(props) {
	const classes = usetableStyles();

	// contexts
	const dispatch = useDispatch();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [count, setCount] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	// function states
	const [columns, Columns] = useState([]);
	const setColumns = newState => {
		setStateIfDeepEqual(Columns, newState);
	};
	const [selectedYear, setSelectedYear] = useState(2020); // production selected year state
	const [addMultiWellInterestToShape] = useMutation(ADD_MULTI_WELLINTEREST_TO_SHAPE);

	// queries
	// i have no idea why skip works, but if we dont use it, a query variable change during pagination will
	// rerun the new query but also the "first" query https://github.com/apollographql/apollo-client/issues/5912#issuecomment-803013814
	// may not have needed for paginatedContacts due to relayStylePagination type policy
	const [getPaginatedShapeWells, { data: dataShapeWells, variables: variablesShapeWells }] = useLazyQuery(SHAPEWELLS, {
		fetchPolicy: 'cache-and-network',
		skip: true,
		onCompleted: dataShapeWells => {
			setCount((state, props) => {
				let newState = state || dataShapeWells?.paginatedShapeWells?.edges?.length;
				let newStateIncrement =
					!variablesShapeWells?.pagination?.before && dataShapeWells?.paginatedShapeWells?.pageInfo?.hasNextPage
						? 1
						: 0;

				return newState + newStateIncrement;
			});
		},
	});
	const [getShapeWellsCount, { data: dataShapeWellsCount }] = useLazyQuery(SHAPEWELLSCOUNT, {
		fetchPolicy: 'cache-and-network',
		skip: true,
		onCompleted: dataShapeWellsCount => {
			setStateApp(state => ({
				...state,
				shapeGridWellsCount: dataShapeWellsCount?.shapeWellsCount,
			}));
		},
	});
	const tableData = dataShapeWells?.paginatedShapeWells;

	const addAble = false;
	const total = false;
	const orderByTracks = false;

	////////////Contact Wells begin///////////////////////////////////////////////
	useEffect(() => {
		// if (props.customLayer?.shape) {
		//     props.customLayer.shape = {};   // this will make it like it doesn't have boundary
		// }
		getPaginatedShapeWells({
			variables: {
				polygon: getPolygonString(props.customLayer?.shape),
				shapeId: props.customLayer?._id,
			},
		});
		getShapeWellsCount({
			variables: {
				polygon: getPolygonString(props.customLayer?.shape),
			},
		});
	}, [props.parent]);

	useEffect(() => {
		if (tableData?.edges?.length > 0) {
			let wells = tableData.edges.map(el => el.node);
			const objectsIdsArray = wells.map(well => well.id);
			props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
		}
	}, [tableData]);

	useEffect(() => {
		if (tableData?.edges?.length > 0) {
			let wells = tableData.edges.map(el => ({ ...el.node, cursor: el.cursor }));

			wells = wells.map(w => {
				let well = { ...w };
				well.wellId = w.id;
				//// temporary to fix the ticks dates fields comming from the rest api
				if (well.permitApprovedDate && well.permitApprovedDate != 'null')
					well.permitApprovedDate = ticksToDateString(well.permitApprovedDate);
				if (well.spudDate && well.spudDate != 'null') well.spudDate = ticksToDateString(well.spudDate);
				if (well.completionDate && well.completionDate != 'null')
					well.completionDate = ticksToDateString(well.completionDate);
				if (well.firstProductionDate && well.firstProductionDate != 'null')
					well.firstProductionDate = ticksToDateString(well.firstProductionDate);
				//// temporary end

				well.coordinates = {};
				well.coordinates.wellId = well.wellId;
				if (well.longitude && well.latitude) well.coordinates.center = [well.longitude, well.latitude];

				well.detailCard = well.id;

				well.isTracked = false;
				well.commentsCounter = 0;
				well.tags = [[], 0];

				well = props.setGenricData(well, well.id, ['comments', 'tracks', 'tags']);

				return well;
			});
			props.setRows(wells);

			const cleanAvailableTags = []; // get from backend

			const columns = handleTagColumn(TableHeader, cleanAvailableTags);
			setColumns(columns);
			props.setLoading(false);
		} else if (tableData?.edges?.length === 0) {
			props.setLoading(false);
		}
	}, [tableData, props.dependencyUpdate]);

	////////////Contact Wells end///////////////////////////////////////////////

	const onTableChange = (action, tableState, rows, meta) => {
		const pageVariables = {
			variables: {
				polygon: getPolygonString(props.customLayer?.shape),
				userId: stateApp.user.mongoId,
				pagination: {
					first: tableState.rowsPerPage,
					after: null,
				},
				...(!isEmpty(tableState.sortOrder) && {
					sort: {
						field:
							tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.dbName ||
							tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.name,
						order: tableState.sortOrder?.direction === 'asc' ? 1 : -1,
					},
				}),

				filters: {},
			},
		};

		switch (action) {
			case 'changeRowsPerPage':
				props.setLoading(true);
				tableState.page = 0;
				meta.setPageInd(tableState.page);
				meta.setRowsPerPage(tableState.rowsPerPage);
				getPaginatedShapeWells(pageVariables);
				break;
			case 'changePage':
			case 'search':
				props.setLoading(true);
				if (tableState.page > meta.pageInd) {
					setCount((state, props) => {
						return (tableState.page + 1) * tableState.rowsPerPage;
					});
				}
				getPaginatedShapeWells({
					...pageVariables,
					variables: {
						...pageVariables.variables,
						search: tableState.searchText,
						pagination: {
							...pageVariables.variables.pagination,
							before: props.rows && tableState.page < meta.pageInd ? props.rows[0]?.cursor : null,
							after: props.rows && tableState.page > meta.pageInd ? props.rows[props.rows.length - 1]?.cursor : null,
						},
					},
				});
				break;
			case 'sort':
				props.setLoading(true);
				tableState.page = 0;
				meta.setPageInd(tableState.page);
				getPaginatedShapeWells(pageVariables);
				break;
			case 'onSearchClose':
				break;
			case 'propsUpdate':
				break;
			case 'filterChange':
				break;
			case 'resetFilters':
				break;
			case 'rowSelectionChange':
				setSelectedRows(tableState.selectedRows.data);
				break;
			default:
		}
	};

	const options = {
		rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
		count: stateApp.shapeGridWellsCount || count || 0,
		serverSide: false,
		// search: false,
		// filter: false,
		// column: false,
		customToolbar: () => {
			return (
				<div style={{ display: 'inline', float: 'left', marginRight: '15px', marginTop: '5px' }}>
					<Button id="addWells" color="secondary" className={classes.multiSelectionTopBarButtons} disabled={true}>
						+ ADD Wells TO {props.shapeType?.toUpperCase()}
					</Button>
				</div>
			);
		},
		customToolbarSelect: ({ data }) => {
			return (
				<div style={{ height: '48px', display: 'flex' }}>
					<div style={{ marginTop: '6px', height: '35px', display: 'flex', marginRight: '20px' }}>
						<Button
							id="addWells"
							color="secondary"
							className={classes.multiSelectionTopBarButtons}
							disabled={data.length < 1}
							onClick={() => {
								addWellInterestToShape();
							}}
						>
							+ ADD Wells TO {props.shapeType?.toUpperCase()}
						</Button>
					</div>
				</div>
			);
		},
	};

	const addWellInterestToShape = () => {
		const { rows } = props;
		const selectedWells = selectedRows.map(sR => ({ ...rows[sR.dataIndex], globalWell: rows[sR.dataIndex].wellId }));
		// const selectedWells = tableData.filter((t, index) => rows.data.find((row) => row.dataIndex === index))
		props.setLoading(true);
		addMultiWellInterestToShape({
			variables: {
				wells: selectedWells,
				shapeId: props.customLayer._id,
				shapeType: props.shapeType,
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getShapeSummaryDetails'],
			awaitRefetchQueries: true,
		}).then(
			({ data: { addMultiWellInterestToShape } }) => {
				if (addMultiWellInterestToShape?.success) {
					// rowsSelected.current = []
					Columns([...columns]);
					dispatch(showSuccessMessage(addMultiWellInterestToShape.message));
				} else {
					dispatch(showErrorMessage(addMultiWellInterestToShape.message));
				}
				props.setLoading(false);
				props.setSelectedTab(0);
			},
			err => {
				console.log(err);
				props.setLoading(false);
				dispatch(showErrorMessage('Failed to attach to contact'));
			}
		);
	};

	////////////-----Add your code section here-----///////////////////////
	const getWellOwnersByYear = selectedYear => {
		setSelectedYear(selectedYear);
	};
	return (
		<div className={classes.root}>
			<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
				<Table
					style={{ backgroundColor: '#fff' }}
					header={props.header}
					columns={columns}
					rows={props.rows}
					total={total}
					loading={props.loading}
					addAble={addAble}
					targetLabel={props.targetLabel}
					deleteFunc={null}
					uploadIcon={null}
					dense={props.dense ? props.dense : undefined}
					orderByTracks={orderByTracks}
					startPaginationAt={null}
					onTableChange={onTableChange}
					options={options}
					parent={props.parent}
					setColumnsBase={[]}
					getWellOwnersByYear={getWellOwnersByYear}
				/>
			</Container>
		</div>
	);
}

export default React.memo(TableHOC(AssociatedWellsShapeTable), deepEqualObjects);
