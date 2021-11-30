
const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },

    {
        name: "checkNumber", label: "Check Number", esKey: 'check.checkNumber.keyword', options: { sort: true, filter: true }
    },
    {
        name: "purchaserName", label: "Purchaser Name", esKey: 'check.payor.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "checkAmount", label: "Check Amount", esKey: 'check.checkAmount.keyword', options: { sort: true, filter: true }
    },
    {
        name: "checkDate", label: "Check Date", esKey: 'check.checkDate.keyword', options: { sort: true, filter: true }
    },
    {
        name: "depositeDate", label: "Deposite Date", esKey: 'check.depositDate.keyword', options: { sort: true, filter: true }
    },
    {
        name: "lines", label: "Lines", esKey: 'lines.keyword', options: { sort: true, filter: true }
    },
    {
        name: "source", label: "CDEX Source", esKey: 'check.source.keyword', options: { sort: true, filter: true }
    },
    {
        name: "checkId", label: "CDEX Check ID", esKey: 'check._id.keyword', options: { sort: true, filter: true }
    },
    {
        name: "status", label: "Status", esKey: 'check.status.keyword', options: { sort: true, filter: true }
    },
    {
        name: "tags", label: "Tags", esKey: 'tags.keyword', options: { sort: true, filter: true }
    },
    {
        name: "validation", label: "Validation", esKey: 'validation.keyword', options: { sort: true, filter: true }
    },
];

export default RevenueStatementHeadCells;