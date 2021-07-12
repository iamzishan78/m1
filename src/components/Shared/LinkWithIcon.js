import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useLazyQuery } from "@apollo/client";
import Tooltip from "@material-ui/core/Tooltip";
import LinkIcon from '@material-ui/icons/Link';
import { Grid, Container, Box, Typography, Badge } from "@material-ui/core";
import RightDialog from "../ContactDetailCard/components/RightDialog";
import CloseSharp from "@material-ui/icons/CloseSharp";
import { LINKED_GLOBAL_OWNERS } from "../../graphQL/useQueryLinkedGlobalOwners";

export default function LinkWithIcon(props) {
  const [openDialog, setOpenDialog] = useState(false);

  const [getLinkedGlobalOwners, { data }] = useLazyQuery(LINKED_GLOBAL_OWNERS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (props.objectId) {
      getLinkedGlobalOwners({
        variables: {
          contactId: props.objectId,
        },
      });
    }
  }, [props.objectId]);

  const useStyles = makeStyles((theme) => ({
    icons: {
      color: "#ffffff",
      marginLeft: "auto",
      "&:hover": {
        backgroundColor:
          props.targetLabel === "deal" ? "#dadbde88 !important" : "#031d40",
      },
    },
    iconSelected: {
      color: theme.palette.secondary.main,
      "& svg": {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
    heading: {
      fontSize: "initial",
      fontWeight: 800,
      marginBottom: "10px"
    },
    badge: {
      "& .MuiBadge-anchorOriginTopRightRectangle": {
        top: "7px"
      }
    }

  }));

  const classes = useStyles();

  const getGlobalOwners = () => {
    return data && data.linkedGlobalOwners && data.linkedGlobalOwners.data ? data.linkedGlobalOwners.data : []
  }

  return (
    <React.Fragment>
      <Tooltip
        title={"Linked Global Owner"}
        placement="top"
      >
        <Badge className={classes.badge} badgeContent={props.iconZiseSmall ? null : getGlobalOwners().length} color="secondary">
          <IconButton
            size={props.iconZiseSmall ? "small" : "medium"}
            color="primary"
            className={`${classes.icons}  ${openDialog || (getGlobalOwners().length > 0)
              ? classes.iconSelected
              : ""
              }`}
            onClick={() => { setOpenDialog(true) }}
            aria-label="show linked global owner"
          >
            <LinkIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      {openDialog && (
        <RightDialog open={true}>
          <Container maxWidth="sm" className={classes.gridWidthScroll}>
            <div className={classes.dealContainer}>

              <Box pb={3} pt={1}>
                <Grid container direction="row" spacing={4} justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography className={classes.topHeading} style={{ fontWeight: "bold" }} variant="h5" component="h2">
                      Linked Platform Owners
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton aria-label="delete" color="primary" onClick={() => setOpenDialog(false)}>
                      <CloseSharp />
                    </IconButton>
                  </Grid>
                </Grid>
                {
                  getGlobalOwners().length > 0 ?
                    <>
                      <Box mt={2}>
                        <Typography>
                          The below platform owners are linked to the selected contact.
                        </Typography>
                      </Box>

                      <Box pt={3}>
                        <Typography style={{ fontWeight: "bold" }}>Platform owners</Typography>
                      </Box>
                    </> :
                    <Box mt={2}>
                      <Typography>
                        No Platform Owner linked to selected contact.
                      </Typography>
                    </Box>
                }
              </Box>

              <Grid container justify='center' alignItems='center' className={classes.heading}>
                <Grid item md={3}>Owner ID</Grid>
                <Grid item md={9}>Name &amp; Address</Grid>
              </Grid>

              {getGlobalOwners().map((row) => (
                <Grid container direction="row" spacing={2} alignItems="center" key={row.id}>
                  <Grid item md={12}>
                    <Typography style={{ backgroundColor: "#edfbff" }}>
                      <Grid container justify='center' alignItems='center'>
                        <Grid item md={3}>{row.id}</Grid>
                        <Grid item md={9}>
                          <Grid container>
                            <Grid item md={12}>{row.name}</Grid>
                            <Grid item md={12}>{row.address1} {row.address2} {row.city}, {row.state} {row.zip}</Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </div>
          </Container>
        </RightDialog>
      )}

    </React.Fragment>
  );
}
