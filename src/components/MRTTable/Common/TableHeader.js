import React, { memo } from 'react';

import { Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

function TableHeader({ Icon, label }) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
			{Icon && <Icon />}
			<Typography
				variant="h6"
				component="h1"
				style={{
					fontWeight: 'bold',
					marginLeft: '10px',
				}}
				color="inherit"
			>
				{label}
			</Typography>
		</div>
	);
}

TableHeader.propTypes = { Icon: PropTypes.object, label: PropTypes.string };

export default memo(TableHeader);
