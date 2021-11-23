import { InputAdornment } from "@material-ui/core"

const tableData = [
    {
        label: 'Agreement Number',
        type: 'text',
        key: 'agreementNumber'
    },
    {
        label: 'Agreement Name',
        type: 'text',
        key: 'agreementName'
    }, {
        label: 'Agreement Type',
        type: 'autocomplete',
        key: 'agreementType'
    }, {
        label: 'Rights Type',
        type: 'autocomplete',
        key: 'rightsType'
    }, {
        label: 'Agreement Status',
        type: 'autocomplete',
        key: 'agreementStatus'
    }, {
        label: 'Lessor (Grantor)',
        type: 'text',
        key: 'grantor'
    },
    {
        label: 'Lessee (Grantee)',
        type: 'text',
        key: 'grantee'
    },
    {
        label: 'Agreement Date',
        type: 'date',
        key: 'agreementDate'
    },
    {
        label: 'Effective Date',
        type: 'date',
        key: 'effectiveDate'
    },
    {
        label: 'Expiration Date',
        type: 'date',
        key: 'expirationDate'
    },
    {
        label: 'Extension Date',
        type: 'date',
        key: 'extensionDate'
    },
    {
        label: 'Bonus Payment',
        type: 'text',
        key: 'bounusPayment',
        formatValue: (value) => `$ ${value}`,
        InputProps: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
    },
    {
        label: 'Report Gross Acres',
        type: 'number',
        key: 'reportGrossAcres'
    },
    {
        label: 'Gross Acres',
        type: 'number',
        key: 'grossAcres'
    },
    {
        label: 'Net Acres',
        type: 'number',
        key: 'netAcres'
    }
]
export default tableData