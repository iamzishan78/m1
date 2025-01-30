import React, { useRef, useState, useEffect } from 'react';
import { Typography, Tooltip, Box } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	iconTooltip: {
		fontSize: '15px !important',
		padding: '10px !important',
		maxWidth: '450px !important',
	},
}));
const NameWithTooltip = ({ title, style, index, height }) => {
	const classes = useStyles();
	const textRef = useRef(null); // Reference to Typography element
	const [isTruncated, setIsTruncated] = useState(false); // State to track if text is truncated

	// Check if the text is truncated by comparing scrollWidth and offsetWidth
	useEffect(() => {
		const checkTruncation = () => {
			if (textRef.current) {
				const { offsetWidth, scrollWidth } = textRef.current;
				setIsTruncated(scrollWidth > offsetWidth); // If text is overflowing, it's truncated
			}
		};

		checkTruncation();
		window.addEventListener('resize', checkTruncation); // Recalculate on resize
		return () => window.removeEventListener('resize', checkTruncation); // Clean up event listener
	}, [title, index]); // Re-run when the `title` changes

	return (
		<>
			<Typography ref={textRef} noWrap style={style}>
				{title}
			</Typography>
			{isTruncated && (
				<Tooltip classes={{ tooltip: classes.iconTooltip }} arrow title={title}>
					<Box
						sx={{
							position: 'relative',
							top: '0px',
							right: '14px',
							width: '12px', // Approximate ellipsis width
							height: height,
							pointerEvents: 'auto',
							cursor: 'pointer',
						}}
					/>
				</Tooltip>
			)}
		</>
	);
};

export default NameWithTooltip;
