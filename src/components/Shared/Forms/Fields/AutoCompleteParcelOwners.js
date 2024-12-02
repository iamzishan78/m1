import React, { useEffect, useState, useMemo } from 'react';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';
import joinAddress from '../../valueformatters/join-address.js';
import pick from 'lodash/pick';
import { PARCELOWNERSQUERY } from 'graphQL/useQueryParcelOwners.js';

const useStyles = makeStyles({
	inputRoot: {
		// backgroundColor: "#ffffff",
	},
	listbox: {
		boxSizing: 'border-box',
		'& ul': {
			padding: 0,
			margin: 0,
		},
	},
});

const AutoCompleteParcelOwners = ({ onChange, value, parcel, onBlur, ...other }) => {
	const [esData, setEsData] = useState([]);

	const [getParcelOwners, { data: elasticData }] = useLazyQuery(PARCELOWNERSQUERY, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {},
	});

	useEffect(() => {
		if (parcel?._id || parcel?.tractId)
			getParcelOwners({
				variables: { customLayerId: parcel._id || parcel.tractId, qtr: parcel.qtrQtr || {} },
			});
	}, [parcel]);

	useEffect(() => {
		if (elasticData && elasticData[Object.keys(elasticData)[0]]) {
			const data = elasticData[Object.keys(elasticData)[0]];
			setEsData(data);

			if (other?.setTotalOwners) other?.setTotalOwners(data.length);
		}
	}, [elasticData]);

	const classes = useStyles();

	const options = useMemo(() => {
		if (esData?.length > 0)
			return esData.map(data => ({
				_id: data.ownerEntity,
				...data?.relatedObject?.entityDetail,
				ownerData: {
					...pick(data, [
						'depthFrom',
						'depthTo',
						'mineral_interest',
						'royalty_interest',
						'orri',
						'net_acres',
						'nra',
						'company_net_acres',
					]),
					working_interest: data.operating_rights,
				},
			}));

		return [];
	}, [esData]);

	return (
		<Autocomplete
			defaultValue={{ _id: value, name: value }}
			value={value}
			disableListWrap
			classes={classes}
			onBlur={onBlur}
			options={options}
			getOptionLabel={option => {
				// Value selected with enter, right from the input
				if (typeof option === 'string') {
					return option;
				}
				// Add "xxx" option created dynamically
				if (option.inputValue) {
					return option.name;
				}

				if (option?.name) return option.name;
				else return '';
			}}
			getOptionSelected={(option, value) => {
				return option?._id === value?._id;
			}}
			renderOption={option => {
				// if (option._id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.name}'</Typography>;

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
			filterOptions={(options, params) => {
				const inputValue = params.inputValue;
				const filtered = createFilterOptions()(options, { ...params, inputValue });
				// const isExist = loadashFilter(filtered, (filter) => {
				//     return filter._id === inputValue;
				// });
				// Suggest the creation of a new value
				// if (inputValue !== "" && (!isExist || isExist.length === 0)) {
				//     filtered.unshift({
				//         name: inputValue,
				//         _id: "newEntity",
				//     });
				// }
				return filtered;
			}}
			onChange={(event, newValue) => {
				onChange(event, newValue);
			}}
			renderInput={params => (
				<TextField
					variant={other.variant}
					margin={other.margin}
					label={other.label}
					placeholder={other.placeholder}
					{...params}
					InputLabelProps={{
						...params.InputLabelProps,
						...other.InputLabelProps,
					}}
					InputProps={{
						...params.InputProps,
						...other.InputProps,
					}}
					fullWidth
					autoFocus
					size="small"
				/>
			)}
			// {...other}
		/>
	);
};

export default AutoCompleteParcelOwners;
