import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { useLazyQuery, useMutation } from '@apollo/client';
import { set } from 'lodash';
import moment from 'moment';

import RelatedDocumentsTable from 'components/Common/RelatedTables/Documents';
import RelatedTractsTable from 'components/Common/RelatedTables/Tracts';
import RelatedWellsTable from 'components/Common/RelatedTables/Wells';
import { DrawerContextProvider } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import AgreementLegalDescriptionFields from 'components/Land/components/Agreements/detailComponents/legalDescription/FieldsSection';
import MRTTable from 'components/MRTTable';
import AgreementRelatedUnitsToolbar from 'components/MRTTable/TablesOverride/AgreementRelatedUnitsTable/AgreementRelatedUnitsToolbar';
import PotentialShapeTractToolbar from 'components/MRTTable/TablesOverride/PotentialShapeTract/PotentialShapeTractToolbar';
import { copy } from 'components/Shared/functions';
import TabPanels from 'components/Shared/TabPanels';
import Tags from 'components/Shared/Tagger';
import Taps from 'components/Shared/Taps';

import { jobController } from 'controllers/jobStateController';
import { layerController } from 'controllers/layerStateController';
import { popupController } from 'controllers/popupStateController';
import { tableController, tableGlobalController } from 'controllers/tableController';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { GET_AGREEMENT_PROVISIONS } from 'graphQL/useQueryGetAgreementProvisions';
import { GET_STANDARD_PROVISIONS } from 'graphQL/useQueryGetStandardProvisions';

import { showSuccessMessage, showErrorMessage, showInfoMessage } from 'actions';

import { detailCardStyles } from '../style';
import AgreementSummary from './AgreementSummary';
import ProvisionsTab from './ProvisionsTab';

