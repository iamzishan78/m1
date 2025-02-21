import React, { useEffect, useState } from 'react';

import { Box, Button, CircularProgress, Skeleton, TextField, Typography } from '@mui/material';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

import { slidoutStateController } from 'controllers/slidoutStateController';

import { UPDATE_PDF_TEXTS } from 'graphQL/useMutationUpdateDocument';
import { GET_FILE_OCR_TEXT, VIEWFILEQUERY } from 'graphQL/useQueryViewFile';

import { convertFile } from 'utils/tesseractHelper';


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

	if (isEditing) {
		return (
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
		);
	}

	return (
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
	const [generatingOCR, setGeneratingOCR] = useState(false);
	const { lines } = slidoutStateController.useState(['isChanged', 'lines']);

	const client = useApolloClient();

	const { data, loading } = useQuery(GET_FILE_OCR_TEXT, {
		variables: { fileId: selectedDocument?._id },
	});

	const [updatePDFText] = useMutation(UPDATE_PDF_TEXTS, {
		refetchQueries: ['getFileOCRText'],
		onCompleted: () => setGeneratingOCR(false),
		onError: () => setGeneratingOCR(false),
	});

	const parsePDFText = async () => {
		setGeneratingOCR(true);

		const res = await client.mutate({
			mutation: VIEWFILEQUERY,
			variables: {
				fileId: selectedDocument?._id,
			},
		});

		convertFile(res.data.viewFile.uri, (texts, error) => {
			if (error) {
				setGeneratingOCR(false);
			}

			updatePDFText({
				variables: {
					fileId: selectedDocument?._id,
					pageTexts: texts.map((text, index) => ({ text, page: index + 1 })),
				},
			});
		});
	};

	const updateLine = (index, newText) => {
		const updatedLines = [...lines];

		if (updatedLines[index] === newText) {
			return;
		}

		updatedLines[index] = { ...updatedLines[index], text: newText };

		slidoutStateController.updateState({
			isChanged: !isEqual(updatedLines, data?.getFileOCRText?.data),
			lines: updatedLines,
		});
	};

	useEffect(() => {
		slidoutStateController.updateState({ isChanged: false, lines: [] });

		return () => {
			const { isChanged, lines } = slidoutStateController.getValues(['isChanged', 'lines']);

			if (!lines?.length || !isChanged) {
				return;
			}

			updatePDFText({ variables: { fileId: selectedDocument?._id, lineTexts: lines } });
		};
	}, []);

	useEffect(() => {
		slidoutStateController.updateState({
			lines: data?.getFileOCRText?.data || [],
		});
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

	if (!lines?.length) {
		return (
			<Box sx={{ textAlign: 'center', marginTop: '20px' }}>
				<Typography sx={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic', color: 'gray' }}>
					No text found in the document.
				</Typography>

				<Button
					variant="contained"
					onClick={() => parsePDFText({ variables: { fileId: selectedDocument?._id } })}
					disabled={generatingOCR || !selectedDocument?._id}
					startIcon={generatingOCR ? <CircularProgress size={20} /> : null}
					sx={{
						backgroundColor: '#2BAFDE',
						marginTop: '1rem',
					}}
				>
					{generatingOCR ? 'Generating OCR...' : 'Generate OCR Data'}
				</Button>
			</Box>
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
			{lines?.map((line, index) => (
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
