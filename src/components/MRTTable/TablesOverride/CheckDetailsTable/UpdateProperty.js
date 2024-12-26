import React, { useEffect, useState } from 'react';

import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';

import Loader from 'components/Loaders';

import { UPSERT_CHECK_PROPERTY } from 'graphQL/useMutationCheckPropertyUpdate';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

import { tableGlobalController } from 'hookstate/tableController';

function UpdateProperty(props) {
	// Initial states
	const [propertiesNumbers, setPropertiesNumbers] = useState([]);
	const [totalProperties, setTotalProperties] = useState(0);
	const [query, setQuery] = useState('');

	// Queries
	const [getESSimpleFilter, { loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
		fetchPolicy: 'no-cache',
	});
	const [getESSimpleSearch] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		fetchPolicy: 'no-cache',
	});

	// Mutations
	const [upsertCheckProperties] = useMutation(UPSERT_CHECK_PROPERTY);

	// useEffects
	useEffect(() => {
		(async () => {
			await new Promise((resolve, reject) => {
				getESSimpleSearch({
					variables: {
						index: 'checkdetails_flat',
						filters: [{ field: 'property.IsDeleted', value: false }],
						pagination: {
							getAllData: true,
						},
					},
					onCompleted: res => {
						if (res) {
							const { total } = res?.getESSimpleSearch;
							setTotalProperties(total);
						}
					},
					onError: error => reject(error),
				});
			});
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		(async () => {
			await new Promise((resolve, reject) => {
				getESSimpleFilter({
					variables: {
						index: 'checkdetails_flat',
						filters: [{ field: 'property.IsDeleted', value: false }],
						filterKey: 'property.number.keyword',
						filterAggs: {
							query,
							field: 'property.number.keyword',
							size: totalProperties,
						},
					},
					onCompleted: res => {
						if (res) {
							const propertiesNumbers = res?.getESSimpleFilter?.hits?.map(obj => obj.key);
							setPropertiesNumbers(propertiesNumbers);
						}
					},
					onError: error => reject(error),
				});
			});
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalProperties, query]);

	// handle selected record update
	const handleChecksUpdate = async propertyNumber => {
		if (propertyNumber) {
			Loader.createToast('checks-updation', 'Checks Bulk Update in progress');
			const checksIds = props.selectedRows.map(sR => sR?._id);

			upsertCheckProperties({
				variables: {
					propertyNumber,
					checksIds,
				},
			}).then(res => {
				const { success } = res;
				if (success) {
					Loader.successToast('checks-updation', 'Checks updated successfully');
				} else {
					Loader.successToast('checks-updation', 'Checks update Failed');
				}

				props.resetRows();
				tableGlobalController.refetch();
			});
		}
	};

	return (
		<div style={{ display: 'flex', marginRight: '15px', marginTop: '5px' }}>
			<Grid item xs md={2} style={{ marginTop: '2px', minWidth: '285px' }}>
				<Autocomplete
					size="small"
					onChange={(event, newValue) => {
						handleChecksUpdate(newValue);
					}}
					options={propertiesNumbers}
					style={{ marginTop: '2px', minWidth: '285px' }}
					loadingText={loading ? 'Loading' : ''}
					renderInput={params => (
						<TextField
							{...params}
							label="Update Property"
							variant="outlined"
							placeholder=""
							style={{ backgroundColor: 'white', color: 'black' }}
							onChange={e => setQuery(e.target.value)}
						/>
					)}
					disableListWrap
					id="custom-date-dropdown"
				/>
			</Grid>
		</div>
	);
}

export default UpdateProperty;
