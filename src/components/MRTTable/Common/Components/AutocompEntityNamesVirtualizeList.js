import React from 'react';
import { useHistory } from 'react-router-dom';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { IconButton, Typography, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

import ContactCardIcon from 'components/Shared/svgIcons/contact_card';
import ContactCardDisabledIcon from 'components/Shared/svgIcons/contact_card_disabled';
import joinAddress from 'components/Shared/valueformatters/join-address.js';

import { AppContext } from 'AppContext';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

const LISTBOX_PADDING = 8; // px

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
	const outerProps = React.useContext(OuterElementContext);
	return <div ref={ref} {...props} {...outerProps} />;
});

const ListboxComponent = React.forwardRef((props, ref) => {
	const { children, isItemLoaded, loadMoreItems, itemCount, ...other } = props;

	const itemData = React.Children.toArray(children);
	const itemSize = 65;

	const getChildSize = () => {
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

const useStyles = makeStyles({
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
		addNewOnClick,
		mongoEntitiesArray,
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

	const loadMoreItems = async startIndex => {
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
			debounce((event, value) => {
				setNameAutInputValue(value);
			}, 500),
		[]
	);

	const getParams = props.withContactCard
		? {
				endAdornment: (
					<React.Fragment>
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
			}
		: {
				...props.InputProps,
				endAdornment: <>{isNextPageLoading ? <CircularProgress color="inherit" size={20} /> : null}</>,
			};

	const renderOptionComp = option => {
		return (
			<Grid container item xs={12} alignItems="center">
				<Grid item xs>
					<span style={{ fontWeight: 400 }}>{option.name}</span>
					<Typography variant="body2" color="textSecondary">
						{joinAddress(option)}
					</Typography>
				</Grid>
			</Grid>
		);
	};

	return (
		<>
			<CustomAutoComplete
				disableListWrap
				classes={classes}
				ListboxProps={ListboxProps}
				onInputChange={onInputChange}
				ListboxComponent={ListboxComponent}
				id="autocompEntityNamesVirtualizeList"
				fieldConfig={{
					margin,
					variant,
					renderOptionComp,
					allowNewOptions: props?.addNew,
					textFiledInputProps: getParams,
				}}
				fieldAttributes={{
					size,
					label,
					margin,
					placeholder,
					value: nameAutValue,
					defaultValue: nameAutValue,
					defaultOptions: mongoEntitiesArray,
				}}
				fieldEvents={{
					onChange: newValue => {
						if (newValue) {
							if (newValue?._id) {
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
						} else setNameAutValue(null);
					},
				}}
				{...other}
			/>
		</>
	);
}

OuterElementType.displayName = 'OuterElementType';
ListboxComponent.displayName = 'ListboxComponent';

ListboxComponent.propTypes = {
	children: PropTypes.node,
	isItemLoaded: PropTypes.func.isRequired,
	loadMoreItems: PropTypes.func.isRequired,
	itemCount: PropTypes.number.isRequired,
};
AutocompEntityNamesVirtualizeList.propTypes = {
	addNewOnClick: PropTypes.func,
	mongoEntitiesArray: PropTypes.arrayOf(PropTypes.object).isRequired,
	nameAutValue: PropTypes.object,
	setNameAutValue: PropTypes.func.isRequired,
	nameAutInputValue: PropTypes.string,
	setNameAutInputValue: PropTypes.func.isRequired,
	variant: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	margin: PropTypes.string,
	size: PropTypes.string,
	hasNextPage: PropTypes.bool.isRequired,
	isNextPageLoading: PropTypes.bool.isRequired,
	loadNextPage: PropTypes.func.isRequired,
	withContactCard: PropTypes.bool,
	addNew: PropTypes.bool,
	InputProps: PropTypes.object,
};
