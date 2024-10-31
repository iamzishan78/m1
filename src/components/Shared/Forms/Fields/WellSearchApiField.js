import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography } from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';

import { TENANTWELL } from 'graphQL/useQueryTenantWell';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

const useStyles = makeStyles(theme => ({}));

function WellSearchApiField(props) {
	const classes = useStyles();

	const [foundWells, setFoundWells] = useState([]);
	const [selectedWell, setSelectedWell] = useState(null);
	const [valid, setValid] = useState({});

	const [getTenantWell, { data: dataTenantWell }] = useLazyQuery(TENANTWELL, {
		// must be network-only to trigger state change for field updates
		fetchPolicy: 'network-only',
	});
	const [getESSimpleSearch] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		fetchPolicy: 'no-cache',
		onCompleted: wellsData => {
			if (wellsData?.getESSimpleSearch?.hits) setFoundWells(wellsData.getESSimpleSearch.hits);
		},
	});

	useEffect(() => {
		if (!dataTenantWell?.tenantWell) return;

		const leaseToSet = dataTenantWell?.tenantWell?.lease || '';
		const leaseAcresToSet = dataTenantWell?.tenantWell?.leaseAcres;
        const measuredDepth = dataTenantWell?.tenantWell?.measuredDepth; 
        const lateralLength = dataTenantWell?.tenantWell?.lateralLength;
        const lastTwelveMonthBOE = dataTenantWell?.tenantWell?.lastTwelveMonthBOE;


		setSelectedWell({
			...selectedWell,
			Lease: leaseToSet,
			LeaseAcreage: leaseAcresToSet,
            measuredDepth: measuredDepth,
            lateralLength: lateralLength,
            lastTwelveMonthBOE: lastTwelveMonthBOE
		});
		props.setSelectedWell({
			...selectedWell,
			Lease: leaseToSet,
			LeaseAcreage: leaseAcresToSet,
            measuredDepth: measuredDepth, // Measured depth of the selected well
            lateralLength: lateralLength, // Lateral length of the selected well
            lastTwelveMonthBOE: lastTwelveMonthBOE  // Last twelve months (BOE) for the selected well
		});
		props.setTenantWell(dataTenantWell?.tenantWell);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataTenantWell]);

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Autocomplete
				options={foundWells || []}
				id="selectWell"
				onChange={(e, well) => {
					setSelectedWell(well);
					well &&
						getTenantWell({
							variables: {
								globalWellId: well.Id,
							},
						});
					well &&
						setValid({
							...valid,
							'selectedWell.Id': false,
						});
				}}
				value={selectedWell}
				getOptionLabel={(option, value) => option.WellName}
				filterOptions={x => x}
				renderOption={option => {
					const parts = parse(option.WellName, []);

					return (
						<Grid container spacing={0}>
							<Grid container item xs={11} alignItems="center">
								<Grid item xs>
									{parts.map((part, index) => (
										<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
											{part.text}
										</span>
									))}

									{option && option.ApiNumber && (
										<Typography variant="body2" color="textSecondary">
											{option.ApiNumber}
										</Typography>
									)}
								</Grid>
							</Grid>
							<Grid container item xs={1} alignItems="center">
								<Grid item style={{ position: 'relative' }}>
									<div
										className={classes.score}
										style={{
											zIndex: '1300',
											backgroundColor: '#12ABE0',
										}}
									/>
									<div
										className={classes.score}
										style={{
											zIndex: '1301',
											backgroundImage: 'repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)',
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
					);
				}}
				renderInput={params => (
					<TextField
						margin="dense"
						{...params}
						required
						error={valid['selectedWell.Id']}
						helperText={valid['selectedWell.Id'] ? 'Select a well to get started' : ''}
						variant="outlined"
						label={props.label}
						InputLabelProps={{ shrink: true }}
						onChange={event => {
							getESSimpleSearch({
								variables: {
									index: 'platformData:wells',
									pagination: {
										first: 50,
										after: null,
									},
									search: {
										query: `*${event.target.value}*`,
										fields: [
											'api.keyword',
											'wellName.keyword',
											'state.keyword',
											'county.keyword',
											'wellType.keyword',
											'wellStatus.keyword',
											'operator.keyword',
											'wellBoreProfile.keyword',
										],
										advanceSearch: [],
									},
									filters: [],
								},
							});
						}}
					/>
				)}
			/>
		</FormControl>
	);
}

WellSearchApiField.defaultProps = {
	label: 'Search for a well by name or API',
};

export default WellSearchApiField;
