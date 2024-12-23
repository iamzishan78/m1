import React, { useMemo } from 'react';
import MRTTable from 'components/MRTTable';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: 60,
		padding: '10px 5px',
	},
}));

const BulkDataEditing = () => {
	const classes = useStyles();
	const history = useHistory();

	const overrideMeta = useMemo(() => {
		const onClickedRow = selectedRow => {
			history.push({ pathname: `/admin/bulk-editing/${selectedRow?._id}` });
		};

		return {
			onClickedRow,
		};
	}, [history]);

	return (
		<div className={classes.root}>
			<MRTTable name="BulkDataEditingTable" overrideMeta={overrideMeta} />
		</div>
	);
};

export default BulkDataEditing;
