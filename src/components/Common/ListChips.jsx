import { Chip } from '@material-ui/core';
import * as React from 'react';

const ListChips = ({ list, ...rest }) => {
	return (
		list &&
		list.map((item, index) => (
			<Chip
				style={{
					backgroundColor: '#f0f0f0',
				}}
				disabled
				key={index}
				id={item._id}
				label={item.name}
			/>
		))
	);
};

export default ListChips;
