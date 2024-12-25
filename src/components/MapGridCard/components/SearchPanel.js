import Grid from '@material-ui/core/Grid';
import React from 'react';

import MapGridCardSearch from './MapGridCardSearch';
// import SearchByTypeSelectField from "./SearchByTypeSelectField";

const SearchPanel = ({ value, ativateSearchPanel, ...rest }) => {
	return (
		<>
			<Grid container direction="row" spacing={2}>
				{/* <Grid item>
                    <SearchByTypeSelectField value={value}  {...rest} backgroundColor='#ffffff' />
                </Grid> */}
				<Grid item>
					<MapGridCardSearch ativateSearchPanel={ativateSearchPanel} searchOption={value.value} />
				</Grid>
			</Grid>
			{/* <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small /> */}
		</>
	);
};

export default SearchPanel;
