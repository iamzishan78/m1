import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import FolderIcon from '@material-ui/icons/Folder';
import HistoryIcon from '@material-ui/icons/History';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';
import parse from 'autosuggest-highlight/parse';
import debounce from 'lodash/debounce';

import { platformDataInitialData } from 'components/MapGridCard/components/data';
import SearchByTypeSelectField from 'components/MapGridCard/components/SearchByTypeSelectField';
import { SHAPE_TYPE } from 'components/Navigation/components/Utils/consts';
import TractIcon from 'components/Shared/svgIcons/tract';
import UnitIcon from 'components/Shared/svgIcons/unit';
import capitalizeFirstLetter from 'components/Shared/valueformatters/capitalize-first-letter';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { layerController } from 'hookstate/layerStateController';
import { mapControlsController } from 'hookstate/mapControlsController';
import { popupController } from 'hookstate/popupStateController';

import { AppContext } from '../../../AppContext';
import { ADDSEARCHHISTORY } from '../../../graphQL/useMutationAddSearchHistory';
import { REMOVESEARCHHISTORY } from '../../../graphQL/useMutationRemoveSearchHistory';
import { UPDATESEARCHHISTORY } from '../../../graphQL/useMutationUpdateSearchHistory';
import { CONTACTWELLS } from '../../../graphQL/useQueryContactWells';
import { LEASELATSLONS } from '../../../graphQL/useQueryLeaseLatsLonsArray';
import { OPERATORSLATSLONS } from '../../../graphQL/useQueryOperatorLatsLonsArray';
import { OWNERSLATSLONS } from '../../../graphQL/useQueryOwnerLatsLonsArray';
import { USERSEARCHHISTORY } from '../../../graphQL/useQueryUserSearchHistory';
import LeaseIcon from '../../Shared/svgIcons/lease';
import LeaseGrayIcon from '../../Shared/svgIcons/lease-gray';
import OperatorIcon from '../../Shared/svgIcons/operator';
import WellIcon from '../../Shared/svgIcons/well';

const landGridIndexName = 'landgrid-index';
const leaseIndexName = 'lease-index-m1corev3';
const operatorIndexName = 'operator-index-m1corev3';
const wellCogIndexName = 'wellheader-index-m1corev3';
const ownerCogIndexName = 'globalowner-index-m1corev3';
const contactIndexName = 'contacts-index';

const maxMinScore = options => {
	let max = 0;
	let min = 1000000;
	for (let i = 0; i < options.length; i++) {
		if (options[i].Score > max) {
			max = options[i].Score;
		}
		if (options[i].Score < min) {
			min = options[i].Score;
		}
	}

	return [max, min];
};

const calcScoreOpacity = (maxMin, score) => {
	if (maxMin[0] === maxMin[1]) {
		return 0;
	}
	if (score === maxMin[1]) {
		return 1;
	}

	return 1 - (score - maxMin[1]) / (maxMin[0] - maxMin[1]);
};

const useStyles = makeStyles(theme => ({
	icon: {
		color: theme.palette.text.secondary,
		// color: '#fff',
		marginRight: theme.spacing(2),
	},
	groupsHeadersText: {
		margin: '0',
		marginTop: '3px',
		padding: '0',
		fontFamily: 'Poppins',
		color: '#0f2046',
		paddingLeft: '5px',
	},
	groupsHeaders: {
		position: 'sticky',
		top: '-9px',
		// backgroundColor: "#d4e7fce0",
		// backgroundColor: "red",
		zIndex: '4000',
	},
	groupsButton: {
		margin: '3px',
		zIndex: '2000',
		color: '#5f5f5f',
	},
	root: {
		height: '40px',
		width: '100%',
		'& .MuiAutocomplete-inputRoot': { maxHeight: '42px' },
	},
	textF: {
		'& input': {
			// color: "#ffffffc9",
			color: '#d3d3d3',
			height: '5px',
			minWidth: '0 !important',
			visibility: 'unset',
			opacity: '1',
			// visibility: ({ mapGridCardActivated }) =>
			//   mapGridCardActivated ? "hidden" : "unset",
			// opacity: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : "1"),
			// transition: "opacity 0.5s linear",
		},
		// "& .MuiInputAdornment-root": {
		//   padding: "6px 0 6px 8px",
		//   height: "23px",
		// },
		'& .MuiInputBase-adornedStart, .MuiInputBase-adornedEnd': {
			padding: '9px 0 !important',
		},
	},
	endAdornmentIcon: {
		opacity: '1',
		// opacity: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : "1"),
		transition: 'opacity 1.2s linear',
		'& button': {
			width: '',
			// width: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : ""),
			transition: 'width 1s ',
		},
	},
	score: {
		position: 'absolute',
		top: '-8px',
		width: '17px',
		height: '16px',
		borderRadius: '50%',
		marginLeft: '10px',
	},
	headerButtons: {
		width: '100%',
		margin: '0 4px',
		minWidth: 'max-content',
	},
	historyPopover: {
		'& .MuiPopover-paper': {
			width: 'calc(100% - 42px) !important',
			maxWidth: 'none !important',
			minWidth: 'unset !important',
			maxHeight: '55vh !important',
		},
	},
	historyRow: {
		'&:hover': {
			backgroundColor: '#EFEFEF',
			cursor: 'pointer',
		},
	},
	startAdornmentIcon: {
		cursor: 'pointer',
		height: '23px',
	},
}));

