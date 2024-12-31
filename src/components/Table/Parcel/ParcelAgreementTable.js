import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Button, Tooltip, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';

import { useMutation } from '@apollo/client';
import moment from 'moment';

// context

import { NavigationContext } from 'components/Navigation/NavigationContext';
import ParcelInstrument from 'components/ParcelsDetailCard/ParcelInstrument';
import PdfWithZoom from 'components/Shared/components/common/PdfWithZoom';
import { deepEqualObjects, copy } from 'components/Shared/functions';
import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHeader from 'components/Table/constants/parcel-agreement-header-schema';
import TableESHOC from 'components/Table/TableESHOC';

import { DELETE_PARCEL_RUNSHEET } from 'graphQL/useMutationDeleteParcelAgreement';

import { downloadPdfsFile } from 'utils/helper';

import { AppContext } from 'AppContext';

import { usetableStyles } from '../Styles';

const genericDataActions = ['comments', 'tracks', 'ifAreContacts'];
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
	'company_net_acres',
	'unknown_interest',
];
const startPaginationAt = 25;

function ParcelAgreementTable(props) {
	let history = useHistory();
	const classes = usetableStyles();
	const [resetSelectedRow, setResetSelectedRow] = useState(false);
	const [isSelectAll, setIsSelectAll] = useState(false);
	const [stateApp, setStateApp] = useContext(AppContext);
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { customLayer, esIndex, searchFields, clickedRow } = props;

	const addAble = { type: 'parcelRunsheet' };
	const [showSlider, setShowSlider] = useState(false);
	const [openCustomDialog, setOpenCustomDialog] = useState('');
	const [selectedInstrument, setSelectedInstrument] = useState(null);
	const [numPages, setNumPages] = useState(null);

	const [deleteParcelRunsheet] = useMutation(DELETE_PARCEL_RUNSHEET, {
		refetchQueries: ['getParcelAgreement'],
		awaitRefetchQueries: true,
	});

	const appliedFilters = [
		{ field: 'customLayerId', value: customLayer._id },
		{ field: 'isRunsheetInstrument', value: 'true' },
	];
	const formatHits = hits => {
		hits = hits.map(hit => {
			hit.effectiveDate = hit.effectiveDate ? moment(hit.effectiveDate).format('MM/DD/YYYY') : '';
			hit.executionDate = hit.executionDate ? moment(hit.executionDate).format('MM/DD/YYYY') : '';
			hit.fileDate = hit.fileDate ? moment(hit.fileDate).format('MM/DD/YYYY') : '';
			hit.commentsCounter = hit.comments ? hit.comments.length : 0;
			if (hit?.tags?.length > 0) {
				const tags = hit.tags.map(tag => tag.tag);
				if (tags[0]) {
					hit.tags = [[tags], hit.tags.length];
				}
			} else {
				hit.tags = [[], 0];
			}

			return hit;
		});
		return hits;
	};

	useEffect(() => {
		props.setTableMeta({
			filters: appliedFilters,
			extendSearchQuery: stateApp.activitySearchQuery,
			searchFields,
			TableHeader: copy(TableHeader),
			esIndex,
			startPaginationAt,
			formatHits,
			defaultSort: { field: '_ts', order: 'asc' },
			setAppliedFilters: props.filtersChange,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateApp.activitySearchQuery, props.filterToggle]);

	useEffect(() => {
		if (clickedRow) {
			setSelectedInstrument({
				...clickedRow,
			});
			setShowSlider(true);
		}
	}, [clickedRow]);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}
	const deleteFunc = ids => {
		for (let i = 0; i < ids.length; i++) {
			const record = props.rows.find(row => row._id === ids[i]);
			if (record) {
				deleteParcelRunsheet({
					variables: {
						id: record.descriptorObject,
						parcelId: props.customLayer._id,
						fileId: record.fileId,
					},
					refetchQueries: ['getParcelAgreement', 'getDbData'],
					awaitRefetchQueries: true,
				});
			}
		}

		setResetSelectedRow(!resetSelectedRow);
	};

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			{showSlider && (
				<ParcelInstrument
					parcelId={props.customLayer._id}
					setShowSlider={setShowSlider}
					selectedInstrument={selectedInstrument}
					setSelectedInstrument={setSelectedInstrument}
				/>
			)}
			{openCustomDialog === 'deleteInstruments' && (
				<DeleteConfirmationDialogContent
					header="Delete Runsheet Instrument(s)"
					onClose={() => setOpenCustomDialog('')}
					deleteFunc={deleteFunc}
					m1nSelectedRowsIds={props.selectedRows.map(sR => props.rows[sR.dataIndex]?._id)}
					setM1nSelectedRowsIndexes={props.setSelectedRows}
				>
					{`Do you want to permanently delete the Runsheet Instrument${
						props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? 's' : ''
					}?`}
				</DeleteConfirmationDialogContent>
			)}
			<Table
				style={{ backgroundColor: '#fff' }}
				header={props.header}
				columns={props.columns}
				rows={props.rows}
				total={false}
				loading={props.loading}
				targetLabel={props.targetLabel}
				uploadIcon={null}
				deleteFunc={deleteFunc}
				addAble={addAble}
				dense
				orderByTracks={false}
				startPaginationAt={null}
				onTableChange={props.onTableChange}
				resetSelectedRow={resetSelectedRow}
				options={{
					...props.options,
					customToolbar: () => {
						const options = [
							{
								text: '+ ADD Instrument',
								isShow: false,
								action: () => setShowSlider(true),
							},
						];
						return (
							<div
								style={{
									display: 'inline',
									float: 'left',
									marginTop: '5px',
									marginRight: '5px',
								}}
							>
								<ButtonDropDown options={options} />
							</div>
						);
					},
					customToolbarSelect: () => {
						return (
							<div
								style={{
									height: '48px',
									display: 'flex',
								}}
							>
								<div
									style={{
										marginTop: '6px',
										height: '35px',
										display: 'flex',
									}}
								>
									<Tooltip title={'Delete'}>
										<IconButton
											size="medium"
											style={{ margin: '0 5px' }}
											onClick={e => {
												setOpenCustomDialog('deleteInstruments');
											}}
											aria-label="delete"
										>
											<DeleteIcon />
										</IconButton>
									</Tooltip>
								</div>
							</div>
						);
					},
				}}
				onRowSelectionChange={allRowsSelected => {
					if (allRowsSelected.length === startPaginationAt || allRowsSelected.length === props.options.count) {
						setIsSelectAll(true);
					} else {
						setIsSelectAll(false);
					}
				}}
				parent={props.parent}
				setColumnsBase={[]}
				{...props.esHocProps}
			/>
			<Dialog
				className={classes.dialogExpCard}
				fullWidth
				maxWidth="xl"
				open={stateApp.pdfView ? true : false}
				onClose={() => {
					setStateApp(state => ({
						...state,
						pdfView: null,
					}));
				}}
			>
				<Toolbar>
					<Grid
						justify="space-between" // Add it here :)
						container
						spacing={24}
					>
						<Grid item>
							<Typography className={classes.fileTitle} type="title" color="inherit">
								{stateApp.pdfView?.fileName}
							</Typography>
						</Grid>

						<Grid item>
							{stateApp.pdfView && (
								<IconButton onClick={() => downloadPdfsFile(stateApp.pdfView)}>
									<GetAppIcon />
								</IconButton>
							)}
							<IconButton
								className="float-right"
								color="inherit"
								onClick={() => {
									setStateApp(state => ({
										...state,
										pdfView: null,
										viewDoc: null,
									}));
								}}
								aria-label="close"
							>
								<CloseIcon />
							</IconButton>
						</Grid>
					</Grid>
				</Toolbar>
				<PdfWithZoom
					numPages={numPages}
					viewToken={stateApp.pdfView?.viewToken}
					onDocumentLoadSuccess={onDocumentLoadSuccess}
				/>
			</Dialog>
		</Container>
	);
}

export default React.memo(TableESHOC(ParcelAgreementTable), deepEqualObjects);
