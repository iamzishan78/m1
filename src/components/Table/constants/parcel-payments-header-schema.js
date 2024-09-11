
/* props is just a style object*/

const PaymentsHeadCells = [
    {
        name: "_id",
        options: {
            display: false,
            filter: false,
            searchable: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
    {
        name: "paymentType",
        label: "Payment Type",
        esKey: 'paymentType.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "startDate",
        label: "Start Date",
        esKey: 'startDate',
        options: {
            filter: true
        },
        custom: { isDate: true, key_as_string: true },
    },
    {
        name: "endDate",
        label: "End Date",
        esKey: 'endDate',
        options: {
            filter: true
        },
        custom: { isDate: true, key_as_string: true },
    },
    {
        name: "frequency",
        label: "Frequency",
        esKey: 'frequency.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "nextPayment",
        label: "Next Payment",
        esKey: 'nextPayment.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "amount",
        label: "Amount",
        esKey: 'amount.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "companyShare",
        label: "Company Share",
        esKey: 'companyShare.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "responsibleParty",
        label: "Responsible Party",
        esKey: 'responsibleParty.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "assignedTo",
        label: "Assigned To",
        esKey: 'assignedTo.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "paymentStatus",
        label: "Payment Status",
        esKey: 'paymentStatus.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "calendarLinks",
        label: "Calendar Link",
        esKey: 'calendarLinks.keyword',
        options: {
            filter: true
        },
    }
];


export default PaymentsHeadCells;



