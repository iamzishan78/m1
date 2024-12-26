import { useLazyQuery } from '@apollo/client';
import { IconButton } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import React, { memo, useEffect } from 'react';

import { VIEWFILEQUERY } from 'graphQL/useQueryViewFile';

function FileDownload({ id }) {
	const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: 'no-cache',
	});

	// file view handler
	const handleViewFile = async id => {
		viewFile({ variables: { fileId: id } });
	};

	// Download file
	useEffect(() => {
		if (viewFileResult?.viewFile?.uri) {
			let a = document.createElement('a');
			a.href = viewFileResult.viewFile.uri;
			a.download = viewFileResult.viewFile.name;
			a.click();
		}
	}, [viewFileResult]);

	return (
		<div
			style={{
				marginRight: '10px',
				display: 'flex',
				justifyContent: 'left',
				alignItems: 'center',
			}}
		>
			{id && (
				<IconButton
					onClick={e => {
						e.stopPropagation();
						handleViewFile(id);
					}}
				>
					<GetAppIcon />
				</IconButton>
			)}
		</div>
	);
}

export default memo(FileDownload);
