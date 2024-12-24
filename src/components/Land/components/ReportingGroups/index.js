import { makeStyles } from '@material-ui/styles';
import React, { useState, useContext, useEffect } from 'react';

// actions
import { useDispatch } from 'react-redux';

import ReportGroupHeader from 'components/Shared/ReportGroupHeader';
import AgreementsTable from 'components/Table/Agreement/AgreementsTable';

import { setMapGridCardState } from 'actions';
import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '65px',
		// marginLeft: '-10px',
	},
	propertyTableContainer: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		// paddingLeft: "38px",
		// paddingRight: "38px",
		// marginLeft: '-10px',
		marginTop: theme.spacing(2),
	},
}));

export default function ReportingGroups() {
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const dispatch = useDispatch();
	// redux

	const [filterToggle, setFilterToggle] = React.useState(false);
	// props to pass in table
	const esIndex = 'shapes_flat';
	const [esFilters, setESFilters] = useState([]);

	// waypointKey should any key of Table Header which do not have customRender in schema file
	const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 166px)' };

	useEffect(() => {
		dispatch(setMapGridCardState({ searchInputValue: '' }));
	}, []);

	return (
		<div className={classes.root}>
			<ReportGroupHeader
				type={'Agreements'}
				esFilters={esFilters}
				setESFilters={setESFilters}
				setFilterToggle={setFilterToggle}
			/>

			<div
				// className={classes.propertyTableContainer}
				style={{
					marginTop: '25px',
					// marginLeft: "-10px"
				}}
			>
				<AgreementsTable
					esIndex={esIndex}
					isCheckboxSticky={true}
					header="Agreements"
					esFilters={esFilters}
					filterToggle={filterToggle}
					targetLabel="agreement"
					parent="AgreementsTable"
					setESFilters={setESFilters}
					landSearchQuery={stateApp.landSearchQuery}
					loadMore={loadMore}
				/>
			</div>
		</div>
	);
}
