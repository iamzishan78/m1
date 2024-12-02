import React, { useContext, useState, useEffect } from 'react';
// context
import { AppContext } from 'AppContext';

import { Container, Button } from '@material-ui/core';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHOC from 'components/Table/TableHOC';

// QUERIES
import { useLazyQuery, useMutation } from '@apollo/client';
import { SHAPE_TRACTS } from 'graphQL/useQueryPaginatedShapeTracts';
import { ADD_TRACTS_TOA_SHAPE } from 'graphQL/useMutationAddTractsToAShape';
import { copy, deepEqualObjects, setStateIfDeepEqual } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/unit-tracts-header-schema.js';

// Utilities
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from 'actions/Notifications.js';
import { usetableStyles } from '../Styles/index.js';

function AssociatedTractsUnitTable(props) {
	const classes = usetableStyles();

	// contexts
	const dispatch = useDispatch();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [count, setCount] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	// function states
	const [columns, Columns] = useState(copy(TableHeader));
	const setColumns = newState => {
		setStateIfDeepEqual(Columns, newState);
	};
	const [addShapeTract] = useMutation(ADD_TRACTS_TOA_SHAPE, {
		onCompleted: () => {
			props.setLoading(false);
			props.setSelectedTab(0);
		},
		refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	// queries
	// i have no idea why skip works, but if we dont use it, a query variable change during pagination will
	// rerun the new query but also the "first" query https://github.com/apollographql/apollo-client/issues/5912#issuecomment-803013814
	// may not have needed for paginatedContacts due to relayStylePagination type policy
	const [getPaginatedPotentialShapeTracts, { data: dataShapeTracts }] = useLazyQuery(SHAPE_TRACTS, {
		fetchPolicy: 'cache-and-network',
		skip: true,
		onCompleted: dataShapeTracts => {
			setCount(dataShapeTracts?.paginatedPotentialShapeTracts.length);
		},
	});
	const tableData = dataShapeTracts?.paginatedPotentialShapeTracts;

	////////////Contact Wells begin///////////////////////////////////////////////
	useEffect(() => {
		getPaginatedPotentialShapeTracts({
			variables: {
				polygon: props.customLayer?.shapeJson?.geometry,
				userId: stateApp.user.mongoId,
			},
		});
	}, [props.parent]);

	useEffect(() => {
		if (tableData?.length > 0) {
			const isStateTx = !!tableData.find(hit => hit.state === 'TX');
			if (isStateTx) {
				columns.forEach(header => {
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

			props.setRows(tableData);
			setColumns(columns);
			props.setLoading(false);
		} else if (tableData?.length === 0) {
			props.setLoading(false);
		}
	}, [tableData]);

	////////////Contact Wells end///////////////////////////////////////////////

	const onTableChange = (action, tableState, rows, meta) => {
		switch (action) {
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
		count: count || 0,
		serverSide: false,
		searchable: true,
		filter: true,
		// column: false,
		customToolbar: () => {
			return (
				<div style={{ display: 'inline', float: 'left', marginRight: '15px', marginTop: '5px' }}>
					<Button color="secondary" className={classes.multiSelectionTopBarButtons} disabled={true}>
						+ ADD Tracts TO {props.shapeType?.toUpperCase()}
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
								addTractsToShape();
							}}
						>
							+ ADD Tracts TO {props.shapeType?.toUpperCase()}
						</Button>
					</div>
				</div>
			);
		},
	};

	const addTractsToShape = () => {
		const { rows } = props;
		let selectedTracts = copy(selectedRows.map(sR => rows[sR.dataIndex]));
		selectedTracts.map(selectedTract => {
			selectedTract.shapeId = props.customLayer._id;
			return selectedTract;
		});
		props.setLoading(true);
		addShapeTract({
			variables: { shapeTracts: selectedTracts, shapeType: props.shapeType },
		}).then(
			({ data: { addTractsToAShape } }) => {
				if (addTractsToAShape?.success) {
					Columns([...columns]);
					dispatch(showSuccessMessage(addTractsToAShape.message));
				} else {
					dispatch(showErrorMessage(addTractsToAShape.message));
				}
				props.setLoading(false);
				props.setSelectedTab(0);
			},
			err => {
				console.log(err);
				props.setLoading(false);
				dispatch(showErrorMessage('Failed to attach to unit'));
			}
		);
	};

	return (
		<div className={classes.root}>
			<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
				<Table
					style={{ backgroundColor: '#fff' }}
					header={props.header}
					columns={columns}
					rows={props.rows}
					loading={props.loading}
					targetLabel={props.targetLabel}
					deleteFunc={null}
					uploadIcon={null}
					dense={props.dense ? props.dense : undefined}
					startPaginationAt={null}
					onTableChange={onTableChange}
					options={options}
					parent={props.parent}
					setColumnsBase={[]}
				/>
			</Container>
		</div>
	);
}

export default React.memo(TableHOC(AssociatedTractsUnitTable), deepEqualObjects);
