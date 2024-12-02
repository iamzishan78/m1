import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';

import { useStyles } from 'components/Land/components/Common/AnalyticsCards';
import { copy } from 'components/Shared/functions';
import { contactsAnalyticsCards } from 'utils/data';

const ContactsAnalyticsCards = () => {
	const classes = useStyles();
	const [cards, setCards] = useState(contactsAnalyticsCards);
	const { activeModule } = useSelector(({ common }) => common);

	useEffect(() => {
		if (activeModule.title) {
			const updatedCards = copy(contactsAnalyticsCards);
			updatedCards[0].heading = updatedCards[0].heading.replace('Contacts', activeModule.title);
			setCards(updatedCards);
		}
	}, [activeModule]);

	return (
		<Grid
			container
			direction="row"
			display="flex"
			align="center"
			spacing={4}
			textAlign="left"
			style={{ padding: '30px 0px' }}
		>
			{cards.map((card, index) => (
				<Grid item md={3} key={index}>
					<Card variant="outlined" className={classes.card}>
						<CardContent className={classes.cardContent}>
							<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
								{card.heading}
							</Typography>
							<Typography
								variant="h6"
								component="div"
								className={classes.cardNumberTypography}
								style={{ color: card.type === 'warning' ? '#b9b908' : '' }}
							>
								{card.points}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default ContactsAnalyticsCards;
