import { Chip } from '@material-ui/core';
import * as React from 'react';

const Chips = ({ list }) => {
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
			{list &&
				list.map((item, index) => (
					<Chip
						style={{
							backgroundColor: '#f0f0f0',
						}}
						disabled
						key={index}
						label={item.label || item}
					/>
				))}
		</div>
	);
};

export default Chips;
