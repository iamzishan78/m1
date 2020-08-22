import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';
import { makeStyles } from '@material-ui/core/styles';

const textStyle = makeStyles((theme) => ({
    paragraph : {
        color: '#8c8c8c',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    }
  }));

const Security = () => {
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
                                <Typography className={classes.heading}>Two Step Verification</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <Typography variant="subtitle1" className={text.paragraph}>
                                        Two-step verification, also known as two-factor authentication or dual-factor authentication, adds an additional layer
                                        of security to your portal login. If you choose to add this security feature, you'll receive a verification code via text message.
                                        This first code will verify your phone number, so be sure it's a number you can receive texts at. Going
                                        forward, you'll be sent a new verification code every time you login. You can also use an authenticator application as another
                                        way to receive your verification codes. To enable two-step verification, follow the instruction below.
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <FormGroup style={{paddingLeft: 10}} row>
                                        <FormControlLabel
                                            control={
                                            <Switch
                                                checked={false}
                                                onChange={()=> {}}
                                                name="enable"
                                                color="primary"
                                            />
                                            }
                                            label="Disabled"
                                        />
                                    </FormGroup>
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

export default Security