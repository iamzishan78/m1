import { Chip } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as React from 'react';

const Chips = ({ list }) => {
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
			{list &&
				list.map(item => (
					<Chip
						style={{
							backgroundColor: '#f0f0f0',
						}}
						disabled
						key={item.label || item}
						label={item.label || item}
					/>
				))}
		</div>
	);
};

Chips.propTypes = {
	list: PropTypes.array.isRequired,
};

export default Chips;
