import React, { useEffect, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { Container, Dialog } from '@material-ui/core';

import { useMutation } from '@apollo/client';
import _ from 'lodash';
import debounce from 'lodash/debounce';

import { agreementTypes } from 'components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData';
import { deepEqualObjects, copy, esExtentedSearch } from 'components/Shared/functions';
import GridView from 'components/Shared/GridView';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import Table from 'components/Shared/M1nTable/components/Table';
import Agreements from 'components/Shared/svgIcons/agreements';
import convert_date from 'components/Shared/valueformatters/convert_date.js';
import TableHeader from 'components/Table/constants/agreements-header-schema';
import { HeaderComponent } from 'components/Table/helpers';
import TableESHOC from 'components/Table/TableESHOC';

import { REMOVE_AGREEMENTS } from 'graphQL/useMutationRemoveAgreements';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { UPDATE_GRID_VIEW } from 'graphQL/useMutationUpdateGridView';

import { jobController } from 'hookstate/jobStateController';
import { mapControlsController } from 'hookstate/mapControlsController';

import { AppContext } from 'AppContext';

import CustomerViewCol from '../helpers/CustomerView';
import MetaField from '../helpers/MetaField';
import { usetableStyles } from '../Styles';

function AgreementsTable(props) {
	const defaultView = {
		name: 'All Agreements',
		type: 'Default',
	};

	const [resetSelectedRow, setResetSelectedRow] = useState(false);

	const [showSaveAsNew, setShowSaveAsNew] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [stateApp, setStateApp] = useContext(AppContext);

	// queries
	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);
	const [updateGridView] = useMutation(UPDATE_GRID_VIEW);
	const [removeAgreements] = useMutation(REMOVE_AGREEMENTS, {
		refetchQueries: ['getDbData'],
		awaitRefetchQueries: true,
	});
	const excludeFromViewColumns = ['interest_type', 'tract_status'];

	const classes = usetableStyles({ isFullHeight: true, isAgreementsTable: true });
	const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);

	let GridViewModule = userGridViewSettings['Agreements'] || {};
	GridViewModule.columns = _.get(GridViewModule, 'columns', []).map(obj =>
		excludeFromViewColumns.includes(obj.name) ? { ...obj, viewColumns: false } : obj
	);

	const { Agreements: AgreementsGridView } = useSelector(({ session }) => session.userGridViewSettings);

	const {
		stateValues: { searchValue },
	} = mapControlsController.useState(['searchValue']);

	const { setESFilters } = props;

	const esFilters = props.esFilters ? props.esFilters : [];

	const setTableMeta = React.useMemo(
		() =>
			debounce((request, top, callback) => {
				props.setTableMeta(request);
			}, 1000),
		[]
	);

	const formatHits = hits => {
		hits = hits.map(hit => {
			hit.agreementId = hit._id;
			hit.agreementType = agreementTypes.find(
				type => type.value === hit.agreementType || type.label === hit.agreementType
			)?.label;
			hit.agreementDate = hit.agreementDate ? convert_date(hit.agreementDate) : null;
			hit.acquisitionDate = hit.acquisitionDate ? convert_date(hit.acquisitionDate) : null;
			hit.effectiveDate = hit.effectiveDate ? convert_date(hit.effectiveDate) : null;
			hit.expirationDate = hit.expirationDate ? convert_date(hit.expirationDate) : null;
			hit.extensionDate = hit.extensionDate ? convert_date(hit.extensionDate) : null;
			hit.recordedDate = convert_date(hit.recordedDate);
			hit.tags = hit?.tags?.length > 0 ? [[hit.tags.map(tag => tag.tag)], hit.tags.length] : [[], 0];
			hit.commentsCounter = hit.comments ? hit.comments.length : 0;
			// hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
			return hit;
		});
		return hits;
	};

	useEffect(() => {
		if (props.landSearchQuery) {
			setStateApp(stateApp => ({ ...stateApp, landSearchQuery: '' }));
		}
	}, []);

	useEffect(() => {
		props.setSelectedGridView(AgreementsGridView || defaultView);
	}, [AgreementsGridView]);

	useEffect(() => {
		const formatedFilter = esFilters ? copy(esFilters) : [];
		props.setInitialFilters(formatedFilter);
		setTableMeta({
			extendSearchQuery: esExtentedSearch(props.landSearchQuery, searchValue),
			selectedGridView: GridViewModule || defaultView,
			customDataESKey: 'shapeJson.properties.custom_data',
			// searchFields: ["*"],
			TableHeader: copy(TableHeader(!!props.isSnapGrid)),
			esIndex: 'shapes_flat',
			startPaginationAt: 50,
			typeKeyword: { gridViewCategory: 'Agreements', metaModule: 'Agreement' },
			filters: [
				...getAdvanceSearchFilters(),
				{
					field: 'shapeJson.properties.type.keyword',
					value: 'agreement',
				},
			],
			defaultSort: { field: '_ts', order: 'desc' },
			polygon: stateApp?.currentFeature?.geometry && {
				type: 'geo_intersects',
				field: 'shapeGeometry',
				value: stateApp?.currentFeature?.geometry,
			},
			exportPx: '121px',
			formatHits,
		});
		// eslint-disable-next-line
	}, [searchInput, props.landSearchQuery, props.filterToggle, stateApp.landSearchFilters]);

	useEffect(() => {
		props?.onAgreementCount && props?.onAgreementCount(props?.options?.count || 0);
	}, [props?.options?.count]);

	useEffect(() => {
		setESFilters && setESFilters(props.initialFilters);
		// eslint-disable-next-line
	}, [props.initialFilters]);

	useEffect(() => {
		props?.onAgreementCount && props?.onAgreementCount(props?.options?.count || 0);
	}, [props?.options?.count]);

	const deleteFunc = ids => {
		if (ids.length > 0) {
			props.setLoading(true);
			removeAgreements({
				variables: {
					agreementIds: ids,
				},
			}).then(() => {
				props.setLoading(false);
				setResetSelectedRow(!resetSelectedRow);
			});
		}
	};

	const onCustomKeyChange = (value = null, index, key) => {
		const rows = JSON.parse(JSON.stringify(props.rows));
		rows[index].custom_data = {
			...props.rows[index]?.custom_data,
			[`${key}`]: value,
		};
		props.setRows(rows);

		const customLayer = {
			shapeJson: {
				...props.rows[index]?.shapeJson,
				properties: {
					...props.rows[index]?.shapeJson.properties,
					custom_data: { [`${key}`]: value },
				},
			},
		};

		updateCustomLayer({
			variables: {
				customLayerId: props.rows[index]?._id,
				customLayer: customLayer,
			},
			refetchQueries: ['customLayer'],
		}).then(() => {
			jobController.toggleBulkUpload();
		});
	};

	const getAdvanceSearchFilters = () => {
		let filters = [];
		Object.values(stateApp.landSearchFilters).forEach(filter => {
			filters = [...filters, ...filter];
		});
		return _.uniq(filters);
	};

	const handleDefaultView = (view, user) => {
		return view;
	};

	const headerProps = {
		columns: props.columns,
		showViewModal,
		selectedGridView: props.selectedGridView || defaultView,
		updateGridView,
		setShowSaveAsNew,
		setShowViewModal,
		Icon: Agreements,
		label: 'Agreements',
		selectedFilters: props.selectedFilters.current,
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
						header={'Delete Agreement(s)'}
						onClose={() => props.setOpenDialog(null)}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={props.selectedRows.map(sR => props.rows[sR.dataIndex]?._id)}
						setM1nSelectedRowsIndexes={props.setSelectedRows}
					>
						{`Do you want to delete the selected agreement${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? 's' : ''
							}?`}
					</DeleteConfirmationDialogContent>
				)}
			</Dialog>

			{showViewModal && (
				<GridView
					columns={props.columns}
					module="Agreements"
					handleDefaultView={handleDefaultView}
					handleClose={() => setShowViewModal(false)}
					// setSelectedGridView={props.setSelectedGridView}
					selectedGridView={props.selectedGridView}
					setShowViewModal={setShowViewModal}
					setShowSaveAsNew={setShowSaveAsNew}
					showSaveAsNew={showSaveAsNew}
					selectedFilters={props.selectedFilters.current}
				/>
			)}

			{stateApp.showFieldModal && (
				<MetaField
					customDataPrefix="shapeJson.properties.custom_data"
					customDataPostfix=".keyword"
					columns={props.columns}
					category="Agreement"
					updateColumnSorting={props.updateColumnSorting}
				/>
			)}
			<Table
				style={{ backgroundColor: '#fff' }}
				header={props.header}
				columns={props.columns}
				headerProps={headerProps}
				headerComponent={HeaderComponent}
				viewColumn={CustomerViewCol}
				viewColumnProps={props.viewColumnProps}
				rows={props.rows}
				total={false}
				addAble={{ type: 'Tracts' }}
				loading={props.loading}
				targetLabel={props.targetLabel}
				uploadIcon={null}
				dense={props.dense ? props.dense : undefined}
				orderByTracks={false}
				startPaginationAt={null}
				onTableChange={props.onTableChange}
				onCustomKeyChange={onCustomKeyChange}
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

export default React.memo(TableESHOC(AgreementsTable, 'Agreement'), deepEqualObjects);