const esCallData = {
	'platform wells': {
		esIndex: 'platformData:wells',
		search: request => `${request.input}`,
		searchFields: SHAPE_TYPE['wells'].SEARCH_FIELDS,
		formatOptions: data => {
			return { ...data, Source: wellCogIndexName, Primary: data.WellName, Secondary: data.ApiNumber };
		},
	},
	'my wells': {
		esIndex: 'mywells_flat',
		search: request => `*${request.input}*`,
		searchFields: SHAPE_TYPE['my wells'].SEARCH_FIELDS,
		formatOptions: data => {
			return { ...data, Source: 'mywells_flat', Primary: data.wellData.WellName, Secondary: data.wellData.ApiNumber };
		},
	},
	contacts: {
		esIndex: 'contacts_flat',
		search: request => `${request.input}`,
		searchFields: SHAPE_TYPE['contacts'].SEARCH_FIELDS,
		formatOptions: data => {
			return {
				...data,
				...data.node,
				Primary: data.name || '--',
				Source: contactIndexName,
				Secondary:
					data.address1 || data.city || data.state
						? data.address1 + ' ' + data.city + ', ' + data.state + ' ' + data.zip
						: '--',
			};
		},
	},
	'tax owners': {
		esIndex: 'platformData:globalowner',
		search: request => `${request.input}`,
		searchFields: SHAPE_TYPE['tax owners'].SEARCH_FIELDS,
		formatOptions: data => {
			return {
				...data,
				Source: 'globalowner-index-m1corev3',
				Primary: data.OwnerName,
				Secondary: `${data.StreetAddress}\n${data.City}\n${data.State}\n${data.Zip}`,
			};
		},
	},
	operators: {
		esIndex: 'platformData:operator',
		search: request => `${request.input}`,
		searchFields: SHAPE_TYPE['operators'].SEARCH_FIELDS,
		formatOptions: data => {
			return { ...data, Source: operatorIndexName, Primary: data.Operator, Secondary: null };
		},
	},
	leases: {
		esIndex: 'platformData:lease',
		search: request => `${request.input}`,
		searchFields: ['lease', 'leaseId'],
		formatOptions: data => {
			return {
				...data,
				Source: leaseIndexName,
				Primary: data.Lease && ['', 'N/A', '(N/A)'].includes(data.Lease) ? '--' : data.Lease,
				Secondary: data.LeaseId && ['', 'N/A', '(N/A)'].includes(data.LeaseId) ? null : data.LeaseId,
			};
		},
	},
	'land grid': {
		esIndex: 'platformData:landgrid',
		search: request => `${request.input}`,
		searchFields: SHAPE_TYPE['land grid'].SEARCH_FIELDS,
		filter: [
			{ field: 'level7Id.keyword', value: undefined },
			{ field: 'level8Id.keyword', value: undefined },
			{ field: 'level9Id.keyword', value: undefined },
			{ field: 'level10Id.keyword', value: undefined },
		],
		formatOptions: data => {
			return {
				...data,
				Source: landGridIndexName,
				Primary: [
					`${data.level1Type ? `${data.level1Type}: ${data.level1Name}` : ''}`,
					`${data.level2Type ? `${data.level2Type}: ${data.level2Name}` : ''}`,
				].join(' '),
				Secondary: [
					`${data.level3Type ? `${data.level3Type}: ${data.level3Name}` : ''}`,
					`${data.level4Type ? `${data.level4Type}: ${data.level4Name}` : ''}`,
					`${data.level5Type ? `${data.level5Type}: ${data.level5Name}` : ''}`,
					`${data.level6Type ? `${data.level6Type}: ${data.level6Name}` : ''}`,
				].join(' '),
			};
		},
	},
	units: {
		esIndex: 'shapes_flat',
		search: request => (request.input ? `*${request.input}*` : ''),
		searchFields: [
			'name',
			'shapeJson.properties.uNumber',
			'shapeJson.properties.originalProperties.County',
			'data.shapeJson.properties.originalProperties.State',
		],
		filter: {
			field: 'layer',
			value: 'unit',
		},
		formatOptions: data => {
			const Secondary = data?.shapeJson?.properties?.originalProperties
				? `${data.shapeJson.properties.originalProperties.County}, ${data.shapeJson.properties.originalProperties.State || ''}`
				: null;
			const Primary = data?.shapeJson?.properties?.uNumber
				? `${data?.shapeJson?.properties?.uNumber} - ${data.name}`
				: data.name;
			return {
				...data,
				Source: 'shapes_flat',
				Primary,
				Secondary,
			};
		},
	},

	tracts: {
		esIndex: 'shapes_flat',
		search: request => (request.input ? `*${request.input}*` : ''),
		searchFields: SHAPE_TYPE['tracts'].SEARCH_FIELDS,
		filter: {
			field: 'layer',
			value: 'parcel',
		},
		formatOptions: data => {
			const Secondary = data?.shapeJson?.properties?.originalProperties
				? `${data.shapeJson.properties.originalProperties.County}, ${data.shapeJson.properties.originalProperties.State || ''}`
				: null;
			return {
				...data,
				Source: 'shapes_flat',
				Primary: data.name,
				Secondary,
			};
		},
	},
	agreements: {
		esIndex: 'shapes_flat',
		search: request => (request.input ? `*${request.input}*` : ''),
		searchFields: SHAPE_TYPE['agreements'].SEARCH_FIELDS,
		filter: {
			field: 'shapeJson.properties.type',
			value: 'agreement',
		},
		formatOptions: data => {
			return {
				...data,
				Source: 'shapes_flat',
				Primary: data?.shapeJson?.properties?.shapeLabel,
				Secondary: capitalizeFirstLetter(data.layer),
			};
		},
	},
};

