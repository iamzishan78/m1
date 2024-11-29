import React from 'react';
import MRTTable from 'components/MRTTable';

function Agreements(props) {
	return (
		<div
			style={{
				marginTop: '65px',
				marginLeft: '-10px',
			}}
		>
			<MRTTable name="AgreementTable" />
		</div>
	);
}

export default Agreements;
