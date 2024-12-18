import React, { useState, useEffect, useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import TableHOC from 'components/Table/TableHOC';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { tableGlobalController } from 'hookstate/tableController';

// QUERIES
import { useLazyQuery } from '@apollo/client';
import { GET_PARCELS_FILES } from 'graphQL/useQueryGetParcelFiles';
import { TENANTWELL } from 'graphQL/useQueryTenantWell';

import { deepEqualObjects } from 'components/Shared/functions';
import WellFile from 'components/Document/components/WellFile';

import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';

const useStyles = makeStyles(theme => ({
	container: {
		padding: '0 !important',
	},
	ZoomIcons: {
		zIndex: '1',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute !important',
		top: '85% !important',
		bottom: '0 !important',
		left: '15px',
		width: '3.875rem',
	},
	docViewSection: {
		overflow: 'scroll',
		height: '98%',
		width: '100%',
	},
}));

function WellDetailsDocumentTable(props) {
	const classes = useStyles();
	const [, setStateApp] = useContext(AppContext);

	// function states
	const [showDocumentSlider, setShowDocumentSlider] = useState(false);

	// queries
	const [getAllFiles] = useLazyQuery(GET_PARCELS_FILES, {
		onCompleted: () => {
			tableGlobalController.refetch(); // reftech table data
		},
	});
	const [getTenantWellId, { data: tenantData }] = useLazyQuery(TENANTWELL);

	useEffect(() => {
		if (props.selectedWell.tenantWellId === undefined)
			getTenantWellId({ variables: { globalWellId: props.selectedWell?.id } });
	}, [getTenantWellId, props.selectedWell?.id, props.selectedWell.tenantWellId]);

	useEffect(() => {
		let wellId;

		if (props.selectedWell.tenantWellId) wellId = props.selectedWell.tenantWellId;
		else wellId = tenantData?.tenantWell.tenantWellId;

		getAllFiles({
			variables: {
				relatedObjectId: wellId,
				relatedObjectType: 'Well',
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selectedWell.tenantWellId, showDocumentSlider, getAllFiles]);

	const onClickAdd = () => {
		setStateApp(state => ({
			...state,
			selectedDocument: null,
		}));
		setShowDocumentSlider(true);
	};

	const relatedDocumentOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(100vh - 800px)',
			defaultFilters: [
				{ field: 'wells.globalWell.keyword', value: props.selectedWell.id }, // Default filters
			],
			deletedKeys: {
				// Overriden deletion Toolbar
				mainRecord: { key: '_id' },
				parentRecord: { value: props?.selectedWell?.tenantWellId },
			},
			customValue: { parentRecord: props?.selectedWell?.tenantWellId }, // Add aprent record in case of select all
			CustomToolBar: () => {
				// Customer Toolbar
				return (
					<ButtonGroup variant="contained" style={{ height: '40px' }} color="primary" aria-label="split button">
						<Button
							id="addDocument"
							color="primary"
							size="small"
							aria-label="select merge strategy"
							aria-haspopup="menu"
							onClick={onClickAdd}
						>
							<PostAddIcon></PostAddIcon>
							Add Document
						</Button>
					</ButtonGroup>
				);
			},
			onClickedRow: selectedRow => {
				// On row click action
				setStateApp(state => ({
					...state,
					selectedDocument: selectedRow,
				}));
				setShowDocumentSlider(true);
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props?.selectedWell?.tenantWellId, props?.selectedWell?.id]
	);

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			{showDocumentSlider && (
				<WellFile
					getAllFiles={variables => getAllFiles(variables)}
					globalWellId={props.selectedWell.id}
					tenantWellId={props.selectedWell.tenantWellId}
					setShowDocumentSlider={setShowDocumentSlider}
				/>
			)}
			{/* Related well documets table */}
			<MRTTable name="RelatedDocumentTable" overrideMeta={relatedDocumentOverrideMeta} />
		</Container>
	);
}

export default React.memo(TableHOC(WellDetailsDocumentTable), deepEqualObjects);
