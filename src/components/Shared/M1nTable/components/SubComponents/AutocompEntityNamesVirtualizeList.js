import { IconButton, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import ContactCardIcon from 'components/Shared/svgIcons/contact_card';
import ContactCardDisabledIcon from 'components/Shared/svgIcons/contact_card_disabled';

// import value formatters
import joinAddress from 'components/Shared/valueformatters/join-address.js';

import { AppContext } from 'AppContext';

import { fuzzySearch } from '../MUIDataTable/utils';

const LISTBOX_PADDING = 8; // px

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
	const outerProps = React.useContext(OuterElementContext);
	return <div ref={ref} {...props} {...outerProps} />;
});

// Adapter for react-window
const ListboxComponent = React.forwardRef((props, ref) => {
	const { children, isItemLoaded, loadMoreItems, itemCount, isNextPageLoading, nameAutInputValue, ...other } = props;

	const itemData = React.Children.toArray(children);
	// const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
	// const itemCount = /*hasNextPage ? itemData.length + 1 : */itemData.length;
	// const itemSize = smUp ? 36 : 48;
	const itemSize = 65;

	const getChildSize = child => {
		// if (React.isValidElement(child) && child.type === ListSubheader) {
		//   return 48;
		// }

		return itemSize;
	};

	const getHeight = () => {
		if (itemCount > 4) {
			return 4 * itemSize;
		}
		return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
	};

	const renderRow = props => {
		const { data, index, style } = props;

		if (!isItemLoaded(index)) {
			// TODO - improve loading state
			return null;
			// return <li style={style}>Loading...</li>;
		}

		if (!data[index]) {
			return null;
		}

		return React.cloneElement(data[index], {
			style: {
				...style,
				top: style.top + LISTBOX_PADDING,
			},
		});
	};

	return (
		<div ref={ref}>
			<OuterElementContext.Provider value={other}>
				<InfiniteLoader
					isItemLoaded={isItemLoaded}
					itemCount={itemCount}
					loadMoreItems={loadMoreItems}
					minimumBatchSize={25}
				>
					{({ onItemsRendered, ref: refList }) => (
						<VariableSizeList
							ref={refList}
							itemData={itemData}
							height={getHeight() + 2 * LISTBOX_PADDING}
							width="100%"
							outerElementType={OuterElementType}
							innerElementType="ul"
							itemSize={() => itemSize}
							overscanCount={5}
							itemCount={itemCount}
							onItemsRendered={onItemsRendered}
						>
							{renderRow}
						</VariableSizeList>
					)}
				</InfiniteLoader>
			</OuterElementContext.Provider>
		</div>
	);
});

ListboxComponent.propTypes = {
	children: PropTypes.node,
};

const useStyles = makeStyles({
	inputRoot: props =>
		props.darkCard
			? {
					backgroundColor: '#273551',
					color: '#ffffff',
					'& .MuiSvgIcon-root': {
						fill: '#ffffff',
					},
				}
			: {
					backgroundColor: '#ffffff',
					color: 'grey',
					'& .MuiSvgIcon-root': {
						fill: 'grey',
					},
				},
	inputRoot: props =>
		props.withContactCard && {
			'& .MuiAutocomplete-endAdornment': {
				right: '60px !important',
				'& .MuiAutocomplete-clearIndicator': {
					// display: "none"
				},
				'& .MuiAutocomplete-popupIndicator': {
					display: 'none',
				},
			},
		},
	listbox: {
		boxSizing: 'border-box',
		'& ul': {
			padding: 0,
			margin: 0,
		},
	},
});

const paramUseStyles = makeStyles({
	contactCardIcon: {
		position: 'absolute',
		right: '12px !important',
		marginTop: '4px !important',
	},
	adornmentAutocomplete: {
		'& .MuiAutocomplete-endAdornment': {
			right: '60px !important',
			'& .MuiAutocomplete-clearIndicator': {
				// display: "none"
			},
			'& .MuiAutocomplete-popupIndicator': {
				display: 'none',
			},
		},
	},
});

