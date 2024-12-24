// context

import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import debounce from 'lodash/debounce';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { setMapGridCardState } from '../../../actions';
import { AppContext } from '../../../AppContext';
import { MapGridContext } from '../../../components/MapGridCard/MapGridContext.js';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		'& .MuiInput-root': {
			height: '41px',
			paddingRight: '8px',
			backgroundColor: 'white',
		},
		'& > div': {
			width: '350px',
		},
	},
	inputAdornment: {
		padding: '0 8px',
		cursor: 'context-menu',
		height: '100%',
	},
}));

function MapGridCardSearch(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { searchInputValue } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);

	// contexts
	const [stateApp] = useContext(AppContext);
	const [, setStateGrid] = useContext(MapGridContext);

	// function states
	const [searchTop] = React.useState(100);

	const setSearchInputValue = React.useMemo(
		() =>
			debounce((request, top, callback) => {
				dispatch(
					setMapGridCardState({
						searchloading: true,
						searchInputValue: `${request}`,
					})
				);
				setStateGrid(state => ({
					...state,
					gridSearchTarget: `${request}`,
				}));
			}, 500),
		[]
	);

	const callMapboxSearch = React.useMemo(
		() =>
			debounce((request, callback) => {
				const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${request.input}.json?access_token=${
					stateApp.mapboxglAccessToken
				}&autocomplete=true&country=us%2Cca&limit=${searchTop > 50 ? 50 : searchTop}`;

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

	useEffect(() => {
		if (props.searchOption === 'location') {
			callMapboxSearch({ input: searchInputValue }, results => {
				let newOptions = [];
				if (results && results.features) {
					newOptions = [
						...results.features.map(result => {
							return {
								...result,
								Id: result.id,
								Primary: result.text ? result.text : '',
								Secondary: result.place_name
									? result.place_name.indexOf(result.text + ', ') === 0
										? result.place_name.slice(result.place_name.indexOf(', ') + 2, result.place_name.length)
										: result.place_name
									: '',
							};
						}),
					];
				}
				dispatch(
					setMapGridCardState({
						searchResultData: [...newOptions],
						searchloading: false,
					})
				);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchInputValue, callMapboxSearch, props.searchOption]);

	return (
		<form
			className={`cancelDraggableEffect ${classes.root}`}
			noValidate
			autoComplete="off"
			onSubmit={e => {
				e.preventDefault();
			}}
		>
			<TextField
				id="mapGridCardSearch-basic"
				type="search"
				placeholder={`Search across ${props.searchOption} datasets`}
				InputProps={{
					disableUnderline: true,
					startAdornment: (
						<InputAdornment
							className={classes.inputAdornment}
							position="start"
							onClick={e => {
								e.stopPropagation();
								props.ativateSearchPanel();
							}}
						>
							<SearchIcon htmlColor="#757575" />
						</InputAdornment>
					),
				}}
				onClick={props.ativateSearchPanel}
				// value={searchInputValue}
				defaultValue={searchInputValue}
				onChange={event => setSearchInputValue(event.target.value)}
			/>
		</form>
	);
}

function areEqual(prevProps, nextProps) {
	return Object.is(prevProps.searchOption, nextProps.searchOption);
}

export default React.memo(MapGridCardSearch, areEqual);
