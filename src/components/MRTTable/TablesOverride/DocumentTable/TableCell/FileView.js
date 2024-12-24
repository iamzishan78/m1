import { useLazyQuery } from '@apollo/client';
import { IconButton } from '@material-ui/core';
import PageviewIcon from '@material-ui/icons/Pageview';
import React, { memo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import PdfViewer from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/PDFView';

import { VIEWFILEQUERY } from 'graphQL/useQueryViewFile';

function FileView({ docInfo }) {
	const splittedStrings = docInfo?.fileName?.split('.');
	const docExtention = splittedStrings?.[splittedStrings.length - 1]?.toLowerCase();
	const [openPdfView, setOpenPdfView] = useState(false);
	let history = useHistory();
	const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: 'no-cache',
	});

	const handleViewFile = async id => {
		viewFile({ variables: { fileId: id } });
	};

	useEffect(() => {
		if (viewFileResult?.viewFile?.uri) {
			setOpenPdfView(true);
		}
	}, [viewFileResult]);

	const onCloseHandler = () => {
		history.goBack();
		setOpenPdfView(false);
	};

	return (
		<div>
			{docExtention === 'pdf' && (
				<IconButton
					onClick={e => {
						e.stopPropagation();
						window.history.pushState('', '', `/documents/${docInfo?._id}/view`);
						handleViewFile(docInfo._id);
					}}
				>
					<PageviewIcon />
				</IconButton>
			)}
			{openPdfView && (
				<PdfViewer viewDoc={viewFileResult?.viewFile} width="calc(100vw)" onCloseHandler={onCloseHandler} />
			)}
		</div>
	);
}

export default memo(FileView);
