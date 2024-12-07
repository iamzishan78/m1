import React, { useState, useEffect, useContext } from 'react';
import { FormControl, Grid, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { AppContext } from 'AppContext';

import WellMaster from './WellMaster';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';
import { setStateIfDeepEqual } from 'components/Shared/functions';
import AutoCompleteTypeComponent from 'components/Shared/Forms/Fields/AutoCompleteType';

const useStyles = makeStyles(theme => ({
	formControl: {
		width: '100%',
	},
	select: {
		height: 40,
	},
	actionsGrid: {
		width: '100%',
	},
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginBottom: 30,

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
		},
	},
}));

export default function ExhibitATabPanel() {
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 144px)' }; // set table height for well master
	const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);

	const [externalFilters, setExtFilters] = useState({
		internalCompany: 'All',
		wellClassification: 'All',
		payStatus: 'All',
		reportingGroup: 'All',
	});
	const [esFilters, ESFilters] = useState([]);

	useEffect(() => {
		const newESFilters = [];

		// Add available values to filters
		['internalCompany', 'wellClassification', 'payStatus', 'reportingGroup'].map(field => {
			if (externalFilters[field] !== 'All')
				newESFilters.push({
					field: `${field}.keyword`,
					value: externalFilters[field],
				});
		});

		ESFilters(newESFilters);
	}, [externalFilters]);

	const setESFilters = newState => {
		setStateIfDeepEqual(ESFilters, newState);
	};

	const handleFilterChange = (field, newValue) => {
		setExtFilters({ ...externalFilters, [field]: newValue || 'All' });
	};

	return (
		<>
			{/* <div className={classes.actionBar}>
        <Grid
          container
          direction="row"
          display="flex"
          alignItems="center"
          spacing={2}
          style={{ padding: "0px 36px" }}
        >
          <Grid item xs={12} md={2}>
            <AutoCompleteTypeComponent
              fullWidth
              value={externalFilters.internalCompany}
              shapeType="Agreement"
              typeKey={"internalCompany"}
              variant="outlined"
              createable={false}
              onChange={(e, newValue) =>
                handleFilterChange("internalCompany", newValue?.name)
              }
              autoFocus={false}
              id={`field-internalCompany`}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <AutoCompleteTypeComponent
              fullWidth
              value={externalFilters.wellClassification}
              shapeType="Agreement"
              typeKey={"wellClassification"}
              variant="outlined"
              createable={false}
              onChange={(e, newValue) =>
                handleFilterChange("wellClassification", newValue?.name)
              }
              autoFocus={false}
              id={`field-wellClassification`}
            />
          </Grid>
          <Grid item xs={12} md={2} style={{ marginTop: "4px" }}>
            <Grid container display="flex" alignItems="center" spacing={3}>
              <FormControl
                variant="outlined"
                required
                className={classes.formControl}
              >
                <InputLabel id="demo-simple-select-required-label">
                  Pay Status
                </InputLabel>
                <Select
                  value={externalFilters.payStatus}
                  onChange={({ target }) =>{
                    handleFilterChange("payStatus", target?.value)
                  }}
                  label="Pay Status"
                  fullWidth
                  className={classes.select}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="InPay">In Pay</MenuItem>
                  <MenuItem value="NotInPay">Not In Pay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} md={2}>
            <Grid container display="flex" className={classes.actionsGrid}>
              <ReportGroupHeader
                type="Agreements"
                esFilters={externalFilters.reportingGroup}
                setESFilters={(value) => setESFilters(value)}
                setFilterToggle={() => {}}
                isBackground={false}
                noUpdate={true}
                strechedWidth
                isShrink
                noPadding
              />
            </Grid>
          </Grid>
        </Grid>
      </div> */}
			<WellMaster
				header="Well Master"
				esFilters={esFilters}
				targetLabel="acerage"
				parent="AcerageDetail"
				setESFilters={setESFilters}
				landSearchQuery={stateApp.landAnalyticsSearchQuery}
				loadMore={loadMore}
			/>
		</>
	);
}