export default function AgreementDetailCard(props) {
	const dispatch = useDispatch();
	const [selectedTab, setSelectedTab] = useState(0);

	const [uniObj, setUniObj] = useState();
	const [properties, setProperties] = useState();
	const relatedTractsTableState = tableController('RelatedTractsTable').useState(['data']).stateValues;
	const [updateCustomLayer, { data: updatedUnit }] = useMutation(UPDATECUSTOMLAYER);

	const {
		stateValues: { tabKey: selectedTableTab },
	} = tableGlobalController.useState(['tabKey']);

	const classes = detailCardStyles();
	const history = useHistory();
	const showSummary = true;
	const { dataCustomLayer } = props;

	const [getAgreementProvisions, { data: agreementProvisions }] = useLazyQuery(GET_AGREEMENT_PROVISIONS);
	const [getStandardProvisions, { data: dataStandardProvisions = [] }] = useLazyQuery(GET_STANDARD_PROVISIONS);

	useEffect(() => {
		return history.listen(location => {
			if (
				!properties?.agreementNumber &&
				location &&
				(typeof location === 'string' || Array.isArray(location)) &&
				!location.includes(uniObj?._id)
			) {
				popupController.reset();
				history.goBack();
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history, uniObj]);

	useEffect(() => {
		if (props.id) {
			getStandardProvisions();
			getAgreementProvisions({ variables: { agreementId: props.id } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.id]);

	useEffect(() => {
		if (selectedTab === 0 || selectedTab === 1) {
			getAgreementProvisions({ variables: { agreementId: props.id } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTab]);

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

			let feature = shape;
			feature.id = dataCustomLayer.customLayer?._id;
			feature.properties.id = dataCustomLayer.customLayer?._id;
			feature.identifier = 'Agreements';
			popupController.updateState({
				selectedShape: { ...shape.properties, feature, id: dataCustomLayer.customLayer._id },
			});

			// Dispatch action for validation error if there is no agreement number
			if (!shape.properties.agreementNumber) {
				dispatch(showInfoMessage('Agreement Number is required'));
			}
			setProperties(shape.properties);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataCustomLayer?.customLayer]);

	useEffect(() => {
		if (updatedUnit) {
			if (updatedUnit.updateCustomLayer?.success) {
				dispatch(showSuccessMessage('Successfully updated the agreement'));
				// Updating stateapp parcel object
				const customLayer = updatedUnit.updateCustomLayer.customLayer;
				const feature = JSON.parse(customLayer.shape);
				setProperties({ ...feature.properties });

				feature.id = customLayer._id;
				feature.properties.id = customLayer._id;
				feature.layer = { id: 'unit' };
				popupController.updateState({
					selectedShape: { ...feature.properties, feature },
				});
			} else {
				dispatch(showErrorMessage('Failed to update unit'));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updatedUnit]);

	const updateProperties = (e, field, value) => {
		if (e?.preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}

		const shape = uniObj.shape;
		set(shape, `properties.${field}`, value);

		const customLayer = {};
		let shapeLabel = shape.properties.shapeLabel;
		if (field === 'agreementNumber') {
			shapeLabel = `${value}${shape.properties.agreementName ? `-${shape.properties.agreementName}` : ''}`;
		}

		if (field === 'agreementName') {
			shapeLabel = `${shape.properties.agreementNumber ? `${shape.properties.agreementNumber}-` : ''}${value}`;
		}

		if (field === 'agreementType') {
			customLayer.layer = value;
			const newPath = `/map/${value}s/${uniObj._id}`;
			history.location.pathname !== newPath && history.replace(newPath);
		}
		//add support for extension term calculation
		if (field === 'extensionTerm' || field === 'expirationDate') {
			if (field === 'extensionTerm') {
				shape.properties.extensionDate = moment(shape.properties.expirationDate)
					.add(parseInt(value), 'months')
					.toDate();
			} else {
				shape.properties.extensionDate = moment(value).add(parseInt(shape.properties.extensionTerm), 'months').toDate();
			}
		}

		if (field === 'agreementTerm' || field === 'effectiveDate') {
			if (field === 'agreementTerm') {
				shape.properties.expirationDate = moment(shape.properties.effectiveDate)
					.add(parseInt(value), 'months')
					.toDate();
			} else {
				shape.properties.expirationDate = moment(value)
					.add(parseInt(shape.properties.agreementTerm), 'months')
					.toDate();
			}
		}
		if (field === 'state') {
			if (shape.properties.originalProperties) {
				shape.properties.originalProperties.County = undefined;
				shape.properties.originalProperties.State = value;
				shape.properties.originalProperties.StateAbbreviation = value;
				shape.properties.county = undefined;
			} else {
				shape.properties.originalProperties = { State: value, StateAbbreviation: value };
				shape.properties.county = undefined;
			}
		}
		if (field === 'county') {
			if (shape.properties.originalProperties) {
				shape.properties.originalProperties.County = value;
			} else {
				shape.properties.originalProperties = { County: value };
			}
		}

		// if (field ==='agreementTerm' || field ==='effectiveDate') {
		//   if (field ==='agreementTerm') {
		//     shape.properties.expirationDate = moment(shape.properties.effectiveDate, 'YYYY-MM-DD').add(parseInt(value), 'months').format('YYYY-MM-DD');
		//   } else {
		//     shape.properties.expirationDate = moment(value, 'YYYY-MM-DD').add(parseInt(shape.properties.agreementTerm), 'months').format('YYYY-MM-DD');
		//   }
		// }

		shape.properties.shapeLabel = shapeLabel;
		shape.name = shapeLabel;
		shape.properties.name = shapeLabel;
		popupController.updateState({
			selectedShape: { ...popupController.getValue('selectedShape'), shapeLabel },
		});
		customLayer.shape = JSON.stringify(shape);
		customLayer.shapeJson = shape;

		const shapeSubtitle = [];
		if (customLayer?.shapeJson?.properties?.county) {
			shapeSubtitle.push(customLayer?.shapeJson?.properties?.county);
		}
		if (customLayer?.shapeJson?.properties?.state) {
			shapeSubtitle.push(customLayer.shapeJson.properties.state);
		}

		if (shapeSubtitle.length) {
			customLayer.shapeJson.properties.shapeSubtitle = shapeSubtitle.join(',');
		}
		updateCustomLayer({
			variables: {
				customLayerId: uniObj._id,
				customLayer,
			},
			refetchQueries: ['getMetaData'],
			awaitRefetchQueries: true,
		}).then(res => {
			jobController.toggleBulkUpload();
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer);
		});
	};

	const updateCustomProperties = (type, value, key) => {
		const shape = uniObj.shape;
		// const customRow = properties.custom_data_arr.find((p) => p.id === id);
		// if (type === "key") {
		//   customRow.key = value;
		// } else {
		//   customRow.value = value;
		// }

		// Used for Agreement nra, net_acres and grossAcres overidden
		if (value?.overridden?.toString()) {
			set(properties, `overridden.${key}`, value.overridden);
			value = value.value;
		}
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
			},
			refetchQueries: ['allLayerSettingsByUser'],
			awaitRefetchQueries: true,
		}).then(res => {
			jobController.toggleBulkUpload();
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer);
		});
	};

	// Table overridden meta
	const RelatedUnitsOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'shape._id', value: uniObj?._id }],
			CustomToolBar: AgreementRelatedUnitsToolbar,
			maxTableHeight: 'calc(60vh - 200px)',
			customProps: { customLayer: uniObj },
		}),
		[uniObj]
	);

	const RelatedDocumentsOverrideMeta = useMemo(
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[uniObj?._id]
	);

	const RelatedTractsOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			tabLabels: ['Related Tracts', 'Potential Tracts'],
			defaultFilters: [{ field: 'shape._id', value: uniObj?._id }],
			customProps: { customLayer: uniObj, shapeType: 'Agreement' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: uniObj?._id },
			},
			customValue: { parentRecord: uniObj?._id },
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[uniObj?._id]
	);

	const RelatedWellsOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			tabLabels: ['Agreement Wells', 'Potential Wells'],
			defaultFilters: [{ field: 'shape._id', value: uniObj?._id }],
			customProps: { customLayer: uniObj, shapeType: 'Agreement' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: uniObj?._id },
			},
			customValue: { parentRecord: uniObj?._id },
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[uniObj?._id]
	);

	const PotentialTractsOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Related Tracts', 'Potential Tracts'],
			defaultFilters: [
				{
					type: 'geo_intersects',
					field: 'shapeJson.geometry',
					value: uniObj?.shapeJson?.geometry,
				},
				{ field: 'layer.keyword', value: 'parcel' },
			],
			customProps: { customLayer: uniObj, shapeType: 'Agreement' },
			excludeFields: ['tags.tag', 'comments'],
			gridViewSettings: null,
			fetchMetaData: null,
			CustomToolBar: PotentialShapeTractToolbar,
			isDeleteDisabled: true,
			isExportDisabled: true,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[uniObj?._id]
	);

	return uniObj ? (
		<DrawerContextProvider>
			<Grid item sm={12} container className={classes.gridWidthScroll}>
				<Grid item xs={12} style={{ padding: '10px 15px 0px 15px' }} className={classes.border}>
					<div className={classes.tags}>
						<Tags width="100%" targetSourceId={props.id} targetLabel="agreement" publicLeftBottom />
					</div>
				</Grid>
				<Grid item sm={12}>
					<Taps
						tabLabels={['Summary', 'Provisions', 'Tracts', 'Units', 'Wells', 'Documents']}
						backgroundColor={'white'}
						openTabIdex={selectedTab}
						whichTapIsActive={value => setSelectedTab(value)}
						tabPanels={[
							<div style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)' }}>
								<AgreementSummary
									properties={properties}
									setProperties={setProperties}
									updateProperties={updateProperties}
									updateCustomProperties={updateCustomProperties}
									id={props.id}
									provisions={agreementProvisions?.getAgreementProvisions || []}
									standardProvisions={dataStandardProvisions?.getStandardProvisions || []}
									customLayer={uniObj}
								/>
							</div>,
							<div style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)' }}>
								<ProvisionsTab
									provisions={agreementProvisions?.getAgreementProvisions || []}
									standardProvisions={dataStandardProvisions?.getStandardProvisions || []}
									id={props.id}
								/>
							</div>,
							<div style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)' }}>
								<Grid
									container
									direction="column"
									alignItems="center"
									style={{ display: 'block', padding: '20px 20px 0px 20px' }}
								>
									<Grid item xs={12} style={{ padding: '15px 5px 25px 0px' }}>
										<AgreementLegalDescriptionFields
											tractOwners={relatedTractsTableState?.data?.rows}
											agreementDetails={uniObj?.shape?.properties}
											updateAgreement={updateCustomProperties}
										/>
									</Grid>
									{uniObj && (
										<Grid item xs={12}>
											<TabPanels
												value={selectedTableTab}
												panels={[
													<div>
														<RelatedTractsTable
															id="relatedTractsTable"
															overrideMeta={RelatedTractsOverrideMeta}
															shapeType="Agreement"
															customLayer={uniObj}
														/>
													</div>,
													<div className={showSummary ? classes.subContent : classes.subContent2}>
														<MRTTable name="TractsTable" overrideMeta={PotentialTractsOverrideMeta} />
													</div>,
												]}
											/>
										</Grid>
									)}
								</Grid>
							</div>,
							<div style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)' }}>
								<MRTTable name="AgreementRelatedUnitsTable" overrideMeta={RelatedUnitsOverrideMeta} />
							</div>,
							<div style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)' }}>
								<TabPanels
									value={selectedTableTab}
									panels={[
										<div className={showSummary ? classes.subContent : classes.subContent2}>
											<RelatedWellsTable
												id="relatedWellsTable"
												overrideMeta={RelatedWellsOverrideMeta}
												shapeType="Agreement"
												customLayer={uniObj}
											/>
										</div>,
										<div className={showSummary ? classes.subContent : classes.subContent2}>
											<MRTTable
												name="PotentialWellsTable"
												overrideMeta={{
													tabLabels: ['Agreement Wells', 'Potential Wells'],
													customProps: {
														customLayer: uniObj,
														shapeType: 'Agreement',
													},
												}}
											/>
										</div>,
									]}
								/>
							</div>,
							<div className={`${showSummary ? classes.subContent : classes.subContent2} ${classes.parcelDocument}`}>
								<RelatedDocumentsTable
									id="relatedDocumentsTable"
									moduleId={uniObj?._id}
									overrideMeta={RelatedDocumentsOverrideMeta}
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
