import React, { memo, useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import PageviewIcon from '@material-ui/icons/Pageview';
import { useLazyQuery } from '@apollo/client';
import { VIEWFILEQUERY } from 'graphQL/useQueryViewFile';
import PdfViewer from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/PDFView';
import { useHistory } from 'react-router-dom';

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
