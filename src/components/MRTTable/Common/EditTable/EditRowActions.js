import React from 'react';

import { Delete } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';

import { useApolloClient } from '@apollo/client';
import PropTypes from 'prop-types';

import { tableGlobalController } from 'stateManagement/tableController';

const EditRowActions = onDelete => {
	const Component = ({ row }) => {
		const client = useApolloClient();

		return (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title="Delete">
					<IconButton
						color="error"
						onClick={() => {
							tableGlobalController.updateState({
								dialog: {
									type: 'deleteGrid',
									deletedData: row.original,
									deleteType: 'row',
									deleteFunc: async row => {
										await onDelete(client, row);

										tableGlobalController.refetch();
									},
								},
							});
						}}
					>
						<Delete />
					</IconButton>
				</Tooltip>
			</Box>
		);
	};

	Component.propTypes = {
		row: PropTypes.shape({
			original: PropTypes.object.isRequired,
		}).isRequired,
	};

	Component.displayName = 'EditRowActions';

	return Component;
};

export default EditRowActions;
