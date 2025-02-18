import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery, useMutation } from '@apollo/client';
import { set } from 'lodash';
import PropTypes from 'prop-types';

import RelatedDocumentsTable from 'components/Common/RelatedTables/Documents';
import RelatedWellsTable from 'components/Common/RelatedTables/Wells';
import { DrawerContextProvider } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import MRTTable from 'components/MRTTable';
import TabPanels from 'components/Shared/TabPanels';
import Tags from 'components/Shared/Tagger';

import { globalStateController } from 'hookstate/globalStateController';
import { jobController } from 'hookstate/jobStateController';
import { layerController } from 'hookstate/layerStateController';
import { mapControlsController } from 'hookstate/mapControlsController';
import { popupController } from 'hookstate/popupStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { copy, formatLayerForMap } from 'utils/helper';

import { showSuccessMessage, showErrorMessage } from 'actions';

import ParcelSummary from './ParcelSummary';
import { UPDATECUSTOMLAYER } from '../../graphQL/useMutationUpdateCustomLayer';
import { CUSTOMLAYER } from '../../graphQL/useQueryCustomLayer';
import Taps from '../Shared/Taps';

const useStyles = makeStyles(theme => ({
	grid: {
		width: 'auto',
	},
	gridItem: {
		flexGrow: 1,
		display: 'flex',
		height: '100%',
	},
	gridPacelDetails: {
		flexGrow: 1,
		display: 'flex',
		height: '100%',
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
	},
	parcelSummmary: {
		marginBottom: '0px',
	},
	gridPortion: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-around',
		height: '100%',
	},
	gridWidthScroll: {
		maxHeight: 'calc(100% - 88px)',
		overflow: 'auto',
		'&::-webkit-scrollbar': {
			height: '0.4em',
			width: '0.4em',
		},
		'&::-webkit-scrollbar-track': {
			'-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 5,
		},
	},
	gridItemGrey: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-around',
		// background: "#f6f6f6",
		position: 'relative',
		top: '0',
		left: '0',
		paddingTop: '7px',
		borderBottom: '1px solid rgb(190, 190, 190)',
		background: '#ebebeb',
	},
	gridHeaderDivision: {
		display: 'flex',
	},
	calcSummary: {
		width: '100%',
	},
	parcelMap: {
		margin: '8px',
		width: '100%',
		textAlign: 'center',
	},
	content: {
		backgroundColor: '#fff',
		padding: '16px',
	},
	dataSect: {
		height: '100%',
		borderTop: '2px solid #C9C9C9',
		color: '#757575',
		width: '100%',
		'& .MuiGrid-item': { display: 'flex', padding: '8px' },
		'& p': {
			wordWrap: 'break-word',
			margin: 'auto 0',
		},
		'& .dataLabels': {
			fontWeight: 'bold',
		},
		'& > .MuiGrid-item': {
			borderBottom: '2px solid #C9C9C9',
			borderRight: '2px solid #C9C9C9',
		},
		'& .fieldName': {
			borderLeft: '2px solid #C9C9C9',
			backgroundColor: '#EBEBEB',
		},
	},
	borderRight: {
		borderRight: '1px solid #eaeaea',
		backgroundColor: '#fff',
		padding: '15px',
	},
	qtrAndInputs: { '& input': { fontSize: '0.875rem' } },
	foodText: {
		position: 'absolute',
		bottom: '20px',
		// zIndex: "51",
		right: '0px',
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0 !important',
		textAlign: 'right',
		height: '0',
		paddingRight: '10px',
		'& span': {
			fontWeight: 'bold',
		},
	},
	subContent: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 53vh ) !important',
					'& .MuiTableCell-paddingCheckbox': {
						position: 'unset',
					},
				},
			},
		},
	},
	subContent2: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 35vh ) !important',
					'& .MuiTableCell-paddingCheckbox': {
						position: 'unset',
					},
				},
			},
		},
	},

	tapsPanels: {
		'& .MuiBox-root': { padding: '0' },
	},
	tapsPanelsPadding: {
		'& .MuiBox-root': { padding: '0' },
	},
	tapsLabelsButtonsSelected: {
		boxShadow: 'none',
		color: '#fff',
		backgroundColor: theme.palette.secondary.main,
		'&:hover': { color: '#757575', boxShadow: 'none !important' },
	},
	tapsLabelsButtons: {
		boxShadow: 'none',
		backgroundColor: '#fff',
		color: '#757575',
		'&:hover': { boxShadow: 'none !important' },
	},
	documentHeader: {
		display: 'flex',
		'& span': {
			marginTop: '2px',
			marginLeft: '5px',
		},
	},
	parcelDocument: {
		'& .MuiTableRow-root': {
			'&>:nth-child(2) ': {
				'& .fileName': {
					width: '375px !important',
				},
			},
		},
	},
	tags: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
	},

	toogleButtons: {
		zIndex: '9999',
		padding: '0.5rem 0.75rem 0.5rem 1.25rem',
	},
}));

