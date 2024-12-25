import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import CheckDetailsTable from 'components/Table/Revenue/CheckDetailsTable';

const useStyles = makeStyles(() => ({
	sectionCard: {
		padding: '20px 15px',
		maxWidth: '100%',
		margin: '0 auto',
		background: '#ffffff',
		borderBottonLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	titleField: {
		padding: 10,
	},
	titleText: {
		textTransform: 'uppercase',
		margin: '5px 16px 10px',
		fontWeight: 'bold',
	},
}));

const CheckDetailsSection = ({ checkId }) => {
	const classes = useStyles();
	return (
		<div className={`${classes.sectionCard} flex column justifyStart alignStart w-100`}>
			<CheckDetailsTable parent="CheckDetailsTable" header="Check Details" checkId={checkId} />
		</div>
	);
};

export default CheckDetailsSection;
