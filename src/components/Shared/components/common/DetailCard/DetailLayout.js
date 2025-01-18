import React, { useEffect } from 'react';

import { CircularProgress } from '@material-ui/core';

import Content from './Content';
import useDetailCardUnmount from './Hooks/useDetailCardUnmount';
import { detailCardController } from 'hookstate/detailCardController';

function DetailLayout({ loading, ignoreUnmount, tabs, page, props }) {
	useDetailCardUnmount(ignoreUnmount);

	useEffect(() => {
		detailCardController.initialize({
			page,
			props,
			tabs,
		});
	}, []);

	if (loading)
		return (
			<div
				style={{
					padding: '20px',
					position: 'absolute',
					height: '100%',
					width: '100%',
					zIndex: '50',
				}}
			>
				<CircularProgress size={80} disableShrink color="secondary" />
			</div>
		);

	return <Content />;
}

export default DetailLayout;
