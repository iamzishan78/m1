import React, { useEffect, useContext } from 'react';

import MRTTable from 'components/MRTTable';
import Wells from 'components/Shared/svgIcons/well';

import { tableController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

const externalFilters = {
	internalCompany: 'All',
	wellClassification: 'All',
	payStatus: 'All',
	reportingGroup: 'All',
};

export default function ExhibitATabPanel() {
	const [stateApp] = useContext(AppContext);

	useEffect(() => {
		const newESFilters = [];

		// Add available values to filters
		['internalCompany', 'wellClassification', 'payStatus', 'reportingGroup'].forEach(field => {
			if (externalFilters[field] !== 'All') {
				newESFilters.push({
					field: `${field}.keyword`,
					value: externalFilters[field],
				});
			}
		});
	}, []);

	useEffect(() => {
		tableController('MyWellsTable')?.setGlobalFilter(
			stateApp.landAnalyticsSearchQuery === '*' ? '' : stateApp.landAnalyticsSearchQuery
		);
	}, [stateApp.landAnalyticsSearchQuery]);

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
			{/* Display well master table using MRT Grid */}
			<MRTTable
				name="MyWellsTable"
				overrideMeta={{
					isDeleteDisabled: true, // Disable delete functionality
					gridViewSettings: {
						label: 'Well Master', // Label for grid view
						Icon: Wells, // Icon for grid view
						cssOverride: {
							top: '138px', // CSS overrides for positioning
							left: '40px',
							marginLeft: '-9px',
						},
					},
				}}
			/>
		</>
	);
}
