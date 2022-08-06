import GlobalSettings from "..//..//..//GlobalSettings.js";
import WellIcon from '../../../components/Shared/svgIcons/well.js';
import { ErrorOutline } from "@material-ui/icons";
import React from 'react';
import { useHistory } from "react-router-dom";

const styles = {
  width: "fit-content",
  fontWeight: 600,
  color: "#17aadd",
  cursor: "pointer",
};

const ComponentPropertyName = ({ value, tableMeta }) => {
  const history = useHistory();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    // style={{borderRight: 'solid red'}}
    >
      <p
        onClick={(e) => {
          e.stopPropagation();
          history.push(`/revenue/property/details/${tableMeta.rowData[0]}`);
        }}
        style={styles}
      >
        {/* {splitNumber?.[0]} */}
        {value?.split("_")?.[0]
          ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[2]}`
          : tableMeta?.rowData[2]}

      </p>
      {/* <Button/> */}
      {
        !(tableMeta?.rowData[5] && tableMeta?.rowData[6]) &&
        <div style={{ marginLeft: "15px", cursor: 'pointer' }} onClick={(e) => {
          e.stopPropagation();
          history.push(`/revenue/property/details/${tableMeta.rowData[0]}`, { focusOnWellSearch: true });
        }}>
          <WellIcon size={"18"} opacity={"1"} color="gray" />
          <ErrorOutline style={{
            width: "17px",
            height: "17px",
            color:"gray"
          }} 
          />
        </div>
      }
    </div>
  );
}

// sort: true,
// filter: true,
// stickyColumn: true,
// viewColumns: false,
// display: true,

const RevenuePropertiesHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {

    /// this is the control column for properties 

    name: "number",
    label: "Property",
    esKey: "number.keyword",
    options: {

      ...GlobalSettings.muiGridControlOptions,


      // setCellProps: () => ({
      //   style: {
      //     minWidth: "150px",
      //     whiteSpace: "nowrap",
      //     position: "sticky",
      //     left: "77px",
      //     background: "white",
      //     zIndex: 200,
      //     boxShadow: 'inset -1px 0px 0px 0px lightgrey',
      //   }
      // }),
      // setCellHeaderProps: () => ({
      //   style: {
      //     position: "sticky",
      //     minWidth: "150px",
      //     left: "77px",
      //     zIndex: 201,
      //     // boxShadow: 'inset -1px 0px 0px 0px lightgrey',
      //   }
      // }),


      customRender: (value, tableMeta) => <ComponentPropertyName value={value} tableMeta={tableMeta} />,
    },
  },
  {
    name: "name",
    label: "Property Name",
    esKey: "name.keyword",
    options: {
      sort: true, filter: true,
      display: false
    },
    // options: {
    //   ...GlobalSettings.muiGridStandardOptions,
    //   display: false,
    // }
  },

  {
    name: "state",
    label: "State",
    esKey: "state.keyword",
    options: {
      sort: true,
      filter: true
    },
    // options: {
    //   ...GlobalSettings.muiGridStandardOptions,
    // }
  },
  {
    name: "county",
    label: "County",
    esKey: "county.keyword",
    options: { sort: true, filter: true },
  },


  {
    name: "wellApiNumber",
    label: "Well API",
    esKey: "wells.apiNumber.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "110px", maxWidth: "110px" } }),
    },
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wells.wellName.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "250px", maxWidth: "250px" } }),
    },
  },
  {
    name: "payorName",
    label: "Operator",
    esKey: "operator.name.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "225px" } }),
    },
  },
  {
    name: "status",
    label: "Pay Status",
    esKey: "status.keyword",
    options: { sort: true, filter: true },
  },
  // {
  //   name: "type",
  //   label: "Type",
  //   esKey: "type.keyword",
  //   options: { sort: true, filter: true },
  // },
  // {
  //   name: "amount",
  //   label: "Decimal",
  //   esKey: "amount",
  //   options: { sort: true, filter: true },
  // },
  {
    name: "checkNumber",
    label: "Last Check #",
    esKey: "lastCheck.checkNumber.keyword",
    options: {
      customHeadLabelRender: () => (
        <>
          <div style={{ width: 120 }}>Last Check #</div>
        </>
      ),
      sort: true,
      filter: true,
    },
    style: { minWidth: 120 },
  },
  {
    name: "lastChecked",
    label: "Last Check",
    esKey: "lastCheck.checkDate",
    options: {
      customHeadLabelRender: () => (
        <>
          <div style={{ width: 120 }}>Last Check</div>
        </>
      ),
      sort: true,
      filter: true,
    },
    style: { minWidth: 120 },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "prospectID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "acquisitionID",
    label: "Acquisition ID",
    esKey: "acquisitionID.keyword",
    options: { sort: true, filter: true },
  },


  {
    name: "internalID",
    label: "Internal Prop #",
    esKey: "internalID.keyword",
    options: {
      customHeadLabelRender: () => (
        <>
          <div style={{ minWidth: 100 }}>Internal Prop #</div>
        </>
      ),
      sort: true,
      filter: true,
    },
    style: { minWidth: 100 },
  },

  {
    name: "internalCompany",
    label: "Internal Company",
    esKey: "internalCompany.keyword",
    options: {
      customHeadLabelRender: () => (
        <>
          <div style={{ minWidth: 120 }}>Internal Company</div>
        </>
      ),
      sort: true,
      filter: true,
    },
    style: { minWidth: 120 },
  },

  {
    name: "source",
    label: "Source",
    esKey: "source.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "120px", maxWidth: "120px" } }),
    },
  },

  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      dbName: "comments.comment",
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "approvalStatus",
    label: "Status",
    esKey: "approvalStatus.keyword",
    options: {
      customHeadLabelRender: () => (
        <>
          <div> </div>
        </>
      ),
      sort: true,
      filter: true,
    },
  },
];

export default RevenuePropertiesHeadCells;
