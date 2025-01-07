import React, { memo, useEffect, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { tableGlobalController } from 'hookstate/tableController';
import GavelIcon from '@material-ui/icons/Gavel';
import ParcelInstrument from 'components/ParcelsDetailCard/ParcelInstrument';
import { getIdFromPath } from 'utils/helper';
import { useHistory } from 'react-router-dom';

// This component is used in the RelatedPaymentsTable component for the toolbar
function RunsheetToolbar({ table, tableKey }) {
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
			<Typography
				variant="h6"
				component="h1"
				style={{ fontWeight: 'bold', margin: '5px 0px 0px 10px', position: 'absolute', left: '0' }}
			>
				<div style={{ display: 'flex' }}>
					<GavelIcon />
					<span
						style={{
							marginTop: '-3px',
							marginLeft: '8px',
						}}
					>
						RUNSHEET INSTRUMENTS
					</span>
				</div>
			</Typography>
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
		</>
	);
}

export default memo(RunsheetToolbar);