const setSelectedTab = tableGlobalController.setSelectedTab;

export default function ParcelsDetailCard({ id, selectTabIndex, dataCustomLayer }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [parcelObj, setParcelObj] = useState();
	const [properties, setProperties] = useState();

	const tractOwnerGridState = tableController('TractInterestOwnerTable').useState(['data']).stateValue;
	const tractUnitsGridState = tableController('TractUnitsTable').useState(['data']).stateValues;
	const tractPotentialUnitsState = tableController('TractPotentialUnitsTable').useState(['data']).stateValues;
	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const contactsAdded = useSelector(state => state?.common?.contactsAdded);
	const [updateCustomLayer, { data: updatedParcel, loading: updatingParcel }] = useMutation(UPDATECUSTOMLAYER);

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
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			popupController.updateState({
				selectedShape: formatLayerForMap(dataCustomLayer).feature,
			});
			let shape = copy(dataCustomLayer.customLayer.shape);
			if (typeof shape === 'string') {
				shape = JSON.parse(shape);
			}
			if (dataCustomLayer.customLayer.shapeJson) {
				shape = copy(dataCustomLayer.customLayer.shapeJson);
			}
			const data = {
				...dataCustomLayer.customLayer,
				shape,
				state: dataCustomLayer.customLayer.state,
				qtrQtr: {
					nwnw: false,
					nenw: false,
					swnw: false,
					senw: false,
					nwne: false,
					nene: false,
					swne: false,
					sene: false,
					nwsw: false,
					nesw: false,
					swsw: false,
					sesw: false,
					nwse: false,
					nese: false,
					swse: false,
					sese: false,
				},
			};
			setParcelObj(data);

			setProperties(shape.properties);
		}
	}, [dataCustomLayer, tractOwnerGridState?.data, tractUnitsGridState?.data, tractPotentialUnitsState?.data]);

	const tractOwnerOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Tract Ownership', 'Potential Ownership'],
			defaultFilters: [
				{ field: 'shape._id', value: parcelObj?._id },
				{ field: 'contact.IsDeleted', value: 'false' },
				{ field: 'descriptor', value: 'ParcelDescriptor' },
			],
			customProps: { customLayer: parcelObj },
		}),
		[parcelObj]
	);

	const potentialShapeOwnersOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Tract Ownership', 'Potential Ownership'],
			customProps: { customLayer: parcelObj },
		}),
		[parcelObj]
	);

	const tractUnitsOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Related Units', 'Potential Units'],
			defaultFilters: [{ field: 'parcel._id', value: parcelObj?._id }],
			customProps: { customLayer: parcelObj },
		}),
		[parcelObj]
	);

	const tractPotentialUnitsOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Related Units', 'Potential Units'],
			defaultFilters: [
				{
					type: 'geo_intersects',
					field: 'shapeJson.geometry',
					value: parcelObj?.shapeJson?.geometry,
				},
				{ field: 'layer.keyword', value: 'unit' },
			],
			customProps: { customLayer: parcelObj },
		}),
		[parcelObj]
	);

	// Table overridden meta
	const relatedAgreementOverrideMeta = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'tract.tractId', value: parcelObj?._id },
				{ field: 'shapeType', value: 'Agreement' },
			],
			onClickedRow: () => null,
			onCustomKeyChange: null,
			CustomToolBar: null,
			gridViewSettings: null,
			maxTableHeight: 'calc(60vh - 200px)',
			fetchMetaData: null,
		}),
		[parcelObj]
	);

	const relatedWellsOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [{ field: 'shape._id', value: parcelObj?._id }],
			customProps: { customLayer: parcelObj, shapeType: 'Parcel' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: parcelObj?._id },
			},
			customValue: { parentRecord: parcelObj?._id },
		}),
		[parcelObj?._id]
	);

	useEffect(() => {
		if (updatedParcel) {
			if (updatedParcel.updateCustomLayer?.success) {
				dispatch(showSuccessMessage('Successfully updated the tract'));

				// Updating stateapp parcel object
				const { customLayer } = updatedParcel.updateCustomLayer;
				const feature = JSON.parse(customLayer.shape);
				feature.id = customLayer._id;
				feature.properties.id = customLayer._id;
				feature.layer = { id: 'parcel' };
				popupController.updateState({
					selectedShape: { ...feature.properties, feature },
				});
			} else {
				dispatch(showErrorMessage('Failed to update parcel'));
			}
		}
	}, [dispatch, updatedParcel]);

	const updateProperties = (e, field, value) => {
		if (e?.preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
		const data = copy(parcelObj);
		const { shape } = data;
		set(shape, `properties.${field}`, value);

		const customLayer = {
			shapeJson: shape,
			shape: JSON.stringify(shape),
		};

		if (field === 'shapeLabel') {
			popupController.updateState({
				selectedShape: { ...popupController.getValue('selectedShape'), shapeLabel: value },
			});
			customLayer.name = value;
		}

		updateCustomLayer({
			variables: {
				customLayerId: data._id,
				customLayer,
				userId: globalStateController.getValue('user')?._id,
			},
		}).then(res => {
			jobController.toggleBulkUpload();
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer);
		});
	};

	const updateCustomProperties = (type, value, key) => {
		const { shape } = parcelObj;
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
				customLayerId: parcelObj._id,
				customLayer,
				userId: globalStateController.getValue('user')?._id,
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
			defaultFilters: [{ field: 'shapeObj._id', value: parcelObj?._id }],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: parcelObj?._id },
			},
			customValue: { parentRecord: parcelObj?._id },
		}),
		[parcelObj?._id]
	);

	const runsheetOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [
				{ field: 'customLayerId', value: parcelObj?._id },
				{ field: 'isRunsheetInstrument', value: 'true' },
			],
		}),
		[parcelObj?._id]
	);

	return parcelObj ? (
		<DrawerContextProvider>
			<Grid item sm={12} container className={classes.gridWidthScroll}>
				<Grid item xs={12} style={{ padding: '10px 15px 0px 15px' }} className={classes.border}>
					<div className={classes.tags}>
						<Tags width="100%" targetSourceId={id} targetLabel="parcel" publicLeftBottom hideCheckBox />
					</div>
				</Grid>
				<Grid item sm={12}>
					<Taps
						tabLabels={['Summary', 'Interest Owners', 'Runsheet', 'Wells', 'Units', 'Agreements', 'Documents']}
						openTabIdex={selectTabIndex}
						tabPanels={[
							<div key="Summary" style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)', overflowX: 'hidden' }}>
								<ParcelSummary
									id={id}
									customLayer={copy(parcelObj)}
									properties={properties}
									setProperties={setProperties}
									updateProperties={updateProperties}
									updateCustomProperties={updateCustomProperties}
									updating={updatingParcel}
								/>
							</div>,
							<TabPanels
								key="Interest Owners"
								value={selectedTab}
								panels={[
									<MRTTable
										key="TractInterestOwnerTable"
										name="TractInterestOwnerTable"
										overrideMeta={tractOwnerOverrideMeta}
									/>,
									<MRTTable
										key="PotentialShapeOwnersTable"
										name="PotentialShapeOwnersTable"
										overrideMeta={potentialShapeOwnersOverrideMeta}
									/>,
								]}
							/>,
							<MRTTable key="Runsheet" name="RunsheetTable" overrideMeta={runsheetOverrideMeta} />,
							<div key="Wells" className={classes.subContent}>
								<RelatedWellsTable
									id="relatedWellsTable"
									overrideMeta={relatedWellsOverrideMeta}
									shapeType="Parcel"
									customLayer={copy(parcelObj)}
								/>
							</div>,
							<TabPanels
								key="Units"
								value={selectedTab}
								panels={[
									<MRTTable key="TractUnitsTable" name="TractUnitsTable" overrideMeta={tractUnitsOverrideMeta} />,
									<MRTTable
										key="TractPotentialUnitsTable"
										name="TractPotentialUnitsTable"
										overrideMeta={tractPotentialUnitsOverrideMeta}
									/>,
								]}
							/>,
							<MRTTable
								key="Agreements"
								name="ShapeDetailAgreementTable"
								overrideMeta={relatedAgreementOverrideMeta}
							/>,
							<div key="Documents" className={`${classes.subContent} ${classes.parcelDocument}`}>
								<RelatedDocumentsTable
									id="relatedDocumentsTable"
									moduleId={parcelObj?._id}
									overrideMeta={relatedDocumentsOverrideMeta}
									relatedObjectType="Parcel"
								/>
							</div>,
						]}
					/>
				</Grid>
			</Grid>
		</DrawerContextProvider>
	) : (
		<div
			style={{
				padding: '20px',
				position: 'absolute',
				height: '100%',
				width: '100%',
			}}
		>
			<CircularProgress size={80} disableShrink color="secondary" />
		</div>
	);
}

ParcelsDetailCard.propTypes = {
	id: PropTypes.string.isRequired,
	selectTabIndex: PropTypes.number.isRequired,
};
