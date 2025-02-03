import React, { useEffect, useState } from 'react';

import { Box, Skeleton, TextField, Typography } from '@mui/material';

import { useMutation, useQuery } from '@apollo/client';
import { useHookstate } from '@hookstate/core';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

import { UPDATE_PDF_TEXTS } from 'graphQL/useMutationUpdateDocument';
import { GET_FILE_OCR_TEXT } from 'graphQL/useQueryViewFile';

const EditableLine = ({ text, onUpdate }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(text);

	const handleBlur = () => {
		setIsEditing(false);
		onUpdate(value);
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			handleBlur();
		}
	};

	useEffect(() => {
		setValue(text);
	}, [text]);

	return isEditing ? (
		<TextField
			value={value}
			autoFocus
			onChange={e => setValue(e.target.value)}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			fullWidth
			size="small"
			variant="standard"
		/>
	) : (
		<Box
			onClick={() => setIsEditing(true)}
			sx={{
				cursor: 'text',
				paddingY: '4px',
				fontSize: '16px',
				lineHeight: '1.6',
				whiteSpace: 'pre-wrap',
			}}
		>
			{text}
		</Box>
	);
};

const OCRText = ({ selectedDocument }) => {
	const { data, loading } = useQuery(GET_FILE_OCR_TEXT, {
		variables: { fileId: selectedDocument?._id },
	});

	const [updatePDFText] = useMutation(UPDATE_PDF_TEXTS, { refetchQueries: ['getFileOCRText'] });

	const isChanged = useHookstate(false);
	const lines = useHookstate([]);

	const updateLine = (index, newText) => {
		const updatedLines = [...lines.get({ noproxy: true })];

		if (updatedLines[index] === newText) {
			return;
		}

		updatedLines[index] = { ...updatedLines[index], text: newText };

		isChanged.set(!isEqual(updatedLines, data?.getFileOCRText?.data?.data));

		lines.set(updatedLines);
	};

	useEffect(() => {
		return () => {
			if (!data?.getFileOCRText?.data?.data || !lines.get()?.length || !isChanged.get()) {
				return;
			}

			updatePDFText({ variables: { fileId: selectedDocument?._id, lineTexts: lines.get({ noproxy: true }) } });
		};
	}, []);

	useEffect(() => {
		lines.set(data?.getFileOCRText?.data?.data || []);
	}, [data]);

	if (loading) {
		return (
			<Box
				sx={{
					padding: '20px',
					maxWidth: '800px',
					margin: 'auto',
					background: '#fff',
					boxShadow: '0 0 10px rgba(0,0,0,0.1)',
					borderRadius: '8px',
					fontFamily: 'serif',
				}}
			>
				{Array.from({ length: 8 }).map((_, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<Skeleton key={i} height={24} sx={{ marginBottom: '8px' }} />
				))}
			</Box>
		);
	}

	if (!lines.get()?.length) {
		return (
			<Typography sx={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic', color: 'gray' }}>
				No text found in the document.
			</Typography>
		);
	}

	return (
		<Box
			sx={{
				padding: '20px',
				maxWidth: '800px',
				margin: 'auto',
				background: '#fff',
				boxShadow: '0 0 10px rgba(0,0,0,0.1)',
				borderRadius: '8px',
				fontFamily: 'serif',
			}}
		>
			{lines.get({ noproxy: true })?.map((line, index) => (
				<EditableLine key={line._id} text={line.text} onUpdate={newText => updateLine(index, newText)} />
			))}
		</Box>
	);
};

OCRText.propTypes = {
	selectedDocument: PropTypes.object,
};

EditableLine.propTypes = {
	text: PropTypes.object,
	onUpdate: PropTypes.func.isRequired,
};

export default OCRText;
