import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { getAddressUrl } from 'utils/helper';

const MapAddress = ({ owner, id }) => {
	const value = getAddressUrl(owner);
	return (
		<Tooltip title="Show Address" placement="top" style={{ marginRight: '10px' }}>
			<IconButton
				id={id}
				color="primary"
				onClick={e => {
					e.stopPropagation();
					window.open(value, '_blank', 'noopener,noreferrer');
				}}
				aria-label="show address"
			>
				<HomeOutlinedIcon fontSize="medium" style={{ color: 'rgb(23, 170, 221)' }} />
			</IconButton>
		</Tooltip>
	);
};

export default MapAddress;
