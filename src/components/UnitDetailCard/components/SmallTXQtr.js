import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
  table: {
    height: "calc(100% - 1px) !important",
    width: "100%  !important",
  },
  tableRow: {
    "& > td": {
      border: "2px dashed #D7D7D7",
      padding: "0",
      "&:hover": {
        backgroundColor: "#BFEBFB !important",
      },
    },
  },
});

export default function SmallTXQtr(props) {
  const classes = useStyles();
  const array5 = [1, 2, 3, 4, 5];

  return (
    <Table aria-label="simple table" className={classes.table}>
      <TableBody>
        {array5.map((e, i) => (
          <TableRow className={classes.tableRow} key={i}>
            {array5.map((e2, j) => (
              <TableCell key={j} />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
