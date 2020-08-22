import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';
import { makeStyles } from '@material-ui/core/styles';

const textStyle = makeStyles((theme) => ({
    paragraph : {
        color: '#8c8c8c'
    }
  }));

const ElectronicConsent = () => {
    const classes = PanelGeneralStyle();
    const text = textStyle();

    const confirm_checkbox = 'I confirm my election to receive Tax Documents for each of my investments through my investor room and via the "Documents" list accessible from the main navigational menu';
    const elect_checkbox = 'I elect to have Tax Documents for each of my investments mailed to my designated address';

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
                                <Typography className={classes.heading}>Document Delivery</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" className={text.paragraph}>
                                            Electronic-only document delivery consent applies to all investments managed via this portal, including, without limitation, any
                                            and all tax documents the sponsor is required to provide by the Internal Revenue Service, including Form 1099 and Schedule K-1
                                            (The "Tax Documents"), and remains in effect until changed. To change your preference, simply return to this page and check the 
                                            box below
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" className={text.paragraph}>
                                            All Tax Documents, regardless of your indicated delivery preference, will be posted to this portal and will be available for review
                                            and download. You will receive an email when a Tax Document is available for your review. This email will contain a link to
                                            securely access and download the document. You will also find all Tax Documents in your Investor Room for each investment and
                                            on the Documents page found on the main navigational menu. Tax Documents for your investments will remain on this portal throughout
                                            the investment period and may optionally remain accessible for years thereafter.
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" className={text.paragraph}>
                                            No special hardware or software beyond what is required to access this portal is required to view or access your Tax Documents
                                            electronically. When downloading multiple Tax Documents, you may be required to obtain additional software such as WinZip or 
                                            7-zip to uncompress a .zip file however most modern computers support extracting .zip files natively.
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" className={text.paragraph}>
                                            When you submit an offer for a particular investment on the CrowdStreet platform, you consent to electronic delivery of offering
                                            documents and applicable Tax Documents. However, please check the box below if, in addition to electronic delivery, you would
                                            also like printed K-1s to be mailed to the address entered and editable on your Account Profile.
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" className={text.paragraph}>
                                            For further assistance,or to obtain additional printed documents, please contact your investment sponsor directly.
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Divider/>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="agreement" name="agreement" row>
                                                <FormControlLabel value="confirm" control={<Radio />} label={confirm_checkbox} />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="agreement" name="agreement" row>
                                                <FormControlLabel value="elect" control={<Radio />} label={elect_checkbox} />
                                            </RadioGroup>
                                        </FormControl>
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

export default ElectronicConsent