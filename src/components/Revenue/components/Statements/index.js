import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import FilterIcon from "components/Shared/svgIcons/filter";
import ViewColumnIcon from "components/Shared/svgIcons/view_column";
import SearchIcon from "@material-ui/icons/Search";

import { useLazyQuery } from "@apollo/client";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    "& .MuiTableBody-root": {
      height: "50px",
    },
    "& .MuiPaper-root > .MuiToolbar-gutters": {
      paddingLeft: "11px !important",
    },
    "& .MUIDataTableToolbar": {
      zIndex: "999999 !important",
    },
    "& .MuiPaper-elevation1": {
      flexDirection: "row !important",
      height: "65px !important",
      width: "100% !important",
      display: "flex !important",
      flex: "auto",
      alignItems: "center !important",
    },
    "& .MuiButton-text": {
      padding: "5px 12px",
      minWidth: "max-content",
    },
    "& .Mui-disabled": {
      backgroundColor: "transparent",
    },
    "& .MuiToolbar-root": {
      backgroundColor: "#ebebeb",
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
    },
    "& .MuiToolbar-regular > div:nth-child(2) .MuiIconButton-root": {
      backgroundColor: "#D4E8F1",
      margin: "0 2px",
    },
    "& .MuiTableCell-paddingCheckbox": {
      position: "relative"
    },
    "& .MuiToolbar-regular > div:nth-child(2)": {
      flex: "0 1 auto",
    },
    "& .MuiTableHead-root": {
      "& th": {
        backgroundColor: "#ebebeb",
        zIndex: "auto",
        "& button": {
          "& .MuiButton-label": {
            textAlign: "left",
          },
        },
      },
    },
    "& thead": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
      zIndex: 999,
      position: "sticky",
    },
    "& tbody": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
      height: "50px",
    },
  },
  loadingTable: {
    "& thead": { opacity: "0" },
    "& tbody": { opacity: "0" },
  },
  emptyTable: {
    "& thead": { opacity: "0" },
  },
  icons: {
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "#dadbde !important",
    },
  },
  colorIcon: {
    marginLeft: "auto",
    color: `${theme.palette.secondary.main} !important`,
    "&:hover": {
      backgroundColor: "#dadbde !important",
    },
  },
  iconSelected: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    color: "#011133 !important",
    "& p": {
      color: "#011133 !important",
    },
  },
  multiSelectionTopBarButtons: {
    margin: "0px 5px",
    fontWeight: "600",
    backgroundColor: "rgba(1, 17, 51, 1)",
    color: "#fff",
    border: "1px solid #B3B3B3",
    "&:hover": {
      backgroundColor: "#263451",
      color: "#fff",
    },
  },
  selectPopover: {
    zIndex: "88890 !important",
  },
  selectMenu: {
    zIndex: "88891 !important",
  },
  clickableCell: {
    cursor: "pointer",
    padding: "10px 10px 10px 10px",
    position: "relative",
    minWidth: "100px",
    borderRadius: "7px",
    color: "#17aadd",
    "&:hover": {
      textDecoration: "underline",
    },
    fontWeight: "bold",
  },
}));

export default function RevenueStatements() {
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [approvedRows, setApprovedRows] = useState([]);
  const [unApprovedRows, setUnApprovedRows] = useState([]);
  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });
  const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });
  const tableData = elasticData?.getESPaginatedList;
  console.log("filtersData", filtersData);

  const [columns, setColumns] = useState([
    { name: "checkNumber", label: "Check Number" },
    { name: "purchaserName", label: "Purchaser Name" },
    { name: "checkAmount", label: "Check Amount" },
    { name: "checkDate", label: "Check Date" },
    { name: "depositeDate", label: "Deposite Date" },
    { name: "lines", label: "Lines" },
    { name: "source", label: "CDEX Source" },
    { name: "id", label: "CDEX Check ID" },
    { name: "status", label: "Status" },
    { name: "tags", label: "Tags", },
    { name: "validation", label: "Validation" },
  ]);

  useEffect(() => {
    if (columns) {
      columns.forEach((column) => {
        switch (column.name) {
          case "checkNumber":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <p style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}>
                    {value}
                  </p>
                );
              },
            };
            break;
          case "checkAmount":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <p style={{ fontWeight: 600 }}>
                    {`$${value}`}
                  </p>
                );
              },
            };
            break;
          case "status":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <div className="flex justifyStart alignCenter">
                    {value.toLowerCase() === "approved" && (<div style={{ background: "#17c10d", height: 12, width: 12, marginRight: 8, borderRadius: "50%" }} />)}
                    {value.toLowerCase() === "imported" && (<div style={{ background: "#ffa800", height: 12, width: 12, marginRight: 8, borderRadius: "50%" }} />)}
                    {value}
                  </div>

                );
              },
            };
            break;
          default:
            break;
        }
      });
      setColumns(columns);
    }
  }, [columns]);


  useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex: "checkdetails_flat",
        pagination: {
          first: 50,
          keep_alive: "1micros"
        },
      }
    });

    getFilters({
      variables: {
        esIndex: "checkdetails_flat",
        filterKey: "check.status",
        search: "",
        size: 50,
      },
    });

  }, []);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      let hits = tableData?.hits;
      setRows(hits);
      setCount(tableData?.total);
      const approved = hits.filter((hit) => hit["_source"]["check"]["status"] === "APPROVED" && hit);
      const unApproved = hits.filter((hit) => hit["_source"]["check"]["status"] === undefined && hit);
      setApprovedRows(approved);
      setUnApprovedRows(unApproved);
    } else if (tableData?.hits?.length === 0) {
      setRows([]);
      setCount(0);
    }
  }, [tableData]);

  const data = [
    {
      checkNumber: "123456789", purchaserName: "Test Corp 1", checkAmount: 80, checkDate: "01/01/2021",
      depositeDate: "02/01/2021", lines: 122, source: "ENERGYLINK", id: `224453`, status: "Approved",
    },
    { checkNumber: "345678576", purchaserName: "Test Corp 2", checkAmount: 180, checkDate: "01/01/2021", depositeDate: "02/01/2021", lines: 3765, source: "ENERGYLINK", id: `224453`, status: "Imported", },
    { checkNumber: "456798575", purchaserName: "Test Corp 3", checkAmount: 5680, checkDate: "01/01/2021", depositeDate: "02/01/2021", lines: 5445, source: "ENERGYLINK", id: `224453`, status: "Approved", },
    { checkNumber: "656783456", purchaserName: "Test Corp 4", checkAmount: 86659, checkDate: "01/01/2021", depositeDate: "02/01/2021", lines: 465, source: "ENERGYLINK", id: `224453`, status: "Imported", }
  ];

  const options = {
    filterType: 'dropdown',
    print: false,
  };

  return (
    <div style={{ padding: 75 }}>
      <AnalyticsCards checks={count} approved={approvedRows.length} unApproved={unApprovedRows.length} />
      <div style={{ marginTop: 32 }} className={classes.table}>
        <MUIDataTable
          title={"Revenue Checks"}
          data={data}
          columns={columns}
          options={options}
          components={{
            icons: {
              SearchIcon,
              FilterIcon,
              ViewColumnIcon,
            },
          }}
        />
      </div>
    </div>
  );
}