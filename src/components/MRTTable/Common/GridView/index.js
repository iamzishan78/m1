import React, { memo, useRef } from 'react';

import PropTypes from 'prop-types';

import ViewComponent from 'components/MRTTable/Common/GridView/ViewComponent';
import ViewOptions from 'components/MRTTable/Common/GridView/ViewOptions';

function GridView({ moduleName }) {
	const buttonRef = useRef(null);

	return (
		<div>
			<ViewComponent moduleName={moduleName} buttonRef={buttonRef} />
			<ViewOptions moduleName={moduleName} buttonRef={buttonRef} />
		</div>
	);
}

GridView.propTypes = {
	moduleName: PropTypes.string.isRequired,
};

export default memo(GridView);
