import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { useLazyQuery, useMutation } from '@apollo/client';
import set from 'lodash/set';
import PropTypes from 'prop-types';

import RelatedDocumentsTable from 'components/Common/RelatedTables/Documents';
import RelatedWellsTable from 'components/Common/RelatedTables/Wells';
import { DrawerContextProvider } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import MRTTable from 'components/MRTTable';
import PotentialShapeTractToolbar from 'components/MRTTable/TablesOverride/PotentialShapeTract/PotentialShapeTractToolbar';
import { copy } from 'components/Shared/functions';
import TabPanels from 'components/Shared/TabPanels';
import Tags from 'components/Shared/Tagger';
import Taps from 'components/Shared/Taps';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';

import { jobController } from 'hookstate/jobStateController';
import { layerController } from 'hookstate/layerStateController';
import { mapControlsController } from 'hookstate/mapControlsController';
import { popupController } from 'hookstate/popupStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { showSuccessMessage, showErrorMessage } from 'actions';
import { AppContext } from 'AppContext';

import { getShapeSubtitle } from '../helper';
import { detailCardStyles } from '../style';
import UnitSummary from './UnitSummary';

const setSelectedTab = tableGlobalController.setSelectedTab;

export default function UnitDetailCard({ id }) {
	const dispatch = useDispatch();
	const [uniObj, setUniObj] = useState();
	const [properties, setProperties] = useState();
	const [stateApp, setStateApp] = useContext(AppContext);
	const UnitInterestOwnerGridState = tableController('UnitInterestOwnerTable').useState(['data']).stateValue;
	const [updateCustomLayer, { data: updatedUnit, loading: updatingLayer }] = useMutation(UPDATECUSTOMLAYER);

	const globalState = tableGlobalController.useState(['refetch']);
	const globalStateValues = globalState.stateValues;

	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const classes = detailCardStyles();
	const showSummary = true;

	const [getCustomLayer, { data: dataCustomLayer, refetch: refetchCustomLayer }] = useLazyQuery(CUSTOMLAYER);

	const contactsAdded = useSelector(state => state?.common?.contactsAdded);

	useEffect(() => {
		if (dataCustomLayer) {
			refetchCustomLayer();
		}
	}, [globalStateValues?.refetch]);

	useEffect(() => {
		mapControlsController.updateState({
			mapGridCardActivated: false,
		});
	}, []);

	useEffect(() => {
		if (contactsAdded) {
			setSelectedTab(0);
		}
	}, [contactsAdded]);

	useEffect(() => {
		if (id) {
			getCustomLayer({
				variables: {
					id: id,
				},
			});
		}
	}, [getCustomLayer, id]);

	useEffect(() => {
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			let shape = JSON.parse(dataCustomLayer.customLayer.shape);
			if (dataCustomLayer.customLayer.shapeJson) {
				shape = copy(dataCustomLayer.customLayer.shapeJson);
			}
			setUniObj({
				...dataCustomLayer.customLayer,
				shape,
			});

			setProperties(shape.properties);
		}
	}, [dataCustomLayer, UnitInterestOwnerGridState?.data]);

	const unitInterestOwnerOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Unit Ownership', 'Potential Ownership'],
			defaultFilters: [
				{ field: 'shape._id', value: dataCustomLayer?.customLayer?._id },
				{ field: 'contact.IsDeleted', value: 'false' },
			],
			customProps: { customLayer: dataCustomLayer?.customLayer },
		}),
		[dataCustomLayer]
	);

	// Table overridden meta
	const relatedAgreementOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'relatedShape._id', value: dataCustomLayer?.customLayer?._id }],
			maxTableHeight: 'calc(60vh - 200px)',
		}),
		[dataCustomLayer]
	);

	useEffect(() => {
		if (updatedUnit) {
			if (updatedUnit.updateCustomLayer?.success) {
				dispatch(showSuccessMessage('Successfully updated the unit'));
				// Updating stateapp parcel object
				const { customLayer } = updatedUnit.updateCustomLayer;
				const feature = JSON.parse(customLayer.shape);

				if (feature?.properties?.netRoyalityAcres && !feature?.properties?.netRoyalityAcres?.unitNra) {
					feature.properties.netRoyalityAcres.unitNra = feature.properties?.netRoyalityAcres?.calculatedNra;
				}

				feature.id = customLayer._id;
				feature.properties.id = customLayer._id;
				feature.layer = { id: 'unit' };
				popupController.updateState({
					selectedShape: { ...feature.properties, feature },
				});
				setStateApp(state => ({
					...state,
					selectedShape: { ...feature.properties, feature },
				}));
				setProperties({ ...feature.properties });
			} else {
				dispatch(showErrorMessage('Failed to update unit'));
			}
		}
	}, [dispatch, setStateApp, updatedUnit]);

	const updateProperties = (e, field, value) => {
		e?.preventDefault();
		e?.stopPropagation();
		const { shape } = uniObj;
		/* -------------------------------- Data Fix -------------------------------- */
		if (field.includes('originalProperties.')) {
			delete shape.properties[field];
		}
		if (field.includes('originalProperties.State')) {
			set(shape.properties, 'originalProperties.StateAbbreviation', value);
		}
		if (field.includes('originalProperties.Section')) {
			set(shape.properties, 'originalProperties.ShortName', value);
		}
		if (field.includes('originalProperties.Meridian')) {
			set(shape.properties, 'originalProperties.PrincipalMeridian', value);
		}
		/* -------------------------------- Data Fix -------------------------------- */
		set(shape.properties, field, value);

		const customLayer = {};

		if (field === 'uName') {
			popupController.updateState({
				selectedShape: { ...popupController.getValue('selectedShape'), shapeLabel: value },
			});
			shape.properties.shapeLabel = value;
			customLayer.name = value;
		}

		if (field.includes('originalProperties')) {
			set(shape.properties, field.replace('originalProperties.', '').toLowerCase(), value);
			const shapeSubtitle = getShapeSubtitle(
				shape?.properties?.originalProperties,
				shape.properties.uName || shape.properties.shapeLabel
			);
			shape.properties.shapeSubtitle = shapeSubtitle;
			shape.shapeSubtitle = shapeSubtitle;
			popupController.updateState({
				selectedShape: { ...popupController.getValue('selectedShape'), shapeSubtitle },
			});
		}
		customLayer.shape = JSON.stringify(shape);
		customLayer.shapeJson = shape;

		updateCustomLayer({
			variables: {
				customLayerId: uniObj._id,
				customLayer,
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['getAllLayerSettingsByUser'],
			awaitRefetchQueries: true,
		}).then(res => {
			jobController.toggleBulkUpload();
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer);
		});
	};

	const updateCustomProperties = (type, value, key) => {
		const { shape } = uniObj;
		set(properties, `${key}`, value);
		properties.custom_data_arr?.forEach(data => {
			properties.custom_data[data.key] = data.value;
		});
		const customLayer = {};
		shape.properties = properties;
		customLayer.shape = JSON.stringify(shape);
		customLayer.shapeJson = shape;
		updateCustomLayer({
			variables: {
				customLayerId: uniObj._id,
				customLayer,
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['allLayerSettingsByUser'],
			awaitRefetchQueries: true,
		}).then(res => {
			jobController.toggleBulkUpload();
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer);
		});
	};

	const relatedDocumentsOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			gridViewSettings: null,
			fetchMetaData: null,
			defaultFilters: [{ field: 'shapeObj._id', value: uniObj?._id }],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: uniObj?._id },
			},
			customValue: { parentRecord: uniObj?._id },
		}),
		[uniObj?._id]
	);

	const relatedWellsOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			tabLabels: ['Unit Wells', 'Potential Wells'],
			defaultFilters: [{ field: 'shape._id', value: uniObj?._id }],
			customProps: { customLayer: uniObj, shapeType: 'Unit' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: uniObj?._id },
			},
			customValue: { parentRecord: uniObj?._id },
		}),
		[uniObj?._id]
	);

	const potentialTractsOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Unit Tracts', 'Potential Tracts'],
			defaultFilters: [
				{
					type: 'geo_intersects',
					field: 'shapeJson.geometry',
					value: uniObj?.shapeJson?.geometry,
				},
				{ field: 'layer.keyword', value: 'parcel' },
			],
			customProps: { customLayer: uniObj, shapeType: 'Unit' },
			excludeFields: ['tags.tag', 'comments'],
			gridViewSettings: null,
			fetchMetaData: null,
			CustomToolBar: PotentialShapeTractToolbar,
			isDeleteDisabled: true,
			isExportDisabled: true,
		}),
		[uniObj?._id]
	);

	const runsheetOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [
				{ field: 'customLayerId', value: uniObj?._id },
				{ field: 'isRunsheetInstrument', value: 'true' },
			],
		}),
		[uniObj?._id]
	);

	return uniObj ? (
		<DrawerContextProvider>
			<Grid item sm={12} container className={classes.gridWidthScroll}>
				<Grid item xs={12} style={{ padding: '10px 15px 0px 15px' }} className={classes.border}>
					<div className={classes.tags}>
						<Tags width="100%" targetSourceId={id} targetLabel="unit" publicLeftBottom hideCheckBox />
					</div>
				</Grid>
				<Grid item sm={12}>
					<Taps
						tabLabels={['Summary', 'Interest Owners', 'Runsheet', 'Wells', 'Tracts', 'Agreements', 'Documents']}
						openTabIdex={selectedTab}
						tabPanels={[
							<div
								key="Summary"
								style={{
									height: 'calc(100vh - 285px)',
									overflow: 'overlay',
								}}
							>
								<UnitSummary
									properties={properties}
									setProperties={setProperties}
									updateProperties={updateProperties}
									updateCustomProperties={updateCustomProperties}
									id={id}
									customLayer={uniObj}
									updating={updatingLayer}
								/>
							</div>,
							<TabPanels
								key="Interest Owners"
								value={selectedTab}
								panels={[
									<MRTTable
										key="UnitInterestOwnerTable"
										name="UnitInterestOwnerTable"
										overrideMeta={unitInterestOwnerOverrideMeta}
									/>,
									<MRTTable
										key="PotentialWellOwnersTable"
										name="PotentialWellOwnersTable"
										overrideMeta={{
											tabLabels: ['Unit Ownership', 'Potential Ownership'],
											customProps: {
												customLayer: uniObj,
												year: 2023,
												filterByWells: false,
											},
										}}
									/>,
								]}
							/>,
							<MRTTable key="Runsheet" name="RunsheetTable" overrideMeta={runsheetOverrideMeta} />,
							<TabPanels
								key="Wells"
								value={selectedTab}
								panels={[
									<div key="relatedWellsTable" className={showSummary ? classes.subContent : classes.subContent2}>
										<RelatedWellsTable
											id="relatedWellsTable"
											overrideMeta={relatedWellsOverrideMeta}
											shapeType="Unit"
											customLayer={uniObj}
										/>
									</div>,
									<div key="PotentialWellsTable" className={showSummary ? classes.subContent : classes.subContent2}>
										<MRTTable
											name="PotentialWellsTable"
											overrideMeta={{
												tabLabels: ['Unit Wells', 'Potential Wells'],
												customProps: {
													customLayer: uniObj,
													shapeType: 'Unit',
												},
											}}
										/>
									</div>,
								]}
							/>,
							<TabPanels
								key="Tracts"
								value={selectedTab}
								panels={[
									<MRTTable
										key="UnitTractTable"
										name="UnitTractTable"
										overrideMeta={{
											tabLabels: ['Unit Tracts', 'Potential Tracts'],
											defaultFilters: [{ field: 'shape._id', value: dataCustomLayer?.customLayer?._id }],
											customProps: {
												customLayer: uniObj,
											},
										}}
									/>,
									<MRTTable key="TractsTable" name="TractsTable" overrideMeta={potentialTractsOverrideMeta} />,
								]}
							/>,
							<MRTTable
								key="Agreements"
								name="UnitRelatedAgreementTable"
								overrideMeta={relatedAgreementOverrideMeta}
							/>,
							<div
								key="Documents"
								className={`${showSummary ? classes.subContent : classes.subContent2} ${classes.parcelDocument}`}
							>
								<RelatedDocumentsTable
									id="relatedDocumentsTable"
									moduleId={uniObj?._id}
									overrideMeta={relatedDocumentsOverrideMeta}
									relatedObjectType="Shape"
								/>
							</div>,
						]}
					/>
				</Grid>
			</Grid>
		</DrawerContextProvider>
	) : (
		<div style={{ padding: '20px', position: 'absolute', height: '100%', width: '100%' }}>
			<CircularProgress size={80} disableShrink color="secondary" />
		</div>
	);
}

UnitDetailCard.propTypes = {
	id: PropTypes.string.isRequired,
};
