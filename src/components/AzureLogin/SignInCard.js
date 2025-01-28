import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Card, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import queryString from 'query-string';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
	select: {
		color: 'white',
	},
	card: {
		width: '400px',
		height: '425px',
		alignItems: 'center',
		// backgroundColor: theme.palette.secondary.dark,
		backgroundColor: '#0e111a',
		fontFamily: theme.typography.fontFamily,
	},

	cardFooter: {
		paddingBottom: '0px',
		paddingTop: '45px',
		color: 'white',
		fontSize: '.75rem',
		float: 'left',
		marginLeft: '30px',
	},

	aadButton: {
		backgroundColor: '#17aadd',
		width: '125px',
		lineHeight: '1.4',
		marginTop: '65px',
		paddingTop: '12px',
		paddingBottom: '12px',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#f0cfb3',
		},
	},
	signupLink: {
		textDecoration: 'none',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		'&:hover': {
			color: '#e4a773',
		},
	},
	errorSection: {
		margin: '12px 90px',
		padding: '10px',
		color: '#E4A773',
		background: '#e4a77347',
		maxHeight: '90px',
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},

		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 10,
		},
	},
	termsAndPrivacy: {
		color: '#fff',
		'& a': {
			color: '#fff',
			textDecoration: 'none',
			'&:hover': {
				color: theme.palette.secondary.main,
			},
		},
	},
}));

const M1neralLogoNavNoAuth = props => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11320 2490" className={props.className}>
		<g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
			<path
				fill="#12ABE0"
				d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
			></path>
			<g transform="translate(2687 379)">
				<path fill="#12ABE0" d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"></path>
				<path fill="white" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
				<path
					fill="white"
					d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
				></path>
			</g>
		</g>
	</svg>
);

const M1neralLogo2 = styled(M1neralLogoNavNoAuth)`
	width: 200px;
	padding-top: 50px;
	padding-bottom: 20px;
`;

const BootstrapInput = withStyles(theme => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 4,
		backgroundColor: theme.palette.common.white,
		border: '1px solid #ced4da',
		fontSize: 16,
		width: '280px',
		height: '25px',
		padding: '10px',
		marginTop: '10px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
}))(InputBase);

const SignInCard = props => {
	const { handleAADSignIn } = props;
	const classes = useStyles();
	const history = useHistory();
	const query = queryString.parse(history?.location?.search);

	const [tenant, setTenant] = useState(query.tenant || '');
	const [error, setError] = useState(null);
	const [tenantFlags, setTenantFlags] = useState({
		error: false,
		placeholder: 'i.e. M1neral',
		autoFocus: false,
	});

	useEffect(() => {
		if (query.tenant?.trim()) {
			handleSignIn(query.tenant);
		}
	}, [query.tenant]);

	const updateTenantFlags = (errorText = null) => {
		setTenantFlags(prevFlags => ({
			...prevFlags,
			error: true,
			autoFocus: true,
		}));
		setTenant('');
		setError(errorText);
	};

	const handleSignIn = async tenantValue => {
		if (tenantValue.trim() === '') {
			updateTenantFlags();
		} else {
			setError(null);
			if (query.tenant?.trim()) {
				await handleAADSignIn(tenantValue, updateTenantFlags);
			} else {
				handleAADSignIn(tenantValue, updateTenantFlags);
			}
			history.push(history.location.pathname);
		}
	};

	const onEnterKey = e => {
		if (e.keyCode === 13) {
			e.preventDefault();
			handleSignIn(tenant);
		}
	};

	const loading = query.tenant?.trim() ? true : props.ready;

	const renderAADButtonAndLoader = loading ? (
		<CircularProgress color="secondary" size={28} className={classes.loader} />
	) : (
		<Button
			variant="outlined"
			disableElevation
			type="submit"
			id="workSpaceSignin"
			className={classes.aadButton}
			onClick={() => handleSignIn(tenant)}
			onKeyDown={e => onEnterKey(e)}
		>
			Sign In
		</Button>
	);

	return (
		<div>
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: 'calc(100vh - 70px)' }}
			>
				<Card square={true} className={classes.card}>
					<div>
						<M1neralLogo2 />
					</div>

					{!loading ? (
						<React.Fragment>
							<div
								style={{
									marginTop: '55px',
									fontSize: '14px',
									fontWeight: '900',
									fontFamily: 'Tahoma, Geneva, sans-serif',
									color: 'white',
									textAlign: 'left',
									marginLeft: '75px',
								}}
							>
								Sign in with your workspace name
							</div>
							<BootstrapInput
								error={tenantFlags.error}
								placeholder={tenantFlags.placeholder}
								autoFocus={tenantFlags.autoFocus}
								autoComplete="true"
								onKeyDown={e => onEnterKey(e)}
								onChange={e => setTenant(e.target.value)}
								onBlur={() => {
									setError(null);
									setTenantFlags({
										error: false,
										placeholder: null,
										autoFocus: false,
									});
								}}
								onClick={() => {
									setError(null);
								}}
								value={tenant}
							/>
							<>
								{renderAADButtonAndLoader}
								{error && (
									<p id="errorSection" className={classes.errorSection}>
										{error}
									</p>
								)}
							</>
						</React.Fragment>
					) : (
						<CircularProgress color="secondary" size={50} className={classes.loader} />
					)}
				</Card>
			</Grid>

			<div
				style={{
					color: '#fff',
				}}
			>
				© 2024 M1neral, LLC. All Rights Reserved.
			</div>

			<div className={classes.termsAndPrivacy}>
				<a href="https://m1neral.com/TOS.pdf" target="_blank" rel="noreferrer">
					Terms of Service
				</a>
				{' | '}
				<a href="https://m1neral.com/Privacy.pdf" target="_blank" rel="noreferrer">
					Privacy Policy
				</a>
			</div>
		</div>
	);
};

function areEqual(prevProps, nextProps) {
	return Object.is(prevProps.tenant, nextProps.tenant);
}

export default React.memo(SignInCard, areEqual);
