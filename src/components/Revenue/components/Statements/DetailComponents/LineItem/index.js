import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';
import PdfViewer from 'components/Revenue/components/Statements/DetailComponents/LineItem/PdfViewer';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { tableController } from 'hookstate/tableController';

const SPACING = 2;

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(SPACING),
	},
	inputModeButton: {
		width: '200px',
		fontWeight: 600,
		fontSize: 'initial',
		borderRadius: '6px',
		height: '34px',
		color: '#767676',
		textTransform: 'none',
		border: '1px solid #938e8e',
	},
	exitButton: {
		color: 'white',
		background: 'rgb(24, 170, 221)',
		width: '170px',
		fontWeight: 600,
		fontSize: 'initial',
		borderRadius: '6px',
		height: '34px',
		textTransform: 'none',
	},
	pdfViewerRoot: {
		// height: "500px",
		border: '1px solid #c1c1c1',
		marginTop: '22px',
		borderRadius: '4px',
		alignItems: 'center',
	},
	tableRoot: {
		marginTop: '22px',
	},
}));

const getFilterVariables = field => ({
	index: 'checkdetails_flat',
	filters: [],
	filterKey: field,
	search: {
		fields: [],
		advanceSearch: [],
	},
	size: 1,
	filterAggs: {
		query: '',
		field,
		size: 10000,
		fieldType: 'string',
	},
});

export default function LineItem({ checkId }) {
	const classes = useStyles();
	const history = useHistory();
	// const [checkId, setCheckId] = useState();
	const [showPdfSection, setSectionState] = useState(true);
	const Revenue = useSelector(({ Revenue }) => Revenue.statements);
	const activeStatement = Revenue?.activeStatement;

	const togglePdfViewState = () => {
		setSectionState(!showPdfSection);
	};

	const redirectHandler = () => {
		history.push(`/revenue/statement/details/${activeStatement?._id}`);
	};

	const { data: taxTypesData } = useQuery(GET_DB_FILTERS, {
		variables: getFilterVariables('taxType'),
		fetchPolicy: 'no-cache',
	});
	const { data: productsData } = useQuery(GET_DB_FILTERS, {
		variables: getFilterVariables('product'),
		fetchPolicy: 'no-cache',
	});
	const { data: interestTypesData } = useQuery(GET_DB_FILTERS, {
		variables: getFilterVariables('interestType'),
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		const taxTypes = taxTypesData?.getDbFilters?.hits?.map(hit => hit.key);
		const products = productsData?.getDbFilters?.hits?.map(hit => hit.key);
		const interestTypes = interestTypesData?.getDbFilters?.hits?.map(hit => hit.key);

		if (!taxTypes || !products || !interestTypes) {
			return;
		}

		const TableSchema = tableController('CheckDetailsTable').getValue('TableSchema');

		tableController('CheckDetailsTable').updateState({
			TableSchema: TableSchema.map(column => {
				if (column.id === 'taxType') {
					column.editSelectOptions = taxTypes;
				}
				if (column.id === 'product') {
					column.editSelectOptions = products;
				}
				if (column.id === 'interestType') {
					column.editSelectOptions = interestTypes;
				}

				return column;
			}),
		});
	}, [taxTypesData, productsData, interestTypesData]);

	return (
		<div className={classes.root}>
			<Grid container display="flex" direction="row" alignItems="center" justify="space-between">
				<Grid item>
					<Button variant="outlined" className={classes.inputModeButton} onClick={togglePdfViewState}>
						Input Mode
					</Button>
				</Grid>
				<Grid item>
					<Button id="exitButton" variant="contained" className={classes.exitButton} onClick={redirectHandler}>
						Exit
					</Button>
				</Grid>
			</Grid>
			{showPdfSection && (
				<div className={classes.pdfViewerRoot}>
					<PdfViewer togglePdfViewState={togglePdfViewState} checkId={checkId} />
				</div>
			)}
			<div className={classes.tableRoot}>
				<MRTTable
					name={'CheckDetailsTable'}
					overrideMeta={{
						enableEditing: true,
						defaultFilters: [
							{
								field: 'check._id.keyword',
								value: checkId,
							},
						],
					}}
				/>
			</div>
		</div>
	);
}

LineItem.propTypes = {
	checkId: PropTypes.string.isRequired,
};
