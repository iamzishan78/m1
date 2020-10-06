import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ReCAPTCHA from "react-google-recaptcha";
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const Verification = () => {
    const classes = PanelGeneralStyle();
    return(
        <Fragment>
            <ThemeProvider theme={PanelTheme}>
                <Grid container spacing={2} className={classes.root}>
                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                        <Typography component="div">
                            <Box fontWeight="bold">
                                Please verify you are not a robot.
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        {/* <ReCAPTCHA
                            sitekey="Your client site key"
                            onChange={onChange}
                        /> */}
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Fragment>
    )
}

export default Verification