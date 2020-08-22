import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';
import { makeStyles } from '@material-ui/core/styles';

const textStyle = makeStyles((theme) => ({
    paragraph : {
        color: '#8c8c8c'
    }
}));

const PrivacyAndSharing = () => {
    const classes = PanelGeneralStyle();
    const text = textStyle();
    return(
        <Fragment>
            <ThemeProvider theme={PanelTheme}>
                <Grid container spacing={2} className={classes.root}>
                    <Grid item sm={12}>
                        <Accordion className={classes.panels} >
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                                <Typography className={classes.heading}>Privacy & Sharing</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" className={text.paragraph}>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                                            and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Divider/>
                                    </Grid>
                                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                                        <div style={{textAlign: 'center'}}>
                                            <Typography variant="subtitle1" className={text.paragraph}>
                                                Once you make an investment with an sponsor, their name will appear here as an option.
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Fragment>
    )
}

export default PrivacyAndSharing