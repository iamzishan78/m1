import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { Container, Button } from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
import React, { useContext, useState, useEffect, useRef } from 'react';

// context
import { deepEqualObjects, setStateIfDeepEqual } from 'components/Shared/functions';
import { getPolygonString } from 'components/Shared/functions';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHeader from 'components/Table/constants/potential-parcel-owners-header-schema';
import TableHOC from 'components/Table/TableHOC';

import { IFARECONTACTS } from 'graphQL/useQueryIfOwnersAreContacts';
import { SHAPE_OWNERS } from 'graphQL/useQueryPaginatedShapeOwners';
import { AppContext } from 'AppContext';

// QUERIES

import { SHAPEOWNERSCOUNT } from 'graphQL/useQueryShapeOwnersCount';
import { ADDOWNERTOAPARCEL } from 'graphQL/useMutationAddOwnerToAParcel';
import { CONVERT_MULTITPLE_OWNER_TO_CONTACT } from 'graphQL/useMutationConvertMultitpleOwnerToContact';

// Header Schemas

import { handleTagColumn } from '../helpers';

// Utilities

import { usetableStyles } from '../Styles';

import { MultipleOwnerToContactDrawerContainer } from 'store/containers';

function SuggestedOwnerTable(props) {
	const classes = usetableStyles();
	const { jobType, jobName } = props;

	// contexts
	const [stateApp] = useContext(AppContext);

	const client = useApolloClient();

	// function states
	const [columns, Columns] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const setColumns = newState => {
		setStateIfDeepEqual(Columns, newState);
	};
	const [selectedYear, setSelectedYear] = useState(2023); // production selected year state
	const [count, setCount] = useState(); // local state for async count query
	const [suggestedOwnersCount, setSuggestedOwnersCount] = useState(); // local state for async count query

	const [showConvertDialog, setShowConvertDialog] = useState(false);

	const setM1nSelectedRowsIndexesRef = useRef();

	// queries
	const [getPaginatedShapeOwners, { data: dataShapeOwners, variables: variablesShapeOwners }] = useLazyQuery(
		SHAPE_OWNERS,
		{
			fetchPolicy: 'cache-and-network',
			skip: true,
			onCompleted: dataShapeOwners => {
				setCount((state, props) => {
					let newState = state || dataShapeOwners?.paginatedShapeOwners?.edges?.length;
					let newStateIncrement =
						!variablesShapeOwners?.pagination?.before && dataShapeOwners?.paginatedShapeOwners?.pageInfo?.hasNextPage
							? 1
							: 0;

					return newState + newStateIncrement;
				});
			},
		}
	);
	const [addOwnerToAParcel, { data: mutationData }] = useMutation(ADDOWNERTOAPARCEL);
	const [convertMultitpleOwnerToContact] = useMutation(CONVERT_MULTITPLE_OWNER_TO_CONTACT);

	const tableData = dataShapeOwners?.paginatedShapeOwners;
	const [getShapeOwnersCount, { data: dataShapeOwnersCount }] = useLazyQuery(SHAPEOWNERSCOUNT, {
		fetchPolicy: 'cache-and-network',
		skip: true,
		onCompleted: dataShapeOwnersCount => {
			setSuggestedOwnersCount(dataShapeOwnersCount?.shapeOwnersCount);
		},
	});

	const addAble = { type: 'suggestedOwnerToParcel' };
	const total = false;
	const orderByTracks = false;

	////////////Contact Wells begin///////////////////////////////////////////////
	useEffect(() => {
		const queryPoly = getPolygonString(props.customLayer?.shape);

		getPaginatedShapeOwners({
			variables: {
				polygon: queryPoly,
				userId: stateApp.user.mongoId,
				pagination: {
					first: 10000 /*tableState.rowsPerPage*/,
					after: null,
				},
			},
		});
		getShapeOwnersCount({
			variables: {
				// polygon: queryPoly,
				polygon: props?.customLayer?.shape?.geometry,
			},
		});
	}, [props.parent]);

	useEffect(() => {
		if (tableData?.edges?.length > 0) {
			let owners = tableData.edges.map(el => el.node);
			const objectsIdsArray = owners.map(owner => owner.globalOwnerId);
			props.initializeGenericData(objectsIdsArray, ['comments', 'tags', 'ifAreContacts']);
		}
	}, [tableData]);

	useEffect(() => {
		if (tableData?.edges?.length > 0) {
			let owners = tableData.edges.map(el => ({ ...el.node, cursor: el.cursor }));
			owners = owners.map(o => {
				let owner = { ...o };
				owner.isContact = false;
				owner.ownershipType = owner.OwnerType;
				owner = props.setGenricData(owner, owner.globalOwnerId, ['comments', 'tracks', 'tags', 'ifAreContacts']);

				return owner;
			});
			props.setRows(owners);

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
		if (action === 'filterChange') {
			let isFiltered = false;
			for (let i = 0; i < tableState.filterList.length; i++) {
				if (tableState.filterList[i].length !== 0) {
					isFiltered = true;
					break;
				}
			}
			props.setIsFiltered(isFiltered);
		}
		setCount((tableState.count = tableState?.displayData.length));
		switch (action) {
			case 'changeRowsPerPage':
				// props.setLoading(true);
				// tableState.page = 0;
				meta.setPageInd(tableState.page);
				meta.setRowsPerPage(tableState.rowsPerPage);
				// getPaginatedShapeOwners(pageVariables);
				break;
			case 'changePage':
				setSelectedRows([]);
				// props.setLoading(true);
				// if (tableState.page > meta.pageInd) {
				//   setCount((state, props) => {
				//     return (tableState.page + 1) * tableState.rowsPerPage
				//   })
				// }
				// getPaginatedShapeOwners({
				//   ...pageVariables,
				//   variables: {
				//     ...pageVariables.variables,
				//     pagination: {
				//       ...pageVariables.variables.pagination,
				//       before:
				//         props.rows && tableState.page < meta.pageInd
				//           ? props.rows[0]?.cursor
				//           : null,
				//       after:
				//         props.rows && tableState.page > meta.pageInd
				//           ? props.rows[props.rows.length - 1]?.cursor
				//           : null,
				//     },
				//   },
				// });
				break;
			case 'sort':
				// props.setLoading(true);
				// tableState.page = 0;
				// meta.setPageInd(tableState.page);
				// getPaginatedShapeOwners(pageVariables);
				break;
			case 'search':
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
		rowsPerPageOptions: count > 25 ? [10, 25, 50, 100, 250] : count > 10 ? [10, 25] : [],
		count: suggestedOwnersCount || count || 0,
		serverSide: false,
		searchable: true,
		filter: false,
		customToolbar: () => {
			return (
				<div style={{ display: 'inline', float: 'left', marginRight: '15px', marginTop: '5px' }}>
					<Button
						color="secondary"
						className={classes.multiSelectionTopBarButtons}
						disabled={true}
						// onClick={addAction}
					>
						+ ADD TO TRACT
					</Button>
				</div>
			);
		},
		customToolbarSelect: ({ data }) => {
			return (
				<div style={{ height: '48px', display: 'flex' }}>
					<div style={{ marginTop: '6px', height: '35px', display: 'flex', marginRight: '20px' }}>
						<Button
							color="secondary"
							className={classes.multiSelectionTopBarButtons}
							disabled={data.length < 1}
							onClick={() => {
								setShowConvertDialog(true);
							}}
						>
							+ ADD TO TRACT
						</Button>
					</div>
				</div>
			);
		},
	};
	////////////-----Add your code section here-----///////////////////////
	const getWellOwnersByYear = selectedYear => {
		setSelectedYear(selectedYear);
	};

	const suggestedOwnerToParcel = async m1nSelectedRowsIndexes => {
		const { rows } = props;
		const selectedRows = [];
		const globalOwnerIds = [];
		for (let i = 0; i < m1nSelectedRowsIndexes.length; i++) {
			if (
				!rows[m1nSelectedRowsIndexes[i]].isContact &&
				!globalOwnerIds.includes(rows[m1nSelectedRowsIndexes[i]].globalOwnerId)
			) {
				globalOwnerIds.push(rows[m1nSelectedRowsIndexes[i]].globalOwnerId);
			} else {
				selectedRows.push(rows[m1nSelectedRowsIndexes[i]]);
			}
		}
		if (globalOwnerIds.length > 0) {
			props.setLoading(true);
			convertMultitpleOwnerToContact({
				variables: {
					ownerIds: globalOwnerIds,
					existingContactId: null,
					status: 'Lead',
					contactOwner: null,
					action: 'single',
					userId: stateApp.user.mongoId,
				},
				refetchQueries: ['checkIfOwnersAreContacts'],
				awaitRefetchQueries: true,
			}).then(
				async res => {
					if (res.data && res.data.convertMultitpleOwnerToContact) {
						const { success, message } = res.data.convertMultitpleOwnerToContact;
						if (success) {
							const { data: checkIfOwnersAreContactsData } = await client.query({
								query: IFARECONTACTS,
								variables: {
									idsArray: globalOwnerIds,
								},
							});
							addParcel(checkIfOwnersAreContactsData.ifAreContacts);
						}
					}
				},
				err => {
					console.log(err);
				}
			);
		}
		if (selectedRows.length > 0) {
			props.setLoading(true);
			addParcel(selectedRows);
		}
		// setSelectedRow([])
		// props.setSelectedTab(0)
	};

	const formatInterestForImport = () => {
		return selectedRows.map(sR => {
			const rec = props.rows?.[sR.dataIndex];
			rec.parcel = {
				_id: props.customLayer._id,
				isSuggested: true,
			};
			return rec;
		});
	};

	const addParcel = selectedRows => {
		for (let i = 0; i < selectedRows.length; i++) {
			const ownerToAdd = {
				customLayer: props.customLayer._id,
				depthFrom: '',
				depthTo: '',
				entity: '',
				interest: null,
				nma: null,
				nra: null,
				ownerEntity: selectedRows[i].isContact,
				type: '',
				isSuggested: true,
			};
			addOwnerToAParcel({
				variables: {
					parcelOwner: {
						...ownerToAdd,
						createBy: stateApp.user.mongoId,
						lastUpdateBy: stateApp.user.mongoId,
					},
				},
			}).then(() => {
				props.setSelectedTab(0);
			});
		}
	};

	return (
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
				// suggestedOwnerToParcel={suggestedOwnerToParcel}
				options={options}
				parent={props.parent}
				setColumnsBase={[]}
				getWellOwnersByYear={getWellOwnersByYear}
				setM1nSelectedRowsIndexesRef={setM1nSelectedRowsIndexesRef}
			/>
			{showConvertDialog && (
				<MultipleOwnerToContactDrawerContainer
					jobType={jobType}
					jobName={jobName}
					onClose={() => {
						setShowConvertDialog(false);
					}}
					rows={formatInterestForImport()}
					setM1nSelectedRowsIndexes={m1nSelectedRowsIndexes => {
						if (typeof setM1nSelectedRowsIndexesRef.current === 'function') {
							setM1nSelectedRowsIndexesRef.current(m1nSelectedRowsIndexes);
						}
					}}
					onSuccess={() => {}}
					setRows={() => {}}
				/>
			)}
		</Container>
	);
}

export default React.memo(TableHOC(SuggestedOwnerTable), deepEqualObjects);
