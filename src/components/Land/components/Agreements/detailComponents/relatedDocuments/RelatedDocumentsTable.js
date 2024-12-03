import React, { useContext, useEffect, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { useMutation } from '@apollo/client';

// context
import { Container, Dialog, Button, IconButton, Tooltip } from '@material-ui/core';
import Table from 'components/Shared/M1nTable/components/Table';
import TableESHOC from 'components/Table/TableESHOC';

// QUERIES

import { deepEqualObjects } from 'components/Shared/functions';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

// Header Schemas
import TableHeader from 'components/Table/constants/parcel-documents-header-schema.js';

// Utilities
import { usetableStyles } from './style';
import { DELETEDESCRIPTORRELATEDFILE } from 'graphQL/useMutationDeleteDescriptorFile';
import { AppContext } from 'AppContext';
import { DrawerContext } from '../DrawerContext';
import convert_date from 'components/Shared/valueformatters/convert_date';

function AgreementDocumentsTable(props) {
	const classes = usetableStyles();
	const [isDeletePopup, setDeletePopup] = useState(false);
	const [resetSelectedRow, setResetSelectedRow] = useState(false);
	const { moduleId } = props;
	const [, setDrawer] = useContext(DrawerContext);

	const [updateParcelDocument] = useMutation(
		DELETEDESCRIPTORRELATEDFILE,
		{
			onCompleted: () => {
				props.setLoading(false);
				props.setSelectedRows([]);
				setResetSelectedRow(!resetSelectedRow);
			},
			onError: err => {},
		},
		{ refetchQueries: ['getESSimpleSearch'], awaitRefetchQueries: true }
	);

	const [, setStateApp] = useContext(AppContext);

	const options = {
		...props.options,
		customToolbar: () => {
			return (
				<div style={{ display: 'inline', float: 'left', marginRight: '15px', marginTop: '5px' }}>
					<Button
						id="addRelatedDcmnButton"
						color="secondary"
						className={classes.multiSelectionTopBarButtons}
						onClick={() => {
							if (!props.setDrawer) return;
							props.setDrawer('dcmnt');
							setStateApp(stateApp => ({ ...stateApp, selectedDocument: null }));
						}}
					>
						+ ADD DOCUMENT
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
									setDeletePopup('delete');
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</div>
				</div>
			);
		},
		onRowClick: (_, { dataIndex }) => {
			setDrawer('dcmnt');

			setStateApp(stateApp => ({ ...stateApp, selectedDocument: props.rows[dataIndex] }));
		},
	};

	const formatHits = hits => {
		hits = hits.map(hit => {
			hit.dateTime = hit.dateTime ? convert_date(hit.dateTime) : null;
			return hit;
		});
		return hits;
	};
	const deleteFunc = ids => {
		props.setLoading(true);
		for (let i = 0; i < ids.length; i++) {
			updateParcelDocument({
				variables: {
					descriptorObjectId: ids[i],
					relatedObjectId: moduleId,
				},
				refetchQueries: ['getESSimpleSearch'],
				awaitRefetchQueries: true,
			});
		}

		props.setSelectedRows([]);
	};

	useEffect(() => {
		if (moduleId)
			props.setTableMeta({
				shapeType: props.shapeType,
				addableName: 'Tract',
				searchFields: ['_all'],
				filters: [{ field: 'shapeObj._id', value: moduleId }],
				TableHeader: TableHeader,
				esIndex: 'documents_flat',
				startPaginationAt: 25,
				formatHits,
			});
	}, [moduleId]);

	useEffect(() => {
		if (props.setCounter) props.setCounter(props.rows.length);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.rows]);

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			<Dialog open={isDeletePopup} onClose={() => setDeletePopup(false)} fullWidth={true} maxWidth={'sm'}>
				<DeleteConfirmationDialogContent
					header={`Delete Related Document(s)`}
					onClose={() => setDeletePopup(false)}
					deleteFunc={deleteFunc}
					m1nSelectedRowsIds={props.selectedRows.map(sR => props.rows[sR.dataIndex]?._id)}
					setM1nSelectedRowsIndexes={props.setSelectedRows}
				>
					{`Do you want to delete the selected related document${
						props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? 's' : ''
					}?`}
				</DeleteConfirmationDialogContent>
			</Dialog>

			<Table
				style={{ backgroundColor: '#fff' }}
				header={props.header ?? 'Related Documents'}
				columns={props.columns}
				rows={props.rows}
				total={false}
				loading={props.loading}
				targetLabel={props.targetLabel}
				resetSelectedRow={resetSelectedRow}
				uploadIcon={null}
				dense={props.dense ? props.dense : undefined}
				orderByTracks={false}
				startPaginationAt={null}
				onTableChange={props.onTableChange}
				options={options}
				parent={props.parent}
				setColumnsBase={[]}
				{...props.esHocProps}
			/>
		</Container>
	);
}

export default React.memo(TableESHOC(AgreementDocumentsTable), deepEqualObjects);
