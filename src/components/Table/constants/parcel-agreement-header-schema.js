import { Chip } from "@material-ui/core";
import ListChips from "components/Common/ListChips";
import GlobalSettings from "../../../GlobalSettings";
const ParcelAgreementHeadCells = [

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
        name: "descriptorObject",
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
        name: "instrumentType",
        label: "Instrument Type",
        esKey: "instrumentType.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "fromPartySummary",
        label: "Party of the First (Grantor)",
        esKey: "fromPartySummary.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "toPartySummary",
        label: "Party of the Second (Grantee)",
        esKey: "toPartySummary.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "effectiveDate",
        label: "Effective Date",
        esKey: "effectiveDate",
        options: {
            dbName: "effectiveDate",

        },
        custom: {
            isDate: true,
        },
    },
    {
        name: "executionDate",
        label: "Instrument Date",
        esKey: "executionDate",
        options: {
            display: true,
        },
        custom: {
            isDate: true,
        },
    },
    {
        name: "fileDate",
        label: "File Date",
        esKey: "fileDate",
        options: {
            display: true,
        },
        custom: {
            isDate: true,
        },
    },
    {
        name: "recordType",
        label: "Record Type",
        esKey: "recordType.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "recordationNumber",
        label: "Rec #",
        esKey: "recordationNumber.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "volume",
        label: "Volume",
        esKey: "volume.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "page",
        label: "Page",
        esKey: "page.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "legalDescription",
        label: "Legal Description",
        esKey: "legalDescription.keyword",
        options: {
            display: true,
        },
    },
    {
        name: "fileId",
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
        name: "fileName",
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
        name: "tags",
        label: "Tags ",
        esKey: "tags.tag.keyword",
        options: {
            sort: false,
            download: false,
            print: false,
            filterOptions: {
                names: [],
                logic(rowVal, pickedTags) {
                    let containIts = true;
                    pickedTags.map((pickedTag) => {
                        if (rowVal[0].indexOf(pickedTag) === -1) {
                            containIts = false;
                        }
                    });
                    return !containIts;
                },
            },
        },
    },

    {
        name: "commentsCounter",
        label: " ",
        options: {
            filter: false,
            searchable: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
    {
        name: " ",
        label: " ",
        options: {
            filter: false,
            searchable: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
        },
    },

    {
        name: "viewToken",
        label: "View Token",
        options: {
            display: false,
            filter: false,
            searchable: false,
            sort: false,
            viewColumns: false,
        }
    },

];

export default ParcelAgreementHeadCells;
