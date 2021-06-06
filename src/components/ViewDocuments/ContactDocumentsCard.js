import React, { useState, useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Link from "@material-ui/core/Link";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import CircularProgress from "@material-ui/core/CircularProgress";

import { AppContext } from "AppContext";
import { NavigationContext } from "components/Navigation/NavigationContext";
import ViewDocuments from "./ViewDocuments";
import { CONTACT } from "graphQL/useQueryContact";
import { DELETEDESCRIPTORFILE } from "graphQL/useMutationDeleteDescriptorFile";

export default function ContactDocumentsCard(props) {
  let history = useHistory();
  const [stateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [contactData, setContactData] = useState(null);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);

  const contactId =
    history.location.pathname.split("/")[
      history.location.pathname.split("/").length - 2
    ];

  const [getContact, { data }] = useLazyQuery(CONTACT);
  const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);

  useEffect(() => {
    if (contactId) {
      getContact({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId, getContact]);

  useEffect(() => {
    if (data && data.contact) {
      setContactData(data.contact);
    }
  }, [data]);

  const handleDeleteCancel = () => {
    setFileIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
  };

  const handleDeleteAccept = () => {
    // Delete Document Logic goes here
    if (fileIdToDelete) {
      deleteFile({
        variables: {
          id: fileIdToDelete,
        },
        refetchQueries: ["getRecentContactFiles", "getContactFiles"],
        awaitRefetchQueries: true,
      });
      setFileIdToDelete(null);
      setOpenDeleteConfirmDialog(false);
    }
  };

  const checkModuleHistory = () => {
    return !!stateNav.contactFromMap;
  };

  return contactData ? (
    <div variant="outlined">
      <Toolbar style={{ backgroundColor: "#F0F6F8" }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {checkModuleHistory() && (
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => {
                history.push("/");
                setStateNav((stateApp) => ({
                  ...stateApp,
                  contactFromMap: false,
                }));
              }}
            >
              Map
            </Link>
          )}
          <Link
            style={{
              marginLeft: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => history.push("/contacts")}
          >
            Contacts
          </Link>
          <Link
            style={{
              marginLeft: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => history.push(`/contact/details/${contactId}`)}
          >
            {contactData?.name}
          </Link>
          <Typography
            style={{
              color: "#18AADD",
              fontSize: "16px",
              marginLeft: "5px",
            }}
          >
            Documents
          </Typography>
        </Breadcrumbs>
      </Toolbar>

      <ViewDocuments
        contactId={contactId}
        user_id={stateApp.user.email}
        openDeleteConfirmDialog={openDeleteConfirmDialog}
        handleClose={handleDeleteCancel}
        handleAccept={handleDeleteAccept}
        setOpenDeleteConfirmDialog={setOpenDeleteConfirmDialog}
        setFileIdToDelete={setFileIdToDelete}
      />
    </div>
  ) : (
    <div
      style={{
        padding: "20px",
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: "50",
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
