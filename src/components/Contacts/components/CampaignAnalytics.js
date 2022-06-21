// import React from "react";
// import { Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
// import { makeStyles } from "@material-ui/styles";

// import MyLocationIcon from "@material-ui/icons/MyLocation";
// import CampaignIcon from "components/Shared/svgIcons/campaign";
// import CloseIcon from "@material-ui/icons/Close";

// const cardsDefault = [
//   {
//     heading: "Active",
//     points: 4,
//   },
//   {
//     heading: "Inactive",
//     points: 145,
//   },
// ];

// const useStyles = makeStyles(() => ({
//   root: {
//     padding: "30px",
//   },
//   card: { borderRadius: "8px" },
//   noBorderCard: {
//     border: "none",
//     "& svg": {
//       fontSize: "5rem",
//       fill: "#b6d2f6",
//     },
//     "& .MuiTypography-root": {
//       fontWeight: "bold",
//     },
//     "& button": {
//       backgroundColor: "#eeeeee",
//       color: "black",
//       textTransform: "capitalize",
//       fontSize: 15,
//       fontWeight: "bold",
//       boxShadow: "none",
//       width: "300px",
//     },
//   },
//   cardHeaderTypography: {
//     fontWeight: "bolder",
//     marginBottom: "25px",
//   },
//   cardNumberTypography: {
//     fontWeight: 900,
//     fontSize: "xx-large",
//   },
//   cardContent: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     height: "235px",
//     textAlign: "left",
//     padding: "30px 16px",
//   },
//   buttonCardContent: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     height: "235px",
//     alignItems: "center",
//   },
//   issuesBadges: {
//     display: "flex",
//     alignItems: "center",
//     color: "red",
//     height: "20px",
//   },
//   title: {
//     display: "flex",
//     justifyContent: "space-between",
//     "& .MuiTypography-root": {
//       width: "100%",
//       fontWeight: "bolder",
//       fontSize: "1.5rem",
//     },
//   },
//   titleClose: {
//     float: "right",
//     cursor: "pointer",
//   },
//   modalContent: {
//     // fontWeight: "bold",
//     maxWidth: "400px",
//     padding: "15px 35px",
//   },
//   modal: {
//     textAlign: "center",
//     fontSize: "1.3rem",
//     zIndex: 9999999999,
//     "& .MuiDialog-paper": {
//       borderRadius: "20px",
//     },
//   },
// }));

// const SmartCampaignDialog = ({ onClose }) => {
//   const classes = useStyles();
//   return (
//     <Dialog open={true} className={classes.modal}>
//       <DialogTitle className={classes.title} id="customized-dialog-title">
//         Smart Campaigns
//         <CloseIcon fontSize="large" className={classes.titleClose} onClick={onClose} />
//       </DialogTitle>
//       <DialogContent className={classes.modalContent}>
//         <p>Smart Campaigns are an enerprise feature.</p>
//         <p>
//           These solutions are intended to add automations that integrate our customer's in-house technology systems and/or data with our
//           platform systems and our data to build a robust and highly targeted marketing solution.
//         </p>
//         <p>
//           Contact us at<br></br>
//           <a href="sales@m1neral.com">sales@m1neral.com</a>
//           <br></br>
//           for more details
//         </p>
//       </DialogContent>
//     </Dialog>
//   );
// };

// const CampaignAnalytics = () => {
//   const classes = useStyles();
//   const [isDialogActive, setDialog] = React.useState(false);

//   return (
//     <>
//       <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
//         <Grid item md={3}>
//           <Card variant="outlined" className={classes.noBorderCard}>
//             <CardContent className={classes.buttonCardContent}>
//               <CampaignIcon />
//               <Typography variant="h6" component="div">
//                 Classic Campaign
//               </Typography>
//               <Button variant="contained">Create Classic Campaign</Button>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item md={3}>
//           <Card variant="outlined" className={classes.noBorderCard} onClick={() => setDialog(true)}>
//             <CardContent className={classes.buttonCardContent}>
//               <MyLocationIcon />
//               <Typography variant="h6" component="div">
//                 Smart Campaign
//               </Typography>
//               <Button variant="contained">Create Smart Campaign</Button>
//             </CardContent>
//           </Card>
//         </Grid>
//         {cardsDefault.map((card, index) => (
//           <Grid item md={3} key={index}>
//             <Card variant="outlined" className={classes.card}>
//               <CardContent className={classes.cardContent}>
//                 <Typography variant="h4" component="div" className={classes.cardHeaderTypography}>
//                   {card.heading}
//                 </Typography>
//                 <Typography variant="h4" component="div" className={classes.cardNumberTypography}>
//                   {card.points}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       {isDialogActive && <SmartCampaignDialog onClose={() => setDialog(false)} />}
//     </>
//   );
// };

// export default CampaignAnalytics;

import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  card: { borderRadius: "8px" },
  cardHeaderTypography: {
    fontWeight: "bolder",
    marginBottom: "25px",
  },
  cardNumberTypography: {
    fontWeight: 900,
    fontSize: "xx-large",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "160px",
    textAlign: "left",
  },
  issuesBadges: {
    display: "flex",
    alignItems: "center",
    color: "#ff0000",
    height: "20px",
  },
  tooltip: {
    position: "absolute",
    top: 72,
    color: "rgb(255, 0, 0)",
    width: 200,
    left: -148,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: "120%",
    textAlign: "left"
  }
}));


export default function CampaignAnalytics(props) {
  // console.log("props--->",props);
  const classes = useStyles();
  const [tooltip, showTooltip] = useState(false);
  return (
    <Grid style={{marginTop: 0, marginBottom: 0}} container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Total Campaigns
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {/* {props.checks} */}
              88
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Open Campaigns
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {/* {props.approvedCount} */}
              54
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Closed Campaigns
            </Typography>
            <Typography 
              variant="h6" 
              component="div" 
              className={classes.cardNumberTypography} 
              // style={{ color: "#b9b908" }}
              >
              {/* {props.unapprovedCount} */}
              34
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3} style={{ position: "relative" }}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent} onMouseOver={() => showTooltip(true)} onMouseOut={() => showTooltip(false)}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
             Total NRA
            </Typography>
            {/* hiding until we have more warning types/rules --kc 02/06/2022 */}
            {/* <div className={classes.issuesBadges}>
              <div style={{ marginRight: 6 }}>
                <WarningIcon />
              </div>
              <div>{props.potentialIssues.length}</div>
            </div> */}
            <Typography 
              variant="h6" 
              component="div" 
              className={classes.cardNumberTypography} 
              // style={{ color: "red" }}
              >
              {/* {props.potentialIssues.length} */}
              76,095
            </Typography>
          </CardContent>

        </Card>

        {/* {tooltip && (
          <div className={classes.tooltip}>
            <p className={classes.tooltipText}>Sum of check details does not match check amount</p>
          </div>
        )} */}

      </Grid>
    </Grid>
  );
}
