import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import {
	Box,
	CircularProgress,
	Dialog,
	FormControl,
	FormControlLabel,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Typography,
	InputAdornment,
	Menu,
	ListItemIcon,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import get from 'lodash/get';
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import Loaders from 'components/Loaders';
import { getParcelOriginalProperties } from 'components/ParcelsDetailCard/utils/GetParcelOriginalProps';
import AutocompEntityNamesList from 'components/Shared/Forms/Fields/AutocompEntityNamesList';
import AutoCompleteParcelOwners from 'components/Shared/Forms/Fields/AutoCompleteParcelOwners';
import AutoCompleteTypeComponent from 'components/Shared/Forms/Fields/AutoCompleteType';
import AutoCompleteWithNewOption from 'components/Shared/Forms/Fields/AutoCompleteWithNewOption';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { addTrailingZeros } from 'components/Shared/functions';
import CloseIcon2 from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import TractForm from 'components/Table/TableAddDialog/Common/TractForm';

import { ADD_OWNER_TOA_SHAPE } from 'graphQL/useMutationAddOwnerToAShape';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { UPDATE_SHAPE_TRACTS } from 'graphQL/useMutationUpdateShapeTracts';
import { GET_AUTOCOMPLETE_LIST } from 'graphQL/useQueryGetAutoCompleteList';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { GET_TRACT_ABSTRACT_SHAPE } from 'graphQL/useQueryGetTractAbstractShape';

import { tableGlobalController } from 'hookstate/tableController';

import { calculateStandardNraForTract } from 'utils/calculatedNraHelper';

import RightDialog from '../../ContactDetailCard/components/RightDialog';
import DeleteConfirmationDialogContent from '../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

// contexts

const useStyles = makeStyles(theme => ({
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		paddingBottom: '15px',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
	},
	dialog: {
		zIndex: '9999999999 !important',
	},
	royaltyAcres: {
		'& .MuiInputBase-input': {
			color: 'red',
		},
	},
	selectedType: {
		color: 'black',
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	netAcresOveridden: {
		'& .MuiInputBase-input': {
			color: '#01B0F0 !important',
			fontWeight: 'bold !important',
		},
	},
	netAcresNormal: {
		'& .MuiInputBase-input': {
			color: 'inherit !important',
			fontWeight: 'normal !important',
		},
	},
	qtrCalls: {
		margin: '5px 0px',
	},
}));

const qtrOptions = ['E2', 'NE', 'NW', 'N2', 'SE', 'SW', 'S2', 'W2'];

function AddAgreementOwnerAndTractDialog(props) {
	const classes = useStyles();
	const client = useApolloClient();
	const { control, reset, register, getValues, watch, setValue } = useForm();
	const [isNraOverridden, setIsNRAOverridden] = useState(false);
	const [isAcquisitionCostOverridden, setIsAcquisitionCostOverridden] = useState(false);
	const [anchorEl, setAnchorEl] = useState();
	const [isAcresOverridden, setIsAcresOverridden] = useState(false);

	const [loading, setLoading] = useState(false);
	const [isTractOwner, setIsTractOwner] = useState(false);
	const [isNewTract, setIsNewTract] = useState(true);
	const [newTractError, setNewTractError] = useState();
	const [totalOwners, setTotalOwners] = useState(0);
	const [nameAutValue, setNameAutValue] = useState({ name: '', _id: null });
	const [tractValue, setTractValue] = useState({ name: '', _id: null });
	const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);
	const [getautoCompleteList, { data: dataAutoCompleteList = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);
	const tract = watch('tract', {});
	const state = watch('tract.state', '');
	const nra = watch('nra', '');
	const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);

	let layerType = _.upperFirst(props.layerType);
	layerType = layerType === 'Surface' ? 'Surface/ROW' : layerType;

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	useEffect(() => {
		getMetaData({
			variables: {
				category: 'Agreement',
			},
		});
	}, [getMetaData]);

	const interestMapping = useMemo(() => {
		if (!metaDataRes) {
			return;
		}

		const { metaData } = metaDataRes.getMetaData;
		const interestMetaData = metaData.filter(data => data.esKey === 'custom_data.interest_type')[0];

		return interestMetaData?.mapping?.reduce((acc, val) => ({ ...acc, [val.from]: val.to }), {});
	}, [metaDataRes]);

	useEffect(() => {
		if (isNewTract) {
			const form = getValues();
			form.tract = { tractName: form.tract?.tractName, state };
			reset(form);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	useEffect(() => {
		register('tract.qtrQtrSelection');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tract]);

	useEffect(() => {
		if (!isAcquisitionCostOverridden) {
			setValue('acquisition_cost', calculateAcquisitionCost(nra, getValues().acquisition_nra));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nra]);

	useEffect(() => {
		try {
			if (tract.state && isNewTract) {
				(async () => {
					const { data: tractShape } = await client.query({
						query: GET_TRACT_ABSTRACT_SHAPE,
						variables: {
							tract,
						},
					});
					if (
						tractShape?.getTractAbstractShape?.data?.properties?.shapeArea &&
						tract.shapeArea !== get(tractShape, 'getTractAbstractShape.data.properties.shapeArea')
					) {
						setValue('tract.shapeArea', tractShape?.getTractAbstractShape?.data.properties?.shapeArea);
						if (newTractError) {
							setNewTractError(null);
						}
					} else if (!get(tractShape, 'getTractAbstractShape.data.properties.shapeArea')) {
						setNewTractError(tractShape?.getTractAbstractShape);
					}
				})();
			} else {
				if (newTractError) {
					setNewTractError(null);
				}
			}
		} catch (error) {
			console.log('%c Fetch track with newState', 'color:red', error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		tract.state,
		tract.county,
		tract.township,
		tract.range,
		tract.section,
		tract.survey,
		tract.block,
		tract.sectiontx,
		tract.abstract,
	]);

	const parcelOwnersRadioBValue = watch('parcelOwnersRadioBValue', 'true');

	const [addOwnerToAShape] = useMutation(ADD_OWNER_TOA_SHAPE, {
		onCompleted: data => {
			setLoading(false);
			tableGlobalController.refetch();
			if (data.addOwnerToAShape.success) {
				Loaders.successToast('ageement-tract-creation', 'Agreement tract created Successfully');
			} else {
				Loaders.errorToast('ageement-tract-creation', data.addOwnerToAShape.message);
			}
		},
		refetchQueries: ['getESSimpleSearch', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
		onCompleted: () => {
			setLoading(false);
			tableGlobalController.refetch();
			Loaders.successToast('ageement-tract-creation', 'Agreement tract updated Successfully');
		},
		refetchQueries: ['getESSimpleSearch', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	const [updateShapeTract] = useMutation(UPDATE_SHAPE_TRACTS, {
		onCompleted: () => {
			setLoading(false);
			handleClose();
		},
		onError: err => {},
		refetchQueries: ['getESSimpleSearch', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	const checkOwnerOverRidden = owner => {
		const { royalty_interest, orri, net_acres, nra, mineral_interest, acquisition_nra, acquisition_cost } = owner;
		let calculatedNRA = calculateStandardNraForTract(
			getValues()?.tract?.sdGrossAcres,
			mineral_interest,
			royalty_interest,
			orri,
			workspaceSettings
		);
		if (!isNaN(parseFloat(calculatedNRA))) {
			setIsNRAOverridden(parseFloat(calculatedNRA) !== parseFloat(nra) && !isNaN(parseFloat(nra)));
		}

		let calculatedAcres = calculateNetAcres(mineral_interest);
		if (!isNaN(parseFloat(calculatedAcres))) {
			setIsAcresOverridden(parseFloat(calculatedAcres) !== parseFloat(net_acres) && !isNaN(parseFloat(net_acres)));
		}

		let calculatedAcquisitionCost = calculateAcquisitionCost(nra, acquisition_nra);
		if (!isNaN(parseFloat(calculatedAcquisitionCost))) {
			setIsAcquisitionCostOverridden(
				parseFloat(calculatedAcquisitionCost) !== parseFloat(acquisition_cost) && !isNaN(parseFloat(acquisition_cost))
			);
		}
	};

	useEffect(() => {
		if (props.seletedOwner) {
			props.seletedOwner.realtedObject = props.seletedOwner?.contact?._id;
			props.seletedOwner.ownerEntity = props.seletedOwner.realtedObject;
			props.seletedOwner.ownerName = props.seletedOwner?.contact?.entityDetail?.name;
			setIsTractOwner(props.seletedOwner.isTractOwner);
			setTractValue({ _id: props.seletedOwner?.tract?.tractId, name: props?.seletedOwner?.tract?.tractName });
			setNameAutValue({ _id: props.seletedOwner?.ownerEntity, name: props?.seletedOwner?.ownerName });
			setSelectedShapeLayer(props.seletedOwner);

			if (props.seletedOwner.depthTo === 'All depths' && props.seletedOwner.depthFrom === 'All depths') {
				props.seletedOwner.parcelOwnersRadioBValue = 'true';
			} else {
				props.seletedOwner.parcelOwnersRadioBValue = 'false';
			}
			reset(props.seletedOwner);

			setTimeout(() => checkOwnerOverRidden(props.seletedOwner), 0);

			setIsNewTract(false);
			// reset(pick(props.seletedOwner, ['state', 'county', 'survey', 'block', 'section', 'abstract', 'township', 'meridian', 'range', 'altSurvey', 'qtr', 'sdGrossAcres', 'uAcres', 'legalDescription']))
		} else {
			reset({ countAcres: 'Yes' });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.seletedOwner]);

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		getautoCompleteList({ variables: { type: 'AgreementShapeOwner', data: { key: 'tractStatus' } } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// if launched from grid row set initializing based on selectedWell state
		if (selectedShapeLayer?.shapeJson) {
			const originalProperties = getParcelOriginalProperties(selectedShapeLayer?.shapeJson?.properties);
			const sdGrossAcres = selectedShapeLayer?.shapeJson?.properties?.sdGrossAcres || '';
			const shapeArea = selectedShapeLayer?.shapeJson?.properties?.shapeArea || '';
			const legalDescription = selectedShapeLayer?.shapeJson?.properties?.legalDescription || '';
			const mapStatus = selectedShapeLayer?.shapeJson?.properties?.mapStatus || '';
			const basin = selectedShapeLayer?.shapeJson?.properties?.basin || '';
			const field = selectedShapeLayer?.shapeJson?.properties?.field || '';
			selectedShapeLayer.parcelId = selectedShapeLayer._id;

			setTractValue({ _id: selectedShapeLayer._id, name: selectedShapeLayer.name });
			const form = {
				...getValues(),
				depthTo: getValues().depthTo || 'All depths',
				depthFrom: getValues().depthFrom || 'All depths',
				tract: {
					tractId: selectedShapeLayer._id,
					name: selectedShapeLayer.name,
					sdGrossAcres,
					shapeArea,
					legalDescription,
					mapStatus,
					basin,
					field,
					...originalProperties,
					qtrQtrSelection: selectedShapeLayer.qtrQtrSelection,
				},
			};
			reset({ ...form });
		} else {
			if (selectedShapeLayer?.clear) {
				setTractValue({ name: '', _id: null });
				reset({ ...getValues(), tract: {} });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedShapeLayer]);

	const handleClose = () => {
		setSelectedShapeLayer(null);
		reset({});
		props.onClose();
	};

	const handleSave = () => {
		// if (newTractError) {
		//   dispatch(showErrorMessage(newTractError.message))
		//   return;
		// }
		const ownerToAdd = getValues();

		ownerToAdd.acquisition_nra = Number(ownerToAdd.acquisition_nra);
		ownerToAdd.acquisition_cost = Number(ownerToAdd.acquisition_cost);
		ownerToAdd.isTractOwner = isTractOwner;
		ownerToAdd.tract = tract;

		Object.keys(ownerToAdd).forEach(key => {
			if (
				[
					'mineral_interest',
					'royalty_interest',
					'orri',
					'net_acres',
					'nra',
					'company_net_acres',
					'lease_royalty_interest',
				].includes(key) &&
				ownerToAdd[key]
			) {
				ownerToAdd[key] = addTrailingZeros(parseFloat(ownerToAdd[key]).toFixed(8));
			}
		});

		if (ownerToAdd.parcelOwnersRadioBValue === 'true') {
			ownerToAdd.depthFrom = 'All depths';
			ownerToAdd.depthTo = 'All depths';
		}

		if (isNewTract) {
			delete ownerToAdd.tract.tractId;
		}

		setLoading(true);
		if (props.seletedOwner) {
			ownerToAdd.relatedObject = ownerToAdd.ownerEntity;
			updateShapeOwners({
				variables: {
					shapeOwners: [
						{
							shapeId: props.shapeId,
							...ownerToAdd,
						},
					],
					shapeType: props.shapeType,
				},
				refetchQueries: ['getESSimpleSearch', 'getCustomLayer'],
				awaitRefetchQueries: true,
			});
			Loaders.createToast('ageement-tract-creation', 'Agreement tract update in progress');
		} else {
			addOwnerToAShape({
				variables: {
					shapeType: props.shapeType,
					shapeOwner: {
						shapeId: props.shapeId,
						...ownerToAdd,
					},
				},
				refetchQueries: ['getESSimpleSearch', 'getCustomLayer'],
				awaitRefetchQueries: true,
			});
			Loaders.createToast('ageement-tract-creation', 'Agreement tract creation in progress');
		}
		handleClose();
	};

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};

	const deleteFunc = async () => {
		try {
			setLoading(true);
			updateShapeTract({
				variables: {
					seletedTract: {
						id: props.seletedTract._id,
						isDeleted: true,
					},
				},
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList'],
				awaitRefetchQueries: true,
			});
		} catch {
			setLoading(false);
		}
	};

	const calculateNetAcres = mineral_interest => {
		if (!mineral_interest) {
			return null;
		}
		const netAcres = addTrailingZeros(
			getValues()?.tract?.sdGrossAcres ? (getValues()?.tract?.sdGrossAcres * mineral_interest).toFixed(8) : null
		);
		return netAcres;
	};

	// const calculateNRA = (interest1, interest2, net_acres = getValues().net_acres) => {
	//   if (!interest1 && !interest2) return null;
	//   let nra = parseFloat(net_acres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;
	//   nra = addTrailingZeros(nra.toFixed(8));

	//   return nra;
	// };

	const calculateAcquisitionCost = (nra, aquisitionNra) => {
		if (!nra && !aquisitionNra) {
			return null;
		}
		const aquisitionCost = parseFloat(nra || 0) * parseFloat(aquisitionNra || 0);

		return aquisitionCost.toFixed(2);
	};

	useEffect(() => {
		if (nameAutValue?._id && nameAutValue?.name) {
			reset({ ...getValues(), tract, ownerEntity: nameAutValue._id, ownerName: nameAutValue.name });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nameAutValue]);

	const setExistingOwner = (e, value) => {
		if (value?._id && value?.name) {
			setNameAutValue(value);
			let net_acres = value.ownerData.net_acres;
			if (value.ownerData.mineral_interest && !value.ownerData.net_acres) {
				net_acres = addTrailingZeros(
					getValues()?.tract?.sdGrossAcres
						? (getValues()?.tract?.sdGrossAcres * value.ownerData.mineral_interest).toFixed(8)
						: null
				);
			}

			const data = {
				...getValues(),
				tract,
				ownerEntity: value._id,
				ownerName: value.name,
				net_acres: net_acres || '',
				...value.ownerData,
				mineral_interest: value.ownerData.mineral_interest || '',
				royalty_interest: value.ownerData.royalty_interest || '',
				orri: value.ownerData.orri || '',
				depthFrom: value.ownerData.depthFrom || '',
				depthTo: value.ownerData.depthTo || '',
				nra: value.ownerData.nra?.toFixed?.(8) || '',
			};

			reset(data);

			setTimeout(() => checkOwnerOverRidden(data), 0);
		} else {
			setNameAutValue(null);
		}
	};

	const handleChangeQtr = (value, index) => {
		const qtr = tract?.qtrQtrSelection?.selectedQtr
			? JSON.parse(JSON.stringify(tract.qtrQtrSelection.selectedQtr))
			: ['', '', '', ''];
		qtr[index] = value ?? '';
		const newTract = { ...tract, qtrQtrSelection: { ...tract.qtrQtrSelection, selectedQtr: qtr } };
		reset({ ...getValues(), tract: newTract });
	};

	const autoCompleteList = dataAutoCompleteList?.autoCompleteList || [];
	const content = (
		<div style={{ padding: '30px' }}>
			<Grid item xs={12} style={{ minHeight: '35px' }}>
				<h4
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.1rem',
					}}
				>
					{props.seletedTract ? `Update ${props.shapeType} Tract` : `Associate Tract to ${props.shapeType}`}
				</h4>
				<div style={{ float: 'right' }}>
					{selectedShapeLayer?.tract && (
						<>
							<IconButton
								size="small"
								component="span"
								style={{
									background: 'transparent',
									paddingLeft: '10px',
									align: 'center',
								}}
								onClick={handleMenuClick}
							>
								<MoreHorizIcon id="tractMoreHorizIcon" size="medium" />
							</IconButton>
						</>
					)}
					<IconButton onClick={handleClose} size="small">
						<CloseIcon2 fontSize="small" />
					</IconButton>
					<Menu
						id="dealMenu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						className={classes.menu}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<MenuItem
							onClick={() => {
								props.deleteFunc([selectedShapeLayer._id]);
								handleMenuClose();
								handleClose();
							}}
						>
							<ListItemIcon style={{ minWidth: '30px' }}>
								<DeleteIcon size="medium" />
							</ListItemIcon>
							<ListItemText id="deleteTract">Delete</ListItemText>
						</MenuItem>
					</Menu>
				</div>
			</Grid>

			<div>
				<List style={{ padding: 0 }}>
					<ListItem
						style={{
							flexDirection: 'column',
							justifyContent: 'start',
							alignItems: 'start',
							padding: '5px',
						}}
					>
						<ListItemText>
							<h4
								onClick={() => {
									setIsNewTract(true);
								}}
								className={isNewTract ? classes.selectedType : classes.unSelectedType}
							>
								New Tract
							</h4>
							<h4
								onClick={() => {
									setIsNewTract(false);
								}}
								id="existingTractTab"
								className={!isNewTract ? classes.selectedType : classes.unSelectedType}
								style={{ marginLeft: '20px' }}
							>
								Existing Tract
							</h4>
						</ListItemText>
					</ListItem>
				</List>
			</div>

			<div>
				<Box mt={2}>
					{isNewTract ? (
						<Typography>Add new tract to the map by entering a valid legal description</Typography>
					) : (
						<Typography>Search for existing tract to associate to agreement and populate ownership detail</Typography>
					)}
				</Box>
				<TextField id="_id" name="_id" style={{ display: 'none' }} inputRef={register()} />

				<TractForm
					isNewTract={isNewTract}
					tract={tract}
					tractValue={tractValue}
					setSelectedShapeLayer={setSelectedShapeLayer}
					control={control}
					prefix={'tract.'}
				/>

				<TextField id="tractId" name="tract.tractId" style={{ display: 'none' }} inputRef={register()} />
				<Grid container direction="row" spacing={1} className={classes.qtrCalls}>
					<Grid item xs={3}>
						<Autocomplete
							options={qtrOptions}
							getOptionLabel={option => option}
							value={tract?.qtrQtrSelection?.selectedQtr?.[0] ?? ''}
							onChange={(e, newInputValue) => {
								handleChangeQtr(newInputValue, 0);
							}}
							renderInput={params => (
								<TextField {...params} variant="outlined" label="QTR 1" size="small" className={classes.maxWidth} />
							)}
						/>
					</Grid>
					<Grid item xs={3}>
						<Autocomplete
							options={qtrOptions}
							id="autocompleteQTR2"
							getOptionLabel={option => option}
							value={tract?.qtrQtrSelection?.selectedQtr?.[1] ?? ''}
							onChange={(e, newInputValue) => {
								handleChangeQtr(newInputValue, 1);
							}}
							renderInput={params => (
								<TextField {...params} variant="outlined" label="QTR 2" size="small" className={classes.maxWidth} />
							)}
						/>
					</Grid>
					<Grid item xs={3}>
						<Autocomplete
							options={qtrOptions}
							getOptionLabel={option => option}
							value={tract?.qtrQtrSelection?.selectedQtr?.[2] ?? ''}
							onChange={(e, newInputValue) => {
								handleChangeQtr(newInputValue, 2);
							}}
							renderInput={params => (
								<TextField {...params} variant="outlined" label="QTR 3" size="small" className={classes.maxWidth} />
							)}
						/>
					</Grid>
					<Grid item xs={3}>
						<Autocomplete
							options={qtrOptions}
							getOptionLabel={option => option}
							value={tract?.qtrQtrSelection?.selectedQtr?.[3] ?? ''}
							onChange={(e, newInputValue) => {
								handleChangeQtr(newInputValue, 3);
							}}
							renderInput={params => (
								<TextField {...params} variant="outlined" label="QTR 4" size="small" className={classes.maxWidth} />
							)}
						/>
					</Grid>
				</Grid>
				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="tract.sdGrossAcres"
					label={'Gross. Acres'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					defaultValue={tract?.sdGrossAcres || ''}
				/>
				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="tract.shapeArea"
					label={'Calc. Acres'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					disabled
					defaultValue={tract?.shapeArea || ''}
				/>
				{/* <Controller
      control={control}
      name={`tract.tractStatus`}
      defaultValue={tract?.tractStatus || ''}
      render={(props) => (
        <AutoCompleteTypeComponent
          value={props.value}
          meta={{
            path: 'shapeJson.properties.tractStatus'
          }}
          label="Tract Status"
          variant="outlined"
          onChange={(e, value) => { props.onChange(value?.name || '') }}
          autoFocus={false}
        />
      )}
    /> */}
				<Controller
					control={control}
					name={'tract.department'}
					defaultValue={tract?.department || ''}
					render={props => (
						<AutoCompleteTypeComponent
							value={props.value}
							meta={{
								path: 'shapeJson.properties.department',
							}}
							label="Department"
							variant="outlined"
							onChange={(e, value) => {
								props.onChange(value?.name || '');
							}}
							autoFocus={false}
						/>
					)}
				/>
				<Controller
					control={control}
					name={'tract.mapStatus'}
					defaultValue={tract?.mapStatus || ''}
					render={props => (
						<AutoCompleteTypeComponent
							value={props.value}
							meta={{
								path: 'shapeJson.properties.mapStatus',
							}}
							label="Map Status"
							variant="outlined"
							onChange={(e, value) => {
								props.onChange(value?.name || '');
							}}
							autoFocus={false}
						/>
					)}
				/>
			</div>
			<div>
				<List style={{ padding: 0 }}>
					<ListItem
						style={{
							flexDirection: 'column',
							justifyContent: 'start',
							alignItems: 'start',
							padding: '5px',
						}}
					>
						<ListItemText>
							<h4
								onClick={() => {
									setIsTractOwner(false);
								}}
								className={!isTractOwner ? classes.selectedType : classes.unSelectedType}
							>
								New Owner
							</h4>
							<h4
								onClick={() => {
									setIsTractOwner(true);
								}}
								className={isTractOwner ? classes.selectedType : classes.unSelectedType}
								style={{ marginLeft: '10px' }}
							>
								{` Existing Tract Owners (${totalOwners ? totalOwners : '0'})`}
							</h4>
						</ListItemText>
					</ListItem>
				</List>
			</div>

			{isTractOwner ? (
				<AutoCompleteParcelOwners
					variant="outlined"
					setTotalOwners={setTotalOwners}
					parcel={tract}
					placeholder="Search existing tract owner by name"
					value={nameAutValue}
					onChange={setExistingOwner}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
			) : (
				<AutocompEntityNamesList
					variant="outlined"
					id="AutocompEntityNamesList"
					placeholder="Search for owner by name"
					nameAutValue={nameAutValue}
					setNameAutValue={setNameAutValue}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
			)}

			<TextField id="ownerEntity" name={'ownerEntity'} style={{ display: 'none' }} inputRef={register()} />
			<TextField id="ownerName" name={'ownerName'} style={{ display: 'none' }} inputRef={register()} />

			{interestMapping?.['Mineral Interest']?.includes(layerType) && (
				<Controller
					control={control}
					name="mineral_interest"
					render={({ onChange, value }) => (
						<TextField
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							margin="dense"
							value={value}
							type="number"
							label={'Mineral Interest'}
							fullWidth
							onWheel={e => e.target.blur()}
							onChange={e => {
								onChange(e.target.value);
								const net_acres = !isAcresOverridden ? calculateNetAcres(e.target.value) : getValues().net_acres;
								const nra = !isNraOverridden
									? calculateStandardNraForTract(
											getValues()?.tract?.sdGrossAcres,
											e.target.value,
											getValues().royalty_interest,
											getValues().orri,
											workspaceSettings
										)
									: getValues().nra;
								setValue('net_acres', net_acres);
								setValue('nra', nra);
							}}
						/>
					)}
				/>
			)}

			{/* {interestMapping?.['Lease Royalty Interest']?.includes(layerType) && (
      <Controller
        control={control}
        name="lease_royalty_interest"
        render={({ onChange, value }) => (
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            value={value}
            type="number"
            label={'Lease Royalty Interest'}
            fullWidth
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              onChange(e.target.value)
            }}
          />
        )}
      />
    )} */}

			{interestMapping?.['Royalty Interest']?.includes(layerType) && (
				<Controller
					control={control}
					name="royalty_interest"
					render={({ onChange, value }) => (
						<TextField
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							margin="dense"
							value={value}
							type="number"
							label={'Royalty Interest'}
							fullWidth
							onWheel={e => e.target.blur()}
							onChange={e => {
								onChange(e.target.value);
								if (!isNraOverridden) {
									setValue(
										'nra',
										calculateStandardNraForTract(
											getValues()?.tract?.sdGrossAcres,
											getValues().mineral_interest,
											e.target.value,
											getValues().orri,
											workspaceSettings
										)
									);
								}
							}}
						/>
					)}
				/>
			)}

			{interestMapping?.['Overriding Royalty Interest (ORRI)']?.includes(layerType) && (
				<Controller
					control={control}
					name="orri"
					render={({ onChange, value }) => (
						<TextField
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							margin="dense"
							value={value}
							type="number"
							label={'Overriding Royalty Interest (ORRI)'}
							fullWidth
							onWheel={e => e.target.blur()}
							onChange={e => {
								onChange(e.target.value);
								if (!isNraOverridden) {
									setValue(
										'nra',
										calculateStandardNraForTract(
											getValues()?.tract?.sdGrossAcres,
											getValues().mineral_interest,
											getValues().royalty_interest,
											e.target.value,
											workspaceSettings
										)
									);
								}
							}}
						/>
					)}
				/>
			)}

			{interestMapping?.['Working Interest']?.includes(layerType) && (
				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="working_interest"
					inputRef={register()}
					label={'Working Interest'}
					InputLabelProps={{ shrink: true }}
					type="number"
					fullWidth
					onWheel={e => e.target.blur()}
				/>
			)}

			<Controller
				control={control}
				name="net_acres"
				render={({ onChange, value }) => (
					<TextField
						variant="outlined"
						InputLabelProps={{ shrink: true }}
						margin="dense"
						value={value}
						type="number"
						label={'Net Acres'}
						className={isAcresOverridden ? classes.netAcresOveridden : classes.netAcresNormal}
						fullWidth
						onWheel={e => e.target.blur()}
						onChange={e => {
							onChange(e.target.value);
							const netAcres = calculateNetAcres(getValues().mineral_interest);
							setIsAcresOverridden(parseFloat(netAcres) !== e.target.value);
							onChange(e.target.value);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{isAcresOverridden && (
										<IconButton
											aria-label="toggle royality-acres"
											onClick={() => {
												setValue('net_acres', calculateNetAcres());
												const netAcres = calculateNetAcres(getValues().mineral_interest);
												setIsAcresOverridden(false);
												setValue('net_acres', netAcres);
											}}
										>
											<AutorenewIcon />
										</IconButton>
									)}
								</InputAdornment>
							),
						}}
					/>
				)}
			/>

			<Controller
				as={TextField}
				control={control}
				variant="outlined"
				margin="dense"
				name="company_net_acres"
				inputRef={register()}
				label={'Company Net Acres'}
				InputLabelProps={{ shrink: true }}
				type="number"
				fullWidth
				onWheel={e => e.target.blur()}
			/>

			<Controller
				control={control}
				name="nra"
				render={({ onChange, value }) => (
					<TextField
						variant="outlined"
						InputLabelProps={{ shrink: true }}
						margin="dense"
						value={value}
						type="number"
						label="Net Royalty Acres (NRA)"
						className={isNraOverridden ? classes.netAcresOveridden : classes.netAcresNormal}
						fullWidth
						onWheel={e => e.target.blur()}
						onChange={e => {
							onChange(e.target.value);
							const nra = calculateStandardNraForTract(
								getValues()?.tract?.sdGrossAcres,
								getValues().mineral_interest,
								getValues().royalty_interest,
								getValues().orri,
								workspaceSettings
							);
							setIsNRAOverridden(parseFloat(nra) !== parseFloat(e.target.value));
							setValue('nra', e.target.value);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{isNraOverridden && (
										<IconButton
											aria-label="toggle royality-acres"
											onClick={() => {
												const nra = calculateStandardNraForTract(
													getValues()?.tract?.sdGrossAcres,
													getValues().mineral_interest,
													getValues().royalty_interest,
													getValues().orri,
													workspaceSettings
												);
												setValue('nra', nra);
												setIsNRAOverridden(false);
											}}
										>
											<AutorenewIcon />
										</IconButton>
									)}
								</InputAdornment>
							),
						}}
					/>
				)}
			/>

			<Controller
				control={control}
				name="acquisition_nra"
				render={props => (
					<TextField
						label="Acquisition $/NRA"
						variant="outlined"
						margin="dense"
						value={parseFloat(props.value).toFixed(2)}
						inputRef={props.ref}
						onWheel={e => e.target.blur()}
						onChange={e => {
							props.onChange(parseFloat(e.target.value).toFixed(2));
							if (!isAcquisitionCostOverridden) {
								setValue('acquisition_cost', calculateAcquisitionCost(getValues().nra, e.target.value));
							}
						}}
						InputProps={{
							inputComponent: CurrencyFormatCustom,
						}}
						fullWidth
						defaultValue=""
					/>
				)}
			/>

			<Controller
				control={control}
				name="acquisition_cost"
				render={props => (
					<TextField
						label="Acquisition Cost"
						variant="outlined"
						margin="dense"
						value={parseFloat(props.value).toFixed(2)}
						inputRef={props.ref}
						onWheel={e => e.target.blur()}
						className={isAcquisitionCostOverridden ? classes.netAcresOveridden : classes.netAcresNormal}
						onChange={e => {
							const toFixedValue = parseFloat(e.target.value).toFixed(2);
							props.onChange(toFixedValue);
							const acquisition_cost = calculateAcquisitionCost(getValues().nra, getValues().acquisition_nra);
							setIsAcquisitionCostOverridden(acquisition_cost !== toFixedValue);
						}}
						InputProps={{
							inputComponent: CurrencyFormatCustom,
							endAdornment: (
								<InputAdornment position="end">
									{isAcquisitionCostOverridden && (
										<IconButton
											aria-label="toggle royality-acres"
											onClick={() => {
												setValue(
													'acquisition_cost',
													calculateAcquisitionCost(getValues().nra, getValues().acquisition_nra)
												);
												setIsAcquisitionCostOverridden(false);
											}}
										>
											<AutorenewIcon />
										</IconButton>
									)}
								</InputAdornment>
							),
						}}
						fullWidth
						defaultValue=""
					/>
				)}
			/>
			<Controller
				control={control}
				name={'parcelOwnersRadioBValue'}
				render={({ onChange, value, ref }) => (
					<RadioGroup
						row
						value={value || 'true'}
						onChange={event => {
							if (event.target.value === 'true') {
								setValue('depthFrom', 'All depths');
								setValue('depthTo', 'All depths');
							}
							onChange(event.target.value);
						}}
					>
						<FormControlLabel value="true" control={<Radio />} label="All Depths" />
						<FormControlLabel value="false" control={<Radio />} label="Footages/Formations" />
					</RadioGroup>
				)}
			/>

			<Grid item xs={12} style={{ display: parcelOwnersRadioBValue !== 'false' ? 'none' : 'block' }}>
				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="depthFrom"
					inputRef={register()}
					label={'Depth From'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					onWheel={e => e.target.blur()}
				/>

				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="depthTo"
					inputRef={register()}
					label={'Depth To'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					onWheel={e => e.target.blur()}
				/>
			</Grid>

			<Grid container direction="row" spacing={2}>
				<Grid item xs={6}>
					<Controller
						control={control}
						name={'tractStatus'}
						render={({ onChange, value, ref }) => (
							<AutoCompleteWithNewOption
								margin="dense"
								label="Tract Status"
								InputLabelProps={{ shrink: true }}
								variant="outlined"
								options={autoCompleteList}
								value={value}
								onChange={(_, value) => {
									value && onChange(value.name);
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={6}>
					<Controller
						control={control}
						name="countAcres"
						defaultValue={''}
						render={({ onChange, value }) => (
							<FormControl variant="outlined" fullWidth margin="dense">
								<InputLabel id="countAcres-label">Count Acres</InputLabel>
								<Select
									id="countAcres"
									labelId="countAcres-label"
									label="Count Acres"
									value={value}
									onChange={onChange}
								>
									<MenuItem value="Yes">Yes</MenuItem>
									<MenuItem value="No">No</MenuItem>
								</Select>
							</FormControl>
						)}
					/>
				</Grid>
			</Grid>

			<div className={classes.dialogFooter}>
				<Button
					variant="contained"
					color="default"
					size="medium"
					disableElevation
					onClick={handleClose}
					disabled={loading}
					className={classes.footerButton}
					style={{ margin: '0px 15px 0px 0px' }}
				>
					Cancel
				</Button>

				<Button
					variant="contained"
					color="secondary"
					id="saveButton"
					size="medium"
					disableElevation
					onClick={() => {
						handleSave();
					}}
					className={classes.footerButton}
					disabled={!nameAutValue?._id}
				>
					{loading ? <CircularProgress size={14} /> : 'Save'}
				</Button>
			</div>
		</div>
	);

	return (
		<>
			{deleteDialogOpen && (
				<Dialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={handleCloseDialog}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialogContent
						header={'Delete Well Interest'}
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete the selected well interest?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
			{!!props.drawerContainer && ReactDOM.createPortal(content, props.drawerContainer)}
			{!props.drawerContainer && (
				<RightDialog open={props.open} handleClickDialogClose={handleClose} width={props.width}>
					{content}
				</RightDialog>
			)}
		</>
	);
}

export default AddAgreementOwnerAndTractDialog;
