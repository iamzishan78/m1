import React from 'react';

const typeColors = {
	string: { text: '#4A90E2', background: '#E8F4FD' }, // Soft blue
	number: { text: '#9013FE', background: '#F4E8FD' }, // Soft purple
	integer: { text: '#6C2BCB', background: '#EDE1FA' }, // Richer purple
	float: { text: '#417505', background: '#E8F3E6' }, // Soft olive green
	decimal: { text: '#2AA198', background: '#EAF7F6' }, // Soft teal
	boolean: { text: '#66BB00', background: '#EBF7DF' }, // Vibrant green
	date: { text: '#F5A623', background: '#FFF6E5' }, // Soft orange
	mongoID: { text: '#F5A623', background: '#FFF6E5' }, // Soft orange
	array: { text: '#BD10E0', background: '#F6E8FD' }, // Soft magenta
	object: { text: '#FF8C00', background: '#FFF2E0' }, // Vibrant orange
	bigint: { text: '#005AB5', background: '#E0F2FD' }, // Vibrant blue
	symbol: { text: '#9B9B9B', background: '#F2F2F2' }, // Soft gray
	unknown: { text: '#D0021B', background: '#FDE8E9' }, // Soft coral // red like
};

const DataType = ({ title, type, showType }) => {
	const colors = typeColors[type] || { text: '#000', background: '#FFF' };

	return (
		<>
			{title}
			<br />
			<div
				style={{
					width: 'fit-content',
					border: `1px solid ${colors.text}`,
					backgroundColor: colors.background,
					borderRadius: '2px',
					display: showType ? 'block' : 'none',
				}}
			>
				<small
					style={{
						padding: '0 5px',
						fontWeight: 'normal',
						color: colors.text,
					}}
				>
					{type}
				</small>
			</div>
		</>
	);
};

export default DataType;
