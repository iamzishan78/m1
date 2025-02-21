import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';

import PropTypes from 'prop-types';

import ParcelInstrument from 'components/ParcelsDetailCard/ParcelInstrument';

import { tableGlobalController } from 'controllers/tableController';

import { getIdFromPath } from 'utils/helper';

// This component is used in the RelatedPaymentsTable component for the toolbar
function RunsheetToolbar({ table }) {
	const history = useHistory();
	const customLayerId = getIdFromPath(history.location.pathname);
	const [showSlider, setShowSlider] = useState(false);
	const instrumentData = tableGlobalController.useState(['selectedInstrument'])?.stateValues?.selectedInstrument;

	const [selectedInstrument, setSelectedInstrument] = useState(null);

	useEffect(() => {
		if (instrumentData) {
			setSelectedInstrument(instrumentData);
			setShowSlider(instrumentData?.show);
		} else {
			setSelectedInstrument(null);
			setShowSlider(false);
		}
	}, [instrumentData]);

	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	return (
		<>
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					setShowSlider(true);
				}}
				disabled={selectedRows.length}
			>
				+ ADD Instrument
			</Button>
			{showSlider && (
				<ParcelInstrument
					parcelId={customLayerId}
					setShowSlider={setShowSlider}
					selectedInstrument={selectedInstrument}
					setSelectedInstrument={setSelectedInstrument}
				/>
			)}
		</>
	);
}

RunsheetToolbar.propTypes = { table: PropTypes.object };

export default memo(RunsheetToolbar);
