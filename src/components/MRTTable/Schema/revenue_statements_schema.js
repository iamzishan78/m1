import React from "react";
import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink.js";
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { Warning as WarningIcon, CheckCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from 'components/Shared/functions';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    position: "absolute",
    top: 15,
    display: "none",
    color: "rgb(255, 0, 0)",
    width: 200,
    left: -150,
  }
}));

const esIndex = 'checks_flat';

const RevenueStatementsMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  maxTableHeight: 'calc(100vh - 500px)',
  isInFiniteScroll: true,
  columnVirtualization: true,
  TableSchema: [
    {
      ...CommonSchema.HIDDEN,
      name: 'id',
      accessorKey: 'id',
    },

    {
      ...CommonSchema.HIDDEN,
      name: '_id',
      accessorKey: '_id',
    },
    {
      ...CommonSchema.INITAIL_PINNED,
      name: 'checkNumber.keyword',
      accessorKey: 'checkNumber',
      header: 'Check Number',
      Cell: ({ renderedCellValue, row }) => {
        return (
          <ColumnWithLink
            value={(row?.original?.checkNumber ? `${row?.original?.checkNumber} - ${row.getValue('payor.name')}` : row.getValue('payor.name')) || "NA"}
            link={`/revenue/statement/details/${row.getValue('_id')}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )
      },
    },
    {
      ...CommonSchema.HIDDEN,
      name: 'payor.name.keyword',
      accessorFn: row => row?.payor?.name,
      id: 'payor.name',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'checkAmount',
      accessorFn: row => row?.checkAmount,
      id: 'checkAmount',
      header: 'Check Amount',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'checkDate',
      accessorFn: row => row?.checkDate,
      id: 'checkDate',
      header: 'Check Date',
      simple: true,
      type: 'date',
      isSearchField: false,
      Cell: ({ renderedCellValue, row }) => {
        return <>{formatDate(row?.original?.checkDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'payee.name.keyword',
      accessorFn: row => row?.payee?.name,
      id: 'payee.name',
      header: 'Owner Name',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'payee.number.keyword',
      accessorFn: row => row?.payee?.number,
      id: 'payee.number',
      header: 'Owner Number',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'depositDate',
      accessorFn: row => row?.depositDate,
      id: 'depositDate',
      header: 'Deposit Date',
      simple: true,
      type: 'date',
      isSearchField: false,
      Cell: ({ renderedCellValue, row }) => {
        return <>{formatDate(row?.original?.depositDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'checkDetail.lines',
      accessorFn: row => row?.checkDetail?.lines,
      id: 'checkDetail.lines',
      header: 'Lines',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'source.keyword',
      accessorFn: row => row?.source,
      id: 'source',
      header: 'Source',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'sourceId.keyword',
      accessorFn: row => row?.sourceId,
      id: 'sourceId',
      header: 'Check ID',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'approvalStatus.keyword',
      accessorFn: row => row?.approvalStatus,
      id: 'approvalStatus',
      header: 'Approval Status',
    },
    {
      ...CommonSchema.TAGS,
      Cell: ({ row }) => {
        const targetSourceId = row.getValue('_id');
        const targetLabel = 'check';
        return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={targetLabel} />;
      },

    },
    {
      ...CommonSchema.COMMENTS,
      Cell: ({ renderedCellValue, row }) => {
        const id = row.getValue('_id');
        const targetLabel = 'check';
        return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
      },
    },
    {
      size: 220,
      name: 'isAmountValidated',
      accessorFn: row => row?.isAmountValidated,
      id: 'isAmountValidated',
      header: "",
      enableColumnActions: false,
      enableHiding: false,
      enableColumnFilter: false,
      isExport: false,
      enableColumnOrdering: false,
      enableResizing: false,
      filter: false,
      isSearchField: false,
      Cell: ({ renderedCellValue, row }) => {
        const classes = useStyles();
        return <>
          {renderedCellValue === "true" ? (
            <div className="flex justifyCenter alignCenter success w-100">
              <CheckCircle size={20} />
            </div>
          ) : (
            <div
              className="flex justifyCenter alignCenter warning w-100"
              onMouseOver={() => (document.getElementById(`alertTootip${row?.index}`).style.display = "block")}
              onMouseOut={() => (document.getElementById(`alertTootip${row?.index}`).style.display = "none")}
              style={{ marginRight: 6, position: "relative", zIndex: 100 }}
            >
              <WarningIcon />

              <div id={`alertTootip${row.index}`} className={classes.tooltip}>
                <p style={{ fontSize: 14, lineHeight: "120%", textAlign: "left" }}>Sum of check details does not match check amount</p>
              </div>
            </div>
          )
          }
        </>;
      },
    },
  ],
};

export default RevenueStatementsMeta;
