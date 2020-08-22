import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { GETPROFILE } from "../../graphQL/useQueryGetProfile";
import { ProfileContext } from "./ProfileContext";

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

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  label: {
    position: "initial",
    textAlign: "left",
    transform: "none",
    fontSize: 16,
    color: "black",
    "&& + *": {
      marginTop: theme.spacing(1),
    },
  },
  focused: {
    "&$label": {
      color: "black",
    },
  },
  helperText: {
    color: "#6c757d",
    lineHeight: "19.2px",
    marginTop: theme.spacing(1) / 2,
    fontSize: 12.8,
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#ced4da",
    },
  },
  button: {
    textTransform: "none",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "180px",
    borderRadius: "4px",
  },
}));

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
  }
}));


const ProfileContent = () => {
  const classes = useStyles();
  const newStyle = newStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [displayContent, setDisplayContent] = useState([]);

  const {
    user: { email },
  } = stateApp;

  const { data, error, loading } = useQuery(GETPROFILE, {
    variables: { email },
    fetchPolicy: "network-only",
  });

  const {
    fields: { fullname, displayname, activity, phone, timezone, profileImage },
    isImageModalOpen,
  } = stateProfile;

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

  useEffect(() => {
    if (data?.profileByEmail?.profile) {
      const {
        profileByEmail: {
          profile: {
            fullname,
            displayname,
            activity,
            phone,
            timezone,
            profileImage,
          },
        },
      } = data;

      setStateProfile({
        ...stateProfile,
        fields: {
          fullname,
          displayname,
          activity,
          phone,
          timezone,
          profileImage,
        },
      });
    }
  }, [data]);

  useEffect(()=> {
    changeDisplayContent(0);
  }, []);

  const onChange = ({ name, value }) => {
    setStateProfile({
      ...stateProfile,
      fields: { ...stateProfile.fields, [name]: value },
    });
  };

  const handleImage = (e) => {
    if (e.target.files?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setStateProfile({
          ...stateProfile,
          isImageModalOpen: true,
          selectedImage: reader.result,
        })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const formatPhone = (number) => {
    const formatted = `${number}`.replace(/\D/g, "");
    const match = formatted.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
  };

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

  return (
    <Grid container className={newStyle.root}>
      <Grid item sm={2}>
        <Grid container className={newStyle.navSubroot}>
          <Grid item sm={12} style={{alignSelf: 'center', flex: 0.3, padding: '10%'}}>
            <img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                 alt="Profile picture"
                 className={newStyle.profile_picture} />
            <h2 style={{color: '#fff'}}> John Geliberte </h2>
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
  );
};

export default ProfileContent;
