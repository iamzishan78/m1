import React, { useState } from 'react';

import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import Loader from 'components/Loaders';

import { UPSERT_CHECK_PROPERTY } from 'graphQL/useMutationCheckPropertyUpdate';
import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { tableGlobalController } from 'stateManagement/tableController';

function UpdateProperty(props) {
	const [propertiesNumbers, setPropertiesNumbers] = useState([]);

	const [upsertCheckProperties] = useMutation(UPSERT_CHECK_PROPERTY);

	const { loading } = useQuery(GET_DB_FILTERS, {
		variables: {
			index: 'properties_flat',
			filters: [],
			filterKey: 'number',
			search: {
				fields: [],
				advanceSearch: [],
			},
			size: 1,
			filterAggs: {
				query: '',
				field: 'number',
				size: 10000,
				fieldType: 'string',
			},
		},
		fetchPolicy: 'no-cache',
		onCompleted: res => {
			if (res) {
				const propertiesNumbers = res?.getDbFilters?.hits?.map(obj => obj.key);
				setPropertiesNumbers(propertiesNumbers);
			}
		},
	});

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
				const success = res?.data?.upsertCheckProperty?.success;
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
						/>
					)}
					disableListWrap
					id="custom-date-dropdown"
				/>
			</Grid>
		</div>
	);
}

UpdateProperty.propTypes = {
	selectedRows: PropTypes.array.isRequired,
	resetRows: PropTypes.func.isRequired,
};

export default UpdateProperty;
