import React, { useState, useEffect, useRef } from 'react';
import Avatar from 'react-avatar';
import { MentionsInput, Mention } from 'react-mentions';

import { ClickAwayListener, Grid, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import classNames from './mention.module.css';

const useStyles = makeStyles(theme => ({
	commentType: {
		display: 'flex',
		padding: '12px',
	},
	commentBtn: {
		float: 'right',
		zIndex: '999',
		marginTop: '10px',
	},
	helperText: {
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0',
		textAlign: 'right',
		float: 'right',
		marginLeft: '10px',
		'& span': {
			fontWeight: 'bold',
		},
		'& .redColor': {
			color: 'rgb(240, 89, 89) !important',
		},
	},
}));

const MentionsUser = ({ comment, setComment, updateComment, profilesInfo, users, ...props }) => {
	const classes = useStyles();
	const [selectedCommentType, setSelectedCommentType] = useState('General');
	const [height, setHeight] = useState(40); // Initial height
	const [mentionUsers, setMentionUsers] = useState([]);
	const [value, setValue] = useState('');
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [emptyInput, setEmptyInput] = useState(false);

	useEffect(() => {
		if (profilesInfo) {
			// Map the data into the format required by react-mentions
			const mappedData = Object.keys(profilesInfo).map(key => {
				const user = profilesInfo[key];
				return {
					id: user._id, // Use _id as id
					display: user.displayName || user.fullname, // Fallback to available fields
					email: user.email, // Include email for additional use
					profileImage: user.profileImage,
					name: user.displayName || user.fullname || user.name,
				};
			});
			setMentionUsers(mappedData);
		}
	}, [profilesInfo]);

	useEffect(() => {
		if (props?.placeholder) {
			return;
		}
		const helperTextElement = document.querySelector('.input-helper-text');
		if (value.length > 0) {
			if (helperTextElement) {
				helperTextElement.classList.add('fill');
				setEmptyInput(false);
				highlightError(false);
			}
		} else {
			if (helperTextElement) {
				helperTextElement.classList.remove('fill');
			}
		}
	}, [value]);

	const convertToUserIDFormat = input => {
		// Regular expression to match @[Name](userID)
		const regex = /@\[(.*?)\]\((.*?)\)/g;

		// Replace each mention with the {{userID}} format
		return input.replace(regex, (match, userName, userId) => `{{${userId}}}`);
	};

	const convertBackToOriginalFormat = input => {
		// Regular expression to match {{userID}}
		const regex = /{{(.*?)}}/g;

		// Create user mapping from users data
		const userMapping = Object.keys(profilesInfo).reduce((acc, key) => {
			const user = profilesInfo[key];
			acc[user._id] = {
				name: user.displayName || user.name, // Use displayName or name or fallback to 'Unknown'
			};
			return acc;
		}, {});
		// Replace each {{userID}} with the @[Name](userID) format
		const newValue = input.replace(regex, (match, userId) => {
			// Get the user's name using the userId from the mapping
			const user = userMapping[userId];

			// If user is found, return the original format; otherwise, return the userId as is
			return user ? `@[${user.name}](${userId})` : `{{${userId}}}`;
		});

		return newValue;
	};

	const handleFocus = () => {
		setIsCollapsed(false);
		setHeight(160); // Increase height on focus
		if (props?.setIsCollapsed) {
			props?.setIsCollapsed(false);
		}
	};

	const handleBlur = () => {
		if (isCollapsed) {
			setHeight(40); // Reset height on blur
		}
		setEmptyInput(false);
		highlightError(false);
	};

	const handleApplyCSS = () => {
		const mentionInput = document.getElementById('mention-input');
		if (mentionInput) {
			mentionInput.classList.add('hide-scrollbar');
			mentionInput.style.outline = 'none'; // Remove outline
			mentionInput.style.width = 'calc(100% - 25px) important'; // Remove outline
			mentionInput.style.lineHeight = '24px'; // Remove outline
			const previousDiv = mentionInput.previousElementSibling;
			// Apply scroll functionality and hide scrollbar
			if (previousDiv) {
				previousDiv.style.overflow = 'hidden';
				previousDiv.style.width = 'calc(100% - 25px) !important'; // Remove outline
				previousDiv.style.setProperty('line-height', '24px', 'important');
				previousDiv.style.padding = '4px 0px 0px 4px';
			}

			if (!props?.isHelperTextAllow) {
				mentionInput.style.border = 'none'; // Make border color transparent
				previousDiv.style.border = 'none';
			}
		}
	};

	const addHelperText = () => {
		const mentionInput = document.getElementById('mention-input');
		// Check if the span already exists
		if (!document.querySelector('.input-helper-text')) {
			// Create a new <span> element
			const newSpan = document.createElement('span');
			newSpan.className = 'input-helper-text'; // Add a class to the span
			newSpan.textContent = 'Comments'; // Add text content

			// Insert the <span> after the input box
			mentionInput.parentNode.insertBefore(newSpan, mentionInput.nextSibling);
		}
	};

	const highlightError = isError => {
		const mentionInput = document.getElementById('mention-input');
		const previousDiv = mentionInput.previousElementSibling;
		const color = isError ? 'red' : 'black';
		mentionInput.style.borderColor = color; // Make border color transparent
		previousDiv.style.border = color;
	};

	useEffect(() => {
		if (!props.isSaveAllowed) {
			handleApplyCSS();
		} else {
			const mentionInput = document.getElementById('mention-input');
			if (mentionInput) {
				mentionInput.style.lineHeight = '20px'; // Remove outline
				mentionInput.classList.add('hide-scrollbar');
				// Target the previous sibling element of mentionInput
				const previousDiv = mentionInput.previousElementSibling;

				// Apply scroll functionality and hide scrollbar
				if (previousDiv) {
					previousDiv.style.overflow = 'hidden';
					previousDiv.style.setProperty('line-height', '20px', 'important');
					previousDiv.style.padding = '4px 0px 0px 4px';
				}
			}
		}

		if (props.isHelperTextAllow) {
			addHelperText();
		}
	}, [props.isSaveAllowed]);

	useEffect(() => {
		if (isCollapsed) {
			setHeight(40); // Reset height on blur
		}
	}, [isCollapsed]);

	useEffect(() => {
		setValue(convertBackToOriginalFormat(comment));
	}, [comment, users]);

	const handleKeyPress = e => {
		// Detect Enter key
		if (e.key === 'Enter' && props?.isHelperTextAllow) {
			if (e.shiftKey) {
				// Allow new line when Shift + Enter is pressed
				return;
			} else {
				e.preventDefault(); // Prevent default Enter behavior (e.g., new line or form submission)
				if (!value?.length) {
					setEmptyInput(true);
					highlightError(true);
					return;
				}
				// On Enter, save the data
				updateComment({ comment, commentType: selectedCommentType });
				e.preventDefault(); // Prevent form submission or other default behavior
			}
		}
	};

	return (
		<>
			<ClickAwayListener
				onClickAway={e => {
					setIsCollapsed(true);
					if (props?.setIsCollapsed) {
						props?.setIsCollapsed(false);
					}
				}}
			>
				<MentionsInput
					id={'mention-input'}
					className={'mention'}
					value={value}
					onChange={e => {
						setValue(e.target.value);
						const comment = convertToUserIDFormat(e.target.value);
						setComment(comment);
					}}
					classNames={classNames}
					placeholder={props?.placeholder || ''}
					style={{
						input: {
							height: `${height}px`,
							overflow: 'scroll',
						},
						highlighter: {
							height: `${height}px`,
							overflow: 'scroll',
							boxSizing: 'border-box',
						},
						control: {
							height: `${height}px`, // Set dynamic height
							transition: 'height 0.2s ease-in-out', // Smooth transition
						},
					}}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyPress}
				>
					<Mention
						trigger="@"
						data={mentionUsers}
						className={classNames.mentions__mention}
						displayTransform={(id, display) => `@${display}`}
						renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
							return (
								<div
									key={suggestion._id}
									style={{
										display: 'flex',
										alignItems: 'center',
										backgroundColor: focused ? 'rgba(0, 0, 0, 0.08)' : 'white',
										cursor: 'pointer',
										padding: '5px',
										width: '100%',
									}}
								>
									<IconButton style={{ padding: '0px' }}>
										{suggestion?.profileImage ? (
											<Avatar src={suggestion?.profileImage} size="25" round />
										) : (
											<Avatar name={suggestion.name} size="25" round />
										)}
									</IconButton>
									<div
										style={{
											marginLeft: '8px',
										}}
									>
										<strong>{suggestion?.display}</strong>
									</div>
								</div>
							);
						}}
					/>
				</MentionsInput>
			</ClickAwayListener>
			{emptyInput ? (
				<Grid item xs={12}>
					<p className={classes.helperText}>
						<span className="redColor">Required Field</span>
					</p>
				</Grid>
			) : props?.isHelperTextAllow ? (
				<Grid style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} xs={12}>
					<p className={classes.helperText}>
						<span>Shift+Enter</span> to add a new line
					</p>
					<p className={classes.helperText}>
						<span>Enter</span> to save
					</p>
				</Grid>
			) : null}
			{props.isSaveAllowed && (
				<Button
					className={classes.commentBtn}
					variant="contained"
					color="primary"
					id="commentButton"
					disabled={!comment || comment === ''}
					data-testid={'comment-add-button'}
					onClick={e => {
						e.stopPropagation();
						updateComment({ comment, commentType: selectedCommentType });
						setValue('');
						setIsCollapsed(false);
					}}
				>
					Comment
				</Button>
			)}
		</>
	);
};

export default MentionsUser;
