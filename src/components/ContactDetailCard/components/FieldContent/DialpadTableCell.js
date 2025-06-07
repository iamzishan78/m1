import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcCallIcon from "@material-ui/icons/AddIcCall";
import {  useMutation } from "@apollo/client";

import { FEATURES } from "components/Shared/FeatureFlag/common";
import { globalStateController } from "hookstate/globalStateController";
import { INITIATE_DIALPAD_CALL } from "graphQL/useMutationInitiateCall";
import { useDispatch } from "react-redux";
import { showErrorMessage, showInfoMessage, showSuccessMessage } from "actions";

const useStyles = makeStyles((theme) => ({
  phoneContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  phoneNumber: {
    marginRight: theme.spacing(1),
    fontSize: "0.9rem",
  },
  callButton: {
    padding: theme.spacing(0.5),
  },
}));

export default function DialpadTableCell(props) {
  const classes = useStyles();

  const { globalState } = globalStateController.useState(['user'], 'globalState');
  const feature = globalState?.user?.features?.find(feature => feature.name === FEATURES.DIALPAD_INTEGRATION);
  const isDialPad = props.row?.original?.dialpadIds?.length && feature;

  const [initiateDialpadCall] = useMutation(INITIATE_DIALPAD_CALL);
  const dispatch = useDispatch();

  const handleCall = () =>{
    if (isDialPad && globalState.user?.dialpad) {
      dispatch(showInfoMessage('Initiating call...'));
      initiateDialpadCall({
        variables: { phoneNumber: props.value, dialpadUserId: globalState?.user?.dialpad?.id },
      }).then(({ data }) => {
        if (data?.initiateDialpadCall?.success) {
          dispatch(showSuccessMessage('Call initiated successfully'));
        } else {
          dispatch(showErrorMessage(data?.initiateDialpadCall?.message));
        }
      });
    } else if (isDialPad && !globalState.user?.dialpad) {
      dispatch(showErrorMessage('User not found on Dialpad. Please Contact Admin.'));
    }

  }
  return (
    <div>
      {props.value && (
        <div className={classes.phoneContainer}>
          <span className={classes.phoneNumber}>{props.value}</span>
          <Tooltip title={'Call'} placement="top">
            <IconButton
              size="small"
              href={isDialPad ? '' : `tel: ${props.value}`}
              className={classes.callButton}
              onClick={() => {
                handleCall()
              }}
            >
              <AddIcCallIcon htmlColor="#757575" id={'dialpad'} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
}