const SearchMemo = React.memo(Search);

export default function SearchContainer(props) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const setStateAppCallback = useCallback(setStateApp, [setStateApp]);
	const stateAppMemo = useMemo(
		() => ({
			mapboxglAccessToken: stateApp.mapboxglAccessToken,
			user: stateApp.user,
			toggleLayersActivity: stateApp.toggleLayersActivity,
		}),
		[stateApp.mapboxglAccessToken, stateApp.user, stateApp.toggleLayersActivity]
	);

	let location = useLocation();

	return (
		<SearchMemo
			stateApp={stateAppMemo}
			setStateApp={setStateAppCallback}
			isDocument={location.pathname === '/documents'}
		/>
	);
}

function Search({ stateApp, setStateApp, isDocument }) {
	const {
		stateValues: { searchValue },
	} = mapControlsController.useState(['searchValue']);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [value, setValue] = React.useState(null);
	const [searchDropDown, setSearchDropDown] = React.useState(platformDataInitialData[0]);
	const [searchOption, setSearchOption] = React.useState('platform wells');
	const [options, setOptions] = React.useState([]);
	const [searchTop, setSearchTop] = React.useState(5);
	const [maxMinWellsScore] = React.useState([0, 0]);
	const [maxMinOwnersScore] = React.useState([0, 0]);
	const [maxMinOperatosScore] = React.useState([0, 0]);
	const [maxMinLeasesScore] = React.useState([0, 0]);
	const [maxMinContactsScore] = React.useState([0, 0]);
	const [maxMinMapboxSearchScore, setMaxMinMapboxSearchScore] = React.useState([0, 0]);
	const [searchHistoryList, setSearchHistoryList] = React.useState([]);

	const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');
	const { layerStateValues } = layerController.useState(['wellListFromSearch'], 'layerStateValues');
	// loaders
	const [loading, setLoading] = React.useState(false);
	const history = useHistory();
	const classes = useStyles({ mapGridCardActivated: mapControlsStateValues.mapGridCardActivated });

	// queries
	const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(OWNERSLATSLONS);
	const [getOperatorWells, { data: dataOperatorWells }] = useLazyQuery(OPERATORSLATSLONS);
	const [getLeaseWells, { data: dataLeaseWells }] = useLazyQuery(LEASELATSLONS);
	const [getLandGridGeom, { data: dataLandGridGeom }] = useLazyQuery(GET_DB_DATA, { fetchPolicy: 'no-cache' });
	const [getContactsWells, { data: dataContactWells }] = useLazyQuery(CONTACTWELLS);
	const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(USERSEARCHHISTORY);

	//////////// Search History Begin//////////////////

	// Search History Queries and Mutations

	const [addSearchHistory] = useMutation(ADDSEARCHHISTORY);
	const [updateSearchHistory] = useMutation(UPDATESEARCHHISTORY);
	const [removeSearchHistory] = useMutation(REMOVESEARCHHISTORY);

	useEffect(() => {
		if (stateApp && stateApp.user && stateApp.user.mongoId) {
			getSearchHistory({
				variables: {
					userId: stateApp.user.mongoId,
				},
			});
		}
	}, [stateApp.user]);

	useEffect(() => {
		if (!value && searchValue && value !== searchValue) {
			setValue(searchValue);
		}
	}, []);

	useEffect(() => {
		if (searchHistoryData && searchHistoryData.getSearchHistory) {
			let list = [...searchHistoryData.getSearchHistory].sort((a, b) => b.ts - a.ts);

			setSearchHistoryList(list);
		}
	}, [searchHistoryData]);

	useEffect(() => {
		if (searchHistoryList && searchHistoryList.length > 100) {
			///remove last add
			removeSearchHistory({
				variables: {
					searchId: searchHistoryList[100]._id,
				},
				refetchQueries: ['getSearchHistory'],
				awaitRefetchQueries: true,
			});
		}
	}, [searchHistoryList]);

	const [getDbData, { data: esSearchData }] = useLazyQuery(GET_DB_DATA, { fetchPolicy: 'no-cache' });
	//////////// Search History End//////////////////
	const startPaginationAt = 25;

	const callMapboxSearch = React.useMemo(
		() =>
			debounce((request, top, callback) => {
				const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${request.input}.json?access_token=${
					stateApp.mapboxglAccessToken
				}&autocomplete=true&country=us%2Cca&limit=${top > 50 ? 50 : top}`;

				const headers = new Headers();
				headers.append('Content-Type', 'application/json');

				const options = {
					method: 'GET',
					headers,
				};

				fetch(endpoint, options)
					.then(response => response.json())
					.then(response => {
						callback(response);
					})
					.catch(error => {
						console.log(error);
					});
			}, 500),
		[]
	);

	const callESSearch = React.useMemo(
		() =>
			debounce(request => {
				const { esIndex, search, searchFields, filter } = esCallData[searchOption] || { search: () => {} };
				getDbData({
					variables: {
						index: esIndex,
						pagination: {
							first: request.searchTop ? request.searchTop : startPaginationAt,
							keep_alive: '1micros',
						},
						search: {
							query: search(request),
							fields: searchFields,
						},
						...(filter && { filters: !Array.isArray(filter) ? [filter] : filter }),
						sort: [],
					},
				});
			}, 500),
		[searchOption]
	);

	useEffect(() => {
		let newOptions = [];
		if (esSearchData?.getDbData?.hits) {
			const { formatOptions } = esCallData[searchOption];
			newOptions = [
				...esSearchData.getDbData.hits.map(result => {
					return formatOptions(result);
				}),
			];
			setOptions(newOptions);
		}
		setLoading(false);
	}, [esSearchData]);

	useEffect(() => {
		if (!mapControlsStateValues.mapGridCardActivated) {
			if (searchValue === '') {
				setOptions(value ? [value] : []);
				setValue(null);
				if (!stateApp.toggleLayerActivityValue) {
					layerController.updateState({ wellListFromSearch: [] });
					setStateApp(state => ({ ...state, landGridListFromSearch: [] }));
				}

				setLoading(false);
				return undefined;
			}
			if (searchOption === 'location' || searchOption === 'places') {
				callMapboxSearch({ input: searchValue }, searchTop, results => {
					let newOptions = [];
					if (results) {
						let resultsMod = results.features
							? results.features.map(result => {
									return {
										...result,
										Id: result.id,
										Source: searchOption === 'places' ? 'places' : 'mapboxSearch',
										Score: result.relevance ? result.relevance : 0,
										Primary: result.text ? result.text : '',
										Secondary: result.place_name
											? result.place_name.indexOf(result.text + ', ') === 0
												? result.place_name.slice(result.place_name.indexOf(', ') + 2, result.place_name.length)
												: result.place_name
											: '',
									};
								})
							: [];

						newOptions = [...newOptions, ...resultsMod];
						setMaxMinMapboxSearchScore(maxMinScore(resultsMod));
					}

					setOptions(newOptions);
					setLoading(false);
				});
			} else {
				callESSearch({
					input: searchValue,
					searchTop,
				});
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTop, searchValue, callESSearch, callMapboxSearch, searchOption]);
	//// getting wells data from owners ////

	useEffect(() => {
		if (dataOwnerWells && dataOwnerWells.ownerLatsLonsArray) {
			if (dataOwnerWells.ownerLatsLonsArray.length !== 0) {
				if (dataOwnerWells.ownerLatsLonsArray.length === 1) {
					popupController.setState({
						selectedWellId: dataOwnerWells.ownerLatsLonsArray[0].id.toLowerCase(),
						wellSelectedCoordinates: [
							dataOwnerWells.ownerLatsLonsArray[0].longitude,
							dataOwnerWells.ownerLatsLonsArray[0].latitude,
						],
						selectedPlaces: null,
					});
				}
				setStateApp(stateApp => ({
					...stateApp,
					fitBounds: null,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray] });

				layerController.toggleLayersActivity('Search', true);
			} else {
				layerController.toggleLayersActivity('Search', false);
				setStateApp(stateApp => ({
					...stateApp,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [] });
			}
		}
	}, [dataOwnerWells]);

	//// getting wells data from  operators////
	useEffect(() => {
		if (dataOperatorWells && dataOperatorWells.operatorLatsLonsArray) {
			if (dataOperatorWells.operatorLatsLonsArray.length !== 0) {
				if (dataOperatorWells.operatorLatsLonsArray.length === 1) {
					popupController.setState({
						selectedWellId: dataOperatorWells.operatorLatsLonsArray[0].id.toLowerCase(),
						wellSelectedCoordinates: [
							dataOperatorWells.operatorLatsLonsArray[0].longitude,
							dataOperatorWells.operatorLatsLonsArray[0].latitude,
						],
						selectedPlaces: null,
					});
				}
				setStateApp(stateApp => ({
					...stateApp,
					fitBounds: null,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [...dataOperatorWells.operatorLatsLonsArray] });

				layerController.toggleLayersActivity('Search', true);
			} else {
				layerController.toggleLayersActivity('Search', false);
				setStateApp(stateApp => ({
					...stateApp,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [] });
			}
		}
	}, [dataOperatorWells]);

	//// getting wells data from  leases ////
	useEffect(() => {
		if (dataLeaseWells && dataLeaseWells.leaseLatsLonsArray) {
			if (dataLeaseWells.leaseLatsLonsArray.length !== 0) {
				if (dataLeaseWells.leaseLatsLonsArray.length === 1) {
					popupController.setState({
						selectedWellId: dataLeaseWells.leaseLatsLonsArray[0].id.toLowerCase(),
						wellSelectedCoordinates: [
							dataLeaseWells.leaseLatsLonsArray[0].longitude,
							dataLeaseWells.leaseLatsLonsArray[0].latitude,
						],
						selectedPlaces: null,
					});
				}
				setStateApp(stateApp => ({
					...stateApp,
					fitBounds: null,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [...dataLeaseWells.leaseLatsLonsArray] });

				layerController.toggleLayersActivity('Search', true);
			} else {
				layerController.toggleLayersActivity('Search', false);
				setStateApp(stateApp => ({
					...stateApp,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [] });
			}
		}
	}, [dataLeaseWells]);

	//// getting land grid geom ////
	useEffect(() => {
		if (dataLandGridGeom && dataLandGridGeom?.getDbData?.hits) {
			if (dataLandGridGeom?.getDbData?.hits?.length !== 0) {
				setStateApp(stateApp =>
					dataLandGridGeom?.getDbData?.hits?.length === 1
						? {
								...stateApp,
								selectedWell: null,
								fitBounds: true,
								searchLoader: false,
								landGridListFromSearch: [
									...dataLandGridGeom?.getDbData?.hits?.map(hit => ({
										...hit,
										shape: JSON.stringify({ geometry: hit?.geoJSON, properties: {} }),
									})),
								],
							}
						: stateApp
				);
				layerController.toggleLayersActivity('Search', true);
			} else {
				layerController.toggleLayersActivity('Search', false);
				setStateApp(stateApp => ({
					...stateApp,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [] });
			}
		}
	}, [dataLandGridGeom]);

	//// getting wells data from contacts ////
	useEffect(() => {
		if (dataContactWells && dataContactWells.contactWells) {
			if (dataContactWells.contactWells.length !== 0) {
				setStateApp(stateApp =>
					dataContactWells.contactWells.length === 1
						? {
								...stateApp,
								selectedWell: null,
								fitBounds: null,
								searchLoader: false,
							}
						: {
								...stateApp,
								fitBounds: null,
								searchLoader: false,
							}
				);
				layerController.updateState({ wellListFromSearch: [...dataContactWells.contactWells] });
				layerController.toggleLayersActivity('Search', true);
			} else {
				layerController.toggleLayersActivity('Search', false);
				setStateApp(stateApp => ({
					...stateApp,
					searchLoader: false,
				}));
				layerController.updateState({ wellListFromSearch: [] });
			}
		}
	}, [dataContactWells]);

	const handleChange = newValue => {
		if (
			!value ||
			(newValue &&
				(value.Id !== newValue.Id ||
					value.Source !== newValue.Source ||
					value.Primary !== newValue.Primary ||
					value.Secondary !== newValue.Secondary))
		) {
			//// setting search history
			const setSearchHistory = search => {
				if (search.searchId) {
					///update
					updateSearchHistory({
						variables: {
							searchId: search.searchId,
						},
						refetchQueries: ['getSearchHistory'],
						awaitRefetchQueries: true,
					});
					delete newValue.searchId;
				} else {
					///add
					addSearchHistory({
						variables: {
							searchHistory: {
								searchData: search,
								user: stateApp.user.mongoId,
							},
						},
						refetchQueries: ['getSearchHistory'],
						awaitRefetchQueries: true,
					});
				}
			};

			setSearchHistory(newValue);
			setValue(newValue);

			mapControlsController.updateState({
				searchValue: newValue.Primary ? newValue.Primary : newValue.Secondary ? newValue.Secondary : '',
			});

			//// setting map loader
			setStateApp(stateApp => ({ ...stateApp, mapCircularLoaderAct: true, searchLoader: true }));

			if (
				newValue.layer === 'unit' ||
				newValue.layer === 'parcel' ||
				newValue?.shapeJson?.properties?.type === 'agreement'
			) {
				let newPath;
				newPath = `/map/${newValue.layer}s/${newValue._id}`;
				history.location.pathname !== newPath && history.replace(newPath);

				setTimeout(() => {
					setStateApp(stateApp => ({ ...stateApp, mapCircularLoaderAct: false, searchLoader: false }));
				}, 2000);
			}

			//// if well, with lat long
			if (newValue && newValue.Source === wellCogIndexName && newValue.Longitude && newValue.Latitude) {
				popupController.setState({
					selectedWellId: newValue.Id ? newValue.Id.toLowerCase() : null,
					wellSelectedCoordinates: [newValue.Longitude, newValue.Latitude],
					selectedPlaces: null,
				});
				setStateApp(stateApp => ({
					...stateApp,
					fitBounds: null,
				}));
				layerController.updateState({
					wellListFromSearch: [
						{
							id: newValue.Id,
							longitude: newValue.Longitude,
							latitude: newValue.Latitude,
						},
					],
				});
				layerController.toggleLayersActivity('Search', true);
			}

			//// if owner
			if (newValue && newValue.Source === ownerCogIndexName && newValue.Id) {
				getOwnerWells({
					variables: {
						ownerId: newValue.Id,
					},
				});
			}

			//// if operator
			if (newValue && newValue.Source === operatorIndexName && newValue.Operator) {
				getOperatorWells({
					variables: {
						operatorName: newValue.Operator,
					},
				});
			}

			//// if lease
			if (
				newValue &&
				newValue.Source === leaseIndexName &&
				((newValue.Lease && newValue.Lease !== '') || (newValue.LeaseId && newValue.LeaseId !== ''))
			) {
				if (newValue.Lease && newValue.Lease !== '') {
					getLeaseWells({
						variables: {
							fieldName: 'Lease',
							value: newValue.Lease,
						},
					});
				} else {
					getLeaseWells({
						variables: {
							fieldName: 'LeaseId',
							value: newValue.LeaseId,
						},
					});
				}
			}

			//// if land grid
			if (newValue && newValue.Source === landGridIndexName && newValue._id) {
				getLandGridGeom({
					variables: {
						index: 'platformData:landgridgeom',
						filters: [{ field: '_id', value: newValue._id }],
						sort: [],
					},
				});
			}

			// if contact
			if (newValue && newValue.Source === contactIndexName && newValue._id) {
				getContactsWells({
					variables: {
						contactId: newValue._id,
					},
				});

				//when uncommented this takes you from map search bar directly to contact detail card for selected contact
				//const newPath = `/contact/details/${newValue._id}`;
				// history.location.pathname !== newPath && history.replace(newPath);
			}

			//// if mapboxSearch
			if (newValue && newValue.center && newValue.Source === 'mapboxSearch') {
				let minLong, maxLong, minLat, maxLat;
				if (newValue.bbox) {
					[minLong, minLat, maxLong, maxLat] = newValue.bbox;
				}

				popupController.updateState({
					selectedWell: null,
					selectedWellId: null,
					wellSelectedCoordinates: null,
				});

				setStateApp(stateApp => ({
					...stateApp,
					fitBounds: newValue.bbox ? { maxLat, minLat, maxLong, minLong } : null,
				}));
				layerController.updateState({
					wellListFromSearch: [
						{
							id: newValue.Id,
							longitude: newValue.center[0],
							latitude: newValue.center[1],
						},
					],
				});
				layerController.toggleLayersActivity('Search', true);
			}

			if (newValue && newValue.center && newValue.Source === 'places') {
				let minLong, maxLong, minLat, maxLat;
				if (newValue.bbox) {
					[minLong, minLat, maxLong, maxLat] = newValue.bbox;
				}

				popupController.updateState({
					selectedWell: null,
					selectedWellId: null,
					wellSelectedCoordinates: null,
					selectedPlaces: newValue, // Set search places in the mapbox
				});

				setStateApp(stateApp => ({
					...stateApp,
					fitBounds: newValue.bbox ? { maxLat, minLat, maxLong, minLong } : null,
				}));
				layerController.toggleLayersActivity('Search', true);
			}
		}
	};

	const handleSearchPanelChange = value => {
		setSearchDropDown({ ...value });
		// Set either the gridlable or the simple lable
		const selectedSearchOptions = value?.gridLabel?.toLocaleLowerCase() || value.label.toLocaleLowerCase();
		setSearchOption(selectedSearchOptions);
		if (searchOption === 'places' && selectedSearchOptions !== 'places') {
			popupController.reset(); // Reset the state when moving to other Search Item
		}
	};

	//// setting the buttons header /////
	const header = {
		Source: 'header',
		Score: 0,
		Id: '0',
		Primary: '',
		Secondary: '',
	};

	let optionsWithHeader = [header, ...options];
	//// adding loader ////
	if (loading) {
		optionsWithHeader = [header, { ...header, Source: 'loader' }];
	}

	return (
		<div className={classes.root} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
			<SearchByTypeSelectField
				value={searchDropDown}
				handleChange={handleSearchPanelChange}
				color="#ffffff"
				backgroundColor="#1c2233"
			/>
			<Autocomplete
				id="cognitive-search-autocomplete"
				getOptionLabel={(option, value) => {
					// On Places search we need to show address in bar
					if (option?.Source === 'places') {
						return option?.Secondary || option?.Primary || searchValue;
					}
					return option.Primary || searchValue;
				}}
				forcePopupIcon
				filterOptions={x => x}
				options={optionsWithHeader}
				debug
				groupBy={option => {
					if (option?.shapeJson?.properties?.type === 'agreement') {
						return 'Agreements';
					}
					if (option.Source === ownerCogIndexName) {
						return 'Tax Owners';
					}
					if (option.Source === wellCogIndexName) {
						return 'Platform Wells';
					}
					if (option.Source === operatorIndexName) {
						return 'Operators';
					}
					if (option.Source === leaseIndexName) {
						return 'Leases';
					}
					if (option.Source === landGridIndexName) {
						return 'Land Grid';
					}
					if (option.Source === contactIndexName) {
						return 'Contacts';
					}
					if (option.Source === 'mapboxSearch') {
						return 'Locations';
					}
					if (option.Source === 'places') {
						return 'Places';
					}
					if (option.Source === 'mywells_flat') {
						return 'My Wells';
					}
					if (option.layer === 'unit') {
						return 'Units';
					}
					if (option.layer === 'parcel') {
						return 'Tracts';
					}
					if (option.Source === 'loader') {
						return 'loader';
					}
					return 'header';
				}}
				// leftIconButton={<SearchIcon />}
				renderGroup={option => {
					if (option.group === 'loader') {
						return <CircularProgress key="loader" style={{ margin: '10px 0 0 48%' }} size={28} color="secondary" />;
					}

					return option.group === 'header' && !isDocument ? (
						<div></div>
					) : (
						(searchOption === 'all' || searchOption === option.group.toLowerCase()) && !isDocument && (
							<Grid key={option.group} container item>
								<Grid container item xs={12} className={classes.groupsHeaders}>
									<Grid item xs={6}>
										<h3 className={classes.groupsHeadersText}>{option.group}</h3>
									</Grid>
									<Grid item xs={6} style={{ textAlign: 'right' }}>
										{searchTop === 5 ? (
											<Button
												size="small"
												className={classes.groupsButton}
												onClick={() => {
													setSearchTop(200);
												}}
											>
												See All Results
											</Button>
										) : (
											<Button
												size="small"
												className={classes.groupsButton}
												onClick={() => {
													setSearchTop(5);
												}}
											>
												See Less
											</Button>
										)}
									</Grid>
								</Grid>
								<Grid item xs={12}>
									{option.children}
								</Grid>
							</Grid>
						)
					);
				}}
				freeSolo
				// autoComplete
				includeInputInList
				value={value}
				// handle change also acts like onClick here
				onChange={(event, newValue) => {
					if (event.key === 'Enter') {
						handleChange(options[0]);
					} else {
						handleChange(newValue);
					}
				}}
				onInputChange={(event, newInputValue, reason) => {
					if (reason === 'input') {
						mapControlsController.updateState({ searchValue: newInputValue });

						if (newInputValue !== '') {
							//// setting loader
							setLoading(true);
						} else {
							setOptions([]);
							setLoading(false);
						}
					}
				}}
				renderInput={params => (
					<div>
						{isDocument ? (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'transparent',
								}}
							>
								<TextField
									{...params}
									variant="outlined"
									fullWidth
									placeholder={'Search for documents by name'}
									className={classes.textF}
								></TextField>
							</div>
						) : (
							<TextField
								{...params}
								variant="outlined"
								fullWidth
								placeholder="Search by well name, API, owner, operator or a location"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<InputAdornment className={classes.endAdornmentIcon}>
											<div>
												{((searchValue && searchValue !== '') ||
													(layerStateValues.wellListFromSearch && layerStateValues.wellListFromSearch.length > 0)) && (
													<Tooltip title="Clear" placement="top">
														<IconButton
															size="small"
															onClick={() => {
																setValue('');
																mapControlsController.updateState({ searchValue: '' });

																layerController.updateState({ wellListFromSearch: [] });
															}}
														>
															<ClearIcon htmlColor="#fff" />
														</IconButton>
													</Tooltip>
												)}
												<Tooltip title="Search History" placement="top">
													<IconButton
														size="small"
														onClick={event => {
															setAnchorEl(event.currentTarget);
														}}
													>
														<HistoryIcon fontSize="25" htmlColor="#fff" />
													</IconButton>
												</Tooltip>

												<Popover
													onBlur={() => {
														setAnchorEl(null);
													}}
													open={Boolean(anchorEl)}
													anchorEl={anchorEl}
													onClose={() => {
														setAnchorEl(null);
													}}
													anchorOrigin={{
														vertical: 'bottom',
														horizontal: 'right',
													}}
													transformOrigin={{
														vertical: 'top',
														horizontal: 'right',
													}}
													style={{
														width: document.getElementById('searchBarDivParent')
															? document.getElementById('searchBarDivParent').offsetWidth
															: '400px',
													}}
													className={classes.historyPopover}
												>
													{searchHistoryList && searchHistoryList.length > 0 ? (
														searchHistoryList.map((search, i) => {
															let option = search.searchData;
															const parts = parse(option.Primary, []);

															/// THIS IS THEI LIST FOR THE SEARCH HISTORY
															return (
																<div>
																	<Box
																		p={1}
																		key={i}
																		className={classes.historyRow}
																		onClick={() => {
																			setSearchTop(5);
																			setSearchOption(
																				option.Source === ownerCogIndexName
																					? 'tax owners'
																					: option.Source === wellCogIndexName
																						? 'platform wells'
																						: option.Source === operatorIndexName
																							? 'operators'
																							: option.Source === leaseIndexName
																								? 'leases'
																								: option.Source === contactIndexName
																									? 'contacts'
																									: option.group === 'mapboxSearch'
																										? 'locations'
																										: 'all'
																			);

																			mapControlsController.updateState({
																				searchValue: option.Primary ? option.Primary : option.Secondary,
																			});

																			handleChange({
																				...option,
																				searchId: search._id,
																			});
																		}}
																	>
																		<Grid container spacing={0}>
																			<Grid container item xs={9} alignItems="center">
																				<Grid item>
																					{option.Source === ownerCogIndexName && (
																						<PersonIcon className={classes.icon} />
																					)}
																					{option.Source === contactIndexName && (
																						//will need to change this to something different
																						<PersonIcon className={classes.icon} />
																					)}
																					{option.Source === operatorIndexName && (
																						<OperatorIcon className={classes.icon} color={'#757575'} />
																					)}
																					{option.layer === 'unit' && (
																						<UnitIcon className={classes.icon} color={'#757575'} />
																					)}
																					{option.layer === 'parcel' && (
																						<TractIcon className={classes.icon} color={'#757575'} />
																					)}
																					{option?.shapeJson?.properties?.type === 'agreement' && (
																						<FolderIcon className={classes.icon} color={'#757575'} />
																					)}
																					{option.Source === wellCogIndexName && (
																						<WellIcon className={classes.icon} color={'#757575'} opacity="1.0" small />
																					)}
																					{option.Source === leaseIndexName && (
																						<LeaseIcon className={classes.icon} color={'#757575'} />
																					)}
																					{(option.Source === 'mapboxSearch' || option.Source === 'places') && (
																						<LocationOnIcon className={classes.icon} />
																					)}
																				</Grid>
																				<Grid item xs>
																					{parts.map((part, index) => (
																						<span
																							key={index}
																							style={{
																								fontWeight: part.highlight ? 700 : 400,
																							}}
																						>
																							{part.text}
																						</span>
																					))}

																					{option && option.Secondary && (
																						<Typography variant="body2" color="textSecondary">
																							{option.Secondary}
																						</Typography>
																					)}
																				</Grid>
																			</Grid>
																			<Grid container item xs={3} alignItems="center">
																				<Grid item>
																					<Typography variant="body2" style={{ color: 'rgb(80, 187, 223)' }}>
																						{new Intl.DateTimeFormat('en-US', {
																							year: '2-digit',
																							month: '2-digit',
																							day: '2-digit',
																							hour: '2-digit',
																							minute: '2-digit',
																						}).format(search.ts)}
																					</Typography>
																				</Grid>
																			</Grid>
																		</Grid>
																	</Box>
																</div>
															);
														})
													) : (
														<Box p={1}>
															<Typography>There is no history yet.</Typography>
														</Box>
													)}
												</Popover>
											</div>
										</InputAdornment>
									),
								}}
								className={classes.textF}
							/>
						)}
					</div>
				)}
				renderOption={(option, index) => {
					if (option.Source === 'header' || option.group === 'loader') {
						return null;
					}
					const parts = parse(option.Primary, []);

					return (
						<Grid container spacing={0} id={'cognitive-search-options-' + index}>
							<Grid container item xs={11} alignItems="center">
								<Grid item>
									{option.Source === ownerCogIndexName && <PersonIcon className={classes.icon} />}
									{option.Source === operatorIndexName && <OperatorIcon className={classes.icon} color={'#757575'} />}
									{option.layer === 'unit' && option?.shapeJson?.properties?.type !== 'agreement' && (
										<UnitIcon className={classes.icon} color={'#757575'} />
									)}
									{option.layer === 'parcel' && <TractIcon className={classes.icon} color={'#757575'} />}
									{option?.shapeJson?.properties?.type === 'agreement' && (
										<FolderIcon className={classes.icon} color={'#757575'} />
									)}
									{option.Source === wellCogIndexName && (
										<WellIcon className={classes.icon} color={'#757575'} opacity="1.0" small />
									)}
									{option.Source === leaseIndexName && (
										<div>
											<LeaseGrayIcon className={classes.icon} />
										</div>
									)}
									{option.Source === contactIndexName && (
										//will need to change this to something different
										<PersonIcon className={classes.icon} color={'#757575'} />
									)}
									{(option.Source === 'mapboxSearch' || option.Source === 'places') && (
										<LocationOnIcon className={classes.icon} />
									)}
								</Grid>
								<Grid item xs>
									{parts.map((part, index) => (
										<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
											{part.text}
										</span>
									))}

									{option && option.Secondary && (
										<Typography variant="body2" color="textSecondary">
											{option.Secondary}
										</Typography>
									)}
								</Grid>
							</Grid>
							<Grid container item xs={1} alignItems="center">
								<Grid item style={{ position: 'relative' }}>
									<div
										className={classes.score}
										style={{
											zIndex: '1300',
											backgroundColor: '#12ABE0',
										}}
									/>
									<div
										className={classes.score}
										style={{
											zIndex: '1301',
											backgroundImage: 'repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)',
											opacity: calcScoreOpacity(
												option.Source === ownerCogIndexName
													? maxMinOwnersScore
													: option.Source === wellCogIndexName
														? maxMinWellsScore
														: option.Source === operatorIndexName
															? maxMinOperatosScore
															: option.Source === leaseIndexName
																? maxMinLeasesScore
																: option.Source === contactIndexName
																	? maxMinContactsScore
																	: maxMinMapboxSearchScore,
												option.Score
											).toString(),
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
					);
				}}
			/>
		</div>
	);
}
