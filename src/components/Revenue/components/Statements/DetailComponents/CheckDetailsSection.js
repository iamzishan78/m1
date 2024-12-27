import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';

const useStyles = makeStyles(() => ({
	sectionCard: {
		padding: '20px 15px',
		maxWidth: '100%',
		margin: '0 auto',
		background: '#ffffff',
		borderBottonLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
}));

const CheckDetailsSection = ({ checkId }) => {
	const classes = useStyles();
	return (
		<div className={`${classes.sectionCard}`}>
			<MRTTable
				name={'CheckDetailsTable'}
				overrideMeta={{
					defaultFilters: [
						{
							field: 'check._id.keyword',
							value: checkId,
						},
					],
				}}
			/>
		</div>
	);
};

CheckDetailsSection.propTypes = {
	checkId: PropTypes.string.isRequired,
};

export default CheckDetailsSection;
