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
import { ProfileContext } from "./ProfileContext";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import ImageModel from "./ImageModal";
import { NavigationContext } from "../Navigation/NavigationContext";
import Skeleton from "@material-ui/lab/Skeleton";
import { useMutation } from "@apollo/client";
import { UPSERTPROFILE } from "../../graphQL/useMutationUpsertProfile";
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
      borderRadius: "50%",
      objectFit: "contain",
      backgroundColor: "#fff",
    },
    loading_image: {
      height: 150,
      width: 150,
      border: 1,
      padding: "38%",
      borderRadius:"50%",
      backgroundColor: "#fff",
    },
    paper: {
        marginTop: "100px",
        marginLeft: "auto",
        marginBottom: "auto",
        maxHeight: "calc(100% - 72px)",
        minHeight: "85%",
        overflow: 'hidden'
      },
    editIcon: {
      backgroundColor: "hsla(1,50%,100%, 0.4)",
      cursor: "pointer",
      padding: 5,
      borderRadius: "50%",
      fontSize: 30,
    },
    skeleton: {
      margin: 10,
      width: "100%",
      height: 50,
      backgroundColor: "#f2f2f2",
    }
  }));

const ProfileDetails = () => {
    //const [selectedMenu, setSelectedMenu] = useState(0);
    const [displayContent, setDisplayContent] = useState([]);
    const [isDetailedViewOpen, setDetailedViewOpen] = useState(true);
    const [stateProfile, setStateProfile] = useContext(ProfileContext);
    const [stateNav, setStateNav] = useContext(NavigationContext);
    const [updateProfile] = useMutation(UPSERTPROFILE);
    const {
      fields: { fullname, profileImage, email }, isSaving
    } = stateProfile;
    
    useEffect(()=> {
      changeDisplayContent(0);
    }, []);
      
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
        setStateNav({ ...stateNav, isProfileOpen: true });
        setStateProfile({
          ...stateProfile,
          isImageModalOpen: false
        });
        setDetailedViewOpen(false);
        history.goBack();
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStateProfile({...stateProfile, isSaving: true});
      await updateProfile({
        variables: { profileData: { ...stateProfile.fields } },
      });
      setStateProfile({...stateProfile, isSaving: false});
    };

    const newStyle = newStyles();
    const history = useHistory();

    return(
        <div>
            <ImageModel/>
            <Dialog
            onClose={handleClose}
            aria-labelledby="myaccount-dialog"
            open={isDetailedViewOpen}
            fullWidth
            maxWidth={"xl"}
            classes={{ paper: newStyle.paper }}
            >
                <Grid container className={newStyle.root}>
                    <Grid item sm={2}>
                      <Grid container className={newStyle.navSubroot}>
                          <Grid item sm={12} style={{alignSelf: 'center', flex: 0.3, paddingTop:"10%"}}>
                            <input
                              accept="image/*"
                              style={{ display: "none" }}
                              id="profile-image"
                              type="file"
                              name="profileimage"
                              onChange={(e) => handleImage(e)}
                            />
                            <Badge
                              overlap="circle"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              badgeContent={
                                <label htmlFor="profile-image">
                                  <Tooltip title={`Upload a photo`} arrow placement="bottom-end">
                                    <AddAPhotoIcon
                                      className={newStyle.editIcon}
                                      />
                                  </Tooltip>
                                </label>
                                }
                            >
                              {
                                profileImage !== null ? (
                                <img 
                                  src={profileImage !== "" ? profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                  alt="Profile picture"
                                  className={newStyle.profile_picture} 
                                />
                                ) : (
                                  <Skeleton variant="circle" width={150} height={150}/>
                                )
                              }
                            </Badge>
                            <h2 style={{color: '#fff', maxWidth: '100%'}}>{fullname}</h2>
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
                        <ProfileHeader 
                          handleSubmit={handleSubmit} 
                          isSaving={isSaving} 
                          handleClose={handleClose}/>
                        </Grid>
                        <Grid item sm={12} style={{
                        maxHeight: '735px', overflowY: "auto", overflowX: 'hidden'
                        }}>
                        { email !== null ? displayContent : (
                          <div>
                            <Skeleton variant="rect" className={newStyle.skeleton} height={200} />
                            <Skeleton variant="rect" className={newStyle.skeleton} />
                            <Skeleton variant="rect" className={newStyle.skeleton} />
                            <Skeleton variant="rect" className={newStyle.skeleton} />
                            <Skeleton variant="rect" className={newStyle.skeleton} />
                            <Skeleton variant="rect" className={newStyle.skeleton} />
                          </div>
                        )}
                        </Grid>
                    </Grid>
                    </Grid>
                </Grid>
            </Dialog>
    </div> 
    )
}

export default ProfileDetails;