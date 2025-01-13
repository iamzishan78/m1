import React, { useMemo } from 'react';

import { Container } from '@material-ui/core';

import MRTTable from 'components/MRTTable';

function RelatedTractInterestTable(props) {
	const RelatedTractInterestsOverrideMeta = useMemo(
		() => ({
			...props.overrideMeta,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.overrideMeta]
	);

	return (
		<Container style={{ padding: 0, margin: 0 }} maxWidth={false} id={props.id ? props.id : props.parent}>
			<MRTTable name="RelatedTractInterestTable" overrideMeta={RelatedTractInterestsOverrideMeta} />
		</Container>
	);
}

export default React.memo(RelatedTractInterestTable);
