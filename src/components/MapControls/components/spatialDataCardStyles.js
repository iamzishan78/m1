import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: "0px"
  },
  card: {
    //font
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontSize: ".75rem",

    background: "#011133",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#011133",
    width: "200px",
    height: "350px",
    position: "absolute",
    top: "10vh",
    left: "10vw"
  },

  cardHeader: {
    padding: "0px",
    height: "10%"
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: "1rem",
    color: "#FFFFFF",
    textTransform: "uppercase",
    position: "relative",
    height: "1rem",
    left: "7.46%",
    right: "39.32%",
    top: "calc(50% - 23px/2 - 140px)"
  },
  subheader: {
    fontWeight: 300,
    lineHeight: "16px",
    color: "#FFFFFF",
    position: "relative",
    height: "17px",
    left: "7.46%",
    right: "58.31%",
    top: "calc(50% - 17px/2 - 120px)"
  },
  cardAction: {
    color: "black",
    width: "100%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#fff"
  },
  cardContent: {
    height: "10%",
    backgroundColor: "#fff",
    padding: "0px",
    paddingBottom: "0px"
  },
  actionWrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly"
  },
  input: {
    display: "flex",
    marginLeft: "0px",
    marginBottom: "15px"
  },
  label: {
    width: "60px"
  },
  btn: {
    padding: "0px",
    width: "75px",
    height: "25px",
    backgroundColor: "blue",
    color: "white",
    borderRadius: "5px",
    marginLeft: "50%"
  },
  buttonContainer: {
    height: "10%",
    display: "flex",
    padding: "1%",
    backgroundColor: "#fff",
    paddingBottom: "0px",
    "&:last-child": { padding: "0px" }
  },
  button: {
    width: "50%",
    margin: "1%",
    fontSize: ".5rem"
  }
}));
