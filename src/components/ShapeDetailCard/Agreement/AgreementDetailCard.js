import React, { useState, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { set } from 'lodash';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import Taps from 'components/Shared/Taps';
import TabPanels from 'components/Shared/TabPanels';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import RelatedDetailsDocumentTable from 'components/Table/Documents/RelatedDetailsDocumentTable';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import AgreementSummary from './AgreementSummary';
import ProvisionsTab from './ProvisionsTab';
import ShapeWellInterestTable from 'components/Table/Shape/ShapeWellInterestTable';
import AssociatedWellsShapeTable from 'components/Table/Wells/AssociatedWellsShapeTable';
import AgreementOwnersTractsTable from 'components/Table/Agreement/AgreementOwnersTractsTable';
import AssociatedTractsShapeTable from 'components/Table/Wells/AssociatedTractsShapeTable';
import Tags from 'components/Shared/Tagger';
import { showSuccessMessage, showErrorMessage, showInfoMessage } from 'actions';
import AgreementLegalDescriptionFields from 'components/Land/components/Agreements/detailComponents/legalDescription/FieldsSection';
import { DrawerContextProvider } from 'components/Land/components/Agreements/detailComponents/DrawerContext';

import { copy } from 'components/Shared/functions';
import { detailCardStyles } from '../style';
import { GET_AGREEMENT_PROVISIONS } from 'graphQL/useQueryGetAgreementProvisions';
import { GET_STANDARD_PROVISIONS } from 'graphQL/useQueryGetStandardProvisions';
import moment from 'moment';
import { popupController } from 'hookstate/popupStateController';
import { jobController } from 'hookstate/jobStateController';
import { layerController } from 'hookstate/layerStateController';
import MRTTable from 'components/MRTTable';
import AgreementRelatedUnitsToolbar from 'components/MRTTable/TablesOverride/AgreementRelatedUnitsTable/AgreementRelatedUnitsToolbar';

export default function AgreementDetailCard(props) {
	const dispatch = useDispatch();
	const [selectedTab, setSelectedTab] = useState(0);
	const [selectedWellTab, setWellSelectedTab] = useState(0);
	const [selectedTractTab, setTractSelectedTab] = useState(0);
	const [uniObj, setUniObj] = useState();
	const [tractOwners, setTractOwners] = useState();
	const [properties, setProperties] = useState();
	const [updateCustomLayer, { data: updatedUnit }] = useMutation(UPDATECUSTOMLAYER);

	const classes = detailCardStyles();
	const history = useHistory();
	const showSummary = true;

	const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);
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
	}, [history, uniObj]);

	useEffect(() => {
		if (props.id) {
			getStandardProvisions();
			getCustomLayer({ variables: { id: props.id } });
			getAgreementProvisions({ variables: { agreementId: props.id } });
		}
	}, [props.id]);

	useEffect(() => {
		if (selectedTab === 0 || selectedTab === 1) {
			getAgreementProvisions({ variables: { agreementId: props.id } });
		}
	}, [selectedTab]);

	useEffect(() => {
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			let shape = JSON.parse(dataCustomLayer.customLayer.shape);
			if (dataCustomLayer.customLayer.shapeJson) shape = copy(dataCustomLayer.customLayer.shapeJson);
			setUniObj({
				...dataCustomLayer.customLayer,
				shape,
			});
			popupController.updateState({
				selectedShape: { ...shape.properties },
			});

			// Dispatch action for validation error if there is no agreement number
			if (!shape.properties.agreementNumber) {
				dispatch(showInfoMessage('Agreement Number is required'));
			}
			setProperties(shape.properties);
		}
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
		if (field === 'agreementNumber')
			shapeLabel = `${value}${shape.properties.agreementName ? `-${shape.properties.agreementName}` : ''}`;

		if (field === 'agreementName')
			shapeLabel = `${shape.properties.agreementNumber ? `${shape.properties.agreementNumber}-` : ''}${value}`;

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
			refetchQueries: ['getMetaData', 'getAllLayerSettingsByUser'],
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

	const DocumentHeader = () => {
		const classes = detailCardStyles();
		return (
			<div className={classes.documentHeader}>
				<DescriptionOutlinedIcon />
				<span>Documents</span>
			</div>
		);
	};

	const WellHeader = ({ selectedWellTab, setWellSelectedTab }) => (
		<TabButtons
			labels={['Agreement Wells', 'Potential Wells']}
			value={selectedWellTab}
			setValue={n => {
				setWellSelectedTab(n);
			}}
		/>
	);

	const TractHeader = ({ selectedTractTab, setTractSelectedTab }) => (
		<TabButtons
			labels={['Agreement Tracts', 'Potential Tracts']}
			value={selectedTractTab}
			setValue={n => {
				setTractSelectedTab(n);
			}}
		/>
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
											tractOwners={tractOwners}
											agreementDetails={uniObj?.shape?.properties}
											updateAgreement={updateCustomProperties}
										/>
									</Grid>
									{uniObj && (
										<Grid item xs={12}>
											<TabPanels
												value={selectedTractTab}
												panels={[
													<div className={showSummary ? classes.agreementSubContent : classes.subContent2}>
														<AgreementOwnersTractsTable
															setRecord={setTractOwners}
															customLayer={uniObj}
															shapeType="Agreement"
															header={
																<TractHeader
																	selectedTractTab={selectedTractTab}
																	setTractSelectedTab={setTractSelectedTab}
																/>
															}
															dense
															commentType="Ownership"
															targetLabel="Tract"
														/>
													</div>,
													<div className={showSummary ? classes.subContent : classes.subContent2}>
														<AssociatedTractsShapeTable
															customLayer={uniObj}
															shapeType="Agreement"
															header={
																<TractHeader
																	selectedTractTab={selectedTractTab}
																	setTractSelectedTab={setTractSelectedTab}
																/>
															}
															setSelectedTab={setTractSelectedTab}
															dense
														/>
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
									value={selectedWellTab}
									panels={[
										<div className={showSummary ? classes.subContent : classes.subContent2}>
											<ShapeWellInterestTable
												customLayer={uniObj}
												shapeType="Agreement"
												parent="associatedWellsPerUnits"
												targetLabel="well"
												header={
													<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />
												}
												showTracks
												dense
											/>
										</div>,
										<div className={showSummary ? classes.subContent : classes.subContent2}>
											<AssociatedWellsShapeTable
												customLayer={uniObj}
												shapeType="Agreement"
												parent="associatedWellsPerUnits"
												targetLabel="well"
												header={
													<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />
												}
												showTracks
												setSelectedTab={setWellSelectedTab}
												dense
											/>
										</div>,
									]}
								/>
							</div>,
							<div className={`${showSummary ? classes.subContent : classes.subContent2} ${classes.parcelDocument}`}>
								<RelatedDetailsDocumentTable
									customLayer={uniObj}
									relatedObjectType="Shape"
									name="Agreement"
									header={<DocumentHeader />}
									addAble={{ type: 'AgreementDocument' }}
									dense
									targetLabel="documents"
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
