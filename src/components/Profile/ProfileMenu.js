import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { NavigationContext } from "components/Navigation/NavigationContext";

import { useAuth0 } from '@auth0/auth0-react';

import { AppContext } from "AppContext";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import ProfileProvider from "components/Profile/ProfileProvider";
import UserManagementProvider from "components/UserManagement/UserManagementProvider";

import Avatar from "react-avatar";
import { GET_PROFILE_IMAGE } from "graphQL/useQueryGetProfile";
import { useLazyQuery } from "@apollo/client";

import CheckIcon from "@material-ui/icons/Check";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

export const useStyles = makeStyles((theme) => ({
  userMenu: {
    "& .MuiPaper-rounded": {
      borderRadius: "0px",
    },
  },
  userMenuItem: {
    padding: 5,
    paddingLeft: 35,
    width: "260px",
    color: "#1daee1",
  },
  userTenantTitle: {
    padding: 10,
    paddingBottom: 15,
    width: "260px",
    color: "#1daee1",
  },
}));

export default function UserProfile() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openUserManagementModal, setOpenUserManagementModal] = useState(false);
  const isMenuOpen = Boolean(anchorEl);

  const [stateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [getProfileImage, profiledata] = useLazyQuery(GET_PROFILE_IMAGE);

  useEffect(() => {
    if (stateApp?.user?.email) {
      getProfileImage({
        variables: { email: stateApp.user.email },
        fetchPolicy: "network-only",
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (profiledata && profiledata.data && profiledata.data.profileByEmail && profiledata.data.profileByEmail.profile) {
      const {
        data: {
          profileByEmail: {
            profile: { profileImage },
          },
        },
      } = profiledata;
      setProfileImage(profileImage);
    }
  }, [profiledata]);

  const openProfile = (event) => {
    event.preventDefault();
    handleMenuClose();
    setStateNav({ ...stateNav, isProfileOpen: true });
    setOpenProfileModal(true);
  };

  const openUserManagement = (event) => {
    event.preventDefault();
    handleMenuClose();
    setStateNav({ ...stateNav, isUserManagementOpen: true });
    setOpenUserManagementModal(true);
  };

  const { isAuthenticated, logout } = useAuth0();

  const handleLogout = async () => {
    const currentAccounts = stateApp.myMSALObj?.getAllAccounts();
    const currentAccount =
      currentAccounts && currentAccounts.length === 1
        ? currentAccounts[0]
        : (() => {
          // Add choose account code here
          return;
        })();

    const logoutRequest = {
      account: currentAccount,
    };

    if (isAuthenticated)
      logout({
        logoutParams: {
          returnTo: window.location.origin + '/'
        }
      });

    setAnchorEl(null);
    sessionStorage.clear();
    localStorage.clear();

    if (currentAccount) {
      stateApp.myMSALObj?.logout(logoutRequest);
    }

    window.location.replace(window.location.origin);
  };

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const RenderMenu = React.memo(() => (
    <Menu
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      id="primary-search-account-menu"
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={classes.userMenu}
    >
      <MenuItem disabled className={classes.userTenantTitle}>
        <CheckIcon />
        <Typography variant="inherit" color="textPrimary">
          {" "}
          {sessionStorage.getItem("tenantName")}{" "}
        </Typography>
        <FiberManualRecordIcon style={{ color: "#34F125" }} fontSize="small" />
      </MenuItem>
      <Divider />
      <MenuItem className={classes.userMenuItem} onClick={(e) => openProfile(e)} style={{ marginTop: 10 }}>
        <Typography style={{ textDecoration: "none", color: "#1daee1" }} variant="inherit">
          My Account
        </Typography>
      </MenuItem>
      {/* <FeatureFlag feature={FEATURES.USER_MANAGEMENT}>
        </FeatureFlag> */}
      {(stateApp?.user?.roles?.includes("Owner") || stateApp?.user?.roles?.includes("Admin")) && (
        <MenuItem className={classes.userMenuItem} onClick={(e) => openUserManagement(e)}>
          <Typography style={{ textDecoration: "none", color: "#1daee1" }} variant="inherit">
            User Management
          </Typography>
        </MenuItem>
      )}
      <MenuItem className={classes.userMenuItem} onClick={handleLogout}>
        <Typography variant="inherit">Logout</Typography>
      </MenuItem>
    </Menu>
  ));

  return (
    <>
      <IconButton style={{ left: "8.5px" }} onClick={handleProfileMenuOpen}>
        {profileImage ? <Avatar src={profileImage} size="38" round /> : <Avatar name={stateApp.user.displayName} size="38" round />}
      </IconButton>
      <RenderMenu />
      {openProfileModal && <ProfileProvider />}
      {openUserManagementModal && <UserManagementProvider />}
    </>
  );
}