export default function AutocompEntityNamesVirtualizeList(props) {
	const {
		addNew,
		addNewOnClick,
		mongoEntitiesArray,
		setMongoEntitiesArray,
		nameAutValue,
		setNameAutValue,
		nameAutInputValue,
		setNameAutInputValue,
		variant = 'standard',
		label = '',
		placeholder = '',
		margin = 'dense',
		size = 'small',
		hasNextPage,
		isNextPageLoading,
		loadNextPage,
		...other
	} = props;

	const classes = useStyles(props);
	const paramClasses = paramUseStyles();
	let history = useHistory();

	const [, setStateApp] = React.useContext(AppContext);

	const isItemLoaded = index => {
		if (!hasNextPage) {
			return true;
		}

		return !!mongoEntitiesArray[index];
	};

	const loadMoreItems = async (startIndex, stopIndex) => {
		if (isNextPageLoading || !hasNextPage) {
			return () => {};
		} else {
			return loadNextPage({
				variables: {
					pagination: {
						after: mongoEntitiesArray[startIndex - 1]?._id,
					},
					search: nameAutInputValue,
				},
			});
		}
	};

	const itemCount = mongoEntitiesArray.length + 1;

	const ListboxProps = {
		isItemLoaded,
		loadMoreItems,
		itemCount,
		isNextPageLoading,
		nameAutInputValue,
	};

	const onInputChange = React.useMemo(
		() =>
			debounce((event, value, reason) => {
				setNameAutInputValue(value);
			}, 500),
		[]
	);

	const getParams = params => {
		return props.withContactCard
			? {
					InputLabelProps: {
						...params.InputLabelProps,
						shrink: true,
					},
					InputProps: {
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{params.InputProps.endAdornment}
								<IconButton
									style={{ padding: 0 }}
									size={'medium'}
									color={nameAutValue?._id ? 'primary' : 'secondary'}
									className={paramClasses.contactCardIcon}
									onClick={e => {
										if (nameAutValue?._id) {
											e.stopPropagation();
											history.push(`/contact/details/${nameAutValue._id}`);
											setStateApp(stateApp => ({
												...stateApp,
												selectedContact: nameAutValue._id,
											}));
										}
									}}
									aria-label="show contact"
								>
									{nameAutValue?._id ? <ContactCardIcon /> : <ContactCardDisabledIcon />}
								</IconButton>
							</React.Fragment>
						),
					},
				}
			: {
					InputProps: {
						...params.InputProps,
						...props.InputProps,
						endAdornment: (
							<>
								{isNextPageLoading ? <CircularProgress color="inherit" size={20} /> : null}
								{params.InputProps.endAdornment}
							</>
						),
					},
				};
	};
	return (
		<Autocomplete
			id="autocompEntityNamesVirtualizeList"
			defaultValue={nameAutValue}
			value={nameAutValue}
			disableListWrap
			classes={classes}
			// className={props.withContactCard ? paramUseStyles.adornmentAutocomplete : ""}
			ListboxComponent={ListboxComponent}
			ListboxProps={ListboxProps}
			options={mongoEntitiesArray}
			getOptionLabel={option => {
				// Value selected with enter, right from the input
				if (props.addNew && typeof option === 'string') {
					return option;
				}
				// Add "xxx" option created dynamically
				if (props.addNew && option.inputValue) {
					return option.name;
				}

				if (option?.name) {
					return option.name;
				} else {
					return '';
				}
			}}
			getOptionSelected={(option, value) => {
				return option?._id === value?._id;
			}}
			renderOption={option => {
				if (option._id === 'newEntity') {
					return <Typography style={{ color: 'midnightblue' }}>Add '{option.name}'</Typography>;
				}

				return (
					<Grid container spacing={0}>
						<Grid container item xs={12} alignItems="center">
							<Grid item xs>
								<span style={{ fontWeight: 400 }}>{option.name}</span>
								<Typography variant="body2" color="textSecondary">
									{joinAddress(option)}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				);
			}}
			onInputChange={onInputChange}
			filterOptions={(options, params) => {
				if (props.addNew) {
					const filtered = fuzzySearch(options, params.inputValue);

					// Suggest the creation of a new value
					if (params.inputValue !== '') {
						filtered.unshift({
							name: params.inputValue,
							_id: 'newEntity',
						});
					}
					return filtered;
				} else {
					return options;
				}
			}}
			onChange={(event, newValue) => {
				if (newValue && newValue._id) {
					if (newValue._id !== 'newEntity') {
						setNameAutValue(newValue);
					} else {
						if (addNewOnClick) {
							addNewOnClick(newValue.name);
						} else {
							setNameAutValue({
								_id: 'newEntity',
								name: newValue.name,
							});
						}
					}
				} else {
					setNameAutValue(null);
				}
			}}
			renderInput={params => (
				<TextField
					margin={margin}
					{...params}
					label={label}
					placeholder={placeholder}
					variant={variant}
					{...getParams(params)}
					size={size}
					// placeholder="E.g. Jacob"
				/>
			)}
			{...other}
		/>
	);
}
