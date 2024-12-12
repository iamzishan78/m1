import React, { useState, useEffect, useRef, useCallback } from 'react';

import { makeStyles, withStyles } from '@material-ui/styles';
import { Tabs, Tab } from '@material-ui/core';

// Components
import RevenueSection from './RevenueSection';
import AdjustmentSection from './AdjustmentSection';
import ProductsSection from './Products';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
		backgroundColor: '#f3f3f3',
		width: '100%',
	},
	navSection: {
		minHeight: '52px',
		padding: '10px 20px',
		backgroundColor: '#fff',
	},
	detailHeader: {
		backgroundColor: '#fff',
		padding: '20px',
	},
	title: {
		display: 'flex',
	},
	titleText: {
		margin: '2px 0px 0px 5px',
	},
	icon: {
		height: '65px',
		width: '65px',
		backgroundColor: 'lightgrey',
	},
	tabsHeader: {},
	tabsSection: {
		marginTop: '10px',
		backgroundColor: '#fff',
		width: '100%',
	},
	revenueSection: {
		padding: '20px 38px',
		backgroundColor: '#fff',
		marginBottom: '20px',
		height: 'auto',
	},
	adjustmentSection: {
		padding: '20px 38px',
		backgroundColor: '#fff',
		marginBottom: '20px',
		height: 'auto',
	},
	productSection: {
		padding: '20px 38px',
		backgroundColor: '#fff',
		marginBottom: '20px',
	},
	propertiesSection: {
		padding: '20px 38px',
		backgroundColor: '#fff',
		height: '400px',
	},
	sectionTitle: {
		textTransform: 'uppercase',
		fontWeight: theme.typography.fontWeightBold,
	},
}));

const StyledTabs = withStyles({
	root: {
		borderBottom: '1px solid #e8e8e8',
		textTransform: 'capitalize',
		padding: '0px 26px',
	},
	indicator: {
		backgroundColor: '#12abe0',
		height: '4px',
	},
})(Tabs);

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightBold,
		marginRight: theme.spacing(4),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: 'black',
			opacity: 1,
		},
		'&$selected': {
			color: 'black',
		},
		'&:focus': {
			color: 'black',
		},
	},
	selected: {},
}))(props => <Tab disableRipple {...props} />);

export default function DetailTabsSection({ monthsInterval, portfolioSummary, ...rest }) {
	const classes = useStyles();
	const [tab, setTab] = useState(0);
	const [adjustmentTotals, setAdjustmentTotals] = useState([]);
	const [netRevenueTotals, setNetRevenueTotals] = useState([]);

	const sectionsRef = useRef([]); // References for all tab sections
	const observer = useRef(null); // Intersection Observer reference

	useEffect(() => {
		// Set up Intersection Observer
		observer.current = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// Get the index of the currently visible section
						const index = sectionsRef.current.indexOf(entry.target);
						setTab(index);
					}
				});
			},
			{
				root: null, // Defaults to the viewport
				threshold: 0.5, // At least 50% of the section must be visible
			}
		);

		// Observe all sections
		sectionsRef.current.forEach(section => {
			if (section) observer.current.observe(section);
		});

		// Cleanup observer on unmount
		return () => {
			if (observer.current) observer.current.disconnect();
		};
	}, [rest.loading]);

	const adjustmentsRef = useCallback(obj => {
		if (obj != null) {
			setAdjustmentTotals(obj);
		}
	}, []);

	const netRevenueRef = useCallback(obj => {
		if (obj != null) {
			setNetRevenueTotals(obj);
		}
	}, []);

	const handleTabChange = (event, newTab) => {
		sectionsRef.current[newTab]?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	return (
		<div className={classes.tabsSection}>
			<div className={classes.tabsHeader}>
				<StyledTabs value={tab} onChange={handleTabChange} aria-label="ant example">
					<StyledTab label="Revenue" />
					<StyledTab label="Adjustments" />
					<StyledTab label="Products" />
					{/* <StyledTab label="Properties" /> */}
				</StyledTabs>
			</div>
			<div
				style={{
					overflow: 'overlay',
					backgroundColor: '#f3f3f3',
					maxHeight: rest.isRevenueTab ? 'calc(100vh - 305px)' : 'calc(100vh - 270px)',
				}}
			>
				<div className={classes.revenueSection} ref={el => (sectionsRef.current[0] = el)}>
					<RevenueSection
						monthsInterval={monthsInterval}
						portfolioSummary={portfolioSummary}
						adjustmentsRef={adjustmentsRef}
						netRevenueRef={netRevenueRef}
						loading={rest.loading}
					/>
				</div>
				<div className={classes.adjustmentSection} ref={el => (sectionsRef.current[1] = el)}>
					<AdjustmentSection
						monthsInterval={monthsInterval}
						portfolioSummary={portfolioSummary}
						adjustmentTotals={adjustmentTotals}
						loading={rest.loading}
					/>
				</div>
				<div className={classes.productSection} ref={el => (sectionsRef.current[2] = el)}>
					<ProductsSection
						monthsInterval={monthsInterval}
						portfolioSummary={portfolioSummary}
						netRevenueTotals={netRevenueTotals}
						loading={rest.loading}
					/>
				</div>
				{/* temp hide until we get properties section designed --kc 20220307 */}
				{/* <div className={classes.propertiesSection} ref={tab === 3 ? selectedTabRef : null}>
          <Typography varient="h6" className={classes.sectionTitle}>
            Properties
          </Typography>
        </div> */}
			</div>
		</div>
	);
}
