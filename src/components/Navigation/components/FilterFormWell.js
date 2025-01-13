import React from 'react';

import Grid from '@material-ui/core/Grid';

import FilterDatePickerCompletetion from './FilterDatePickerCompletetion';
import FilterDatePickerFirstProd from './FilterDatePickerFirstProd';
import FilterDatePickerPermit from './FilterDatePickerPermit';
import FilterDatePickerSpud from './FilterDatePickerSpud';
import FilterLateralLength from './FilterLateralLength';
import FilterMeasuredDistance from './FilterMeasuredDistance';
import FilterTVD from './FilterTVD';

export default function FilterFormWell() {
	return (
		<Grid container item spacing={2} style={{ padding: '8px', width: '100%', margin: '0' }}>
			{/* <Grid item sm={12}>
				<OperatorsFilter />
			</Grid>
			<Grid item sm={12}>
				<FilterWellTypeJ />
			</Grid>
			<Grid item sm={12}>
				<FilterWellProfileJ />
			</Grid>
			<Grid item sm={12}>
				<FilterWellStatusJ />
			</Grid>
			<Grid item sm={12}>
				<FilterPrimaryFormation />
			</Grid>
			<Grid item sm={12}>
				<FilterPlay />
			</Grid>
			<Grid item sm={12}>
				<FilterField />
			</Grid> */}
			<Grid item sm={12}>
				<FilterTVD />
			</Grid>
			<Grid item sm={12}>
				<FilterMeasuredDistance />
			</Grid>
			<Grid item sm={12}>
				<FilterLateralLength />
			</Grid>
			<Grid item sm={12}>
				<FilterDatePickerPermit labelDates={'Permit'} />
				<FilterDatePickerSpud labelDates={'Spud'} />
				<FilterDatePickerCompletetion labelDates={'Completion'} />
				<FilterDatePickerFirstProd labelDates={'First Production'} />
			</Grid>
		</Grid>
	);
}
