import React, { useEffect, useState, memo, useMemo } from 'react';

import {
	TextField,
	InputAdornment,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Search as SearchIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';

import PropTypes from 'prop-types';

import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
import LeftDialog from 'components/Shared/LeftDialog';

import { globalStateController } from 'hookstate/globalStateController';

import ViewItem from './components/ViewItem';

const useStyles = makeStyles(() => ({
	container: {
		padding: '0 !important',
		display: 'flex',
		flexFlow: 'column',
		'& .MuiPaper-elevation1': {
			boxShadow: 'none !important',
		},
	},
	searchField: {
		margin: '0 !important',
		padding: '10px !important',
		width: '100% !important',
	},
	selectedType: {
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	flexAuto: {
		flex: '0 1 auto',
	},
	flexAutoOverflow: {
		flex: '1 1 auto',
		overflow: 'auto',
	},
	marginTop10: {
		marginTop: 10,
	},
	marginTop20: {
		marginTop: 20,
	},
	marginLeft13: {
		marginLeft: 13,
	},
	accordionMargin0: {
		margin: 0,
	},
	summary: {
		backgroundColor: '#F2F2F2',
		height: '50px !important',
		minHeight: '40px !important',
	},
	details: {
		display: 'block',
		'& div': {
			padding: '5px !important',
		},
	},
}));

const viewCategories = [
	{
		label: 'All Views',
		value: 'views',
	},
	{
		label: 'Favorites',
		value: 'favorites',
	},
];

function ViewOptions({ moduleName, buttonRef }) {
	const classes = useStyles();

	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const ViewController = viewStateController(moduleName);
	const { stateValues: viewStateValues } = ViewController.useState([
		'isTable',
		'allViews',
		'isViewOpen',
		'fetchViewSettings',
	]);
	const { allViews, isViewOpen, fetchViewSettings } = viewStateValues;

	const [selectedTab, setSelectedTab] = useState('views');
	const [filterViews, setfilterViews] = useState(allViews);
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (selectedTab === 'views') {
			setfilterViews(allViews);
		} else if (selectedTab === 'favorites') {
			const favViews = allViews.filter(view => view.favouriteBy?.includes(getUser?._id));
			setfilterViews(favViews);
		} else {
			setfilterViews([]);
		}
	}, [selectedTab, viewStateValues?.allViews]);

	useEffect(() => {
		if (allViews) {
			if (search) {
				setfilterViews(allViews.filter(view => view?.name?.toLowerCase().includes(search.toLowerCase())));
			} else {
				setfilterViews(allViews);
			}
		}
	}, [search]);

	const viewCss = useMemo(() => {
		let top,
			left = '0px';

		if (buttonRef?.current) {
			const rect = buttonRef?.current.getBoundingClientRect();
			top = `${rect.bottom + window.scrollY}px`;
			left = `${rect.left + window.scrollX}px`;
		}

		return {
			top,
			left,
			maxHeight: '40%',
		};
	}, [buttonRef?.current]);

	return (
		<>
			{isViewOpen && (
				<LeftDialog
					open
					width="325px"
					useLeftKey={true}
					maxHeight={viewCss.maxHeight}
					top={viewCss.top}
					left={viewCss.left}
					handleClickDialogClose={() => ViewController.updateState({ isViewOpen: false, fetchViewSettings: false })}
				>
					<div className={classes.container}>
						<div className={classes.flexAuto}>
							<TextField
								value={search}
								onChange={e => {
									setSearch(e.target.value);
								}}
								className={classes.searchField}
								margin="dense"
								variant="outlined"
								placeholder="Search views"
								InputProps={{
									startAdornment: (
										<InputAdornment>
											<IconButton size="small">
												<SearchIcon htmlColor="#fff" />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<div className={classes.marginTop10}>
								{viewCategories.map(option => (
									<div
										key={option.value}
										className={`${classes.marginLeft13} ${
											selectedTab === option.value ? classes.selectedType : classes.unSelectedType
										}`}
										onClick={() => setSelectedTab(option.value)}
									>
										{option.label}
									</div>
								))}
							</div>

							<Accordion defaultExpanded className={classes.marginTop20}>
								<AccordionSummary
									expandIcon={<KeyboardArrowDownIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
									className={classes.summary}
								>
									Standard
								</AccordionSummary>
								<AccordionDetails className={classes.details}>
									{filterViews?.map(
										view => view.type === 'Default' && <ViewItem key={view._id} view={view} moduleName={moduleName} />
									)}
								</AccordionDetails>
							</Accordion>
						</div>

						<div className={classes.flexAutoOverflow}>
							<Accordion defaultExpanded className={classes.accordionMargin0}>
								<AccordionSummary
									expandIcon={<KeyboardArrowDownIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
									className={classes.summary}
								>
									Custom
								</AccordionSummary>
								<AccordionDetails className={classes.details}>
									{fetchViewSettings && <ViewItem moduleName={moduleName} />}
									{filterViews?.map(
										view => view.type === 'Custom' && <ViewItem key={view._id} view={view} moduleName={moduleName} />
									)}
								</AccordionDetails>
							</Accordion>
						</div>
					</div>
				</LeftDialog>
			)}
		</>
	);
}

ViewOptions.propTypes = {
	moduleName: PropTypes.string.isRequired,
	buttonRef: PropTypes.shape({
		current: PropTypes.instanceOf(Element),
	}),
};

export default memo(ViewOptions);
