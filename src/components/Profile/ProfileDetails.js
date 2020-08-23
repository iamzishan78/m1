import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from "@material-ui/core/Grid";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import ElectronicConsent from "./components/ElectronicConsent";
import EmailPreferences from "./components/EmailPreferences";
import FinancialQualification from "./components/FinancialQualification";
import InvestingEntities from "./components/InvestingEntities";
import InvestingPreferences from "./components/InvestingPreferences";
import InvestorDocuments from "./components/InvestorDocuments";
import PrivacyAndSharing from "./components/PrivacyAndSharing";
import Security from "./components/Security";
import Verification from "./components/Verification";
import ProfileHeader from "./components/ProfileHeader";
import Dialog from "@material-ui/core/Dialog";
import { useHistory } from "react-router-dom";
import { ProfileContextProvider } from "./ProfileContext";

const newStyles = makeStyles((theme) => ({
    dialogContent: {
      padding: 0,
      margin: 0
    },
    root: {
      flex: 1,
      flexDirection: 'row',
      padding: 0,
      margin: 0
    },
    navSubroot: {
      flex: 1,
      height: '100%',
      flexDirection: 'column',
      background: '#42517b'
    },
    contentSubroot: {
      flex: 1,
      flexDirection: 'column'
    },
    menuList: {
      color: '#b3b9ca',
      "& .MuiButtonBase-root": {
        paddingRight: '10%',
        paddingLeft: '10%',
      }
    },
    profile_picture: {
      height: 150,
      width: 150,
      border: 1,
      borderRadius: 150
    },
    paper: {
        marginTop: "100px",
        marginLeft: "auto",
        marginBottom: "auto",
        maxHeight: "calc(100% - 72px)",
        minHeight: "85%",
        overflow: 'hidden'
      },
  }));

const ProfileDetails = () => {
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [displayContent, setDisplayContent] = useState([]);
    const [isDetailedViewOpen, setDetailedViewOpen] = useState(true);

    const list = [
      'Profile',
      'Investing Entities',
      'Investing Preferences',
      'Financial Qualification',
      'Email Preferences',
      'Privacy & Sharing',
      'Electronic Consent',
      'Investor Documents',
      'Security',
      'Change Password',
      'Verification'
    ]

    useEffect(()=> {
      changeDisplayContent(0);
    }, []);

    const changeDisplayContent = (index) => {
      let return_display = [
        <Profile/>,
        <InvestingEntities/>,
        <InvestingPreferences/>,
        <FinancialQualification/>,
        <EmailPreferences/>,
        <PrivacyAndSharing/>,
        <ElectronicConsent/>,
        <InvestorDocuments/>,
        <Security/>,
        <ChangePassword/>,
        <Verification/>
      ]
      setDisplayContent(return_display[index]);
    }

    const handleClose = () => {
        setDetailedViewOpen(false);
        history.goBack();
      };

      

    const newStyle = newStyles();
    const history = useHistory();

    return(
        <ProfileContextProvider>
            <Dialog
            onClose={handleClose}
            aria-labelledby="myaccount-dialog"
            open={isDetailedViewOpen}
            fullWidth={true}
            maxWidth={"xl"}
            classes={{ paper: newStyle.paper }}
            >

            <Grid container className={newStyle.root}>
                <Grid item sm={2}>
                <Grid container className={newStyle.navSubroot}>
                    <Grid item sm={12} style={{alignSelf: 'center', flex: 0.3, padding: '10%'}}>
                    <img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt="Profile picture"
                        className={newStyle.profile_picture} />
                    <h2 style={{color: '#fff'}}> Jacob Avery </h2>
                    </Grid>
                    <Grid item sm={12} style={{flex: 1}}>
                    <MenuList className={newStyle.menuList}>
                        {
                        list.map((item, index) => {
                            return <MenuItem key={index} onClick={()=> {changeDisplayContent(index)}}>{item}</MenuItem>
                        })
                        }
                    </MenuList>
                    </Grid>
                </Grid>
                </Grid>
                <Grid item sm={10}>
                <Grid container className={newStyle.contentSubroot}>
                    <Grid item sm={12}>
                    <ProfileHeader />
                    </Grid>
                    <Grid item sm={12} style={{
                    maxHeight: '735px', overflowY: "auto", overflowX: 'hidden'
                    }}>
                    { displayContent }
                    </Grid>
                </Grid>
                </Grid>
            </Grid>

            </Dialog>
    </ProfileContextProvider> 
    )
}

export default ProfileDetails;