
const TractsHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "tractNumber", label: "Tract #", esKey: 'shapeJson.properties.tractNumber.keyword', 
        options: { 
            dbName: "shapeJson.properties.tractNumber",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "tractName", label: "Tract Name", esKey: 'shapeJson.properties.tractName.keyword', 
        options: { 
            dbName: "shapeJson.properties.tractName",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "tractType", label: "Type", esKey: 'shapeJson.properties.tractType.keyword', 
        options: { 
            dbName: "shapeJson.properties.tractSubtype",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "tractSubtype", label: "Subtype", esKey: 'shapeJson.properties.tractSubtype.keyword', 
        options: { 
            dbName: "shapeJson.properties.tractSubtype",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "rightsType", label: "Rights", esKey: 'shapeJson.properties.rightsType.keyword', 
        options: { 
            dbName: "shapeJson.properties.rightsType",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "grantor", label: "Grantor (Party 1)", esKey: 'shapeJson.properties.grantor.keyword', 
        options: { 
            dbName: "shapeJson.properties.grantor",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "grantee", label: "Grantee (Party 2)", esKey: 'shapeJson.properties.grantee.keyword', 
        options: { 
            dbName: "shapeJson.properties.grantee",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "tractDate", label: "Agmt Date", esKey: 'shapeJson.properties.tractDate.keyword', 
        options: { 
            dbName: "shapeJson.properties.tractDate",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "effectiveDate", label: "Efftv Date", esKey: 'shapeJson.properties.effectiveDate.keyword', 
        options: { 
            dbName: "shapeJson.properties.effectiveDate",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "expirationDate", label: "Exp Date", esKey: 'shapeJson.properties.expirationDate.keyword', 
        options: { 
            dbName: "shapeJson.properties.expirationDate",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "extensionDate", label: "Ext Date", esKey: 'shapeJson.properties.extensionDate.keyword', 
        options: { 
            dbName: "shapeJson.properties.extensionDate",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "tractStatus", label: "Status", esKey: 'shapeJson.properties.tractStatus.keyword', 
        options: { 
            dbName: "shapeJson.properties.tractStatus",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "reportGrossAcres", label: "RPT GRS", esKey: 'shapeJson.properties.reportGrossAcres.keyword', 
        options: { 
            dbName: "shapeJson.properties.reportGrossAcres",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "grossAcres", label: "GRS", esKey: 'shapeJson.properties.grossAcres.keyword', 
        options: { 
            dbName: "shapeJson.properties.grossAcres",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "netAcres", label: "NET", esKey: 'shapeJson.properties.netAcres.keyword', 
        options: { 
            dbName: "shapeJson.properties.netAcres",
            sort: true, 
            filter: true 
        }
    },

    {
        name: "State", label: "State", esKey: 'shapeJson.properties.originalProperties.State.keyword', 
        options: { 
            dbName: "shapeJson.properties.originalProperties.State",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "County", label: "County", esKey: 'shapeJson.properties.originalProperties.County.keyword', 
        options: { 
            dbName: "shapeJson.properties.originalProperties.County",
            sort: true, 
            filter: true 
        }
    },
    {
        name: "status", label: "Status", esKey: 'shapeJson.properties.approvalStatus.keyword', 
        options: { 
            dbName: "shapeJson.properties.approvalStatus",
            sort: true, 
            filter: true
        }
    },
    {
        name: "tags", label: "Tags", esKey: 'tags.keyword', options: { sort: true, filter: true }
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
];

export default TractsHeadCells;